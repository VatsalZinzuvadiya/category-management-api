import { format, createLogger, transports, Logger } from 'winston';
import httpContext from 'express-http-context';
import { TransformableInfo } from 'logform';

const { combine, timestamp, printf, errors } = format;

const logFormat = printf((info: TransformableInfo) => {
  const { level, message, stack } = info;
  const logTimestamp = info.timestamp;
  const userId = httpContext.get('userId') || 'N/A';
  const requestID = httpContext.get('requestID') || 'N/A';
  const requestIDPart = `[${requestID}]`;
  const stackTrace = stack ? `\n${stack}` : '';
  return `[${logTimestamp}] ${requestIDPart} [user: ${userId}] [${level}]: ${message}${stackTrace}`;
});

const logger: Logger = createLogger({
  format: combine(
    format.colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat,
  ),
  transports: [new transports.Console()],
});

export default logger;
