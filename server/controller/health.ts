import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response';

const health = (req: Request, res: Response) => {
  sendSuccess(res, 'API is healthy and running', { status: 'OK' });
};

export {
  health,
};
