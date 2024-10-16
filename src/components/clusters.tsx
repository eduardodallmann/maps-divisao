'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  MarkerClusterer,
  NoopAlgorithm,
  type Marker,
} from '@googlemaps/markerclusterer';
import { useMap } from '@vis.gl/react-google-maps';

import type { Counter } from '~/infra/sheet';

import { MyMarker } from './marker';

export function Clusters({ data }: { data: Array<Counter> }) {
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const map = useMap();

  const clusterer = useMemo(() => {
    if (!map) {
      return null;
    }

    return new MarkerClusterer({
      map,
      algorithm: new NoopAlgorithm({}),
    });
  }, [map]);

  useEffect(() => {
    if (!clusterer) {
      return;
    }

    clusterer.clearMarkers();
    const newLocal = Object.values(markers);
    clusterer.addMarkers(newLocal);
  }, [clusterer, markers]);

  const setMarkerRef = useCallback((marker: Marker | null, key: string) => {
    setMarkers((markers) => {
      if ((marker && markers[key]) || (!marker && !markers[key])) {
        return markers;
      }

      if (marker) {
        return { ...markers, [key]: marker };
      } else {
        const { ...newMarkers } = markers;

        return newMarkers;
      }
    });
  }, []);

  return (
    <>
      {data.map(({ key, lat, lng, value }) => (
        <MyMarker
          key={key}
          keySent={String(key)}
          position={{ lat, lng }}
          value={value}
          setMarkerRef={setMarkerRef}
        />
      ))}
    </>
  );
}
