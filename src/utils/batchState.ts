import {
  OmnipoolAssetData,
  Stablepool,
  StablepoolAssetData,
  XykPool,
  XykPoolAssetsData,
} from '../model';

export type BatchStatePayload = {
  xykPools: Map<string, XykPool>;
  xykPoolAssetsData: Map<string, XykPoolAssetsData>;

  omnipoolAssetsData: Map<string, OmnipoolAssetData>;

  stablepools: Map<string, Stablepool>;
  stablepoolAssetsData: Map<string, StablepoolAssetData>;
};

export class BatchState {
  private statePayload: BatchStatePayload = {
    xykPools: new Map(),
    xykPoolAssetsData: new Map(),
    omnipoolAssetsData: new Map(),
    stablepools: new Map(),
    stablepoolAssetsData: new Map(),
  };

  get state(): BatchStatePayload {
    return { ...this.statePayload };
  }

  set state(partialState: Partial<BatchStatePayload>) {
    this.statePayload = { ...this.statePayload, ...partialState };
  }
}
