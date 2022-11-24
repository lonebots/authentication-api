import logger from "../utils/logger";
import { Request, Response } from "express";
import {
  CreateUserInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyUserInput,
} from "../schema/user.schema";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../service/user.service";
import sendEmail from "../utils/mailer";
import { nanoid } from "nanoid";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>, // if the input doesn't match the schema then we need an error and for handling that we need a middleware
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
  req: Request<VerifyUserInput>,
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

export async function forgotPasswordHandler(
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response
) {
  const message =
    "If a user with that email is registered, you will recieve a password reset email";

  const { email } = req.body;
  const user = await findUserByEmail(email);

  if (!user) {
    logger.debug(`user with email ${email} doesnot exists`);
    return res.send(message);
  }

  if (!user.verified) {
    return res.send("User is not verified");
  }
  // generate a password reset code
  const passwordResetCode = nanoid();
  user.passwordResetCode = passwordResetCode;
  await user.save();

  // send email with password reset code
  await sendEmail({
    to: user.email,
    from: " test@example.com",
    subject: "Reset your password",
    text: `Password reset code : ${passwordResetCode}, Id : ${user._id}`,
  });

  //debug log
  logger.debug(`Password reset email sent to ${email}`);
  return res.send(message);
}

export async function resetPasswordHandler(
  req: Request<ResetPasswordInput["params"], {}, ResetPasswordInput["body"]>,
  res: Response
) {
  const { id, passwordResetCode } = req.params;
  const { password } = req.body;

  const user = await findUserById(id);
  if (
    !user ||
    !user.passwordResetCode ||
    user.passwordResetCode !== passwordResetCode
  ) {
    return res.status(400).send("Could not resest your password");
  }

  // if everything is fine
  user.passwordResetCode = "";
  user.password = password;
  await user.save();
  return res.status(200).send("Password reset successfully");
}
