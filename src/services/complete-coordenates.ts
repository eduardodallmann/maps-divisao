import { getLatLng } from '~/infra/get-lat-lng';
import { writeStreetsCoordinates } from '~/infra/sheet';
import type { Counter } from '~/infra/types';

export async function completeCoordenatesStreets({
  data,
}: {
  data: Array<Counter>;
}) {
  data.forEach(async (element, index) => {
    if (!element.lat || !element.lng) {
      try {
        const [{ lat, lon }] = await getLatLng({ street: element.key });

        await writeStreetsCoordinates({
          line: String(index),
          value: `${lat}, ${lon}`,
        });
      } catch (error) {}
    }
  });
}
