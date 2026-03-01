import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("📩 Farcaster Mini App Webhook Event:", body);

    // Always respond quickly
    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Webhook parsing error:", err);

    return NextResponse.json(
      { success: false },
      { status: 400 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json(
    { status: "webhook working" },
    { status: 200 }
  );
}
