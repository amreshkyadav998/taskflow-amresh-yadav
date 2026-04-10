import { http, HttpResponse } from "msw";
import { db } from "../data/seed";
import type { Project } from "@/types";
import { extractUserId } from "../utils";

export const projectHandlers = [
  http.get("/api/projects", ({ request }) => {
    const userId = extractUserId(request);
    if (!userId) {
      return HttpResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const userProjects = db.projects.filter((p) => {
      if (p.owner_id === userId) return true;
      return db.tasks.some(
        (t) => t.project_id === p.id && t.assignee_id === userId
      );
    });

    return HttpResponse.json({ projects: userProjects });
  }),

  http.post("/api/projects", async ({ request }) => {
    const userId = extractUserId(request);
    if (!userId) {
      return HttpResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      name?: string;
      description?: string;
    };
    const fields: Record<string, string> = {};

    if (!body.name?.trim()) fields.name = "is required";
    if (Object.keys(fields).length > 0) {
      return HttpResponse.json(
        { error: "validation failed", fields },
        { status: 400 }
      );
    }

    const project: Project = {
      id: crypto.randomUUID(),
      name: body.name!.trim(),
      description: body.description?.trim() || undefined,
      owner_id: userId,
      created_at: new Date().toISOString(),
    };

    db.projects.push(project);
    return HttpResponse.json(project, { status: 201 });
  }),

  http.get("/api/projects/:id", ({ request, params }) => {
    const userId = extractUserId(request);
    if (!userId) {
      return HttpResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const project = db.projects.find((p) => p.id === params.id);
    if (!project) {
      return HttpResponse.json({ error: "not found" }, { status: 404 });
    }

    const tasks = db.tasks.filter((t) => t.project_id === project.id);

    return HttpResponse.json({ ...project, tasks });
  }),

  http.patch("/api/projects/:id", async ({ request, params }) => {
    const userId = extractUserId(request);
    if (!userId) {
      return HttpResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const project = db.projects.find((p) => p.id === params.id);
    if (!project) {
      return HttpResponse.json({ error: "not found" }, { status: 404 });
    }

    if (project.owner_id !== userId) {
      return HttpResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const body = (await request.json()) as {
      name?: string;
      description?: string;
    };

    if (body.name !== undefined) project.name = body.name.trim();
    if (body.description !== undefined)
      project.description = body.description.trim();

    return HttpResponse.json(project);
  }),

  http.delete("/api/projects/:id", ({ request, params }) => {
    const userId = extractUserId(request);
    if (!userId) {
      return HttpResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const idx = db.projects.findIndex((p) => p.id === params.id);
    if (idx === -1) {
      return HttpResponse.json({ error: "not found" }, { status: 404 });
    }

    if (db.projects[idx].owner_id !== userId) {
      return HttpResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const projectId = db.projects[idx].id;
    db.projects.splice(idx, 1);

    const taskIndicesToRemove = db.tasks
      .map((t, i) => (t.project_id === projectId ? i : -1))
      .filter((i) => i !== -1)
      .reverse();
    for (const i of taskIndicesToRemove) {
      db.tasks.splice(i, 1);
    }

    return new HttpResponse(null, { status: 204 });
  }),
];
