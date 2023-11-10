import { useCallback, useEffect, useState } from 'react';
import { useCosmos } from './use-cosmos';
import { Coin } from '@cosmjs/stargate';

const ttDelta = (tt1: number, tt2: number, delta = 30) =>
  Boolean((tt1 - tt2) / 1000 < delta);

export const useBalances = (address?: string) => {
  const { currentAccount, client } = useCosmos();

  const [balances, setBalances] = useState<Coin[]>([]);
  const [lastCallAddress, setLastCallAddress] = useState<string | null>();
  const [lastCallTT, setLastCallTT] = useState<number>(0);

  const getBalances = useCallback(
    (address: string) => {
      console.log('Getting balances', address, client);
      console.log(
        'Condition',
        address !== lastCallAddress ||
          lastCallTT === 0 ||
          !ttDelta(Date.now(), lastCallTT, 3),
        [
          address !== lastCallAddress,
          lastCallTT === 0,
          !ttDelta(Date.now(), lastCallTT, 3),
        ],
        {
          address,
          lastCallTT,
          td: ttDelta(Date.now(), lastCallTT, 3),
        }
      );
      if (!client) return;

      if (
        address !== lastCallAddress ||
        lastCallTT === 0 ||
        !ttDelta(Date.now(), lastCallTT, 3)
      )
        client
          .getAllBalances(address)
          .then(balances => {
            setBalances(balances as Coin[]);
            setLastCallAddress(address);
            setLastCallTT(Date.now());
          })
          .catch(e => console.log('Get balances', e));
    },
    [client, lastCallTT]
  );

  useEffect(() => {
    let addr = '';
    if (address) addr = address;
    else if (currentAccount) addr = currentAccount.address;

    getBalances(addr);
  }, [currentAccount, address]);

  return { balances };
};
