import { Request, Response } from "express";
import { CreateSessionInput } from "../schema/auth.schema";
import {
  findSessionById,
  signAccessToken,
  signRefreshToken,
} from "../service/auth.service";
import { findUserByEmail, findUserById } from "../service/user.service";
import { get } from "lodash";
import { verifyJwt } from "../utils/jwt.utils";
import logger from "../utils/logger";

export async function createSessionHandler(
  req: Request<{}, {}, CreateSessionInput>,
  res: Response
) {
  const message = "Invalid email or password";
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user) {
    return res.send(message);
  }

  if (!user.verified) {
    return res.send("Please verify your email");
  }
  const isValid = await user.validatePassword(password);

  if (!isValid) {
    return res.send(message);
  }

  // sign a access token
  const accessToken = signAccessToken(user);

  // sign a refresh token
  const refreshToken = await signRefreshToken({ userId: user._id });

  // send the tokens
  res.send({ accessToken, refreshToken });
}

// for refreshin the access token
export async function refreshAccessTokenHandler(req: Request, res: Response) {
  // get the refresh token
  const refreshToken = get(req, "headers.x-refresh") as string;
  const decoded = verifyJwt<{ session: string }>(
    refreshToken,
    "refreshTokenPublicKey"
  );
  if (!decoded) {
    return res.status(401).send("Could not refresh access token");
  }

  // find the session
  const session = await findSessionById(decoded.session);

  // no session or is invalid
  if (!session || !session.valid) {
    return res.status(401).send("could not refresh access token");
  }

  // get the user
  const user = await findUserById(String(session.user));
  if (!user) {
    return res.status(401).send("Could not refresh access token");
  }

  // sign a new token
  const newAccessToken = signAccessToken(user);

  // send back the access token
  logger.info("new access token generated");
  return res.send({ newAccessToken });
}
