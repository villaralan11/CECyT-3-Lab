import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Límites de validación: evita datos absurdos o abusos sin romper al frontend
const MAX_ID_LEN = 120;
const MAX_VALUE = 100_000;

// GET /api/progress?userId=xxx — lista progreso por usuario
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId requerido" }, { status: 400 });
  if (userId.length > MAX_ID_LEN) return NextResponse.json({ error: "userId fuera de rango" }, { status: 400 });

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

  // campos obligatorios
  if (!userId || !topicId) return NextResponse.json({ error: "userId y topicId requeridos" }, { status: 400 });
  // tipos y límites
  if (typeof userId !== "string" || userId.length > MAX_ID_LEN) {
    return NextResponse.json({ error: "userId inválido" }, { status: 400 });
  }
  if (typeof topicId !== "string" || topicId.length === 0 || topicId.length > MAX_ID_LEN) {
    return NextResponse.json({ error: "topicId inválido" }, { status: 400 });
  }
  if (!Number.isInteger(score) || score < 0 || score > MAX_VALUE) {
    return NextResponse.json({ error: "score debe ser un entero entre 0 y 100000" }, { status: 400 });
  }
  if (!Number.isInteger(total) || total < 0 || total > MAX_VALUE) {
    return NextResponse.json({ error: "total debe ser un entero entre 0 y 100000" }, { status: 400 });
  }
  if (score > total) return NextResponse.json({ error: "score no puede ser mayor que total" }, { status: 400 });
  if (completed !== undefined && typeof completed !== "boolean") {
    return NextResponse.json({ error: "completed debe ser booleano" }, { status: 400 });
  }

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
        score,
        total,
        completed: completed ?? false,
        attempts: { increment: 1 },
        lastScore: score,
      },
      create: {
        userId,
        topicId,
        score,
        total,
        completed: completed ?? false,
        attempts: 1,
        lastScore: score,
      },
    });

    return NextResponse.json({ progress });
  } catch (e) {
    console.error("[progress POST]", e);
    // NO se reporta éxito si el guardado falló: el cliente conserva localStorage
    return NextResponse.json({ error: "DB error, guardado en localStorage", fallback: true }, { status: 501 });
  }
}
