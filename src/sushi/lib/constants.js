import BigNumber from 'bignumber.js/bignumber'

export const SUBTRACT_GAS_LIMIT = 100000
export const START_REWARD_AT_BLOCK = 3525595 // TODO
export const NUMBER_BLOCKS_PER_YEAR = 10512000

export const START_NEW_POOL_AT = 1609255800 // 2020/12/29 22h30

const ONE_MINUTE_IN_SECONDS = new BigNumber(60)
const ONE_HOUR_IN_SECONDS = ONE_MINUTE_IN_SECONDS.times(60)
const ONE_DAY_IN_SECONDS = ONE_HOUR_IN_SECONDS.times(24)
const ONE_YEAR_IN_SECONDS = ONE_DAY_IN_SECONDS.times(365)

export const INTEGERS = {
  ONE_MINUTE_IN_SECONDS,
  ONE_HOUR_IN_SECONDS,
  ONE_DAY_IN_SECONDS,
  ONE_YEAR_IN_SECONDS,
  ZERO: new BigNumber(0),
  ONE: new BigNumber(1),
  ONES_31: new BigNumber('4294967295'), // 2**32-1
  ONES_127: new BigNumber('340282366920938463463374607431768211455'), // 2**128-1
  ONES_255: new BigNumber(
    '115792089237316195423570985008687907853269984665640564039457584007913129639935',
  ), // 2**256-1
  INTEREST_RATE_BASE: new BigNumber('1e18'),
}

export const addressMap = {
  uniswapFactory: '0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95',
  uniswapFactoryV2: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
  YFI: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
  YCRV: '0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8',
  UNIAmpl: '0xc5be99a02c6857f9eac67bbce58df5572498f40c',
  WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  UNIRouter: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  LINK: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
  MKR: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
  SNX: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
  COMP: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
  LEND: '0x80fB784B7eD66730e8b1DBd9820aFD29931aab03',
  SUSHIYCRV: '0x2C7a51A357d5739C5C74Bf3C96816849d2c9F726',
}

// TODO: change the address & set LP pool
export const contractAddresses = {
  sushi: {
    56: '0x5ac52ee5b2a633895292ff6d8a89bb9190451587', // bscx token
    97: '0xEFceA9c937D8a4c91244F16dBA188C33F27A7Dba'
  },
  xSushi: {
    56: '0xF1CE70C337EcCD47A998be0Bb07E49188Bc60A3c', // BSCXSafe
    97: '0x5838ef045E4125aE63bE5CD9752cF007B9E82ceD'
  },
  maker: {
    56: '0xE162A4ac31086bb0B135c2bFE6434BA22b759c59',
    97: '0xefC5f524F40bda7481E0714349068c547cC9F08d'
  },
  masterChef: {
    56: '0x1070B9a998C4457C5f393e389F275012e91b31d2',
    97: '0xD79D36EC312ba78543Fc4A15249A5EFf7afdD253'
  },
  weth: {
    56: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    97: '0xae13d989dac2f0debff460ac112a837c89baa7cd' // wbnb
  }
}

