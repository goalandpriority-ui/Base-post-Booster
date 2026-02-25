import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useContractWrite, usePrepareContractWrite, useNetwork, useSwitchNetwork } from "wagmi";
import BasePostBoosterABI from "../abi/BasePostBoosterABI.json";

// Updated category names
const categoryNames = ["Basic", "Whale", "Pro"];
const durationOptions = [
  { label: "1 Hour", price: "0.001" },
  { label: "6 Hours", price: "0.002" },
  { label: "24 Hours", price: "0.003" },
];

const BASE_CHAIN_ID = 8453; // Base network

export default function BoostForm() {
  const [postUrl, setPostUrl] = useState("");
  const [category, setCategory] = useState(0);
  const [durationIndex, setDurationIndex] = useState(0);

  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  // Auto switch to Base chain
  useEffect(() => {
    if (chain?.id !== BASE_CHAIN_ID && switchNetwork) {
      alert("Switching wallet to Base Network for low fees");
      switchNetwork(BASE_CHAIN_ID);
    }
  }, [chain, switchNetwork]);

  const { config } = usePrepareContractWrite({
    address: "0xYourContractAddressHere", // <-- replace with deployed contract
    abi: BasePostBoosterABI,
    functionName: "boostPost",
    args: [postUrl, category, durationIndex],
    overrides: {
      value: ethers.utils.parseEther(durationOptions[durationIndex].price),
    },
    enabled: chain?.id === BASE_CHAIN_ID,
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
        onClick={() => {
          if (chain?.id !== BASE_CHAIN_ID) {
            alert("Please switch wallet to Base Network");
            return;
          }
          write?.();
        }}
        style={{ width: "100%", padding: "10px", background: "#4f46e5", color: "#fff", border: "none", cursor: "pointer" }}
      >
        Boost Now 🚀
      </button>
    </div>
  );
}
