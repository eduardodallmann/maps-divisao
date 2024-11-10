'use server';

import { MyMap } from '~/components/map';
import { ShowInfosProvider } from '~/context/show-infos';
import { getDivisaoData, getMenData, getStreetsData } from '~/infra/sheet';

export default async function Home() {
  const apiKey = process.env.API_KEY || '';
  const data = getStreetsData();
  const menData = getMenData();
  const divisaoAtual = getDivisaoData('old');
  const divisaoNova6A = getDivisaoData('new6A');
  const divisaoNova6B = getDivisaoData('new6B');
  const divisaoNova7 = getDivisaoData('new7');

  return (
    <ShowInfosProvider
      data={data}
      menData={menData}
      divisaoAtual={divisaoAtual}
      divisaoNova6A={divisaoNova6A}
      divisaoNova6B={divisaoNova6B}
      divisaoNova7={divisaoNova7}
    >
      <MyMap mapApiKey={apiKey} />
    </ShowInfosProvider>
  );
}
