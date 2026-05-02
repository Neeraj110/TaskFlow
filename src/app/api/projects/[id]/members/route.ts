import { getUserFromRequest } from "../../../../../middleware/auth";
import { getProjectRole } from "../../../../../services/projectService";
import type { RouteContext } from "../../../../../types/route";
import ProjectMember from "../../../../../models/ProjectMember";
import { connectToDatabase } from "../../../../../lib/mongodb";
import mongoose from "mongoose";

export async function POST(
  req: Request,
  context: RouteContext<{ id: string }>,
) {
  const params = await context.params;
  if (!params?.id)
    return new Response(JSON.stringify({ error: "Invalid project id" }), {
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
<<<<<<< HEAD
    return new Response(
      JSON.stringify({
        error: "Forbidden — only project admins can add members",
      }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      },
    );
=======
    return new Response(JSON.stringify({ error: "Forbidden — only project admins can add members" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
>>>>>>> bf549288fa7e895f2d839dfd891a3c80434ac3db
  try {
    const body = await req.json();
    await connectToDatabase();
    const member = await ProjectMember.create({
      userId: new mongoose.Types.ObjectId(body.userId),
      projectId: new mongoose.Types.ObjectId(params.id),
      role: body.role || "MEMBER",
    });
    return new Response(JSON.stringify({ member }), {
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
