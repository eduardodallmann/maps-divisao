import { CongregacaoName } from '~/infra/sheet';

export const dianteiraDots: Record<
  CongregacaoName,
  { background: string; borderColor?: string; glyphColor?: string }
> = {
  [CongregacaoName.CENTRAL]: {
    background: '#0288d1',
    borderColor: '#01579b',
    glyphColor: '#002f6c',
  },
  [CongregacaoName.JARDIM_INDAIA]: {
    background: '#ce93d8',
    borderColor: '#9c27b0',
    glyphColor: '#6a0080',
  },
  [CongregacaoName.LESTE]: {
    background: '#22ffcc',
    borderColor: '#1ea187',
    glyphColor: '#0f7a5f',
  },
  [CongregacaoName.NORTE]: {
    background: '#ffd600',
    borderColor: '#a1871e',
    glyphColor: '#7a5f0f',
  },
  [CongregacaoName.OESTE]: {
    background: '#cccccc',
    borderColor: '#888888',
    glyphColor: '#555555',
  },
  [CongregacaoName.SUL]: {
    background: '#f57c00',
    borderColor: '#e65100',
    glyphColor: '#b44200',
  },
  [CongregacaoName.TAPAJOS]: {
    background: '#7cb342',
    borderColor: '#689f38',
    glyphColor: '#4b830a',
  },
};

export const polygonColors: Record<
  CongregacaoName,
  { strokeColor: string; fillColor: string }
> = {
  [CongregacaoName.CENTRAL]: {
    strokeColor: '#0288d1',
    fillColor: '#01579b',
  },
  [CongregacaoName.JARDIM_INDAIA]: {
    strokeColor: '#ce93d8',
    fillColor: '#9c27b0',
  },
  [CongregacaoName.LESTE]: {
    strokeColor: '#22ffcc',
    fillColor: '#1ea187',
  },
  [CongregacaoName.NORTE]: {
    strokeColor: '#ffd600',
    fillColor: '#a1871e',
  },
  [CongregacaoName.OESTE]: {
    strokeColor: '#cccccc',
    fillColor: '#888888',
  },
  [CongregacaoName.SUL]: {
    strokeColor: '#f57c00',
    fillColor: '#e65100',
  },
  [CongregacaoName.TAPAJOS]: {
    strokeColor: '#7cb342',
    fillColor: '#689f38',
  },
};
