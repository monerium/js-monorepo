import { createContext } from 'react';

import { SdkInstance, UseAuthReturn } from './types';

export const MoneriumContext = createContext<
  (UseAuthReturn & SdkInstance) | null
>(null);
