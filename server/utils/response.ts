import { Response } from 'express';

/**
 * Sends a standardized success response.
 * @param res - The Express response object.
 * @param message - A descriptive success message.
 * @param data - The payload to be sent.
 * @param statusCode - The HTTP status code.
 */
export const sendSuccess = (res: Response, message: string, data: any, statusCode: number = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Sends a standardized error response.
 * @param res - The Express response object.
 * @param message - A descriptive error message.
 * @param statusCode - The HTTP status code.
 */
export const sendError = (res: Response, message: string, statusCode: number = 500) => {
  res.status(statusCode).json({
    success: false,
    message,
  });
};
