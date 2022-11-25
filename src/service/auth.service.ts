import { privateFields, User } from "../model/user.model";
import { DocumentType } from "@typegoose/typegoose";
import { signJwt } from "../utils/jwt.utils";
import SessionModel from "../model/session.model";
import { omit } from "lodash";

export async function createSession({ userId }: { userId: string }) {
  return SessionModel.create({ user: userId });
}

export async function signRefreshToken({ userId }: { userId: string }) {
  // create a session
  const session = await createSession({ userId });
  // sign a refresh token that references this session
  // create a new accesstoken
  // check if the refresh token is valid
  // if it is valid then sign a new access token
  const refreshToken = signJwt(
    {
      session: session._id,
    },
    "refreshTokenPrivateKey"
  );

  return refreshToken;
}

export function signAccessToken(user: DocumentType<User>) {
  const payload = omit(user.toJSON(), privateFields);
  const accessToken = signJwt(payload, "accessTokenPrivateKey");
  return accessToken;
}
