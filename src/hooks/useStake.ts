import { useCallback } from 'react'

import useSushi from './useSushi'
import { useWallet } from 'use-wallet'

import { stake, getMasterChefContract } from '../sushi/utils'

const useStake = (pid: number) => {
  const { account } = useWallet()
  const sushi = useSushi()
  let referral = localStorage.getItem('CACHE_BSCX_LAUNCHPOOLX_REFERRAL')
  referral = referral || '0x0000000000000000000000000000000000000000'

  const handleStake = useCallback(
    async (amount: string) => {
      try {
        const txHash = await stake(
          getMasterChefContract(sushi),
          pid,
          amount,
          account,
          referral
        )
        console.log(txHash)
        return txHash
      }
      catch (ex) {
        return ''
      }
    },
    [account, pid, sushi],
  )

  return { onStake: handleStake }
}

export default useStake
