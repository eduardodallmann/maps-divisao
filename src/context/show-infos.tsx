'use client';

import {
  createContext,
  useMemo,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { useSearchParams } from 'next/navigation';

import type { Counter, Dianteira, Divisao } from '~/infra/types';

interface Coordenada {
  lat: number;
  lng: number;
}

interface Poligono {
  [nome: string]: Coordenada[];
}

type Version = 'old' | 'new';

type ShowInfosContextType = {
  data: Array<Counter>;
  menData: Array<Dianteira>;
  divisaoAtual: Divisao;
  divisaoNova: Divisao;
  setDivisaoNova: Dispatch<SetStateAction<Divisao>>;

  somasPorPoligono: { [nome: string]: number };
  anciaosPorCongregacao: { [nome: string]: Array<ReactNode> };
  servosPorCongregacao: { [nome: string]: Array<ReactNode> };

  editable: boolean;

  version: Version;
  setVersion: (show: Version) => void;

  dianteira: boolean;
  setDianteira: (show: boolean) => void;

  ruas: boolean;
  setRuas: (show: boolean) => void;
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
  data,
  divisaoAtual,
  divisaoNova: divisaoFromProps,
  menData,
  children,
}: PropsWithChildren<{
  data: Array<Counter>;
  menData: Array<Dianteira>;
  divisaoAtual: Divisao;
  divisaoNova: Divisao;
}>) => {
  const [version, setVersion] = useState<Version>('old');
  const [dianteira, setDianteira] = useState<boolean>(true);
  const [ruas, setRuas] = useState<boolean>(true);
  const [divisaoNova, setDivisaoNova] = useState<Divisao>(divisaoFromProps);
  const params = useSearchParams();

  const somasPorPoligono = useMemo(
    () =>
      somarValoresPorPoligono(
        data,
        version === 'old' ? divisaoAtual : divisaoNova,
      ),
    [version, divisaoNova],
  );

  const anciaosPorCongregacao = useMemo(() => {
    const anciaos: { [nome: string]: Array<ReactNode> } = {};

    const sortedMenData = [...menData].sort((a, b) => {
      const comissoes = ['Coor.', 'Secr.', 'SS'];
      const comissao = version === 'old' ? 'comissaoAtual' : 'comissaoNova';

      const comissaoA = comissoes.includes(a[comissao])
        ? comissoes.indexOf(a[comissao])
        : 3; // Define 3 para itens que não estão na lista

      const comissaoB = comissoes.includes(b[comissao])
        ? comissoes.indexOf(b[comissao])
        : 3;

      if (comissaoA !== comissaoB) {
        return comissaoA - comissaoB;
      }

      // Ordenar alfabeticamente se estiverem fora da lista de comissões
      return a[comissao].localeCompare(b[comissao]);
    });

    for (const {
      congregacaoAtual,
      congregacaoNova,
      privilegio,
      key,
      comissaoAtual,
      comissaoNova,
    } of sortedMenData) {
      if (privilegio === 'Ancião') {
        const congregacao =
          version === 'old' ? congregacaoAtual : congregacaoNova;
        const comissao = version === 'old' ? comissaoAtual : comissaoNova;
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
  }, [version]);

  const servosPorCongregacao = useMemo(() => {
    const servos: { [nome: string]: Array<string> } = {};

    for (const {
      congregacaoAtual,
      congregacaoNova,
      privilegio,
      key,
    } of menData) {
      if (privilegio === 'Servo') {
        const congregacao =
          version === 'old' ? congregacaoAtual : congregacaoNova;
        if (!servos[congregacao]) {
          servos[congregacao] = [];
        }
        servos[congregacao].push(key);
      }
    }

    return servos;
  }, [version]);

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
        divisaoNova,
        setDivisaoNova,

        somasPorPoligono,
        anciaosPorCongregacao,
        servosPorCongregacao,

        editable: params.get('editable') === 'true',
      }}
    >
      {children}
    </ShowInfosContext.Provider>
  );
};
