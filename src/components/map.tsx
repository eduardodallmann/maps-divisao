'use client';

import React from 'react';

import { APIProvider, Map } from '@vis.gl/react-google-maps';

import { useShowInfos } from '~/hooks/use-show-infos';

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

export function MyMap({ mapApiKey }: { mapApiKey: string }) {
  const { dianteira, ruas } = useShowInfos();

  return (
    <APIProvider apiKey={mapApiKey}>
      <Map
        mapId={'7b0db937b6f5c785'}
        style={containerStyle}
        defaultCenter={center}
        defaultZoom={13}
        gestureHandling={'greedy'}
        disableDefaultUI
      >
        {ruas && <Clusters />}
        {dianteira && <DianteiraDots />}
        <DivisaoTerritorio />
      </Map>
      <Panel />
    </APIProvider>
  );
}
