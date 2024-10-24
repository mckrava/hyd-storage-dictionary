import { TypeormDatabase, Store } from '@subsquid/typeorm-store';

import { processor, ProcessorContext } from './processor';
import { BatchState } from './utils/batchState';
import { AppConfig } from './appConfig';
import { handleXykPoolsStorage } from './handlers/xykPool';
import { handleOmnipoolStorage } from './handlers/omnipoolPool';
import { handleStablepoolStorage } from './handlers/stablepool';

const appConfig = AppConfig.getInstance();

processor.run(
  new TypeormDatabase({
    supportHotBlocks: true,
    stateSchema: appConfig.STATE_SCHEMA_NAME,
  }),
  async (ctx) => {
    const ctxWithBatchState: Omit<
      ProcessorContext<Store>,
      'batchState' | 'appConfig'
    > = ctx;
    const batchState = new BatchState();
    (ctxWithBatchState as ProcessorContext<Store>).batchState = batchState;
    (ctxWithBatchState as ProcessorContext<Store>).appConfig =
      AppConfig.getInstance();

    console.log(`Batch size - ${ctx.blocks.length} blocks.`);

    for (let block of ctx.blocks) {
      console.time(`Block ${block.header.height} has been processed in - `);
      if (appConfig.PROCESS_XYK_POOLS)
        await handleXykPoolsStorage(
          ctxWithBatchState as ProcessorContext<Store>,
          block.header
        );
      if (appConfig.PROCESS_OMNIPOOLS)
        await handleOmnipoolStorage(
          ctxWithBatchState as ProcessorContext<Store>,
          block.header
        );
      if (appConfig.PROCESS_STABLEPOOLS)
        await handleStablepoolStorage(
          ctxWithBatchState as ProcessorContext<Store>,
          block.header
        );
      console.timeEnd(`Block ${block.header.height} has been processed in - `);
    }

    if (appConfig.PROCESS_XYK_POOLS) {
      await ctxWithBatchState.store.save([
        ...batchState.state.xykPools.values(),
      ]);
      await ctxWithBatchState.store.save([
        ...batchState.state.xykPoolAssetsData.values(),
      ]);
    }

    if (appConfig.PROCESS_OMNIPOOLS) {
      await ctxWithBatchState.store.save([
        ...batchState.state.omnipoolAssetsData.values(),
      ]);
    }
    if (appConfig.PROCESS_STABLEPOOLS) {
      await ctxWithBatchState.store.save([
        ...batchState.state.stablepools.values(),
      ]);
      await ctxWithBatchState.store.save([
        ...batchState.state.stablepoolAssetsData.values(),
      ]);
    }

    console.log('Batch complete');
  }
);
