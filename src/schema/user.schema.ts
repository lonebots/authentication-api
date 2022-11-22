//validate a user request
import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
  body: object({
    firstName: string({
      required_error: "First name is required",
    }),
    lastName: string({
      required_error: "Last name is required",
    }),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password must contain minimum 6 characters"),
    passwordConfirmation: string({
      required_error: "Password Confirmation is required",
    }),
    email: string({
      required_error: "Email is requiered",
    }).email("Not a valid email"),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"], //allow user to understand that the password confirmation doesn't match with the password supplied
  }),
});

export type createUserInput = TypeOf<typeof createUserSchema>["body"];
