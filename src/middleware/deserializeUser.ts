// get the accesstoken from the header
// decode the token
// attach the user to the token
import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt.utils";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = (req.headers.authorization || "").replace(
    /^Bearer\s/,
    ""
  );
  if (!accessToken) {
    return next();
  }
  const decoded = verifyJwt(accessToken, "accessTokenPublicKey");
  console.log(decoded);
  if (decoded) {
    res.locals.user = decoded;
  }
  return next();
};

export default deserializeUser;
