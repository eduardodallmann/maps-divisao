'use client';

import React from 'react';

import { APIProvider, Map } from '@vis.gl/react-google-maps';

import type { Counter, Dianteira } from '~/infra/sheet';

import { Clusters } from './clusters';
import { DianteiraDots } from './dianteira-dots';

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
}: {
  mapApiKey: string;
  data: Array<Counter>;
  menData: Array<Dianteira>;
}) {
  return (
    <APIProvider apiKey={mapApiKey}>
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
      </Map>
    </APIProvider>
  );
}
