import { CosmosContextType } from './types';

const noop = () => {};

export const DEFAULT_COSMOS_CONTEXT: CosmosContextType = {
  accounts: [],
  client: null,
  currentAccount: null,
  isConnected: false,
  changeAccount: noop,
  reconnect: noop,
  connect: noop,
};
