import z from 'zod';
import type { Request, Response, NextFunction } from 'express';
import { APIError } from './errorHandler.ts';

type Schemas = {
  paramsSchema?: z.ZodSchema;
  bodySchema?: z.ZodSchema;
  querySchema?: z.ZodSchema;
};

export const validatePayload =
  (schemas: Schemas) => (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.paramsSchema) {
        const validatedParams = schemas.paramsSchema.parse(req.params);
        req.params = validatedParams as Request['params'];
      }
      if (schemas.bodySchema) {
        const validatedBody = schemas.bodySchema.parse(req.body);
        req.body = validatedBody;
      }
      if (schemas.querySchema) {
        const validatedQuery = schemas.bodySchema.parse(req.query);
        req.query = validatedQuery as Request['query'];
      }
      next();
    } catch (e) {
      next(e);
    }
  };
