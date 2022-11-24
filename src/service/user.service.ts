import userModel, { User } from "../model/user.model";

// creating a user // Partial comes from typescript allows to
export async function createUser(input: Partial<User>) {
  return userModel.create(input);
}

export async function findUserById(id: string) {
  return userModel.findById(id);
}
