import { NextResponse } from "next/server";
import { getLabSession, stopLabSession } from "@/lib/lab-runtime";

type RouteContext = { params: Promise<{ sessionId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { sessionId } = await context.params;
  const session = getLabSession(sessionId);

  if (!session) {
    return NextResponse.json({ error: "Session introuvable." }, { status: 404 });
  }

  return NextResponse.json({ session });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { sessionId } = await context.params;
  const stopped = stopLabSession(sessionId);

  if (!stopped) {
    return NextResponse.json({ error: "Session introuvable." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
