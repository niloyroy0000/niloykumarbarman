import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({} as any));

  
  const message = (body?.message ?? body?.prompt ?? body?.text ?? body?.q ?? "").toString();

  return NextResponse.json({
    ok: true,
    reply: message
      ? `SpireWiz is an AI integration initiative/project. You asked: "${message}"`
      : "Hi! Ask me about SpireWiz, skills, projects, or experience.",
  });
}
