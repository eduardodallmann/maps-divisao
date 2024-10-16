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
  privilegio: Privilegio;
  lat: number;
  lng: number;
};

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

export async function getStreetsData() {
  const apiKey = process.env.API_KEY;
  const spreadsheetId = process.env.SPREADSHEET_ID;
  const sheetName = 'Ruas';

  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${apiKey}`,
      { cache: 'no-store' },
    );
    const data: {
      values: Array<[string, string, string, string, string, string]>;
    } = await response.json();

    const dados: Array<Counter> = data.values
      .slice(1)
      .filter(
        ([rua, _bairro, _cidade, _cep, coordenadas, contagemCasas]) =>
          Boolean(rua) && Boolean(coordenadas) && Boolean(contagemCasas),
      )
      .map(([rua, _bairro, _cidade, _cep, coordenadas, contagemCasas]) => {
        const [lat, lng] = coordenadas.split(',').map(Number);

        return {
          key: rua,
          value: Number(contagemCasas || 0),
          lat,
          lng,
        };
      });

    return dados;
  } catch (error) {
    console.error('Error:', error);

    return [];
  }
}

export async function getMenData() {
  const apiKey = process.env.API_KEY;
  const spreadsheetId = process.env.SPREADSHEET_ID;
  const sheetName = 'Dianteira';

  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${apiKey}`,
      { cache: 'no-store' },
    );
    const data: {
      values: Array<
        [string, CongregacaoName, CongregacaoName, Privilegio, string, string]
      >;
    } = await response.json();

    const dados: Array<Dianteira> = data.values
      .slice(1)
      .filter(
        ([
          _nome,
          _congregacaoAtual,
          _congregacaoDestino,
          _privilegio,
          _endereco,
          coordenadas,
        ]) => Boolean(coordenadas),
      )
      .map(
        ([
          nome,
          congregacaoAtual,
          _congregacaoDestino,
          privilegio,
          _endereco,
          coordenadas,
        ]) => {
          const [lat, lng] = coordenadas.split(',').map(Number);

          return {
            key: nome,
            privilegio,
            value: nome,
            congregacaoAtual,
            lat,
            lng,
          };
        },
      );

    return dados;
  } catch (error) {
    console.error('Error:', error);

    return [];
  }
}
