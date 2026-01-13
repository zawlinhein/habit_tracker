import { Router } from 'express';
import { authenticateToken, type AuthRequest } from '../middlewares/auth.ts';
import {
  getHabitById,
  getUserHabits,
  postHabit,
  deleteHabit,
  updateHabit,
} from '../controllers/habitController.ts';
import { validatePayload } from '../middlewares/validate.ts';
import { insertHabitSchema } from '../db/schema.ts';
import { z } from 'zod';
import { errorHandler } from '../middlewares/errorHandler.ts';

const router = Router();
router.use(authenticateToken);

router.post('/', validatePayload({ bodySchema: insertHabitSchema }), postHabit);

router.get('/', getUserHabits);

router.get('/:id', getHabitById);

router.patch('/:id', updateHabit);

router.delete(
  '/:id',
  validatePayload({ paramsSchema: z.object({ id: z.string().min(20) }) }),
  deleteHabit
);

router.use(errorHandler);

export default router;
