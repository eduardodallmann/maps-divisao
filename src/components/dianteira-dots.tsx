'use client';

import { useCallback, useState } from 'react';

import {
  AdvancedMarker,
  InfoWindow,
  Pin,
  useAdvancedMarkerRef,
  type AdvancedMarkerProps,
} from '@vis.gl/react-google-maps';

import { useShowInfos } from '~/hooks/use-show-infos';
import { Privilegio } from '~/infra/types';
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

export function DianteiraDots() {
  const { menData, version } = useShowInfos();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [infoWindowShown, setInfoWindowShown] = useState(false);
  const [selectedMarker, setSelectedMarker] =
    useState<google.maps.marker.AdvancedMarkerElement | null>(null);

  const onMouseEnter = useCallback((id: string | null) => setHoverId(id), []);
  const onMouseLeave = useCallback(() => setHoverId(null), []);
  const onMarkerClick = useCallback(
    (id: string | null, marker?: google.maps.marker.AdvancedMarkerElement) => {
      setSelectedId(id);

      if (marker) {
        setSelectedMarker(marker);
      }

      if (id !== selectedId) {
        setInfoWindowShown(true);
      } else {
        setInfoWindowShown((isShown) => !isShown);
      }
    },
    [selectedId],
  );
  const handleInfowindowCloseClick = useCallback(
    () => setInfoWindowShown(false),
    [],
  );
  const getDianteira = useCallback(
    (id: string) => menData.find((d) => d.key === id),
    [menData],
  );
  const getCongregacaoVersion = useCallback(() => {
    return {
      old: 'congregacaoAtual',
      new6A: 'congregacaoNova6A',
      new6B: 'congregacaoNova6B',
      new7: 'congregacaoNova7',
    }[version] as
      | 'congregacaoAtual'
      | 'congregacaoNova6A'
      | 'congregacaoNova6B'
      | 'congregacaoNova7';
  }, [version]);

  return (
    <>
      {menData.map(
        ({
          key,
          congregacaoAtual,
          congregacaoNova6A,
          congregacaoNova6B,
          congregacaoNova7,
          privilegio,
          lat,
          lng,
        }) => (
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
            {congregacaoAtual &&
              congregacaoNova6A &&
              congregacaoNova6B &&
              congregacaoNova7 && (
                <Pin
                  background={
                    dianteiraDots[
                      {
                        old: congregacaoAtual,
                        new6A: congregacaoNova6A,
                        new6B: congregacaoNova6B,
                        new7: congregacaoNova7,
                      }[version]
                    ].background
                  }
                  borderColor={selectedId === key ? '#1e89a1' : null}
                  glyphColor={selectedId === key ? '#0f677a' : null}
                >
                  {privilegio === Privilegio.ANCIAO ? 'Anc' : 'Ser'}
                </Pin>
              )}
          </AdvancedMarkerWithRef>
        ),
      )}
      {infoWindowShown && selectedMarker && (
        <InfoWindow
          anchor={selectedMarker}
          onCloseClick={handleInfowindowCloseClick}
        >
          <h2>
            {getDianteira(String(selectedId))?.privilegio}: {selectedId}
          </h2>
          <p>{getDianteira(String(selectedId))?.endereco}</p>
          <p>
            {getDianteira(String(selectedId))?.congregacaoAtual}
            {version !== 'old' && (
              <>
                {' > '}
                {getDianteira(String(selectedId))?.[getCongregacaoVersion()]}
              </>
            )}
          </p>
        </InfoWindow>
      )}
    </>
  );
}
