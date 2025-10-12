import { User, UserRole } from '@/domain/entities/User';
import { UserRepository } from '@/domain/repositories/users/user-repository';
import { PrismaClient, UserRole as PrismaUserRole } from '@/generated/prisma/client';
import {
  toDomain,
  toPrismaCreate,
  toPrismaUpdate,
} from '../database/prisma/mappers/prisma-user-mapper';

export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? toDomain(user) : null;
  }
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? toDomain(user) : null;
  }
  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    return user ? toDomain(user) : null;
  }

  async findAll(filter?: { roles?: UserRole[] }) {
    const roles = filter?.roles?.length
      ? filter.roles.map(role => role as PrismaUserRole) // ou Prisma.$Enums.UserRole
      : undefined;

    const users = await this.prisma.user.findMany({
      where: roles ? { role: { in: roles } } : undefined,
      orderBy: { registeredAt: 'desc' },
    });
    return users.map(toDomain);
  }

  async create(user: User): Promise<User> {
    if (!user.username) {
      throw new Error('username is required by the database schema'); // Prisma exige username
    }
    const created = await this.prisma.user.create({ data: toPrismaCreate(user) });
    return toDomain(created);
  }
  async update(id: string, data: Partial<User>): Promise<User | null> {
    const updateData = toPrismaUpdate({
      name: data.name,
      email: data.email,
      password: data.password,
      updatedAt: data.updatedAt,
    });
    const updated = await this.prisma.user.update({ where: { id }, data: updateData });
    return toDomain(updated);
  }
  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
