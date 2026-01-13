import { Router } from 'express';
import type { Request, Response } from 'express';
import z from 'zod';
import { validatePayload } from '../middlewares/validate.ts';
import { register, signIn } from '../controllers/authController.ts';
import { insertUserSchema } from '../db/schema.ts';

const router = Router();

const testSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

type testSchema = z.infer<typeof testSchema>;

router.post(
  '/register',
  validatePayload({ bodySchema: insertUserSchema }),
  register
);

router.post('/signIn', validatePayload({ bodySchema: testSchema }), signIn);

export default router;
