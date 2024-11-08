'use server';

import { google } from 'googleapis';

import { authenticate } from './auth';
import {
  CongregacaoName,
  type Counter,
  type Dianteira,
  type Divisao,
  type Privilegio,
} from './types';

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
      .map(([rua, _bairro, _cidade, _cep, coordenadas, contagemCasas]) => {
        const [lat = 0, lng = 0] = (coordenadas || ',').split(',').map(Number);

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
        [
          string,
          CongregacaoName,
          CongregacaoName,
          CongregacaoName,
          Privilegio,
          string,
          string,
          string,
          string,
          string,
        ]
      >;
    } = await response.json();

    const dados: Array<Dianteira> = data.values
      .slice(1)
      .filter(
        ([
          _nome,
          _congregacaoAtual,
          _congregacaoDestino,
          _congregacaoDestinoB,
          _privilegio,
          _endereco,
          coordenadas,
        ]) => Boolean(coordenadas),
      )
      .map(
        ([
          nome,
          congregacaoAtual,
          congregacaoDestino,
          congregacaoDestinoB,
          privilegio,
          endereco,
          coordenadas,
          comissaoAtual = '',
          comissaoNova = '',
          comissaoNovaB = '',
        ]) => {
          const [lat, lng] = coordenadas.split(',').map(Number);

          return {
            key: nome,
            privilegio,
            value: nome,
            congregacaoAtual,
            congregacaoNova: congregacaoDestino,
            congregacaoNovaB: congregacaoDestinoB,
            endereco,
            comissaoAtual,
            comissaoNova,
            comissaoNovaB,
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

export async function getDivisaoData(versao: 'old' | 'new' | 'newB') {
  const apiKey = process.env.API_KEY;
  const spreadsheetId = process.env.SPREADSHEET_ID;
  const sheetNameObj = {
    old: 'DivisaoAtual',
    new: 'DivisaoNova',
    newB: 'DivisaoNovaB',
  };
  const sheetName = sheetNameObj[versao];
  const dados: Divisao = {
    [CongregacaoName.TAPAJOS]: [],
    [CongregacaoName.CENTRAL]: [],
    [CongregacaoName.SUL]: [],
    [CongregacaoName.JARDIM_INDAIA]: [],
    [CongregacaoName.NORTE]: [],
    [CongregacaoName.LESTE]: [],
    [CongregacaoName.OESTE]: [],
  };

  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${apiKey}`,
      { cache: 'no-store' },
    );
    const data: {
      values: Array<[string, string, string, string, string, string, string]>;
    } = await response.json();

    data.values
      .slice(1)
      .forEach(([tapajos, central, sul, jardim, norte, leste, oeste]) => {
        if (tapajos) {
          const [lng, lat] = tapajos.split(',').map(Number);
          dados[CongregacaoName.TAPAJOS].push({ lat, lng });
        }
        if (central) {
          const [lng, lat] = central.split(',').map(Number);
          dados[CongregacaoName.CENTRAL].push({ lat, lng });
        }
        if (sul) {
          const [lng, lat] = sul.split(',').map(Number);
          dados[CongregacaoName.SUL].push({ lat, lng });
        }
        if (jardim) {
          const [lng, lat] = jardim.split(',').map(Number);
          dados[CongregacaoName.JARDIM_INDAIA].push({ lat, lng });
        }
        if (norte) {
          const [lng, lat] = norte.split(',').map(Number);
          dados[CongregacaoName.NORTE].push({ lat, lng });
        }
        if (leste) {
          const [lng, lat] = leste.split(',').map(Number);
          dados[CongregacaoName.LESTE].push({ lat, lng });
        }
        if (oeste) {
          const [lng, lat] = oeste.split(',').map(Number);
          dados[CongregacaoName.OESTE].push({ lat, lng });
        }
      });

    return dados;
  } catch (error) {
    console.error('Error:', error);

    return dados;
  }
}

export async function writeStreetsCoordinates({
  line,
  value,
}: {
  line: string;
  value: string;
}) {
  const auth = await authenticate();

  //@ts-ignore
  const sheets = google.sheets({ version: 'v4', auth });

  const spreadsheetId = process.env.SPREADSHEET_ID;
  const sheetName = 'Ruas';

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${sheetName}!E${line}`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[value]],
    },
  });
}
