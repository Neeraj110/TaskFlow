import { getUserFromRequest } from "../../../middleware/auth";
import { createTask, getTasks } from "../../../services/taskService";
import { getProjectRole, getProjectsForUser } from "../../../services/projectService";
import { z } from "zod";

const createTaskSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  dueDate: z.coerce.date().optional(),
  assignedTo: z.string().optional(),
  projectId: z.string().min(1),
});

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user)
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });

  const memberships = await getProjectsForUser(user._id.toString());
  const projectIds = memberships.map((project) => project._id);

  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const filter: Record<string, unknown> = { projectId: { $in: projectIds } };
  if (status) filter.status = status;

  const tasks = await getTasks(filter);
  return new Response(JSON.stringify({ tasks }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user)
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  try {
    const body = await req.json();
    const parsed = createTaskSchema.parse(body);

    const projectRole = await getProjectRole(user._id.toString(), parsed.projectId);
    if (!projectRole) {
      return new Response(JSON.stringify({ error: "Not a project member" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (parsed.assignedTo && parsed.assignedTo !== user._id.toString() && projectRole !== "ADMIN") {
      return new Response(JSON.stringify({ error: "Only admins can assign to others" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const task = await createTask({ ...parsed, createdBy: user._id.toString() });
    return new Response(JSON.stringify({ task }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Bad Request";
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
