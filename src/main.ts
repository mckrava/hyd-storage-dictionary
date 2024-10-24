import { TypeormDatabase, Store } from '@subsquid/typeorm-store';

import { processor, ProcessorContext } from './processor';
import { BatchState } from './utils/batchState';
import { AppConfig } from './appConfig';
import { handleXykPoolsStorage } from './handlers/xykPool';
import { handleOmnipoolStorage } from './handlers/omnipoolPool';
import { handleStablepoolStorage } from './handlers/stablepool';
import { splitIntoBatches } from './utils/helpers';

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

    console.time(`Blocks batch has been processed in`);
    let blocksSubBatchIndex = 1;
    for (const blocksSubBatch of splitIntoBatches(ctx.blocks, 900)) {
      console.time(
        `Blocks sub-batch #${blocksSubBatchIndex} with size 900 blocks has been processed in`
      );
      await Promise.all(
        blocksSubBatch.map(async (block) => {
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
        })
      );
      console.timeEnd(
        `Blocks sub-batch #${blocksSubBatchIndex} with size 900 blocks has been processed in`
      );
      blocksSubBatchIndex++;
    }
    console.timeEnd(`Blocks batch has been processed in`);

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
