import { NextRequest, NextResponse } from "next/server";

function getHtml(message: string) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Base Post Booster Frame</title>

      <!-- Open Graph -->
      <meta property="og:title" content="Base Post Booster 🚀" />
      <meta property="og:image" content="https://base-post-booster.vercel.app/og.png" />
      <meta property="og:description" content="Boost your Base posts instantly" />

      <!-- Frame -->
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="https://base-post-booster.vercel.app/og.png" />

      <!-- BUTTONS -->
      <meta property="fc:frame:button:1" content="🚀 Boost" />
      <meta property="fc:frame:button:1:action" content="post" />

      <meta property="fc:frame:button:2" content="Open App 🌐" />
      <meta property="fc:frame:button:2:action" content="link" />
      <meta property="fc:frame:button:2:target" content="https://base-post-booster.vercel.app" />

      <meta property="fc:frame:post_url" content="https://base-post-booster.vercel.app/api/frame" />

    </head>
    <body style="background:black;color:white;display:flex;justify-content:center;align-items:center;height:100vh;">
      <div>${message}</div>
    </body>
  </html>
  `;
}

export async function GET() {
  return new NextResponse(getHtml("Frame Loaded 🚀"), {
    headers: { "Content-Type": "text/html" },
  });
}

export async function POST(req: NextRequest) {

  try {

    const body = await req.json()

    const buttonIndex = body?.untrustedData?.buttonIndex
    const fid = body?.untrustedData?.fid

    console.log("User:", fid, "Clicked:", buttonIndex)

    if (buttonIndex === 1) {

      // 🚀 BOOST CLICKED
      return new NextResponse(
        getHtml("🚀 Boost Triggered! Opening App..."),
        { headers: { "Content-Type": "text/html" } }
      )

    }

    return new NextResponse(
      getHtml("Unknown Action"),
      { headers: { "Content-Type": "text/html" } }
    )

  } catch (err) {

    console.error(err)

    return new NextResponse(
      getHtml("Error processing frame"),
      { headers: { "Content-Type": "text/html" } }
    )
  }
}
