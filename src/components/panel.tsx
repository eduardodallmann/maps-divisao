/* eslint-disable etc/no-commented-out-code */
'use client';

import { useState } from 'react';

import { FaCaretDown } from 'react-icons/fa6';

import { useShowInfos } from '~/hooks/use-show-infos';
import type { CongregacaoName } from '~/infra/types';
import { polygonColors } from '~/styles/map-colors';

import { ReactPopover } from './common/popover';
import { Select } from './common/select';
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
  const [openPanel, setOpenPanel] = useState(true);

  return (
    <div className="fixed top-0 right-0 m-4 bg-white p-4 rounded shadow-lg flex flex-col gap-4 min-h-14 min-w-14">
      <button
        className={`absolute right-4 p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-transform transform ${openPanel && 'rotate-180'}`}
        onClick={() => setOpenPanel(!openPanel)}
        title="Abrir/fechar painel"
      >
        <FaCaretDown />
      </button>
      {openPanel && (
        <>
          <Select
            label="Configuração"
            options={[
              { value: 'old', label: 'Atual' },
              // { value: 'new6A', label: 'Opção A com 6 congr.' },
              { value: 'new6B', label: 'Nova formação com 6 congr.' },
              // eslint-disable-next-line etc/no-commented-out-code
              // { value: 'new7', label: 'Opção com 7 congr.' },
            ]}
            value={version}
            onChange={setVersion}
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
            <table className="table-auto border-collapse">
              <thead>
                <tr>
                  <th className="border px-1 py-1">Congr.</th>
                  <th className="border px-1 py-1">Casas</th>
                  <th className="border px-1 py-1">Anc.</th>
                  <th className="border px-1 py-1">Ser.</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(somasPorPoligono)
                  .filter(([key]) => {
                    if (
                      (key === 'Leste' || key === 'Oeste') &&
                      version === 'old'
                    ) {
                      return false;
                    }
                    if (
                      key === 'Leste' &&
                      (version === 'new6A' || version === 'new6B')
                    ) {
                      return false;
                    }

                    return true;
                  })
                  .map(([key, value]) => (
                    <tr key={key}>
                      <td
                        className="border px-1 py-1"
                        style={{
                          backgroundColor: `${polygonColors[key as CongregacaoName].fillColor}77`,
                        }}
                      >
                        {key === 'Oeste' ? 'Oeste/Warnow' : key}
                      </td>
                      <td className="border px-1 py-1">{value}</td>
                      <td className="border px-1 py-1">
                        <ReactPopover
                          content={
                            <>
                              {anciaosPorCongregacao[key]?.map((anc, index) => (
                                <p key={index} className="whitespace-nowrap">
                                  {anc}
                                </p>
                              ))}
                            </>
                          }
                        >
                          {anciaosPorCongregacao[key]?.length}
                        </ReactPopover>
                      </td>
                      <td className="border px-1 py-1">
                        <ReactPopover
                          content={
                            <>
                              {servosPorCongregacao[key]?.map((ser, index) => (
                                <p key={index} className="whitespace-nowrap">
                                  {ser}
                                </p>
                              ))}
                            </>
                          }
                        >
                          {servosPorCongregacao[key]?.length}
                        </ReactPopover>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}
