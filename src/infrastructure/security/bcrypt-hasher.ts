import bcrypt from 'bcrypt';
import { PasswordHasher } from '@/application/services/password-hasher';

export class BcryptHasher implements PasswordHasher {
  constructor(private readonly saltRounds = 10) {}

  hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.saltRounds);
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
