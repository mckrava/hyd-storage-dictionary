import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';

function test(){
  const hex = '0x4c3f445da74028f47bdcfc66c1c73a6c9f9951c2185f0c3f47e3836494879d17' // 63: 7KKXieLDbfJPUaVohYTbbib97LdC1URmZuMNFq9rvTudmDMv

  const decorated = encodeAddress(hex, 63)

  console.log(decorated)
}

test()