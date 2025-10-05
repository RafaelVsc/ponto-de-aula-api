export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  SECRETARY = 'SECRETARY',
  ADMIN = 'ADMIN',
}

export interface User {
  id?: string;
  name: string;
  email: string;
  username?: string;
  password: string;
  role: UserRole;
  registeredAt?: Date;
  updatedAt?: Date;
}
