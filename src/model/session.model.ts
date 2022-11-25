import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { User } from "./user.model";

export class Session {
  @prop({ ref: () => User }) // mongoose definition
  user: Ref<User>; // typescript definition

  @prop({ default: true }) // to check to see if the session is valid or not
  valid: boolean;
}

const SessionModel = getModelForClass(Session, {
  schemaOptions: {
    timestamps: true,
  },
});

export default SessionModel;
