'use client';

import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { useSearchParams } from 'next/navigation';

import type {
  Counter,
  Dianteira,
  Divisao,
  WriteCoordinatesParams,
} from '~/infra/types';

interface Coordenada {
  lat: number;
  lng: number;
}

interface Poligono {
  [nome: string]: Coordenada[];
}

export type Version = 'old' | 'new6A' | 'new6B' | 'new7';

type ShowInfosContextType = {
  data: Array<Counter>;
  menData: Array<Dianteira>;
  divisaoAtual: Divisao;
  divisaoNovaA6: Divisao;
  divisaoNovaB6: Divisao;
  divisaoNova7: Divisao;
  setDivisaoNova: Dispatch<SetStateAction<Divisao>>;

  somasPorPoligono: { [nome: string]: number };
  anciaosPorCongregacao: { [nome: string]: Array<ReactNode> };
  servosPorCongregacao: { [nome: string]: Array<ReactNode> };

  editable: string | null;

  version: Version;
  setVersion: (show: Version) => void;

  dianteira: boolean;
  setDianteira: (show: boolean) => void;

  ruas: boolean;
  setRuas: (show: boolean) => void;

  saveCoords: (coords: WriteCoordinatesParams) => Promise<void>;
};

export const ShowInfosContext = createContext({} as ShowInfosContextType);

function estaDentroDoPoligono(
  coordenada: Coordenada,
  poligono: Coordenada[],
): boolean {
  let dentro = false;
  let j = poligono.length - 1;

  for (let i = 0; i < poligono.length; i++) {
    const xi = poligono[i].lng,
      yi = poligono[i].lat;
    const xj = poligono[j].lng,
      yj = poligono[j].lat;

    const intersect =
      yi > coordenada.lat !== yj > coordenada.lat &&
      coordenada.lng < ((xj - xi) * (coordenada.lat - yi)) / (yj - yi) + xi;
    if (intersect) {
      dentro = !dentro;
    }
    j = i;
  }

  return dentro;
}

// Função para somar os valores das ruas dentro de cada polígono
function somarValoresPorPoligono(
  ruas: Counter[],
  poligonos: Poligono,
): { [nome: string]: number } {
  const somas: { [nome: string]: number } = {};

  // Iterar sobre cada polígono
  for (const nomePoligono in poligonos) {
    const poligono = poligonos[nomePoligono];
    somas[nomePoligono] = 0;

    // Iterar sobre cada rua
    for (const rua of ruas) {
      if (estaDentroDoPoligono({ lat: rua.lat, lng: rua.lng }, poligono)) {
        somas[nomePoligono] += rua.value;
      }
    }
  }

  return somas;
}

