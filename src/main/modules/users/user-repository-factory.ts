import { InMemoryUserRepository } from "@/infrastructure/database/in-memory-user-repository";
import { PrismaUserRepository } from "@/infrastructure/repositories/prisma-user-repository";
import { PrismaClient } from "@/generated/prisma/client";

export function makeUserRepository(prisma: PrismaClient) {
  if (process.env.NODE_ENV === 'test') {
    return new InMemoryUserRepository();
  }
  return new PrismaUserRepository(prisma);
}
