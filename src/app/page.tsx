import { MyMap } from '~/components/map';
import { getStreetsData } from '~/infra/sheet';

export default async function Home() {
  const data = await getStreetsData();

  return <MyMap data={data} />;
}
