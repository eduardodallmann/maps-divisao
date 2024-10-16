'use client';

import { createContext, useState, type PropsWithChildren } from 'react';

type Version = 'old' | 'new';

type OldNewContextType = {
  show: Version;
  setShow: (show: Version) => void;
};

export const OldNewContext = createContext({} as OldNewContextType);

export const OldNewProvider = ({ children }: PropsWithChildren) => {
  const [show, setShow] = useState<Version>('old');

  return (
    <OldNewContext.Provider value={{ show, setShow }}>
      {children}
    </OldNewContext.Provider>
  );
};
