import { StargateClient, SigningStargateClient } from '@cosmjs/stargate';
import { AccountData } from '@cosmjs/proto-signing';

export type CosmosContextType = CosmosContextState & CosmosContextMethods;

export type CosmosContextState = {
  client: StargateClient | SigningStargateClient | null | undefined;
  accounts: readonly AccountData[];
  currentAccount: AccountData | null | undefined;
  isConnected: boolean;
};

export type CosmosContextMethods = {
  changeAccount: (toIndex: number) => void;
  reconnect: () => void;
  connect: (menmonic: string) => void;
};
