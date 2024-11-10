'use client';

import { useShowInfos } from '~/hooks/use-show-infos';
import type { CongregacaoName } from '~/infra/types';
import { polygonColors } from '~/styles/map-colors';

import { Polygon } from './polygon';

export function DivisaoTerritorio() {
  const {
    version,
    divisaoAtual,
    divisaoNovaA6,
    divisaoNovaB6,
    divisaoNova7,
    editable,
  } = useShowInfos();

  const divisaoObj = {
    old: divisaoAtual,
    new6A: divisaoNovaA6,
    new6B: divisaoNovaB6,
    new7: divisaoNova7,
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
