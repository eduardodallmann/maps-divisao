'use server';

import { MyMap } from '~/components/map';
import { ShowInfosProvider } from '~/context/show-infos';
import { getDivisaoData, getMenData, getStreetsData } from '~/infra/sheet';

export default async function Home() {
  const apiKey = process.env.API_KEY || '';
  const data = await getStreetsData();
  const menData = await getMenData();
  const divisaoAtual = await getDivisaoData('old');
  const divisaoNova = await getDivisaoData('new');

  return (
    <ShowInfosProvider
      data={data}
      menData={menData}
      divisaoAtual={divisaoAtual}
      divisaoNova={divisaoNova}
    >
      <MyMap mapApiKey={apiKey} />
    </ShowInfosProvider>
  );
}
