'use client';

import React from 'react';

import { APIProvider, Map } from '@vis.gl/react-google-maps';

import { OldNewProvider } from '~/context/old-new';
import type { Counter, Dianteira, Divisao } from '~/infra/sheet';

import { Clusters } from './clusters';
import { DianteiraDots } from './dianteira-dots';
import { DivisaoTerritorio } from './divisao-territorio';
import { Panel } from './panel';

const containerStyle = {
  width: '100vw',
  height: '100vh',
};

const center = {
  lat: -26.896148,
  lng: -49.240528,
};

export function MyMap({
  mapApiKey,
  data,
  menData,
  divisaoAtual,
}: {
  mapApiKey: string;
  data: Array<Counter>;
  menData: Array<Dianteira>;
  divisaoAtual: Divisao;
}) {
  return (
    <APIProvider apiKey={mapApiKey}>
      <OldNewProvider>
        <Map
          mapId={'bf51a910020fa25a'}
          style={containerStyle}
          defaultCenter={center}
          defaultZoom={13}
          gestureHandling={'greedy'}
          disableDefaultUI
        >
          <Clusters data={data} />
          <DianteiraDots data={menData} />
          <DivisaoTerritorio divisaoAtual={divisaoAtual} />
        </Map>
        <Panel />
      </OldNewProvider>
    </APIProvider>
  );
}
