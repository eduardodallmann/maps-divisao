'use server';

import { MyMap } from '~/components/map';
import { getDivisaoAtualData, getMenData, getStreetsData } from '~/infra/sheet';

export default async function Home() {
  const apiKey = process.env.API_KEY || '';
  const data = await getStreetsData();
  const menData = await getMenData();
  const divisaoAtual = await getDivisaoAtualData();

  return (
    <MyMap
      mapApiKey={apiKey}
      data={data}
      menData={menData}
      divisaoAtual={divisaoAtual}
    />
  );
}
