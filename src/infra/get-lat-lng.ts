import type { Address } from './types';

/**@deprecated */
export async function getLatLng({
  street,
}: {
  street: string;
}): Promise<Array<Address>> {
  const url = 'https://nominatim.openstreetmap.org/search.php';
  const params = {
    q: `${street} Indaial SC`,
    format: 'jsonv2',
  };
  const urlComplete = new URL(url);
  urlComplete.search = new URLSearchParams(params).toString();

  const response = await fetch(urlComplete);

  return response.json();
}
