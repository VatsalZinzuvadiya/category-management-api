import express, { Router } from 'express';
import { health } from '../controller/health';

const router: Router = express.Router();

router.get('/', health);

export default router;
