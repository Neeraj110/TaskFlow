import { IUser } from "../models/User";

export function requireRole(user: IUser, roles: string[] = []) {
  if (!roles.includes(user.role)) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
  return null;
}
>>>>>>> bf549288fa7e895f2d839dfd891a3c80434ac3db
