import { useState } from 'react';
import { CosmosProvider, useBalances, useCosmos, useTransaction } from '../..';
import './App.css';
import { Coin } from '@cosmjs/stargate';
/**

hawk planet slide hour update tape spot fault water absorb gauge near soft hair leave skull train satoshi weapon cabbage boss noodle solution genre
 */
const Connect = () => {
  const { connect, currentAccount, accounts } = useCosmos();
  const { balances } = useBalances();
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState<Coin>({ amount: '', denom: '' });
  const { execute, result, status, error } = useTransaction({
    to,
    amount: [amount],
    fee: {
      amount: '80000',
      denom: 'nuahp',
    },
  });

  return (
    <div>
      <h3 style={{ textAlign: 'start' }}>
        Currect Account Address:{' '}
        <span style={{ textDecoration: 'underline' }}>
          {currentAccount?.address}
        </span>
      </h3>
      <form
        style={{ display: 'flex', flexDirection: 'column' }}
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();

          const fd = new FormData(e.currentTarget);

          const mnemonic = fd.get('mnemonic');
          if (mnemonic) connect(mnemonic.toString());
        }}
      >
        <textarea placeholder="mnemonic" name="mnemonic"></textarea>
        <button type="submit">Connect</button>
      </form>

      <h3 style={{ textAlign: 'start' }}>Balances:</h3>
      <div>
        {balances.map(b => (
          <div>
            {b.denom}: {b.amount}
          </div>
        ))}
      </div>
      <h3 style={{ textAlign: 'start' }}>Accounts:</h3>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {accounts.map(accountDate => (
          <div>{accountDate.address}</div>
        ))}
      </div>

      <h3>Transaction (send tokens)</h3>
      <form style={{ display: 'flex', flexDirection: 'column' }}>
        <input
          type="text"
          placeholder="to..."
          name="to"
          value={to}
          onChange={e => setTo(e.target.value)}
        />
        <input
          type="text"
          placeholder="amount"
          name="amount"
          value={amount.amount}
          onChange={e => setAmount(p => ({ ...p, amount: e.target.value }))}
        />
        <select
          placeholder="to..."
          name="denom"
          value={amount.denom}
          onChange={e => setAmount(p => ({ ...p, denom: e.target.value }))}
        >
          {balances.map(coin => (
            <option key={coin.denom} value={coin.denom}>
              {coin.denom}
            </option>
          ))}
        </select>
      </form>
      <div style={{ textAlign: 'start' }}>
        Status: {status}
        <br />
        Error:
        <pre>
          <code>{JSON.stringify(error, null, 2)}</code>
        </pre>
        <pre>
          <code>{JSON.stringify(result, null, 2)}</code>
        </pre>
      </div>
      <button onClick={() => execute()}>Execute</button>
    </div>
  );
};

function App() {
  return (
    <CosmosProvider rpc="http://localhost:26657">
      <Connect />
    </CosmosProvider>
  );
}

export default App;
