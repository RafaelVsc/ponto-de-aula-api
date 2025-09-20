import { User } from '@/domain/entities/User';
import { UserRepository } from '@/domain/repositories/users/user-repository';

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];
  private nextId = 1;

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
      id: String(this.nextId++),
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
