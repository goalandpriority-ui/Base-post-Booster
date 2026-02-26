"use client"

import { useState } from "react"

declare global {
  interface Window {
    ethereum?: any
  }
}

export default function Page() {
  const [loading, setLoading] = useState(false)

  const sendTransaction = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!")
        return
      }

      setLoading(true)

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      const from = accounts[0]

      await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from,
            to: "0xffF8b3F8D8b1F06EDE51fc331022B045495cEEA2", // replace with your Base wallet
            value: "0x2386F26FC10000", // 0.01 ETH in hex
          },
        ],
      })

      alert("Transaction sent successfully!")
    } catch (err) {
      console.error(err)
      alert("Transaction failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Base Post Booster</h1>
      <button onClick={sendTransaction} disabled={loading}>
        {loading ? "Processing..." : "Send 0.01 ETH Boost"}
      </button>
    </div>
  )
}
