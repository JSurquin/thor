import { NextResponse } from "next/server";
import { createLabSession } from "@/lib/lab-runtime";

export async function POST(request: Request) {
  let body: {
    exerciseId?: string;
    provider?: "azure" | "aws";
    image?: string;
    maxMinutes?: number;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide." }, { status: 400 });
  }

  if (!body.exerciseId?.trim()) {
    return NextResponse.json(
      { error: "exerciseId est requis." },
      { status: 400 }
    );
  }

  const result = createLabSession({
    exerciseId: body.exerciseId.trim(),
    provider: body.provider,
    image: body.image,
    maxMinutes: body.maxMinutes,
  });

  if (!result.ok) {
    const status = result.code === "disabled" ? 503 : 400;
    return NextResponse.json({ error: result.message, code: result.code }, { status });
  }

  return NextResponse.json({ session: result.session }, { status: 201 });
}
