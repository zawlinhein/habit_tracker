import type { NextFunction, Request, Response } from 'express';
import { isDev } from '../../env.ts';
import { ZodError } from 'zod';

export class APIError extends Error {
  statusCode: number;
  constructor(name: string, message: string, statusCode: number) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}

export const errorHandler = async (
  err,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(err.stack);
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error!';
    let errDetail;

    if (err instanceof ZodError) {
      statusCode = 400;
      message = 'Zod validation Error';
      errDetail = err.issues.map(
        (err) => `${err.path.join('.')} : ${err.message}`
      );
    }
    if (err.name === 'ValidationError') {
      statusCode = 400;
      message = 'Validation Error';
    }

    if (err.name === 'UnauthorizedError') {
      statusCode = 401;
      message = 'Unauthorized Error!';
    }

    return res.status(statusCode).json({
      error: message,
      ...(isDev() && { detail: errDetail, stack: err.stack }),
    });
  } catch (e) {
    console.error(e);
  }
};
