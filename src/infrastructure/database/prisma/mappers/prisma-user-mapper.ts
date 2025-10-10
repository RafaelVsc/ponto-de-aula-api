import { User, UserRole } from '@/domain/entities/User';
import { Prisma, User as PrismaUser, UserRole as PrismaUserRole } from '@/generated/prisma/client';

const mapRole = (role?: UserRole): PrismaUserRole | undefined =>
  role ? (role as PrismaUserRole) : undefined;

export const toDomain = (user: PrismaUser): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  username: user.username,
  password: user.password,
  role: user.role as UserRole,
  registeredAt: user.registeredAt,
  updatedAt: user.updatedAt,
});

export const toPrismaCreate = (user: User): Prisma.UserUncheckedCreateInput => ({
  name: user.name,
  email: user.email,
  username: user.username ?? '',
  password: user.password,
  role: mapRole(user.role)!,
  registeredAt: user.registeredAt,
  updatedAt: user.updatedAt,
});

export const toPrismaUpdate = (
  data: Partial<Pick<User, 'name' | 'email' | 'password' | 'updatedAt'>>,
): Prisma.UserUncheckedUpdateInput => {
  const update: Prisma.UserUncheckedUpdateInput = {};
  if (data.name !== undefined) update.name = data.name;
  if (data.email !== undefined) update.email = data.email;
  if (data.password !== undefined) update.password = data.password;
  if (data.updatedAt !== undefined) update.updatedAt = data.updatedAt;
  return update;
};
