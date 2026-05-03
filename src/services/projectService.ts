import connectToDatabase from "../lib/mongodb";
import Project from "../models/Project";
import ProjectMember, { ProjectRole } from "../models/ProjectMember";
import Task from "../models/Task";
import User from "../models/User";
import mongoose from "mongoose";

// ✅ BUG FIX: title → name (matches Project model schema)
export type CreateProjectInput = {
  name: string;
  description?: string;
  createdBy: string;
};

export type UpdateProjectInput = {
  name?: string;
  description?: string;
};

// ✅ Project create + creator auto ADMIN
export async function createProject(data: CreateProjectInput) {
  await connectToDatabase();
  const project = await Project.create({
    name: data.name,
    description: data.description || "",
    createdBy: new mongoose.Types.ObjectId(data.createdBy),
  });
  // Creator automatically ADMIN ban jaata hai
  await ProjectMember.create({
    userId: new mongoose.Types.ObjectId(data.createdBy),
    projectId: project._id,
    role: "ADMIN",
  });
  return project;
}

// ✅ User ke saare projects with userRole attached
export async function getProjectsForUser(userId: string) {
  await connectToDatabase();
  const memberships = await ProjectMember.find({ userId }).select(
    "projectId role",
  );
  const projectIds = memberships.map((m) => m.projectId);
  const projects = await Project.find({ _id: { $in: projectIds } }).populate(
    "createdBy",
    "name email avatar",
  );

  // Har project ke saath us user ka role bhi attach karo
  return projects.map((project) => {
    const membership = memberships.find(
      (m) => m.projectId.toString() === project._id.toString(),
    );
    return {
      ...project.toJSON(),
      userRole: membership?.role || "MEMBER",
    };
  });
}

// ✅ BUG FIX: members bhi return karo — pehle sirf project tha, members missing the
export async function getProjectById(id: string) {
  await connectToDatabase();
  const project = await Project.findById(id).populate(
    "createdBy",
    "name email avatar",
  );
  if (!project) return null;

  // ProjectMember collection se members fetch karo with user details
  const members = await ProjectMember.find({ projectId: id }).populate(
    "userId",
    "name email avatar",
  );

  return {
    ...project.toJSON(),
    members: members.map((m) => ({
      memberId: m._id.toString(), // promote/remove ke liye chahiye
      role: m.role,
      user: m.userId, // populated user object
    })),
  };
}

// ✅ RBAC core function — project mein user ka role
export async function getProjectRole(
  userId: string,
  projectId: string,
): Promise<ProjectRole | null> {
  await connectToDatabase();
  const membership = await ProjectMember.findOne({ userId, projectId });
  return (membership?.role as ProjectRole) || null;
}

// ✅ Simple membership check
export async function isProjectMember(
  userId: string,
  projectId: string,
): Promise<boolean> {
  await connectToDatabase();
  const membership = await ProjectMember.findOne({ userId, projectId });
  return Boolean(membership);
}

// ✅ Email se user dhundo, phir project mein add karo
export async function addProjectMember(
  projectId: string,
  email: string,
  role: ProjectRole = "MEMBER",
) {
  await connectToDatabase();
  const user = await User.findOne({ email });
  if (!user) throw new Error("No user found with this email");

  const existing = await ProjectMember.findOne({
    userId: user._id,
    projectId,
  });
  if (existing) throw new Error("User is already a member of this project");

  return ProjectMember.create({
    userId: user._id,
    projectId: new mongoose.Types.ObjectId(projectId),
    role,
  });
}

// ✅ Member ka role change (MEMBER ↔ ADMIN)
export async function updateMemberRole(memberId: string, role: ProjectRole) {
  await connectToDatabase();
  return ProjectMember.findByIdAndUpdate(memberId, { role }, { new: true });
}

// ✅ Member remove karo
export async function removeProjectMember(memberId: string) {
  await connectToDatabase();
  return ProjectMember.findByIdAndDelete(memberId);
}

export async function updateProject(id: string, payload: UpdateProjectInput) {
  await connectToDatabase();
  return Project.findByIdAndUpdate(id, payload, { new: true });
}

// ✅ Project + tasks + members sab delete
export async function deleteProject(id: string) {
  await connectToDatabase();
  await Promise.all([
    Task.deleteMany({ projectId: id }),
    ProjectMember.deleteMany({ projectId: id }),
    Project.findByIdAndDelete(id),
  ]);
}
