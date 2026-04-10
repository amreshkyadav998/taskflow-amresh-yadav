import { http, HttpResponse } from "msw";
import { db, type StoredUser } from "../data/seed";

function generateToken(user: StoredUser): string {
  const payload = {
    user_id: user.id,
    email: user.email,
    exp: Date.now() + 24 * 60 * 60 * 1000,
  };
  return btoa(JSON.stringify(payload));
}

export const authHandlers = [
  http.post("/api/auth/register", async ({ request }) => {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
    };
    const fields: Record<string, string> = {};

    if (!body.name?.trim()) fields.name = "is required";
    if (!body.email?.trim()) fields.email = "is required";
    if (!body.password || body.password.length < 6)
      fields.password = "must be at least 6 characters";

    if (Object.keys(fields).length > 0) {
      return HttpResponse.json(
        { error: "validation failed", fields },
        { status: 400 }
      );
    }

    const existing = db.users.find((u) => u.email === body.email);
    if (existing) {
      return HttpResponse.json(
        { error: "validation failed", fields: { email: "already registered" } },
        { status: 400 }
      );
    }

    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      name: body.name!.trim(),
      email: body.email!.trim().toLowerCase(),
      password: body.password!,
      created_at: new Date().toISOString(),
    };

    db.users.push(newUser);

    const token = generateToken(newUser);

    return HttpResponse.json(
      {
        token,
        user: { id: newUser.id, name: newUser.name, email: newUser.email },
      },
      { status: 201 }
    );
  }),

  http.post("/api/auth/login", async ({ request }) => {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };
    const fields: Record<string, string> = {};

    if (!body.email?.trim()) fields.email = "is required";
    if (!body.password) fields.password = "is required";

    if (Object.keys(fields).length > 0) {
      return HttpResponse.json(
        { error: "validation failed", fields },
        { status: 400 }
      );
    }

    const user = db.users.find(
      (u) =>
        u.email === body.email!.trim().toLowerCase() &&
        u.password === body.password
    );

    if (!user) {
      return HttpResponse.json(
        { error: "invalid email or password" },
        { status: 401 }
      );
    }

    const token = generateToken(user);

    return HttpResponse.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  }),
];
