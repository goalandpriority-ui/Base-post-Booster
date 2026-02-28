import { NextResponse } from "next/server";

// Handle POST requests from Farcaster
export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Mini App Webhook Received:", body);

    return NextResponse.json(
      { status: "ok" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook Error:", error);

    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}

// Optional: Handle GET to check if webhook is alive
export async function GET() {
  return NextResponse.json(
    { status: "webhook alive" },
    { status: 200 }
  );
}
