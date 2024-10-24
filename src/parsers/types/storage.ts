import { AccountBalances } from '../../model';

export interface AccountData {
  free: bigint;
  reserved: bigint;
  miscFrozen: bigint;
  feeFrozen: bigint;
  flags: bigint;
  frozen: bigint;
}

export interface SystemAccountInfo {
  nonce: number;
  consumers: number;
  providers: number;
  sufficients: number;
  data: AccountData;
}
export type ParachainSystemLastRelayChainBlockNumber = number;

export interface TokensAccountsAssetBalances {
  free: bigint;
  reserved: bigint;
  frozen: bigint;
}

export type OmnipoolAssetTradability = {
  bits: number;
};

export interface OmnipoolAssetState {
  hubReserve: bigint;
  shares: bigint;
  protocolShares: bigint;
  cap: bigint;
  tradable: OmnipoolAssetTradability;
}

export interface XykPoolWithAssets {
  poolAddress: string;
  assetAId: number;
  assetBId: number;
}

export interface PoolAssetBalances {
  poolAddress: string;
  assetId: number;
  balances: AccountBalances;
}

export interface OmnipoolAssetWithDetails {
  assetId: number;
  assetState: OmnipoolAssetState;
}

export interface StablepoolWithDetails {
  poolId: number;
  poolAddress?: string;
  assetIds: number[];
  initialAmplification: number;
  finalAmplification: number;
  initialBlock: number;
  finalBlock: number;
  fee: number;
}
