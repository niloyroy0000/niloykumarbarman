// app/api/chat/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const message = String(body?.message ?? "").trim();

    // If no message, return JSON error
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // ✅ TEMP DEMO RESPONSE (so your UI works now)
    // Later you can connect OpenAI / any backend here
    return NextResponse.json({
      message: `You said: ${message}`,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}
