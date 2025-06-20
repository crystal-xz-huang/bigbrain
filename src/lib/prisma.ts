// Create a singleton instance of PrismaClient to avoid exhausting database connections in development.
// Now, whenever you need access to your database you can import the prisma instance into the file where it's needed.
// See: https://vercel.com/guides/nextjs-prisma-postgres#step-3:-setup-prisma-and-create-the-database-schema

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

