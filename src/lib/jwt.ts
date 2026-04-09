import jwt, { JwtPayload } from "jsonwebtoken";

interface SignOption {
  expiresIn?: string | number;
}

const DEFAULT_SIGN_OPTION: SignOption = {
  expiresIn: "12h",
};

export const signJwtAccessToken = (payload: JwtPayload) => {
  const secretKey = process.env.SECRET_KEY;

  const token = jwt.sign(payload, secretKey as string, {
    expiresIn: "12h",
  });

  return token;
};

export const verifyJwt = (token: string) => {
  try {
    const secretKey = process.env.SECRET_KEY;
    const decoded = jwt.verify(token, secretKey as string);

    return decoded as JwtPayload;
  } catch (error) {
    console.log(error);
  }
};
