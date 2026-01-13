import env from '../../env.ts';
import { jwtVerify, SignJWT } from 'jose';
import { createSecretKey } from 'node:crypto';

export interface JwtPayload {
  id: string;
  email: string;
  username: string;
}
export const generateSecretKey = () => {
  return createSecretKey(env.JWT_SECRET, 'utf-8');
};

export const generateJWT = async (payload: JwtPayload) => {
  const secretKey = generateSecretKey();

  return new SignJWT(payload)
    .setIssuedAt()
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(env.JWT_EXPIRES_IN || '1h')
    .sign(secretKey);
};

export const verifyToken = async (token: string): Promise<JwtPayload> => {
  const secretKey = generateSecretKey();
  const { payload } = await jwtVerify(token, secretKey);
  return payload as unknown as JwtPayload;
};
