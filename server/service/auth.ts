import authHelper from '../helper/auth';
import logger from '../utils/logger';
import { IUser } from '../models/user';

const loginUser = async (email: string, password: string) => {
  try {
    logger.info('Auth service: Logging in user');
    const result = await authHelper.loginUser(email, password);
    return result;
  } catch (error) {
    logger.error('Error in auth service while logging in:', error);
    throw error;
  }
};

const registerNewUser = async (data: Partial<IUser>) => {
  try {
    logger.info('Auth service: Registering new user');
    const newUser = await authHelper.registerNewUser(data);
    return newUser;
  } catch (error) {
    logger.error('Error in auth service while registering new user:', error);
    throw error;
  }
};
export default {
  registerNewUser,
  loginUser,
};
