import {
  getModelForClass,
  modelOptions,
  prop,
  Severity,
  pre,
  DocumentType,
} from "@typegoose/typegoose";
import logger from "../utils/logger";
import argon2 from "argon2";
import { nanoid } from "nanoid";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  //to disallow multiple password reset from the same pwdreset code
  options: {
    allowMixed: Severity.ALLOW,
  },
})
// hook to hash the password
@pre<User>("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  // using argon2 an alternative to bcrypt
  const hash = await argon2.hash(this.password);
  this.password = hash;
  return;
})
export class User {
  @prop({ lowercase: true, required: true, unique: true })
  email: string;

  @prop({ required: true })
  firstName: string;

  @prop({ required: true })
  lasttName: string;

  @prop({ required: true })
  password: string;

  @prop({
    required: true,
    default: () => {
      nanoid();
    },
  })
  verificationCode: string;

  @prop()
  passwordResetCode: string;

  @prop({ default: false })
  verified: boolean;

  async validatePassword(this: DocumentType<User>, candidatePassword: string) {
    try {
      return await argon2.verify(this.password, candidatePassword);
    } catch (e) {
      logger.error(e, "Could not validate password");
    }
  }
}

const userModel = getModelForClass(User);

export default userModel;
