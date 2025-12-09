import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import authService from '../service/auth';
import logger from '../utils/logger';
import { sendSuccess, sendError } from '../utils/response';

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    logger.info('Received request to login user', { email });
    const { user, token } = await authService.loginUser(email, password);
    logger.info('Successfully logged in user');
    sendSuccess(res, 'User logged in successfully', { user, token });
  } catch (error: any) {
    logger.error('Error in auth controller while logging in:', { error });
    sendError(res, 'Invalid credentials', StatusCodes.UNAUTHORIZED);
  }
};

const registerNewUser = async (req: Request, res: Response) => {
  const { body } = req;
  try {
    logger.info('Received request to register new user', { body });
    const { user, token } = await authService.registerNewUser(body);
    logger.info('Successfully registered new user');
    sendSuccess(res, 'User registered successfully', { user, token }, StatusCodes.CREATED);
  } catch (error: any) {
    logger.error('Error in auth controller while registering new user:', { error });
    if (error.code === 409) { // Duplicate email
      return sendError(res, error.message, StatusCodes.CONFLICT);
    }
    if (error.code === 11000 && error.keyPattern?.username) {
      return sendError(res, 'A user with that username already exists.', StatusCodes.CONFLICT);
    }
    sendError(res, 'Something went wrong');
  }
};

export {
  registerNewUser,
  login
};
