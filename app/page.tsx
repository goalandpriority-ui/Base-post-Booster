'use client'

import { useState } from "react"
import { ethers } from "ethers"

export default function BoostPage() {
  const [txHash, setTxHash] = useState("")

  async function boostPost() {
    if (!(window as any).ethereum) {
      alert("Install MetaMask")
      return
    }

    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    )

    await provider.send("eth_requestAccounts", [])

    const signer = provider.getSigner()

    const tx = await signer.sendTransaction({
      to: "0xffF8b3F8D8b1F06EDE51fc331022B045495cEEA2",
      value: ethers.utils.parseEther("0.001")
    })

    setTxHash(tx.hash)
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>🚀 Base On-Chain Boost</h1>

      <button onClick={boostPost}>
        Boost Post (0.001 ETH)
      </button>

      {txHash && (
        <p>Transaction Hash: {txHash}</p>
      )}
    </div>
  )
}
