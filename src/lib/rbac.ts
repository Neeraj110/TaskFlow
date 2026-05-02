import Project from "../models/Project";

export async function getProjectRole(userId: string, projectId: string) {
  const project = await Project.findById(projectId);
  if (!project) return null;
  const member = project.members.find((m) => m.user.toString() === userId);
  return member?.role ?? null;
}

export function requireRole(required: "ADMIN" | "MEMBER", userRole?: string | null) {
  if (!userRole) return false;
  if (required === "ADMIN") return userRole === "ADMIN";
  return true;
}
