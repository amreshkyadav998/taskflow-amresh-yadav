import { db } from "./data/seed";

export function extractUserId(request: Request): string | null {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  try {
    const token = authHeader.slice(7);
    const payload = JSON.parse(atob(token)) as {
      user_id: string;
      email: string;
      exp: number;
    };

    if (payload.exp < Date.now()) return null;

    const user = db.users.find((u) => u.id === payload.user_id);
    return user ? user.id : null;
  } catch {
    return null;
  }
}
