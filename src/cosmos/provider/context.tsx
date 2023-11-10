import { createContext } from 'react';
import { CosmosContextType } from './types';
import { DEFAULT_COSMOS_CONTEXT } from './helpers';

export const CosmosContext = createContext<CosmosContextType>(
  DEFAULT_COSMOS_CONTEXT
);
