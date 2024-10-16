import { MyMap } from '~/components/map';
import { getMenData, getStreetsData } from '~/infra/sheet';

export default async function Home() {
  const apiKey = process.env.API_KEY || '';
  const data = await getStreetsData();
  const menData = await getMenData();

  return <MyMap mapApiKey={apiKey} data={data} menData={menData} />;
}
