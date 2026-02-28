import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return new NextResponse(
    `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Base Post Booster Frame</title>

<meta property="fc:frame" content="vNext" />
<meta property="fc:frame:image" content="https://base-post-booster.vercel.app/og.png" />
<meta property="fc:frame:button:1" content="Open App 🚀" />
<meta property="fc:frame:button:1:action" content="link" />
<meta property="fc:frame:button:1:target" content="https://base-post-booster.vercel.app" />
<meta property="fc:frame:post_url" content="https://base-post-booster.vercel.app/frame" />

</head>
<body>
Base Post Booster Frame
</body>
</html>`,
    {
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "no-store",
      },
    }
  );
}
