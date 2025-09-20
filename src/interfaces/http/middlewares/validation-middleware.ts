import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

// Middleware de validação simplificado com Zod
export const validate = (schema: z.ZodType<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // Valida o corpo da requisição com o schema fornecido
            schema.parse(req.body);
            next();
        } catch (error) {
            // Se houver erro de validação, retorna 400 com formato simplificado
            if (error instanceof ZodError) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Dados de entrada inválidos',
                    //   errors: error.issues
                    errors: error.issues.map((err) => ({
                        path: err.path,
                        message: err.message
                    }))
                });
            }

            // Para outros tipos de erro, passa para o próximo middleware
            return next(error);
        }
    };
};