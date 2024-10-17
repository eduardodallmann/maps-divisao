'use server';

import { google } from 'googleapis';

const serviceAccountBase64 = process.env.AUTH_BASE64 || '';
const serviceAccountDecoded = JSON.parse(
  Buffer.from(serviceAccountBase64, 'base64').toString('utf-8'),
);

export async function authenticate() {
  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccountDecoded,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return auth.getClient();
}
