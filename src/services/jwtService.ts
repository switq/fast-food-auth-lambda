import jwt from 'jsonwebtoken';

export class JwtService {
  private secret: string;
  private options: jwt.SignOptions;

  constructor(secret: string, options?: jwt.SignOptions) {
    this.secret = secret;
    this.options = options || { expiresIn: '1h' };
  }

  sign(payload: object): string {
    return jwt.sign(payload, this.secret, this.options);
  }

  verify<T = any>(token: string): T {
    return jwt.verify(token, this.secret) as T;
  }
}
