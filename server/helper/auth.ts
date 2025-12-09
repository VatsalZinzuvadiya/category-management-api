import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';
import logger from '../utils/logger';
import config from '../../config';

const registerNewUser = async (data: Partial<IUser>) => {
  try {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      logger.warn('User with this email already exists');
      const error: any = new Error('User with this email already exists');
      error.code = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password!, salt);

    const newUser = new User(data);
    await newUser.save();
    logger.info('Successfully created new user');
    return newUser;
  } catch (error) {
    logger.error('Error creating new user:', error);
    throw error;
  }
};

const loginUser = async (email: string, password: string) => {
  try {
    logger.info(`Attempting to find user with email: ${email}`);
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn('User not found');
      throw new Error('Invalid credentials');
    }

    logger.info('Comparing passwords');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn('Password mismatch');
      throw new Error('Invalid credentials');
    }

    logger.info('Password match. Generating JWT.');
    const payload = { id: user.id, username: user.username };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });

    return { user, token };
  } catch (error) {
    logger.error('Error during login:', error);
    throw error;
  }
};

export default {
  registerNewUser,
  loginUser,
};
