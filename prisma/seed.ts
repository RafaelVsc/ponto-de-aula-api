import { PrismaClient } from '../src/generated/prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS ?? 10);

async function main() {
  console.log('Running seed...');

  // Usuários seeds (idempotente via upsert por email)
  const passwordPlain = '12345678';
  const hashedPassword = await bcrypt.hash(passwordPlain, SALT_ROUNDS);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      name: 'Seed Admin',
      username: 'admin2025',
      role: 'ADMIN',
      password: hashedPassword,
    },
    create: {
      name: 'Seed Admin',
      username: 'admin2025',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@example.com' },
    update: {
      name: 'Seed Teacher',
      username: 'teacher2025',
      role: 'TEACHER',
      password: hashedPassword,
    },
    create: {
      name: 'Seed Teacher',
      username: 'teacher2025',
      email: 'teacher@example.com',
      password: hashedPassword,
      role: 'TEACHER',
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {
      name: 'Seed Student',
      username: 'student2025',
      role: 'STUDENT',
      password: hashedPassword,
    },
    create: {
      name: 'Seed Student',
      username: 'student2025',
      email: 'student@example.com',
      password: hashedPassword,
      role: 'STUDENT',
    },
  });

  // Criar alguns posts (upsert por título + authorId para evitar duplicação)
  await prisma.post.upsert({
    where: {
      // você pode ter um constraint único para (title, authorId) no DB, se não, usar findFirst+create
      id: 'seed-post-1', // opcional: usar id fixo facilita idempotência; requer schema permitir id custom
    },
    update: {},
    create: {
      // Se seu schema gera uuid automático e não permite id fixo, altere para create sem id + uma checagem findFirst
      id: 'seed-post-1',
      title: 'Welcome to Ponto de Aula',
      content: 'Este é um post seed criado para desenvolvimento.',
      authorId: teacher.id,
      tags: ['welcome', 'seed'],
    },
  });

  // Outro post
  await prisma.post.upsert({
    where: { id: 'seed-post-2' },
    update: {},
    create: {
      id: 'seed-post-2',
      title: 'Como usar a API em desenvolvimento',
      content: 'Exemplos de uso...',
      authorId: teacher.id,
      tags: ['tutorial'],
    },
  });

  console.log('Seed finished.');
}

main()
  .catch(e => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });