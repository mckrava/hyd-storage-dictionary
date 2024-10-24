import WebSocket from 'ws';
import { createClient } from 'graphql-ws';

const client = createClient({
  webSocketImpl: WebSocket,
  url: 'wss://galacticcouncil.squids.live/hydration-xyk-pools-indexer/graphql',
  retryAttempts: Infinity,
});

client.on('connecting', () => console.log('connecting'));
client.on('connected', () => console.log('connected'));
client.on('closed', () => console.log('closed'));
client.on('opened', () => console.log('opened'));
client.on('error', (e) => console.log('error', e));

client.subscribe(
  {
    query: `
    subscription {
      xykPoolHistoricalVolume {
        event
        node {
          assetAFee
          assetAId
          assetATotalFees
          assetATotalVolumeIn
          assetATotalVolumeOut
          assetAVolumeIn
          assetAVolumeOut
          assetBFee
          assetBId
          assetBTotalFees
          assetBTotalVolumeIn
          assetBTotalVolumeOut
          assetBVolumeIn
          assetBVolumeOut
          averagePrice
          id
          paraChainBlockHeight
          poolId
          relayChainBlockHeight
        }
      }
    }
    `,
  },
  {
    next: (data) => {
      console.log(`New transfers: ${JSON.stringify(data)}`);
    },
    error: (error) => {
      console.error('error', error);
    },
    complete: () => {
      console.log('done!');
    },
  }
);
