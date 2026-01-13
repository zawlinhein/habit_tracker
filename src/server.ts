import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import authRoute from './routes/authRoute.ts';
import z from 'zod';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { isTest } from '../env.ts';
import habitRoute from './routes/habitRoute.ts';

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev', { skip: () => isTest() }));

app.use('/api/auth', authRoute);
app.use('/api/habit', habitRoute);
const testSchema = z.object({
  name: z.object(),
  hasLee: z.boolean(),
});

const testMiddleware = (
  req: Request<{}, {}, {}, { test: string }>,
  res: Response,
  next: NextFunction
) => {
  const q = req.query.test === 'true';
  if (q) {
    res.status(201).json({ message: 'testing one two...' });
    return;
  }
  next();
};

app.get('/health', testMiddleware, (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toDateString(),
    service: 'Habit Tracker API',
  });
});

export default app;
