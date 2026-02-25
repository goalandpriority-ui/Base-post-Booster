import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useContractWrite, usePrepareContractWrite, useNetwork, useSwitchNetwork } from "wagmi";
import BasePostBoosterABI from "../abi/BasePostBoosterABI.json";

// Tier names & details
const tierDetails = [
  {
    name: "Basic",
    description: "Small boost",
    durations: [
      { label: "1h", price: 0.001 },
      { label: "6h", price: 0.002 },
      { label: "24h", price: 0.003 },
    ],
  },
  {
    name: "Whale",
    description: "Medium boost",
    durations: [
      { label: "1h", price: 0.002 },
      { label: "6h", price: 0.004 },
      { label: "24h", price: 0.006 },
    ],
  },
  {
    name: "Pro",
    description: "High boost",
    durations: [
      { label: "1h", price: 0.003 },
      { label: "6h", price: 0.006 },
      { label: "24h", price: 0.009 },
    ],
  },
];

const BASE_CHAIN_ID = 8453; // Base network

export default function BoostForm() {
  const [postUrl, setPostUrl] = useState("");
  const [category, setCategory] = useState(0);
  const [durationIndex, setDurationIndex] = useState(0);

  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  // Auto switch wallet to Base network
  useEffect(() => {
    if (chain?.id !== BASE_CHAIN_ID && switchNetwork) {
      alert("Switching wallet to Base Network for low fees");
      switchNetwork(BASE_CHAIN_ID);
    }
  }, [chain, switchNetwork]);

  // Selected tier & duration
  const selectedTier = tierDetails[category];
  const selectedDuration = selectedTier.durations[durationIndex];

  const { config } = usePrepareContractWrite({
    address: "0xYourContractAddressHere", // <-- Replace with deployed contract address
    abi: BasePostBoosterABI,
    functionName: "boostPost",
    args: [postUrl, category, durationIndex],
    overrides: {
      value: ethers.utils.parseEther(selectedDuration.price.toString()),
    },
    enabled: chain?.id === BASE_CHAIN_ID,
  });

  const { write } = useContractWrite(config);

  return (
    <div style={{ padding: "20px", maxWidth: "500px" }}>
      <h2>Base Post Booster 🚀</h2>

      <input
        placeholder="Post URL"
        value={postUrl}
        onChange={(e) => setPostUrl(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "15px" }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
        {tierDetails.map((tier, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              padding: "10px",
              border: category === i ? "2px solid #4f46e5" : "1px solid #ccc",
              borderRadius: "8px",
              marginRight: i < tierDetails.length - 1 ? "5px" : 0,
              cursor: "pointer",
            }}
            onClick={() => {
              setCategory(i);
              setDurationIndex(0); // reset duration on tier change
            }}
          >
            <h4 style={{ margin: 0 }}>{tier.name}</h4>
            <p style={{ fontSize: "12px", marginTop: "5px" }}>{tier.description}</p>
            <ul style={{ paddingLeft: "15px", fontSize: "12px", marginTop: "5px" }}>
              {tier.durations.map((d, idx) => (
                <li key={idx}>
                  {d.label} – {d.price} ETH
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Duration:</label>
        <select
          value={durationIndex}
          onChange={(e) => setDurationIndex(Number(e.target.value))}
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        >
          {selectedTier.durations.map((d, idx) => (
            <option key={idx} value={idx}>
              {d.label} – {d.price} ETH
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={() => {
          if (!postUrl) {
            alert("Please enter Post URL");
            return;
          }
          if (chain?.id !== BASE_CHAIN_ID) {
            alert("Please switch wallet to Base Network");
            return;
          }
          write?.();
        }}
        style={{
          width: "100%",
          padding: "12px",
          background: "#4f46e5",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Boost Now 🚀
      </button>
    </div>
  );
            }
