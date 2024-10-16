'use client';

import { useCallback } from 'react';

import type { Marker } from '@googlemaps/markerclusterer';
import { AdvancedMarker } from '@vis.gl/react-google-maps';

export const MyMarker = (props: {
  position: google.maps.LatLngLiteral;
  keySent: string;
  value: number;
  setMarkerRef: (marker: Marker | null, key: string) => void;
}) => {
  const { position, keySent, value, setMarkerRef } = props;

  const ref = useCallback(
    (marker: google.maps.marker.AdvancedMarkerElement) =>
      setMarkerRef(marker, keySent),
    [setMarkerRef, keySent],
  );

  return (
    <AdvancedMarker position={position} ref={ref}>
      {value}
    </AdvancedMarker>
  );
};
