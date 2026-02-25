import { useState } from "react";
import { ethers } from "ethers";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import BasePostBoosterABI from "../abi/BasePostBoosterABI.json";

const categoryNames = ["Trending", "Meme", "Alpha", "NFT", "General"];
const durationOptions = [
  { label: "1 Hour", price: "0.001" },
  { label: "6 Hours", price: "0.002" },
  { label: "24 Hours", price: "0.003" },
];

export default function BoostForm() {
  const [postUrl, setPostUrl] = useState("");
  const [category, setCategory] = useState(0);
  const [durationIndex, setDurationIndex] = useState(0);

  const { config } = usePrepareContractWrite({
    address: "0xffF8b3F8D8b1F06EDE51fc331022B045495cEEA2", // <-- Deploy and replace
    abi: BasePostBoosterABI,
    functionName: "boostPost",
    args: [postUrl, category, durationIndex],
    overrides: {
      value: ethers.utils.parseEther(durationOptions[durationIndex].price),
    },
  });

  const { write } = useContractWrite(config);

  return (
    <div style={{ padding: "20px", maxWidth: "400px" }}>
      <h2>Base Post Booster 🚀</h2>

      <input
        placeholder="Post URL"
        value={postUrl}
        onChange={(e) => setPostUrl(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />

      <select
        value={category}
        onChange={(e) => setCategory(Number(e.target.value))}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      >
        {categoryNames.map((c, i) => (
          <option key={i} value={i}>{c}</option>
        ))}
      </select>

      <select
        value={durationIndex}
        onChange={(e) => setDurationIndex(Number(e.target.value))}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      >
        {durationOptions.map((d, i) => (
          <option key={i} value={i}>{d.label} – {d.price} ETH</option>
        ))}
      </select>

      <button
        onClick={() => write?.()}
        style={{ width: "100%", padding: "10px", background: "#4f46e5", color: "#fff", border: "none", cursor: "pointer" }}
      >
        Boost Now 🚀
      </button>
    </div>
  );
}
