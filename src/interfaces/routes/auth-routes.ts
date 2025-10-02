import { Router } from "express";
import { LoginController } from "../http/controllers/auth/login-controller";
import { loginSchema } from "../http/validators/auth/login-validator";
import { validateBody } from "../http/middlewares/validation-middleware";



export default (
    router: Router,
    authController: LoginController
): void => {
    router.post('/login', validateBody(loginSchema), (req, res, next) => authController.handle(req, res, next))
}