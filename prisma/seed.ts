import { PrismaClient } from '../src/generated/prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS ?? 10);

type SeedPostInput = {
  title: string;
  content: string;
  authorId: string;
  tags: string[];
  videoUrl?: string | null;
  imageUrl?: string | null;
};

async function ensurePost(data: SeedPostInput) {
  const existing = await prisma.post.findFirst({
    where: { title: data.title, authorId: data.authorId },
  });

  if (!existing) {
    await prisma.post.create({ data });
  }
}

async function main() {
  console.warn('Running seed...');

  // Usuários seeds (idempotente via upsert por email)
  const passwordPlain = '12345678';
  const hashedPassword = await bcrypt.hash(passwordPlain, SALT_ROUNDS);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@pontodeaula.com' },
    update: {
      name: 'Seed Admin',
      username: 'admin2025',
      role: 'ADMIN',
      password: hashedPassword,
    },
    create: {
      name: 'Seed Admin',
      username: 'admin2025',
      email: 'admin@pontodeaula.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@pontodeaula.com' },
    update: {
      name: 'Seed Teacher',
      username: 'teacher2025',
      role: 'TEACHER',
      password: hashedPassword,
    },
    create: {
      name: 'Seed Teacher',
      username: 'teacher2025',
      email: 'teacher@pontodeaula.com',
      password: hashedPassword,
      role: 'TEACHER',
    },
  });

  const _student = await prisma.user.upsert({
    where: { email: 'student@pontodeaula.com' },
    update: {
      name: 'Seed Student',
      username: 'student2025',
      role: 'STUDENT',
      password: hashedPassword,
    },
    create: {
      name: 'Seed Student',
      username: 'student2025',
      email: 'student@pontodeaula.com',
      password: hashedPassword,
      role: 'STUDENT',
    },
  });

  // Criar alguns posts
  await ensurePost({
    title: 'Bem vindo(a)! ao Ponto de Aula.',
    content: 'Bem vindos a plataforma Ponto de Aula. seu ponto de encontro de conhecimento',
    authorId: admin.id,
    tags: ['welcome', 'admin'],
  });

  // Outro post
  await ensurePost({
    title: 'Como usar a API em desenvolvimento',
    content: 'Exemplos de uso...',
    authorId: teacher.id,
    tags: ['tutorial'],
  });

  console.warn('Seed finished.');
}

main()
  .catch(e => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
