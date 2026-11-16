import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { DOC_ACCEPTED, DOC_MAX_BYTES, DOC_MAX_PER_USER, docExtOf, docMimeOf, type DocExt } from "@/lib/docs";
import { extractDocText } from "@/lib/docs-server";

const MAX_ID_LEN = 120;

// GET /api/documents?userId=xxx — lista los documentos del usuario (sin el archivo)
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId requerido" }, { status: 400 });
  if (userId.length > MAX_ID_LEN) return NextResponse.json({ error: "userId fuera de rango" }, { status: 400 });

  try {
    const db = getDb();
    const documents = await db.document.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, mime: true, size: true, createdAt: true, updatedAt: true },
    });
    return NextResponse.json({ documents });
  } catch (e) {
    console.error("[documents GET]", e);
    return NextResponse.json({ error: "No se pudo leer la biblioteca de documentos." }, { status: 500 });
  }
}

// POST /api/documents — multipart/form-data { userId, file } → guarda + extrae texto
export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  const userId = form?.get("userId");
  const file = form?.get("file");

  if (form === null || typeof userId !== "string" || !userId || userId.length > MAX_ID_LEN) {
    return NextResponse.json({ error: "userId requerido" }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Adjunta un archivo." }, { status: 400 });
  }
  if (file.size === 0 || file.size > DOC_MAX_BYTES) {
    return NextResponse.json({ error: `El archivo debe pesar entre 1 byte y 4 MB.` }, { status: 400 });
  }
  const ext = docExtOf(file.name);
  if (!ext) {
    return NextResponse.json(
      { error: `Tipo no soportado. Acepta: ${DOC_ACCEPTED.map((d) => d.label).join(", ")}.` },
      { status: 400 }
    );
  }

  try {
    const db = getDb();
    const count = await db.document.count({ where: { userId } });
    if (count >= DOC_MAX_PER_USER) {
      return NextResponse.json({ error: `Alcanzaste el máximo de ${DOC_MAX_PER_USER} documentos. Elimina alguno para subir otro.` }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let text: string;
    try {
      text = await extractDocText(ext as DocExt, buffer);
    } catch (extractError) {
      console.error("[documents POST extract]", extractError);
      return NextResponse.json({ error: "No se pudo leer el documento (¿archivo corrupto?)." }, { status: 400 });
    }
    if (!text.trim()) {
      return NextResponse.json({ error: "El documento no contiene texto extraíble (¿es solo imágenes?)." }, { status: 400 });
    }

    const document = await db.document.create({
      data: { userId, name: file.name.slice(0, 200), mime: docMimeOf(ext as DocExt), size: file.size, text, data: buffer },
      select: { id: true, name: true, mime: true, size: true, createdAt: true },
    });
    return NextResponse.json({ document }, { status: 201 });
  } catch (e) {
    console.error("[documents POST]", e);
    return NextResponse.json({ error: "No se pudo guardar el documento." }, { status: 500 });
  }
}
