'use client';

import { useCallback, useState } from 'react';

import {
  AdvancedMarker,
  Pin,
  useAdvancedMarkerRef,
  type AdvancedMarkerProps,
} from '@vis.gl/react-google-maps';

import { Privilegio, type Dianteira } from '~/infra/sheet';
import { dianteiraDots } from '~/styles/map-colors';

export const AdvancedMarkerWithRef = (
  props: AdvancedMarkerProps & {
    onMarkerClick: (marker: google.maps.marker.AdvancedMarkerElement) => void;
  },
) => {
  const { children, onMarkerClick, ...advancedMarkerProps } = props;
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <AdvancedMarker
      onClick={() => {
        if (marker) {
          onMarkerClick(marker);
        }
      }}
      ref={markerRef}
      {...advancedMarkerProps}
    >
      {children}
    </AdvancedMarker>
  );
};

export function DianteiraDots({ data }: { data: Array<Dianteira> }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const onMouseEnter = useCallback((id: string | null) => setHoverId(id), []);
  const onMouseLeave = useCallback(() => setHoverId(null), []);
  const onMarkerClick = useCallback(
    (id: string | null, _marker?: google.maps.marker.AdvancedMarkerElement) => {
      setSelectedId(id);
    },
    [selectedId],
  );

  return (
    <>
      {data.map(({ key, congregacaoAtual, privilegio, lat, lng }) => (
        <AdvancedMarkerWithRef
          onMarkerClick={(marker: google.maps.marker.AdvancedMarkerElement) =>
            onMarkerClick(key, marker)
          }
          onMouseEnter={() => onMouseEnter(key)}
          onMouseLeave={onMouseLeave}
          key={key}
          className="custom-marker"
          style={{
            transform: `scale(${[hoverId, selectedId].includes(key) ? 1.4 : 1})`,
          }}
          position={{ lat, lng }}
        >
          <Pin
            background={dianteiraDots[congregacaoAtual].background}
            borderColor={selectedId === key ? '#1e89a1' : null}
            glyphColor={selectedId === key ? '#0f677a' : null}
          >
            {privilegio === Privilegio.ANCIAO ? 'Anc' : 'Ser'}
          </Pin>
        </AdvancedMarkerWithRef>
      ))}
    </>
  );
}
