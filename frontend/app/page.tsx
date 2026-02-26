"use client"

import { useState } from "react"

declare global {
  interface Window {
    ethereum?: any
  }
}

const tiers = [
  { name: "Basic", value: "0x38D7EA4C68000", eth: "0.001" },   // 0.001 ETH
  { name: "Pro", value: "0xAA87BEE538000", eth: "0.003" },    // 0.003 ETH
  { name: "Elite", value: "0x11C37937E08000", eth: "0.005" }, // 0.005 ETH
]

export default function Page() {
  const [account, setAccount] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedTier, setSelectedTier] = useState(tiers[0])

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Install MetaMask")
      return
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    })

    setAccount(accounts[0])
  }

  const switchToBase = async () => {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x2105" }], // Base Mainnet (8453)
    })
  }

  const sendBoost = async () => {
    try {
      if (!window.ethereum) return alert("Install MetaMask")
      if (!account) return alert("Connect wallet first")

      setLoading(true)

      await switchToBase()

      await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: account,
            to: "0xffF8b3F8D8b1F06EDE51fc331022B045495cEEA2", // 👈 CHANGE THIS
            value: selectedTier.value,
          },
        ],
      })

      alert(`${selectedTier.name} Boost Sent on Base 🔵`)
    } catch (err) {
      console.error(err)
      alert("Transaction failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial",
      }}
    >
      <h1 style={{ marginBottom: 10 }}>🚀 Base Post Booster</h1>
      <p style={{ marginBottom: 30, color: "gray" }}>
        Boost your post visibility on Base
      </p>

      {!account && (
        <button
          onClick={connectWallet}
          style={{ padding: "10px 20px", marginBottom: 30 }}
        >
          Connect Wallet
        </button>
      )}

      <div style={{ display: "flex", gap: 20 }}>
        {tiers.map((tier) => (
          <div
            key={tier.name}
            onClick={() => setSelectedTier(tier)}
            style={{
              padding: 25,
              borderRadius: 14,
              cursor: "pointer",
              border:
                selectedTier.name === tier.name
                  ? "2px solid #0052FF"
                  : "1px solid #ddd",
              minWidth: 120,
              textAlign: "center",
            }}
          >
            <h3>{tier.name}</h3>
            <p>{tier.eth} ETH</p>
          </div>
        ))}
      </div>

      <button
        onClick={sendBoost}
        disabled={!account || loading}
        style={{
          marginTop: 30,
          padding: "12px 30px",
          borderRadius: 8,
        }}
      >
        {loading ? "Processing..." : "Boost Now"}
      </button>
    </div>
  )
                   }
