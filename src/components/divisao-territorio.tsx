'use client';

import type { CongregacaoName, Divisao } from '~/infra/types';
import { polygonColors } from '~/styles/map-colors';

import { Polygon } from './polygon';

export function DivisaoTerritorio({ divisaoAtual }: { divisaoAtual: Divisao }) {
  const data = Object.entries(divisaoAtual).map(([congregation, divisao]) => {
    return (
      <Polygon
        key={congregation}
        paths={divisao}
        fillColor={polygonColors[congregation as CongregacaoName].fillColor}
        strokeColor={polygonColors[congregation as CongregacaoName].strokeColor}
        strokeOpacity={0.6}
      />
    );
  });

  return <>{data}</>;
}
