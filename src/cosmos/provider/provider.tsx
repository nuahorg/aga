import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { HttpEndpoint, SigningStargateClient } from '@cosmjs/stargate';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { CosmosContext } from './context';
import { CosmosContextType } from './types';

export const CosmosProvider = ({
  children,
  rpc,
}: PropsWithChildren<{ rpc: HttpEndpoint | string }>) => {
  const [accounts, setAccounts] = useState<CosmosContextType['accounts']>([]);
  const [client, setClient] = useState<CosmosContextType['client']>();
  const [currentAccount, setCurrentAccount] = useState<
    CosmosContextType['currentAccount']
  >();

  const changeAccount = useCallback(
    (toIndex: number) => {
      if (accounts.length <= toIndex) throw new Error('Out of bounds');
      setCurrentAccount(accounts[toIndex]);
    },
    [accounts]
  );

  const reconnect = () => {};
  const connect = useCallback(
    async (mnemo: string) => {
      try {
        if (!client) return;
        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemo);
        const accounts = await wallet.getAccounts();
        const newClient = await SigningStargateClient.connectWithSigner(
          rpc,
          wallet
        );
        setClient(newClient);
        setAccounts(accounts);
        setCurrentAccount(accounts[0]);
      } catch (error) {}
    },
    [client]
  );

  const connectToRPC = () => {
    SigningStargateClient.connect(rpc)
      .then(client => setClient(client))
      .catch(e => console.error('Error while creating stargate client', e));
  };

  const state: CosmosContextType = useMemo(
    () => ({
      accounts,
      client,
      currentAccount,
      changeAccount,
      isConnected: Boolean(client),
      reconnect,
      connect,
    }),
    [accounts, client, currentAccount, changeAccount, reconnect, connect]
  );

  useEffect(() => {
    connectToRPC();
  }, []);

  return (
    <CosmosContext.Provider value={state}>{children}</CosmosContext.Provider>
  );
};
