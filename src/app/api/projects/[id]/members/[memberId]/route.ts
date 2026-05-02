import { getUserFromRequest } from "../../../../../../middleware/auth";
import type { RouteContext } from "../../../../../../types/route";
import ProjectMember from "../../../../../../models/ProjectMember";
import { getProjectRole } from "../../../../../../services/projectService";

export async function PATCH(
  req: Request,
  context: RouteContext<{ id: string; memberId: string }>,
) {
  const params = await context.params;
  const user = await getUserFromRequest(req);
  if (!user)
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });

  const projectRole = await getProjectRole(user._id.toString(), params.id);
  if (projectRole !== "ADMIN") {
    return new Response(JSON.stringify({ error: "Only admins can change roles" }), { status: 403, headers: { "Content-Type": "application/json" } });
  }

  const { role } = await req.json();
  await ProjectMember.findByIdAndUpdate(params.memberId, { role });
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function DELETE(
  req: Request,
  context: RouteContext<{ id: string; memberId: string }>,
) {
  const params = await context.params;
  if (!params?.memberId)
    return new Response(JSON.stringify({ error: "Invalid member id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  const user = await getUserFromRequest(req);
  if (!user)
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  const projectRole = await getProjectRole(user._id.toString(), params.id);
  if (projectRole !== "ADMIN")
    return new Response(JSON.stringify({ error: "Only admins can remove members" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  await ProjectMember.findByIdAndDelete(params.memberId);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
