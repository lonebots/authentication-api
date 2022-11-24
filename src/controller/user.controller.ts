import { Request, Response } from "express";
import { createUserInput } from "../schema/user.schema";
import { createUser } from "../service/user.service";
import sendEmail from "../utils/mailer";

export async function createUserHandler(
  req: Request<{}, {}, createUserInput>, // if the input doesn't match the schema then we need an error and for handling that we need a middleware
  res: Response
) {
  const body = req.body;
  // controllers don't talk to database directly
  // it is done with the help of services.
  try {
    const user = await createUser(body);
    await sendEmail({
      from :'test@example.com',
      to: user.email,
      subject : "Please verify your account",
      text : `verification code : ${user.verificationCode}, Id : ${user._id}`,
    });
    return res.send("User successfully created");
  } catch (e: any) {
    if (e.code === 11000) {
      // means unique constraint is violated.
      return res.status(409).send("Account already exists");
    }
    return res.status(500).send(e);
  }
} 
