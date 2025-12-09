import express, { Router, Request } from 'express';
import { rateLimit } from 'express-rate-limit';
import healthRoute from './health';
import authRoute from './auth';
import categoryRoute from './category';
import authMiddleware from '../middleware/auth';

// const recommendationRoute = require('./recommendation');

// const {
//   checkEligibility,
// } = require('../controller/middleware.js');

const healthRouter: Router = express.Router();
const nonAuthRouter: Router = express.Router();
const authRouter: Router = express.Router();

const routerV0: Router = express.Router();

// Rate-limit
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5 * 60,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => (req as any).userId,
});


nonAuthRouter.use('/auth', authRoute);
healthRouter.use('/health', healthRoute);
authRouter.use('/category', categoryRoute);

routerV0.use('/v0/api', nonAuthRouter);
routerV0.use('/v0/api', healthRouter);
routerV0.use('/v0/api', authMiddleware, authRouter);

export default routerV0;
