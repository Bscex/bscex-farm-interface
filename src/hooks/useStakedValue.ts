import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'

import {
  getMasterChefContract,
  getFarms,
  getLPValue,
} from '../sushi/utils'
import useSushi from './useSushi'
import useBlock from './useBlock'
import axios from 'axios'
import config from '../config'
import useBSCXPrice from './useBSCXPrice'

export interface StakedValue {
  tokenAmount: BigNumber
  token2Amount: BigNumber
  totalToken2Value: BigNumber
  tokenPriceInToken2: BigNumber
  poolWeight: BigNumber
  usdValue: BigNumber
  pid: string
}

const useStakedValue = (pid: number) => {
  const [balance, setBalance] = useState<StakedValue>()
  const sushi = useSushi()
  const farms = getFarms(sushi)
  const bscxPrice = useBSCXPrice()
  // console.log('bscxPrice22: ', bscxPrice.toString())
  const masterChefContract = getMasterChefContract(sushi)
  const block = 0//useBlock()

  const fetchStakedValue = useCallback(async () => {
    const balances: Array<StakedValue> = await Promise.all(
      farms.filter((e: any) => e.pid == pid).map(
        ({
          pid,
          lpContract,
          tokenContract,
          token2Contract
        }: {
          pid: number
          lpContract: Contract
          tokenContract: Contract
          token2Contract: Contract
        }) =>
          getLPValue(
            masterChefContract,
            lpContract,
            tokenContract,
            token2Contract,
            pid,
            bscxPrice,
          ),
      ),
    )
    // const { data: balances } = await axios.get(`${config.api}/pools/${pid}`)
    setBalance(balances[0])
  }, [masterChefContract, block, sushi, bscxPrice])

  useEffect(() => {
    if (masterChefContract && sushi && bscxPrice) {
      fetchStakedValue()
    }
  }, [masterChefContract, block, setBalance, sushi, bscxPrice])

  return balance
}

export default useStakedValue
