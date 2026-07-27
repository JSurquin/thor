import { NextResponse } from "next/server";
import { getLabSession } from "@/lib/lab-runtime";

type RouteContext = { params: Promise<{ sessionId: string }> };

/**
 * Point d'accroche terminal (stub) — sera remplacé par proxy WebSocket vers ttyd/Gotty ou Azure Serial Console.
 */
export async function GET(_request: Request, context: RouteContext) {
  const { sessionId } = await context.params;
  const session = getLabSession(sessionId);

  if (!session) {
    return NextResponse.json({ error: "Session introuvable." }, { status: 404 });
  }

  if (session.status === "stopped") {
    return NextResponse.json({ error: "Session terminée." }, { status: 410 });
  }

  return NextResponse.json({
    message:
      "Terminal distant non branché — connecter ici le proxy WebSocket (xterm.js + orchestrateur Azure/AWS).",
    sessionId: session.id,
    provider: session.provider,
    image: session.image,
    status: session.status,
  });
}
