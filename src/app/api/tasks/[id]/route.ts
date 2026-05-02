import { getUserFromRequest } from "../../../../middleware/auth";
import { getProjectRole } from "../../../../services/projectService";
import type { RouteContext } from "../../../../types/route";
import {
  getTaskById,
  updateTask,
  deleteTask,
} from "../../../../services/taskService";

export async function GET(req: Request, context: RouteContext<{ id: string }>) {
  const params = await context.params;
  if (!params?.id)
    return new Response(JSON.stringify({ error: "Invalid task id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  const user = await getUserFromRequest(req);
  if (!user)
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  const task = await getTaskById(params.id);
  if (!task)
    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  return new Response(JSON.stringify({ task }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function PATCH(
  req: Request,
  context: RouteContext<{ id: string }>,
) {
  const params = await context.params;
  if (!params?.id)
    return new Response(JSON.stringify({ error: "Invalid task id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  const user = await getUserFromRequest(req);
  if (!user)
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  const body = await req.json();
  const task = await getTaskById(params.id);
  if (!task)
    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
    const projectRole = await getProjectRole(user._id.toString(), task.projectId.toString());
  if (!projectRole) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (projectRole !== "ADMIN") {
    if (task.assignedTo?.toString() !== user._id.toString()) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }
    const allowed = { status: body.status };
    const updated = await updateTask(params.id, allowed);
    return new Response(JSON.stringify({ task: updated }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  const updated = await updateTask(params.id, body);
  return new Response(JSON.stringify({ task: updated }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(
  req: Request,
  context: RouteContext<{ id: string }>,
) {
  const params = await context.params;
  if (!params?.id)
    return new Response(JSON.stringify({ error: "Invalid task id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  const user = await getUserFromRequest(req);
  if (!user)
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  const task = await getTaskById(params.id);
  if (!task)
    return new Response(JSON.stringify({ error: "Not Found" }), { status: 404, headers: { "Content-Type": "application/json" } });
  const projectRole = await getProjectRole(user._id.toString(), task.projectId.toString());
  if (projectRole !== "ADMIN")
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { "Content-Type": "application/json" } });
  await deleteTask(params.id);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
