"use client";

import { useState } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

declare global {
  interface Window {
    ethereum?: any;
  }
}

// Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

const YOUR_WALLET_ADDRESS = "0xffF8b3F8D8b1F06EDE51fc331022B045495cEEA2";
const MINI_APP_LINK = "https://base-post-booster.vercel.app/";

export default function Home() {
  const [selectedTier, setSelectedTier] = useState(0);
  const [postLink, setPostLink] = useState<string | string[]>("");
  const [contract, setContract] = useState("");
  const [loading, setLoading] = useState(false);

  const tiers = [
    { name: "Basic", price: "0.001 ETH", duration: "24 Hours Boost", value: "0x38D7EA4C68000" },
    { name: "Pro", price: "0.003 ETH", duration: "48 Hours Boost", value: "0xAA87BEE538000" },
    { name: "Elite", price: "0.005 ETH", duration: "72 Hours Boost", value: "0x11C37937E08000" },
  ];

  async function handleBoost() {
    if (!postLink) { alert("Paste post link"); return; }
    if (!window.ethereum) { alert("Install MetaMask"); return; }

    try {
      setLoading(true);

      // Ethereum payment
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [{ from: accounts[0], to: 0xffF8b3F8D8b1F06EDE51fc331022B045495cEEA2, value: tiers[selectedTier].value }],
      });

      // --- Safe Supabase upsert ---
      const postsArray = Array.isArray(postLink) ? postLink : [postLink as string];
      const postsToUpsert = postsArray.map((post: string) => ({
        post,
        contract: contract || null,
        tier: tiers[selectedTier].name,
        boost_count: 1,
        updated_at: new Date().toISOString(),
      }));

      const { data, error } = await supabase
        .from("boosted_posts")
        .upsert(postsToUpsert, { onConflict: ["post"] });

      if (error) console.error("Supabase upsert error:", error);
      else console.log("Supabase upsert success:", data);

      // LocalStorage update for Trending page
      let existing: any[] = JSON.parse(localStorage.getItem("boostedPosts") || "[]");
      postsArray.forEach(pl => {
        const index = existing.findIndex(item => item.link === pl);
        if (index !== -1) existing[index].boostCount += 1;
        else existing.push({ link: pl, contract, tier: tiers[selectedTier].name, boostCount: 1, time: new Date().toLocaleString() });
      });
      localStorage.setItem("boostedPosts", JSON.stringify(existing));

      // Auto share to Farcaster / Mini app
      try {
        const shareText = `I just boosted a post! Check it here: ${postsArray.join(", ")} via ${MINI_APP_LINK}`;
        if (navigator.share) {
          await navigator.share({ text: shareText, url: MINI_APP_LINK, title: "Base Post Booster" });
        } else {
          console.log("Share API not supported, fallback link:", shareText);
        }
      } catch (shareError) {
        console.error("Share failed:", shareError);
      }

      alert("Boost successful");
      setPostLink(""); setContract("");
    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 20, textAlign: "center", maxWidth: 500, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, marginBottom: 30 }}>Base Post Booster</h1>

      <div style={{ marginBottom: 30 }}>
        {tiers.map((tier, i) => (
          <div
            key={i}
            onClick={() => setSelectedTier(i)}
            style={{
              border: selectedTier === i ? "2px solid black" : "1px solid gray",
              padding: 15, marginBottom: 15, cursor: "pointer"
            }}
          >
            <h3>{tier.name}</h3>
            <p>{tier.price}</p>
            <p style={{ fontSize: 14, color: "gray" }}>{tier.duration}</p>
          </div>
        ))}
      </div>

      <input type="text" placeholder="Paste Base post link" value={Array.isArray(postLink) ? postLink.join(",") : postLink} onChange={e => {
        const val = e.target.value;
        setPostLink(val.includes(",") ? val.split(",").map(s => s.trim()) : val);
      }} style={{ padding: 12, width: "100%", boxSizing: "border-box", marginBottom: 10 }} />

      <input type="text" placeholder="Coin Contract Address" value={contract} onChange={e => setContract(e.target.value)} style={{ padding: 12, width: "100%", boxSizing: "border-box" }} />

      <div style={{ marginTop: 20 }}>
        <button onClick={handleBoost} disabled={loading} style={{ padding: "10px 20px", cursor: "pointer" }}>
          {loading ? "Processing..." : "Boost Now"}
        </button>
      </div>

      <div style={{ marginTop: 40 }}>
        <a href="/trending">View Trending Posts</a>
      </div>
    </main>
  );
      }
