import type { Request, Response, NextFunction } from 'express';

export type IRequestHandler = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;
