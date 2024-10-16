export type Counter = {
  key: string;
  value: number;
  lat: number;
  lng: number;
};

export async function getStreetsData() {
  const apiKey = process.env.API_KEY;
  const spreadsheetId = process.env.SPREADSHEET_ID;
  const sheetName = 'Ruas';

  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${apiKey}`,
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
