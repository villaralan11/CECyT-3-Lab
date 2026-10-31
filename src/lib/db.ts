import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/** Cliente Prisma perezoso: no se instancia al importar el módulo, así que si
 *  falta `prisma generate` o la BD, la API responde 501 y el cliente usa
 *  localStorage en vez de romper con un 500. */
export function getDb(): PrismaClient {
  if (!globalForPrisma.prisma) globalForPrisma.prisma = new PrismaClient();
  return globalForPrisma.prisma;
}
