import express, { Router } from 'express';
import { registerNewUser, login } from '../controller/auth';
import Joi from 'joi';
import { createValidator } from 'express-joi-validation';

const validator = createValidator({});

const router: Router = express.Router();

const registerNewUserBody = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginBody = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

router.post('/register', validator.body(registerNewUserBody), registerNewUser);
router.post('/login', validator.body(loginBody), login);

export default router;
