'use client'

import { useState } from 'react'
import { ethers } from 'ethers'

export default function Home() {
  const [loading, setLoading] = useState(false)

  const sendTransaction = async () => {
    try {
      if (!window.ethereum) return alert('Please install MetaMask!')

      setLoading(true)

      const provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = await provider.getSigner()

      const tx = await signer.sendTransaction({
        to: '0xRecipientAddressHere', // change to your recipient
        value: ethers.parseEther('0.01'),
      })

      await tx.wait()
      alert('Transaction sent successfully!')
    } catch (err: any) {
      console.error(err)
      alert('Transaction failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <button onClick={sendTransaction} disabled={loading}>
        {loading ? 'Sending...' : 'Send 0.01 ETH'}
      </button>
    </div>
  )
}
