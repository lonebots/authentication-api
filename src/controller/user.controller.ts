import { Request, Response } from "express";
import { createUserInput, verifyUserInput } from "../schema/user.schema";
import { createUser, findUserById } from "../service/user.service";
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
      from: "test@example.com",
      to: user.email,
      subject: "Please verify your account",
      text: `verification code : ${user.verificationCode}, Id : ${user._id}`,
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

export async function verifyUserHandler(
  req: Request<verifyUserInput>,
  res: Response
) {
  const id = req.params.id;
  const verificationCode = req.params.verificationCode;

  // find user id - we need a service
  const user = await findUserById(id);
  if (!user) {
    return res.send("Could not verify the user.");
  }

  // check if they are already verified
  if (user.verified) {
    return res.send("User is already verified.");
  }

  //  check to see if the verification code matches
  if (user.verificationCode === verificationCode) {
    user.verified = true;
    await user.save();
    return res.send("User successfully verified");
  }
  return res.send("Could not verify the user.");
}
