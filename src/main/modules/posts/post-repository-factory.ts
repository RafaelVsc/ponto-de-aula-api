import { InMemoryPostRepository } from "@/infrastructure/database/in-memory-post-repository";
import { PrismaPostRepository } from "@/infrastructure/repositories/prisma-post-repository";
import { PrismaClient } from "@/generated/prisma/client";

export function makePostRepository(prisma: PrismaClient) {
  if (process.env.NODE_ENV === 'test') {
    return new InMemoryPostRepository();
  }
  return new PrismaPostRepository(prisma);
}
