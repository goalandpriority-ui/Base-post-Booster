"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Home() {
  const [selectedTier, setSelectedTier] = useState(0);
  const [postLink, setPostLink] = useState("");
  const [contract, setContract] = useState("");
  const [loading, setLoading] = useState(false);

  const tiers = [
    { name: "Basic", price: "0.001 ETH", duration: "24h", value: "0x38D7EA4C68000" },
    { name: "Pro", price: "0.003 ETH", duration: "48h", value: "0xAA87BEE538000" },
    { name: "Elite", price: "0.005 ETH", duration: "72h", value: "0x11C37937E08000" },
  ];

  async function handleBoost() {
    if (!postLink) return alert("Paste post link");
    if (!window.ethereum) return alert("Install MetaMask");

    try {
      setLoading(true);
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [{ from: accounts[0], to: "0xYOUR_WALLET_ADDRESS_HERE", value: tiers[selectedTier].value }],
      });

      // --- Supabase Insert / Update ---
      const { error } = await supabase
        .from("boosted_posts")
        .upsert(
          {
            post_link: postLink,
            contract: contract || null,
            tier: tiers[selectedTier].name,
          },
          { onConflict: "post_link", ignoreDuplicates: false }
        )
        .then(async (res) => {
          // increment boost_count manually if exists
          if (res.data?.length) {
            await supabase.rpc("increment_boost_count", { post: postLink });
          }
        });

      if (error) console.error("Supabase error:", error);

      // --- Auto-share Farcaster / Miniapp Link ---
      const shareText = `Boosted a post via Base Post Booster! Check it out: ${postLink} - https://your-miniapp-link.com`;
      window.open(`https://farcaster.com/share?text=${encodeURIComponent(shareText)}`, "_blank");

      alert("Boost & Share successful!");
      setPostLink("");
      setContract("");
    } catch (err) {
      console.error(err);
      alert("Transaction or Share failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 20, maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
      <h1 style={{ fontSize: 28, marginBottom: 30 }}>Base Post Booster</h1>

      <div style={{ marginBottom: 30 }}>
        {tiers.map((tier, i) => (
          <div
            key={i}
            onClick={() => setSelectedTier(i)}
            style={{
              border: selectedTier === i ? "2px solid black" : "1px solid gray",
              padding: 15,
              marginBottom: 15,
              cursor: "pointer",
            }}
          >
            <h3>{tier.name}</h3>
            <p>{tier.price}</p>
            <p style={{ fontSize: 14, color: "gray" }}>{tier.duration}</p>
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Paste Base post link"
        value={postLink}
        onChange={(e) => setPostLink(e.target.value)}
        style={{ padding: 12, width: "100%", marginBottom: 10 }}
      />

      <input
        type="text"
        placeholder="Coin Contract Address"
        value={contract}
        onChange={(e) => setContract(e.target.value)}
        style={{ padding: 12, width: "100%" }}
      />

      <div style={{ marginTop: 20 }}>
        <button onClick={handleBoost} disabled={loading} style={{ padding: "10px 20px", cursor: "pointer" }}>
          {loading ? "Processing..." : "Boost Now"}
        </button>
      </div>
    </main>
  );
}
