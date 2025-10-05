import { User, UserRole } from '@/domain/entities/User';
import { UserRepository } from '@/domain/repositories/users/user-repository';
import { randomUUID } from 'crypto';
import { BcryptHasher } from '../security/bcrypt-hasher';

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  constructor() {
    (async () => {
      try {
        const hasher = new BcryptHasher();
        const now = new Date();
        const seeds = [
          {
            name: 'Seed Admin',
            username: 'admin2025',
            email: 'admin@example.com',
            role: UserRole.ADMIN,
          },
          {
            name: 'Seed Secretary',
            username: 'secretary2025',
            email: 'secretary@example.com',
            role: UserRole.SECRETARY,
          },
          {
            name: 'Seed Teacher',
            username: 'teacher2025',
            email: 'teacher@example.com',
            role: UserRole.TEACHER,
          },
          {
            name: 'Seed Student',
            username: 'student2025',
            email: 'student@example.com',
            role: UserRole.STUDENT,
          },
        ];

        for (const seed of seeds) {
          const exists = this.users.find(
            u => u.email === seed.email || u.username === seed.username,
          );
          if (!exists) {
            const hashed = await hasher.hash('12345678');
            this.users.push({
              id: randomUUID(),
              name: seed.name,
              username: seed.username,
              email: seed.email,
              password: hashed,
              role: seed.role,
              registeredAt: now,
            });
          }
        }
      } catch (err) {
        // não propagar erro na inicialização
        console.warn(err);
      }
    })();
  }

  async findAll(filter?: { roles?: UserRole[] }): Promise<User[]> {
    let result = [...this.users];
    if (filter?.roles) {
      result = result.filter(user => filter.roles!.includes(user.role));
    }
    return result;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) ?? null;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.users.find(user => user.username === username) ?? null;
  }

  async create(user: User): Promise<User> {
    const now = new Date();
    const newUser: User = {
      ...user,
      id: randomUUID(),
      registeredAt: now,
    };

    this.users.push(newUser);
    return newUser;
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const now = new Date();
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) {
      return null;
    }

    const current = this.users[index]!;
    const updated: User = {
      ...current,
      ...data,
      id: current.id,
      registeredAt: current.registeredAt,
      updatedAt: now,
    };

    this.users[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<void> {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) {
      return;
    }

    this.users.splice(index, 1);
  }
}
