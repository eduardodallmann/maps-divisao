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
      Qnt de casas por território:
      {somasPorPoligono && (
        <div className="flex flex-col gap-2">
          {Object.entries(somasPorPoligono).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span>{key}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
