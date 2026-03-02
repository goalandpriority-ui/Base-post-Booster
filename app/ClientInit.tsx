"use client"

import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export default function ClientInit() {
  useEffect(() => {
    // Farcaster splash screen hide pannum – idhu main fix
    sdk.actions.ready();

    // Optional debug (remove later if want)
    // console.log("Farcaster Mini App ready called");
    // sdk.context.then(ctx => console.log("Launch context:", ctx));
  }, []);

  return null; // invisible
}
