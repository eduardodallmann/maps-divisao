'use client';

import React from 'react';

import { APIProvider, Map } from '@vis.gl/react-google-maps';

import type { Counter } from '~/infra/sheet';

import { Clusters } from './clusters';

const containerStyle = {
  width: '100vw',
  height: '100vh',
};

const center = {
  lat: -26.896148,
  lng: -49.240528,
};

export function MyMap({ data }: { data: Array<Counter> }) {
  //AIzaSyDyfZzQm6Drr8Il2iPKU4SwZAZxP9nUm3g

  return (
    <APIProvider apiKey="AIzaSyDyfZzQm6Drr8Il2iPKU4SwZAZxP9nUm3g">
      <Map
        mapId={'bf51a910020fa25a'}
        style={containerStyle}
        defaultCenter={center}
        defaultZoom={13}
        gestureHandling={'greedy'}
        disableDefaultUI
      >
        <Clusters data={data} />
      </Map>
    </APIProvider>
  );
}
