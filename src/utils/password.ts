import bcrypt from 'bcrypt';
import env from '../../env.ts';

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, env.BCRYPT_ROUNDS);
};

export const comparePassword = async (input: string, password: string) => {
  return bcrypt.compare(input, password);
};
