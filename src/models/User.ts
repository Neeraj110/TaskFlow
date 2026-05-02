import bcrypt from "bcryptjs";
import mongoose, { Document, Model, Schema } from "mongoose";

export type Role = "ADMIN" | "MEMBER";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (password: string) => Promise<boolean>;
}

export interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser, Model<IUser>, IUserMethods>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    avatar:   { type: String, default: "" },
  },
  { timestamps: true },
);

UserSchema.pre("save", async function (next) {
  const user = this as IUser;

  if (!user.isModified("password") || !user.password) {
    return next();
  }

  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    return next();
  } catch (error) {
    return next(error as Error);
  }
});

UserSchema.methods.comparePassword = async function (password: string) {
  const user = this as IUser;
  if (!user.password) {
    return false;
  }
  return bcrypt.compare(password, user.password);
};

const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

export default User;
