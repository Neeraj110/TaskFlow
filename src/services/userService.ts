import connectToDatabase from "../lib/mongodb";
import User from "../models/User";

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

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
