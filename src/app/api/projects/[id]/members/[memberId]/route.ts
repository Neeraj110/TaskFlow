import { getUserFromRequest } from "../../../../../../middleware/auth";
import { requireRole } from "../../../../../../middleware/authorize";
import type { RouteContext } from "../../../../../../types/route";
import ProjectMember from "../../../../../../models/ProjectMember";

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
  const forbidden = requireRole(user, ["ADMIN"]);
  if (forbidden) return forbidden;
  await ProjectMember.findByIdAndDelete(params.memberId);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
