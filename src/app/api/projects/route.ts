import { getUserFromRequest } from "../../../middleware/auth";
import {
  createProject,
  getProjectsForUser,
} from "../../../services/projectService";
import { z } from "zod";

const createProjectSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
});

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user)
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  const projects = await getProjectsForUser(user._id.toString());
  return new Response(JSON.stringify({ projects }), {
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
    const parsed = createProjectSchema.parse(body);
    const project = await createProject({
      title: parsed.title,
      description: parsed.description,
      createdBy: user._id.toString(),
    });
    return new Response(JSON.stringify({ project }), {
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
