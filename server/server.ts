import httpContext from 'express-http-context';
import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';
import mongoose from 'mongoose';
import config from '../config';
import router from './routes';
import logger from './utils/logger';

const app: Express = express();

app.use(httpContext.middleware);

app.use((req: Request, res: Response, next: NextFunction) => {
  httpContext.set('requestID', uuidv4());
  next();
});

// need to whitelist properly (not "*")
app.use(cors({ origin: '*' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '1mb' }));

app.use(router);

// Connect to MongoDB
mongoose.connect(config.mongoDb.uri!)
  .then(() => {
    logger.info('🚀 Connected to MongoDB');
  })
  .catch((err) => {
    logger.error('🔥 MongoDB connection error:', err);
  });

const PORT = process.env.PORT || config.server.port;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on Port ${PORT}`);
});