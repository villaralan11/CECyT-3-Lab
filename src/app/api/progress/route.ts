import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// GET /api/progress?userId=xxx — lista progreso por usuario
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId requerido" }, { status: 400 });

  try {
    const db = getDb();
    const progress = await db.progress.findMany({ where: { userId } });
    return NextResponse.json({ progress });
  } catch (e) {
    console.error("[progress GET]", e);
    // fallback a 501 para que el cliente use localStorage
    return NextResponse.json({ error: "DB error, usa localStorage", fallback: true }, { status: 501 });
  }
}

// POST /api/progress — upsert { userId, topicId, score, total, completed }
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { userId, topicId, score, total, completed } = body ?? {};

  if (!userId || !topicId) return NextResponse.json({ error: "userId y topicId requeridos" }, { status: 400 });

  try {
    const db = getDb();
    // asegura usuario existe (anon o real)
    await db.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, email: `${userId}@anon.local`, name: "Anon" },
    });

    const progress = await db.progress.upsert({
      where: { userId_topicId: { userId, topicId } },
      update: {
        score: score ?? 0,
        total: total ?? 0,
        completed: completed ?? false,
        attempts: { increment: 1 },
        lastScore: score ?? 0,
      },
      create: {
        userId,
        topicId,
        score: score ?? 0,
        total: total ?? 0,
        completed: completed ?? false,
        attempts: 1,
        lastScore: score ?? 0,
      },
    });

    return NextResponse.json({ progress });
  } catch (e) {
    console.error("[progress POST]", e);
    return NextResponse.json({ ok: true, fallback: true, message: "DB error, guardado en localStorage" }, { status: 501 });
  }
}
