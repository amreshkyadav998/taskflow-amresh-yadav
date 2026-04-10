import { http, HttpResponse } from "msw";
import { db } from "../data/seed";
import type { Task } from "@/types";
import { extractUserId } from "../utils";

export const taskHandlers = [
  http.get("/api/projects/:id/tasks", ({ request, params }) => {
    const userId = extractUserId(request);
    if (!userId) {
      return HttpResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const project = db.projects.find((p) => p.id === params.id);
    if (!project) {
      return HttpResponse.json({ error: "not found" }, { status: 404 });
    }

    const url = new URL(request.url);
    const statusFilter = url.searchParams.get("status");
    const assigneeFilter = url.searchParams.get("assignee");

    let tasks = db.tasks.filter((t) => t.project_id === params.id);

    if (statusFilter) {
      tasks = tasks.filter((t) => t.status === statusFilter);
    }
    if (assigneeFilter) {
      tasks = tasks.filter((t) => t.assignee_id === assigneeFilter);
    }

    return HttpResponse.json({ tasks });
  }),

  http.post("/api/projects/:id/tasks", async ({ request, params }) => {
    const userId = extractUserId(request);
    if (!userId) {
      return HttpResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const project = db.projects.find((p) => p.id === params.id);
    if (!project) {
      return HttpResponse.json({ error: "not found" }, { status: 404 });
    }

    const body = (await request.json()) as {
      title?: string;
      description?: string;
      priority?: string;
      assignee_id?: string;
      due_date?: string;
    };

    const fields: Record<string, string> = {};
    if (!body.title?.trim()) fields.title = "is required";
    if (Object.keys(fields).length > 0) {
      return HttpResponse.json(
        { error: "validation failed", fields },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const task: Task = {
      id: crypto.randomUUID(),
      title: body.title!.trim(),
      description: body.description?.trim() || undefined,
      status: "todo",
      priority: (body.priority as Task["priority"]) || "medium",
      project_id: params.id as string,
      assignee_id: body.assignee_id || null,
      due_date: body.due_date || null,
      created_at: now,
      updated_at: now,
    };

    db.tasks.push(task);
    return HttpResponse.json(task, { status: 201 });
  }),

  http.patch("/api/tasks/:id", async ({ request, params }) => {
    const userId = extractUserId(request);
    if (!userId) {
      return HttpResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const task = db.tasks.find((t) => t.id === params.id);
    if (!task) {
      return HttpResponse.json({ error: "not found" }, { status: 404 });
    }

    const body = (await request.json()) as Record<string, unknown>;

    if (body.title !== undefined) task.title = (body.title as string).trim();
    if (body.description !== undefined)
      task.description = (body.description as string).trim();
    if (body.status !== undefined) task.status = body.status as Task["status"];
    if (body.priority !== undefined)
      task.priority = body.priority as Task["priority"];
    if (body.assignee_id !== undefined)
      task.assignee_id = body.assignee_id as string | null;
    if (body.due_date !== undefined)
      task.due_date = body.due_date as string | null;

    task.updated_at = new Date().toISOString();

    return HttpResponse.json(task);
  }),

  http.delete("/api/tasks/:id", ({ request, params }) => {
    const userId = extractUserId(request);
    if (!userId) {
      return HttpResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const idx = db.tasks.findIndex((t) => t.id === params.id);
    if (idx === -1) {
      return HttpResponse.json({ error: "not found" }, { status: 404 });
    }

    db.tasks.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
