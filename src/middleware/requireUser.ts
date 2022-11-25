import { NextFunction, Request, Response } from "express";
import { rest } from "lodash";

export async function requireUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = res.locals.user;
  console.log(user);
  if (!user) {
    return res.sendStatus(403);
  }
  return next();
}
