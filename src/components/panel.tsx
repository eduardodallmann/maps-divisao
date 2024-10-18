'use client';

import { useShowInfos } from '~/hooks/use-show-infos';

import { Toggle } from './common/toggle';

export function Panel() {
  const {
    version,
    setVersion,
    dianteira,
    setDianteira,
    ruas,
    setRuas,
    somasPorPoligono,
    anciaosPorCongregacao,
    servosPorCongregacao,
  } = useShowInfos();

  return (
    <div className="fixed top-0 right-0 m-4 bg-white p-4 rounded shadow-lg flex flex-col gap-4">
      <Toggle
        label="Mostrar novo"
        value={version === 'new'}
        onChange={() => {
          setVersion(version === 'new' ? 'old' : 'new');
        }}
      />
      <Toggle
        label="Mostrar dianteira"
        value={dianteira}
        onChange={() => {
          setDianteira(!dianteira);
        }}
      />
      <Toggle
        label="Mostrar qnt. de casas"
        value={ruas}
        onChange={() => {
          setRuas(!ruas);
        }}
      />
      Qnts por congregação:
      {somasPorPoligono && (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-4">
            <span>Congr.</span>
            <span>Casas</span>
            <span>Anc.</span>
            <span>Ser.</span>
          </div>
          {Object.entries(somasPorPoligono).map(([key, value]) => (
            <div key={key} className="grid grid-cols-4">
              <span>{key}:&nbsp;</span>
              <span>{value}</span>
              <span>{anciaosPorCongregacao[key]}</span>
              <span>{servosPorCongregacao[key]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
