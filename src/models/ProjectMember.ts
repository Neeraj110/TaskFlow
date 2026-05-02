import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProjectMember extends Document {
  userId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  role: "ADMIN" | "MEMBER";
  createdAt: Date;
  updatedAt: Date;
}

const ProjectMemberSchema = new Schema<IProjectMember>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    role: { type: String, enum: ["ADMIN", "MEMBER"], default: "MEMBER" },
  },
  { timestamps: true },
);

const ProjectMember: Model<IProjectMember> =
  (mongoose.models.ProjectMember as Model<IProjectMember>) ||
  mongoose.model<IProjectMember>("ProjectMember", ProjectMemberSchema);

export default ProjectMember;
