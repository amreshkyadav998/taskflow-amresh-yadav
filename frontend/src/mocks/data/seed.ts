import type { User, Project, Task } from "@/types";

export interface StoredUser extends User {
  password: string;
}

const SEED_USER_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
const SEED_PROJECT_ID = "p1a2b3c4-d5e6-7890-abcd-ef1234567890";

export const seedUsers: StoredUser[] = [
  {
    id: SEED_USER_ID,
    name: "Test User",
    email: "test@example.com",
    password: "password123",
    created_at: "2026-04-01T10:00:00Z",
  },
];

export const seedProjects: Project[] = [
  {
    id: SEED_PROJECT_ID,
    name: "Website Redesign",
    description: "Q2 redesign project for the company website",
    owner_id: SEED_USER_ID,
    created_at: "2026-04-01T10:00:00Z",
  },
];

export const seedTasks: Task[] = [
  {
    id: "t1a2b3c4-0001-7890-abcd-ef1234567890",
    title: "Design homepage mockup",
    description: "Create wireframes and visual designs for the new homepage layout",
    status: "todo",
    priority: "high",
    project_id: SEED_PROJECT_ID,
    assignee_id: SEED_USER_ID,
    due_date: "2026-04-15",
    created_at: "2026-04-02T09:00:00Z",
    updated_at: "2026-04-02T09:00:00Z",
  },
  {
    id: "t1a2b3c4-0002-7890-abcd-ef1234567890",
    title: "Implement responsive navigation",
    description: "Build the new navigation bar with mobile hamburger menu support",
    status: "in_progress",
    priority: "medium",
    project_id: SEED_PROJECT_ID,
    assignee_id: SEED_USER_ID,
    due_date: "2026-04-20",
    created_at: "2026-04-03T11:00:00Z",
    updated_at: "2026-04-05T14:30:00Z",
  },
  {
    id: "t1a2b3c4-0003-7890-abcd-ef1234567890",
    title: "Set up CI/CD pipeline",
    description: "Configure GitHub Actions for automated testing and deployment",
    status: "done",
    priority: "low",
    project_id: SEED_PROJECT_ID,
    assignee_id: null,
    due_date: null,
    created_at: "2026-04-01T15:00:00Z",
    updated_at: "2026-04-04T10:00:00Z",
  },
];

function cloneData<T>(data: T[]): T[] {
  return JSON.parse(JSON.stringify(data));
}

export function createDatabase() {
  return {
    users: cloneData(seedUsers),
    projects: cloneData(seedProjects),
    tasks: cloneData(seedTasks),
  };
}

export type Database = ReturnType<typeof createDatabase>;

export const db: Database = createDatabase();
