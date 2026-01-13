import {
  users,
  habits,
  type User,
  type Habit,
  entries,
  habitTags,
  tags,
} from '../../src/db/schema.ts';
import { v4 as uuidv4 } from 'uuid';
import { hashPassword } from '../../src/utils/password.ts';
import { generateJWT } from '../../src/utils/jwt.ts';
import { db } from '../../src/db/connection.ts';

export const createTestUser = async (userData?: Partial<User>) => {
  const uuid = uuidv4();
  const defaultUser = {
    email: `test-${uuid}@gmail.com`,
    username: uuid,
    password: 'password',
    firstName: 'test',
    lastName: 'User',
    ...userData,
  };

  const hashedPassword = await hashPassword(defaultUser.password);
  const [user] = await db
    .insert(users)
    .values({ ...defaultUser, password: hashedPassword })
    .returning();

  const token = await generateJWT({
    id: user.id,
    email: user.email,
    username: user.username,
  });

  return { token, user, plainPassword: defaultUser.password };
};

export const createTestHabit = async (
  userId: string,
  habitData?: Partial<Habit>
) => {
  const uuid = uuidv4();
  const defaultHabit = {
    userId,
    name: `Test habit-${uuid}`,
    frequency: 'daily',
    description: 'Test habit !!!',
    targetCount: 1,
    ...habitData,
  };

  const [habit] = await db
    .insert(habits)
    .values({ ...defaultHabit })
    .returning();

  return habit;
};

export const cleanupDB = async () => {
  await db.delete(entries); // Delete entries first (foreign keys)
  await db.delete(habitTags); // Delete junction table
  await db.delete(habits); // Delete habits
  await db.delete(tags); // Delete tags
  await db.delete(users); // Delete users last
};
