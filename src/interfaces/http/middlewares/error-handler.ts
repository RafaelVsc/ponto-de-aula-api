import { NextFunction, Request, Response } from 'express';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const status = (err as any)?.status || 500;
  const message = (err instanceof Error) ? err.message : 'Erro interno do servidor';
  res.status(status).json({ error: message });
}

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ error: 'Rota não encontrada' });
}

