'use client';

import { useShowInfos } from '~/hooks/use-show-infos';
import type { CongregacaoName } from '~/infra/types';
import { polygonColors } from '~/styles/map-colors';

import { Polygon } from './polygon';

export function DivisaoTerritorio() {
  const { version, divisaoAtual, divisaoNova, divisaoNovaB, editable } =
    useShowInfos();

  const divisaoObj = {
    old: divisaoAtual,
    new: divisaoNova,
    newB: divisaoNovaB,
  };
  const divisaoEscolhida = divisaoObj[version];

  const data = Object.entries(divisaoEscolhida).map(
    ([congregation, divisao]) => {
      return (
        <Polygon
          key={congregation}
          editable={version !== 'old' && editable}
          paths={divisao}
          fillColor={polygonColors[congregation as CongregacaoName].fillColor}
          strokeColor={
            polygonColors[congregation as CongregacaoName].strokeColor
          }
          strokeOpacity={0.6}
          congregacao={congregation}
        />
      );
    },
  );

  return <>{data}</>;
}
