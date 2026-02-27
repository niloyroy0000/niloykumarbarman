import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const message = (body?.message ?? "").toString();

    return NextResponse.json({
      ok: true,
      reply: message
        ? `SpireWiz is an AI integration initiative/project. You asked: "${message}"`
        : "Hi! Ask me about SpireWiz, skills, projects, or experience.",
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
