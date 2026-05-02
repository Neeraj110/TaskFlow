import connectToDatabase from "../lib/mongodb";
import User from "../models/User";

<<<<<<< HEAD
export type CreateUserInput = Pick<
  IUser,
  "name" | "email" | "password" 
>;
=======
export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};
>>>>>>> bf549288fa7e895f2d839dfd891a3c80434ac3db

export async function createUser(data: CreateUserInput) {
  await connectToDatabase();
  return User.create(data);
}

export async function findUserByEmail(email: string) {
  await connectToDatabase();
  return User.findOne({ email });
}

export async function getUserById(id: string) {
  await connectToDatabase();
  return User.findById(id).select("-password");
}
