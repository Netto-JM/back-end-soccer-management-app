import { sign, verify, decode, SignOptions } from 'jsonwebtoken';
import { TokenPayload } from '../Interfaces/tokenPayload';

const secretKey: string = process.env.JWT_SECRET || 'secret';

const configJWT: SignOptions = {
  expiresIn: '1d',
  algorithm: 'HS256',
};

const generateToken = (payload: object) => sign(payload, secretKey, configJWT);

const validateToken = (token: string) => verify(token, secretKey) as TokenPayload;

const decodeToken = (token: string) => decode(token);

export default { generateToken, validateToken, decodeToken };