export const ShowInfosProvider = ({
  data: dataPromise,
  divisaoAtual: divisaoAtualPromise,
  divisaoNova6A: divisaoNova6APromise,
  divisaoNova6B: divisaoNova6BPromise,
  divisaoNova7: divisaoNova7Promise,
  menData: menDataPromise,
  saveCoords,
  children,
}: PropsWithChildren<{
  data: Promise<Array<Counter>>;
  menData: Promise<Array<Dianteira>>;
  divisaoAtual: Promise<Divisao>;
  divisaoNova6A: Promise<Divisao>;
  divisaoNova6B: Promise<Divisao>;
  divisaoNova7: Promise<Divisao>;
  saveCoords: (coords: WriteCoordinatesParams) => Promise<void>;
}>) => {
  const [data, setData] = useState<Array<Counter>>([]);
  const [menData, setMenData] = useState<Array<Dianteira>>([]);
  const [divisaoAtual, setDivisaoAtual] = useState<Divisao>({} as Divisao);

  const [version, setVersion] = useState<Version>('new6B');
  const [dianteira, setDianteira] = useState<boolean>(true);
  const [ruas, setRuas] = useState<boolean>(false);
  const [divisaoNova6A, setDivisaoNova6A] = useState<Divisao>({} as Divisao);
  const [divisaoNova6B, setDivisaoNova6B] = useState<Divisao>({} as Divisao);
  const [divisaoNova7, setDivisaoNova7] = useState<Divisao>({} as Divisao);
  const params = useSearchParams();

  const somasPorPoligono = useMemo(() => {
    const divisaoObj: Record<Version, Divisao> = {
      old: divisaoAtual,
      new6A: divisaoNova6A,
      new6B: divisaoNova6B,
      new7: divisaoNova7,
    };
    const divisao = divisaoObj[version];

    return somarValoresPorPoligono(data, divisao);
  }, [data, version, divisaoNova6A, divisaoNova6B, divisaoNova7]);

  const setPorVersion = useMemo(() => {
    const divisaoObj: Record<Version, Dispatch<SetStateAction<Divisao>>> = {
      old: () => {},
      new6A: setDivisaoNova6A,
      new6B: setDivisaoNova6B,
      new7: setDivisaoNova7,
    };

    return divisaoObj[version];
  }, [version]);

  const anciaosPorCongregacao = useMemo(() => {
    const anciaos: { [nome: string]: Array<ReactNode> } = {};

    const sortedMenData = [...menData].sort((a, b) => {
      const comissoes = ['Coor.', 'Secr.', 'SS'];
      const comissaoObj: Record<
        Version,
        'comissaoAtual' | 'comissaoNova6A' | 'comissaoNova6B' | 'comissaoNova7'
      > = {
        old: 'comissaoAtual',
        new6A: 'comissaoNova6A',
        new6B: 'comissaoNova6B',
        new7: 'comissaoNova7',
      };
      const comissao = comissaoObj[version];

      const comissaoA = comissoes.includes(a[comissao])
        ? comissoes.indexOf(a[comissao])
        : 3;

      const comissaoB = comissoes.includes(b[comissao])
        ? comissoes.indexOf(b[comissao])
        : 3;

      if (comissaoA !== comissaoB) {
        return comissaoA - comissaoB;
      }

      return a[comissao].localeCompare(b[comissao]);
    });

    for (const {
      congregacaoAtual,
      congregacaoNova6A,
      congregacaoNova6B,
      congregacaoNova7,
      privilegio,
      key,
      comissaoAtual,
      comissaoNova6A,
      comissaoNova6B,
      comissaoNova7,
    } of sortedMenData) {
      if (privilegio === 'Ancião') {
        const congregacao = {
          old: congregacaoAtual,
          new6A: congregacaoNova6A,
          new6B: congregacaoNova6B,
          new7: congregacaoNova7,
        }[version];
        const comissao = {
          old: comissaoAtual,
          new6A: comissaoNova6A,
          new6B: comissaoNova6B,
          new7: comissaoNova7,
        }[version];
        if (!anciaos[congregacao]) {
          anciaos[congregacao] = [];
        }
        anciaos[congregacao].push(
          <>
            {key} <b>{comissao}</b>
          </>,
        );
      }
    }

    return anciaos;
  }, [version, menData]);

  const servosPorCongregacao = useMemo(() => {
    const servos: { [nome: string]: Array<string> } = {};

    for (const {
      congregacaoAtual,
      congregacaoNova6A,
      congregacaoNova6B,
      congregacaoNova7,
      privilegio,
      key,
    } of menData) {
      if (privilegio === 'Servo') {
        const congregacao = {
          old: congregacaoAtual,
          new6A: congregacaoNova6A,
          new6B: congregacaoNova6B,
          new7: congregacaoNova7,
        }[version];
        if (!servos[congregacao]) {
          servos[congregacao] = [];
        }
        servos[congregacao].push(key);
      }
    }

    return servos;
  }, [version, menData]);

  useEffect(() => {
    dataPromise.then(setData);
    divisaoAtualPromise.then(setDivisaoAtual);
    menDataPromise.then(setMenData);
    divisaoNova6APromise.then(setDivisaoNova6A);
    divisaoNova6BPromise.then(setDivisaoNova6B);
    divisaoNova7Promise.then(setDivisaoNova7);
  }, []);

  return (
    <ShowInfosContext.Provider
      value={{
        version,
        setVersion,

        dianteira,
        setDianteira,

        ruas,
        setRuas,

        data,
        menData,
        divisaoAtual,
        divisaoNovaA6: divisaoNova6A,
        divisaoNovaB6: divisaoNova6B,
        divisaoNova7,
        setDivisaoNova: setPorVersion,

        somasPorPoligono,
        anciaosPorCongregacao,
        servosPorCongregacao,

        editable: params.get('editable'),

        saveCoords,
      }}
    >
      {children}
    </ShowInfosContext.Provider>
  );
};
