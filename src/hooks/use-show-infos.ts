import { useContext } from 'react';

import { ShowInfosContext } from '~/context/show-infos';

export const useShowInfos = () => useContext(ShowInfosContext);
