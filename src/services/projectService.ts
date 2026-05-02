import connectToDatabase from "../lib/mongodb";
import Project, { IProject } from "../models/Project";
import ProjectMember from "../models/ProjectMember";
import Task from "../models/Task";
import mongoose from "mongoose";

export type CreateProjectInput = {
  title: string;
  description?: string;
  createdBy: string;
};

export type UpdateProjectInput = Partial<
  Pick<IProject, "title" | "description">
>;

export async function createProject(data: CreateProjectInput) {
  await connectToDatabase();
  const project = await Project.create({
    ...data,
    createdBy: new mongoose.Types.ObjectId(data.createdBy),
  });
  await ProjectMember.create({
    userId: new mongoose.Types.ObjectId(data.createdBy),
    projectId: project._id,
    role: "ADMIN",
  });
  return project;
}

export async function getProjectsForUser(userId: string) {
  await connectToDatabase();
  const memberships = await ProjectMember.find({ userId }).select("projectId");
  const projectIds = memberships.map((m) => m.projectId);
  return Project.find({ _id: { $in: projectIds } }).populate(
    "createdBy",
    "name email",
  );
}

export async function getAllProjects() {
  await connectToDatabase();
  return Project.find().populate("createdBy", "name email");
}

export async function getProjectById(id: string) {
  await connectToDatabase();
  return Project.findById(id).populate("createdBy", "name email");
}

export async function getProjectRole(userId: string, projectId: string) {
  await connectToDatabase();
  const membership = await ProjectMember.findOne({ userId, projectId });
  return membership?.role || null;
}

export async function isProjectMember(userId: string, projectId: string) {
  await connectToDatabase();
  const membership = await ProjectMember.findOne({ userId, projectId });
  return Boolean(membership);
}

export async function updateProject(id: string, payload: UpdateProjectInput) {
  await connectToDatabase();
  return Project.findByIdAndUpdate(id, payload, { new: true });
}

export async function deleteProject(id: string) {
  await connectToDatabase();
  await Task.deleteMany({ projectId: id });
  await ProjectMember.deleteMany({ projectId: id });
  return Project.findByIdAndDelete(id);
}
