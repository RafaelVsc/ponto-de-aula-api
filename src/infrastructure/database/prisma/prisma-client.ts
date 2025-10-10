import { PrismaClient } from '@/generated/prisma/client';

let prisma: PrismaClient | undefined;

export const getPrismaClient = (): PrismaClient => {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
};
