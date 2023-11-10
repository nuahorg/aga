import {
  Coin,
  DeliverTxResponse,
  GasPrice,
  SigningStargateClient,
  StdFee,
  assertIsDeliverTxSuccess,
  calculateFee,
} from '@cosmjs/stargate';
import { useCosmos } from './use-cosmos';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type UseTransactionOptions = {
  from?: string;
  to?: string;
  amount?: Coin[];
  fee: Coin;
};

export type TransactionConfig = {
  from: string;
  to: string;
  amount: Coin[];
  fee: number | StdFee;
};

/**
 * Hook uses for sending tokens
 */
export const useTransaction = ({
  amount,
  from,
  to,
  fee: _fee,
}: UseTransactionOptions) => {
  const { currentAccount, client } = useCosmos();
  const [fee, setFee] = useState<StdFee | null>();
  const [result, setResult] = useState<DeliverTxResponse>();
  const [status, setStatus] = useState<
    'idle' | 'pending' | 'success' | 'failed' | 'invalid'
  >('idle');
  const [error, setError] = useState<string>();

  const options = useMemo(
    () => ({ amount, from: from || currentAccount?.address, to }),
    [amount, from, to, currentAccount]
  );

  const execute = useCallback(async () => {
    try {
      if (!client || !(client instanceof SigningStargateClient))
        throw new Error(
          'Client is not connected or client is not signed by wallet'
        );
      setStatus('pending');
      if (!options.amount || !fee || !options.from || !options.to)
        throw new Error(
          'Config is invalid\n' + JSON.stringify({ ...options, fee })
        );

      const txResult = await client.sendTokens(
        options.from,
        options.to,
        options.amount,
        fee
      );
      setResult(txResult);
    } catch (error) {
      setStatus('invalid');
      if (error instanceof Error) setError(error.message);
    }
  }, [options, fee, client]);

  const prepare = useCallback(() => {
    try {
      const gas = GasPrice.fromString(_fee.amount + _fee.denom);
      const fee = calculateFee(Number(_fee.amount), gas);
      if (!client || !currentAccount) return;
      setFee(fee);
    } catch (error) {
      setStatus('invalid');
      if (error instanceof Error) setError(error.message);
    }
  }, [client, currentAccount, from]);

  useEffect(() => {
    prepare();
  }, [prepare]);

  useEffect(() => {
    if (result) {
      try {
        assertIsDeliverTxSuccess(result);
        setStatus('success');
      } catch (error) {
        setStatus('failed');
        setError((error as Error).message);
      }
    }
  }, [result]);

  return {
    status,
    error,
    result,
    execute,
  };
};
