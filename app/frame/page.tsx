import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base Post Booster",
  description: "Boost your Base posts",
  openGraph: {
    title: "Base Post Booster",
    images: [
      {
        url: "https://base-post-booster.vercel.app/og.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image":
      "https://base-post-booster.vercel.app/og.png",
    "fc:frame:button:1": "Boost Now 🚀",
    "fc:frame:post_url":
      "https://base-post-booster.vercel.app/api/webhook",
  },
};

export default function FramePage() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Base Post Booster 🚀</h1>
      <p>Frame Loaded Successfully</p>
    </div>
  );
}
