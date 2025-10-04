import { User, UserRole } from '@/domain/entities/User';
import { UserRepository } from '@/domain/repositories/users/user-repository';
import { randomUUID } from 'crypto';
import { BcryptHasher } from '../security/bcrypt-hasher';

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

    constructor() {
    // seed dev: usuário admin para facilitar testes locais
    (async () => {
      try {
        const hasher = new BcryptHasher();
        const hashed = await hasher.hash('12345678'); // senha de seed
        const now = new Date();

        const exists = this.users.find(
          u => u.email === 'admin@example.com' || u.username === 'admin'
        );
        if (!exists) {
          this.users.push({
            id: randomUUID(),
            name: 'Seed Admin',
            username: 'admin2025',
            email: 'admin@example.com',
            password: hashed,
            role: UserRole.ADMIN,
            registeredAt: now, // mantém o mesmo campo usado pelo repositório
          });
        }
      } catch (err) {
        // não propagar erro na inicialização
        // console.warn('Seed user creation failed', err);
      }
    })();
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
