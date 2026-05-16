import { sign, Secret, SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export function signJwt(payload: object, expiresIn?: string | number): string {
  const secret: Secret = env.JWT_SECRET as string;
  const options: SignOptions = { expiresIn: (expiresIn ?? env.JWT_EXPIRES_IN) as SignOptions["expiresIn"] };
  return sign(payload as string | Buffer | object, secret, options);
}
