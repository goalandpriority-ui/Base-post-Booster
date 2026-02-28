export const metadata = {
  title: "Base Post Booster",
  description: "Boost your Base posts",
  openGraph: {
    title: "Base Post Booster",
    images: ["https://base-post-booster.vercel.app/og.png"],
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