export const supportedPools = [
  {
    pid: 0,
    lpAddresses: {
      56: '0xaAc5ee3361dA99d3770ff480fC0E2686FfEba302',
      97: '0xaC6A00ec0224cC582AFC6c9119fc80D4466238d3',
    },
    tokenAddresses: {
      56: '0x5ac52ee5b2a633895292ff6d8a89bb9190451587',
      97: '0x7d7f7bbc88239cc2463797632faf94aa1088c7d2',
    },
    token2Addresses: {
      56: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      97: '0xae13d989dac2f0debff460ac112a837c89baa7cd'
    },
    name: 'BSCX - BUSD',
    symbol: 'BSCX-BUSD LP',
    symbolShort: 'BSCX-BUSD',
    description: `Deposit BSCX-BUSD LP Earn BSCX`,
    tokenSymbol: 'BSCX',
    token2Symbol: 'BUSD',
    icon: 'https://nextyezpay.s3-ap-southeast-1.amazonaws.com/bscx.png',
    icon2: 'https://s2.coinmarketcap.com/static/img/coins/128x128/4687.png',
    isHot: true,
    isNew: true,
    protocal: 'BSCEX',
    iconProtocal: 'https://nextyezpay.s3-ap-southeast-1.amazonaws.com/bscx.png',
    pairLink: '/',
    addLiquidityLink: 'https://swap.bscex.org/#/add/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56/0x5Ac52EE5b2a633895292Ff6d8A89bB9190451587',
    removeLiquidityLink: 'https://swap.bscex.org/#/remove/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56/0x5Ac52EE5b2a633895292Ff6d8A89bB9190451587'
  },
  {
    pid: 1,
    lpAddresses: {
      56: '0x20781bc3701c5309ac75291f5d09bdc23d7b7fa8',
      97: '0x8390ba50006860538936c96c1f283019fbe72bfd',
    },
    tokenAddresses: {
      56: '0x5ac52ee5b2a633895292ff6d8a89bb9190451587',
      97: '0x7d7f7bbc88239cc2463797632faf94aa1088c7d2',
    },
    token2Addresses: {
      56: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
      97: '0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee'
    },
    name: 'BSCX - BUSD 2',
    symbol: 'BSCX-BUSD 2 LP',
    symbolShort: 'BSCX-BUSD',
    description: `Deposit BSCX-BUSD LP Earn BSCX`,
    tokenSymbol: 'BSCX',
    token2Symbol: 'BUSD',
    icon: 'https://nextyezpay.s3-ap-southeast-1.amazonaws.com/bscx.png',
    icon2: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/logo.png',
    isHot: true,
    isNew: true,
    protocal: 'BSCEX',
    iconProtocal: 'https://nextyezpay.s3-ap-southeast-1.amazonaws.com/bscx.png',
    pairLink: '/',
    addLiquidityLink: 'https://swap.bscex.org/#/add/0x5Ac52EE5b2a633895292Ff6d8A89bB9190451587/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    removeLiquidityLink: 'https://swap.bscex.org/#/remove/0x5Ac52EE5b2a633895292Ff6d8A89bB9190451587/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
  },
  // {
  //   pid: 2,
  //   lpAddresses: {
  //     56: '0xeb0bab8f337ea2053457decce15e93005b59326a'
  //   },
  //   tokenAddresses: {
  //     56: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82'
  //   },
  //   token2Addresses: {
  //     56: '0x5Ac52EE5b2a633895292Ff6d8A89bB9190451587'
  //   },
  //   name: 'BSCX - CAKE',
  //   symbol: 'BSCX-CAKE LP',
  //   symbolShort: 'BSCX-CAKE',
  //   description: `Deposit BSCX-CAKE LP Earn BSCX`,
  //   tokenSymbol: 'BSCX',
  //   token2Symbol: 'CAKE',
  //   icon: 'https://nextyezpay.s3-ap-southeast-1.amazonaws.com/bscx.png',
  //   icon2: 'https://raw.githubusercontent.com/Bscex/bscex-token-list/master/images/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.png',
  //   isHot: true,
  //   isNew: true,
  //   protocal: 'BSCEX',
  //   iconProtocal: 'https://nextyezpay.s3-ap-southeast-1.amazonaws.com/bscx.png',
  //   pairLink: '/',
  //   addLiquidityLink: 'https://swap.bscex.org/#/add/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/0x5Ac52EE5b2a633895292Ff6d8A89bB9190451587',
  //   removeLiquidityLink: 'https://swap.bscex.org/#/remove/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/0x5Ac52EE5b2a633895292Ff6d8A89bB9190451587'
  // },
]
// .map(e => {
//   if (
//     ['0x239E37485B13F873ac9D5D8D7eC3C8cC1b3Ab0C7']
//     .indexOf(e.lpAddresses[97].toLowerCase()) >= 0)
//     {
//       e.isHot = false
//       e.isNew = true
//     }
//     else {
//       e.isHot = true
//       e.isNew = false
//     }

//     return e;
// })
.sort((a, b) => (a.isNew ? -1 : 1) - (b.isNew ? -1 : 1) )
