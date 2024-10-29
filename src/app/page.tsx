'use server';

import { MyMap } from '~/components/map';
import { ShowInfosProvider } from '~/context/show-infos';
import { getDivisaoData, getMenData, getStreetsData } from '~/infra/sheet';

export default async function Home() {
  const apiKey = process.env.API_KEY || '';
  const data = getStreetsData();
  const menData = getMenData();
  const divisaoAtual = getDivisaoData('old');
  const divisaoNova = getDivisaoData('new');
  const divisaoNovaB = getDivisaoData('newB');

  return (
    <ShowInfosProvider
      data={data}
      menData={menData}
      divisaoAtual={divisaoAtual}
      divisaoNova={divisaoNova}
      divisaoNovaB={divisaoNovaB}
    >
      <MyMap mapApiKey={apiKey} />
    </ShowInfosProvider>
  );
}
