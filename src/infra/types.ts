export type Counter = {
  key: string;
  value: number;
  lat: number;
  lng: number;
};

export type Dianteira = {
  key: string;
  value: string;
  congregacaoAtual: CongregacaoName;
  congregacaoNova6A: CongregacaoName;
  congregacaoNova6B: CongregacaoName;
  congregacaoNova7: CongregacaoName;
  privilegio: Privilegio;
  endereco: string;
  comissaoAtual: string;
  comissaoNova6A: string;
  comissaoNova6B: string;
  comissaoNova7: string;
  lat: number;
  lng: number;
};

export type Divisao = Record<
  CongregacaoName,
  Array<{ lat: number; lng: number }>
>;

export enum CongregacaoName {
  JARDIM_INDAIA = 'Jardim Indaiá',
  NORTE = 'Norte',
  SUL = 'Sul',
  LESTE = 'Leste',
  OESTE = 'Oeste',
  CENTRAL = 'Central',
  TAPAJOS = 'Tapajós',
}

export enum Privilegio {
  ANCIAO = 'Ancião',
  SERVO = 'Servo',
}

export type Address = {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  category: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  boundingbox: string[];
};

export type WriteCoordinatesParams = {
  sheetName: string;
  congregation: CongregacaoName;
  values: Array<{ lat: number; lng: number }>;
};
