import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

const MAX_ID_LEN = 120;

// GET /api/documents/[id]?userId=xxx — sirve el archivo original (PDF se ve inline, resto descarga)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId || userId.length > MAX_ID_LEN || !id) {
    return NextResponse.json({ error: "userId e id requeridos" }, { status: 400 });
  }

  try {
    const db = getDb();
    const doc = await db.document.findFirst({ where: { id, userId } });
    if (!doc) return NextResponse.json({ error: "Documento no encontrado." }, { status: 404 });

    return new NextResponse(new Uint8Array(doc.data), {
      headers: {
        "Content-Type": doc.mime,
        "Content-Length": String(doc.size),
        "Content-Disposition": `inline; filename="doc"; filename*=UTF-8''${encodeURIComponent(doc.name)}`,
        "Cache-Control": "private, max-age=60",
      },
    });
  } catch (e) {
    console.error("[documents/[id] GET]", e);
    return NextResponse.json({ error: "No se pudo abrir el documento." }, { status: 500 });
  }
}

// DELETE /api/documents/[id]?userId=xxx — elimina el documento del usuario
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId || userId.length > MAX_ID_LEN || !id) {
    return NextResponse.json({ error: "userId e id requeridos" }, { status: 400 });
  }

  try {
    const db = getDb();
    const existing = await db.document.findFirst({ where: { id, userId }, select: { id: true } });
    if (!existing) return NextResponse.json({ error: "Documento no encontrado." }, { status: 404 });
    await db.document.delete({ where: { id: existing.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[documents/[id] DELETE]", e);
    return NextResponse.json({ error: "No se pudo eliminar el documento." }, { status: 500 });
  }
}
