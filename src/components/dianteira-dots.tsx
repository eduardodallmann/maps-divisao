'use client';

import { useCallback, useState } from 'react';

import {
  AdvancedMarker,
  Pin,
  useAdvancedMarkerRef,
  type AdvancedMarkerProps,
} from '@vis.gl/react-google-maps';

import { CongregacaoName, Privilegio, type Dianteira } from '~/infra/sheet';

const colors: Record<
  CongregacaoName,
  { background: string; borderColor?: string; glyphColor?: string }
> = {
  [CongregacaoName.CENTRAL]: {
    background: '#22ccff',
    borderColor: '#1e89a1',
    glyphColor: '#0f677a',
  },
  [CongregacaoName.JARDIM_INDAIA]: {
    background: '#ffcc22',
    borderColor: '#a1871e',
    glyphColor: '#7a5f0f',
  },
  [CongregacaoName.LESTE]: {
    background: '#22ffcc',
    borderColor: '#1ea187',
    glyphColor: '#0f7a5f',
  },
  [CongregacaoName.NORTE]: {
    background: '#ff22cc',
    borderColor: '#a11e89',
    glyphColor: '#7a0f67',
  },
  [CongregacaoName.OESTE]: {
    background: '#cccccc',
    borderColor: '#888888',
    glyphColor: '#555555',
  },
  [CongregacaoName.SUL]: {
    background: '#ccff22',
    borderColor: '#89a11e',
    glyphColor: '#67a00f',
  },
  [CongregacaoName.TAPAJOS]: {
    background: '#ff2222',
    borderColor: '#a11e1e',
    glyphColor: '#7a0f0f',
  },
};

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
            background={colors[congregacaoAtual].background}
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
