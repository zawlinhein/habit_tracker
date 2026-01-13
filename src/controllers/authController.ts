import db from '../db/connection.ts';
import type { Request, Response } from 'express';
import type { NewUser } from '../db/schema.ts';
import { generateJWT } from '../utils/jwt.ts';
import { hashPassword, comparePassword } from '../utils/password.ts';
import { users } from '../db/schema.ts';
import { eq } from 'drizzle-orm';

export const register = async (
  req: Request<{}, {}, NewUser>,
  res: Response
) => {
  try {
    const hashedPassword = await hashPassword(req.body.password);
    const [newUser] = await db
      .insert(users)
      .values({ ...req.body, password: hashedPassword })
      .returning({
        id: users.id,
        username: users.username,
        email: users.email,
      });
    const accessToken = await generateJWT(newUser);
    return res.status(201).json({
      message: 'New user Created',
      username: newUser.username,
      token: accessToken,
    });
  } catch (e) {
    console.error('Registration Error', e);
    return res.status(500).json("Can't create new user");
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) return res.status(401).json('Invalid Credentials');

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json('Invalid Credentials');
    }

    const accessToken = await generateJWT({
      id: user.id,
      username: user.username,
      email: user.email,
    });
    return res
      .status(200)
      .json({ message: 'Successfully login in!', token: accessToken });
  } catch (e) {
    console.error('Sign in error', e);
    return res.status(500).json('Sign in failed.');
  }
};
