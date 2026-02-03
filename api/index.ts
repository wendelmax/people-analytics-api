import 'module-alias/register';
import type { Request, Response } from 'express';
import { AppFactory } from '../dist/app.factory';

const app = AppFactory.create().expressApp;

export default function handler(req: Request, res: Response): void {
  const url = req.url ?? '/';
  if (url === '/api' || url === '/api/') {
    res.redirect(302, '/api/docs');
    return;
  }
  if (url.startsWith('/api/')) {
    req.url = url.slice(4) || '/';
  }
  app(req, res);
}
