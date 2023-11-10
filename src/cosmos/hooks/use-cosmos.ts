import { useContext } from 'react';
import { CosmosContext } from '../provider/context';
import { CosmosProvider } from '../provider/provider';

export const useCosmos = () => {
  const context = useContext(CosmosContext);
  if (!context)
    throw new Error(
      `Context is not defined, using hooks outside of ${CosmosProvider.name} could cause this issue`
    );
  return context;
};
