import { PrismaClient } from "@prisma/client";
export const prismaClient = () => {
    return new PrismaClient();
}

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};
export const prisma = globalForPrisma.prisma ?? prismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;