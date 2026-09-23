import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const TOPIC_IDS = [
  "01_mru",
  "02_mruv",
  "03_tiros",
  "04_iupac",
  "05_balanceo",
  "06_estequiometria",
  "07_verb",
  "08_passive",
  "09_modal",
  "10_reported",
  "11_retos",
] as const;

const UserIdSchema = z
  .string()
  .min(3)
  .max(64)
  .regex(/^[a-zA-Z0-9_-]+$/);

const MAX_BODY_BYTES = 4096;

const ProgressSchema = z.object({
  userId: UserIdSchema,
  topicId: z.enum(TOPIC_IDS),
  score: z.number().int().min(0).max(100),
  total: z.number().int().min(1).max(100),
});

function dbFallback() {
  return (
    !process.env.DATABASE_URL ||
    process.env.DATABASE_URL.startsWith("file:")
  );
}

// GET /api/progress?userId=xxx — lista progreso por usuario
export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("userId");
  const userId = UserIdSchema.safeParse(raw);
  if (!userId.success) {
    return NextResponse.json({ error: "userId inválido" }, { status: 400 });
  }

  if (dbFallback()) {
    return NextResponse.json({ error: "DB no configurada, usa localStorage", fallback: true }, { status: 501 });
  }

  try {
    const progress = await db.progress.findMany({ where: { userId: userId.data } });
    return NextResponse.json({ progress });
  } catch (e) {
    console.error("[progress GET]", e);
    return NextResponse.json({ error: "DB error", fallback: true }, { status: 500 });
  }
}

// POST /api/progress — upsert { userId, topicId, score, total }
// completed se calcula en el servidor y no es aceptado como tercero
export async function POST(req: NextRequest) {
  const raw = await req.text().catch(() => "");
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "payload demasiado grande" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw || "null");
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = ProgressSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validación fallida", issues: parsed.error.issues }, { status: 400 });
  }

  if (dbFallback()) {
    return NextResponse.json({ ok: true, fallback: true, message: "DB no configurada, guardado en localStorage" });
  }

  const { userId, topicId, total } = parsed.data;
  const score = Math.min(parsed.data.score, total);
  const completed = score >= total;

  try {
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
        completed,
        attempts: { increment: 1 },
        lastScore: score,
      },
      create: {
        userId,
        topicId,
        score,
        total,
        completed,
        attempts: 1,
        lastScore: score,
      },
    });

    return NextResponse.json({ progress });
  } catch (e) {
    console.error("[progress POST]", e);
    return NextResponse.json({ error: "DB error", fallback: true }, { status: 500 });
  }
}