// app/ClientInit.tsx
"use client"

import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export default function ClientInit() {
  useEffect(() => {
    // Splash hide pannu – idhu Mini App launch la important
    sdk.actions.ready();
    // Optional debug: Farcaster context paaru (FID, etc.)
    // sdk.context.then(ctx => console.log("Farcaster launch context:", ctx));
  }, []); // once on mount

  return null; // invisible component
}
