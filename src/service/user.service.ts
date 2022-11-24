import userModel, { User } from "../model/user.model";

// creating a user // Partial comes from typescript allows to
export async function createUser(input: Partial<User>) {
  return userModel.create(input);
}

// find user by id
export async function findUserById(id: string) {
  return userModel.findById(id);
}

// find user by email
export async function findUserByEmail(email: string) {
  return userModel.findOne({ email });
}
