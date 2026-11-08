import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/progress?userId=xxx — lista progreso por usuario
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId requerido" }, { status: 400 });

  // Si no hay DB configurada, fallback a 501 para que el cliente use localStorage
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("file:")) {
    return NextResponse.json({ error: "DB no configurada, usa localStorage", fallback: true }, { status: 501 });
  }

  try {
    const progress = await db.progress.findMany({ where: { userId } });
    return NextResponse.json({ progress });
  } catch (e) {
    console.error("[progress GET]", e);
    return NextResponse.json({ error: "DB error", fallback: true }, { status: 500 });
  }
}

// POST /api/progress — upsert { userId, topicId, score, total, completed }
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { userId, topicId, score, total, completed } = body ?? {};

  if (!userId || !topicId) return NextResponse.json({ error: "userId y topicId requeridos" }, { status: 400 });

  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("file:")) {
    return NextResponse.json({ ok: true, fallback: true, message: "DB no configurada, guardado en localStorage" });
  }

  try {
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
    return NextResponse.json({ error: "DB error", fallback: true }, { status: 500 });
  }
}
