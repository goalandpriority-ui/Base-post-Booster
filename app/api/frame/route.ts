import { NextResponse } from "next/server";

export async function POST() {
  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="https://base-post-booster.vercel.app/og.png" />
      <meta property="fc:frame:button:1" content="Open App 🚀" />
      <meta property="fc:frame:button:1:action" content="link" />
      <meta property="fc:frame:button:1:target" content="https://base-post-booster.vercel.app" />
      <meta property="fc:frame:post_url" content="https://base-post-booster.vercel.app/api/frame" />
    </head>
    <body>
      Frame Loaded
    </body>
  </html>
  `;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
