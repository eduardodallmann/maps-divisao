import { useContext } from 'react';

import { OldNewContext } from '~/context/old-new';

export const useNewOld = () => useContext(OldNewContext);
