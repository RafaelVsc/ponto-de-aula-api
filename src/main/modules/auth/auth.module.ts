import { LoginUseCase } from "@/application/usecases/auth/login-use-case";
import { InMemoryUserRepository } from "@/infrastructure/database/in-memory-user-repository";
import { BcryptHasher } from "@/infrastructure/security/bcrypt-hasher";
import { JwtService } from "@/infrastructure/security/jwt-service";
import { LoginController } from "@/interfaces/http/controllers/auth/login-controller";
import authRoutes from "@/interfaces/routes/auth-routes";
import { Router } from "express";

export function buildAuthModule(userRepository: InMemoryUserRepository): Router {
  // Criar instâncias das dependências
  const passwordHasher = new BcryptHasher();
  const jwtService = new JwtService(process.env.JWT_SECRET || 'dev-secret');
  
  // Criar caso de uso
  const loginUseCase = new LoginUseCase(userRepository, passwordHasher, jwtService);
  
  // Criar controller
  const loginController = new LoginController(loginUseCase);
  
  // Configurar rotas
  const router = Router();
  authRoutes(router, loginController);
  
  return router;
}