"use client"
import { useState } from 'react'
import { useSendTransaction } from 'wagmi'
import { ethers } from 'ethers'

export default function Page() {
  const [loading, setLoading] = useState(false)
  const { sendTransactionAsync } = useSendTransaction({
    request: {
      to: '0xRecipientAddressHere', // change to your recipient
      value: ethers.parseEther('0.01')
    }
  })

  const handleSend = async () => {
    try {
      setLoading(true)
      const txHash = await sendTransactionAsync?.()
      // If you want confirmation
      const provider = new ethers.BrowserProvider(window.ethereum)
      await provider.waitForTransaction(txHash!)
      alert(`Transaction sent 🚀 Hash: ${txHash}`)
    } catch (e) {
      console.error(e)
      alert('Transaction failed 😞')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button onClick={handleSend} disabled={loading}>
        {loading ? 'Sending...' : 'Send Transaction'}
      </button>
    </div>
  )
}
