# TaskFlow — Frontend Application

A minimal but complete task management system built as a single-page application. Users can register, log in, create projects, add tasks to those projects, assign tasks to team members, and manage task status via a Jira-style drag-and-drop Kanban board.

**Role:** Frontend Engineer

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS 4 + shadcn/ui (Radix primitives) |
| Typography | Plus Jakarta Sans (headings) + Inter (body) via Google Fonts |
| Routing | React Router v7 |
| State Management | Zustand (auth), TanStack Query v5 (server state) |
| Form Handling | React Hook Form + Zod v4 |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| API Mocking | MSW (Mock Service Worker) v2 |
| Deployment | Docker (multi-stage) + nginx |

## Architecture Decisions

### Why MSW over json-server

MSW intercepts requests at the service worker level, meaning the app makes real `fetch` calls that are intercepted before leaving the browser. This:

- Requires **zero backend infrastructure** — no separate server process
- Lets us test the exact same `fetch`-based API client that would talk to a real backend
- Works seamlessly in both development and production Docker builds
- Gives us full control over response timing, error simulation, and auth validation

The tradeoff is that data resets on page refresh (in-memory only). For this take-home scope, that's acceptable.

### Why Zustand + TanStack Query (not Redux)

- **Zustand** handles auth state (user, token, login/logout). It's ~1KB, has no boilerplate, and syncs with localStorage automatically via our store actions.
- **TanStack Query** handles all server state (projects, tasks). It provides caching, background refetching, and built-in optimistic update patterns — exactly what we need for the Kanban drag-and-drop.
- Together they eliminate prop-drilling entirely. Components subscribe to exactly the state they need.

### Why shadcn/ui

Not a component library in the traditional sense — it gives us copy-pasteable, fully customizable Radix-based components. This means:

- Full control over styling and behavior
- No version lock-in to a third-party package
- Built-in accessibility (Radix primitives handle ARIA, keyboard navigation, focus management)
- Dark mode support via CSS variables with zero runtime overhead

### Component Architecture

```
pages/          → Route-level components, data fetching orchestration
components/     → Reusable UI, split by domain (auth, projects, tasks, shared)
hooks/          → Custom hooks wrapping TanStack Query mutations/queries
stores/         → Zustand auth store
lib/            → Pure utilities (API client, auth helpers, formatting)
mocks/          → MSW handlers and seed data
```

Pages own the data flow. Components are presentational where possible. Hooks encapsulate all API interaction logic including optimistic updates.

### Optimistic Updates

Task status changes (including drag-and-drop) use TanStack Query's `onMutate` → snapshot → rollback pattern:

1. Cancel in-flight queries for the project
2. Snapshot current cache state
3. Optimistically update the cache
4. On error, roll back to the snapshot
5. On settle (success or error), invalidate to re-sync

This gives instant feedback when dragging tasks between columns.

### Auth Persistence

Authentication state is persisted in `localStorage` under two keys:

- `taskflow_token` — the JWT string
- `taskflow_user` — the user object (id, name, email) as JSON

On app boot (`main.tsx`), the Zustand store's `hydrate()` method reads both values. If both exist and are valid, the user stays logged in across page refreshes. On logout, both keys are cleared.

## Running Locally

### Prerequisites

- Docker and Docker Compose installed

### Steps

```bash
git clone <repository-url>
cd taskflow
cp .env.example .env
docker compose up --build
```

The app will be available at **http://localhost:3000**.

### Running without Docker (development)

```bash
cd frontend
npm install
npm run dev
```

The dev server starts at **http://localhost:3000** with hot module replacement.

## Test Credentials

The app ships with a seeded test user:

```
Email:    test@example.com
Password: password123
```

You can also register a new account — the mock API supports full registration.

## API Reference

All endpoints are mocked via MSW and follow the spec from Appendix A. The base path is `/api`.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register with `{ name, email, password }`. Returns `{ token, user }` (201) |
| POST | `/auth/login` | Login with `{ email, password }`. Returns `{ token, user }` (200) |

### Projects (requires `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/projects` | List all projects the user owns or has tasks in |
| POST | `/projects` | Create project with `{ name, description? }` (201) |
| GET | `/projects/:id` | Get project detail including all tasks |
| PATCH | `/projects/:id` | Update `{ name?, description? }` (owner only) |
| DELETE | `/projects/:id` | Delete project and all tasks (owner only, 204) |

### Tasks (requires `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/projects/:id/tasks` | List tasks. Supports `?status=` and `?assignee=` filters |
| POST | `/projects/:id/tasks` | Create task with `{ title, description?, priority?, assignee_id?, due_date? }` (201) |
| PATCH | `/tasks/:id` | Update any task field including assignee (200) |
| DELETE | `/tasks/:id` | Delete task (204) |

### Error Responses

```json
// 400 Validation error
{ "error": "validation failed", "fields": { "email": "is required" } }

// 401 Unauthenticated
{ "error": "unauthorized" }

// 403 Forbidden
{ "error": "forbidden" }

// 404 Not found
{ "error": "not found" }
```

## Seed Data

The mock database initializes with:

- **1 user:** Test User (test@example.com)
- **1 project:** "Website Redesign" — Q2 redesign project
- **3 tasks:**
  - "Design homepage mockup" — todo, high priority, due Apr 15
  - "Implement responsive navigation" — in_progress, medium priority, due Apr 20
  - "Set up CI/CD pipeline" — done, low priority

## Features

### Core

- **Authentication:** Login and register forms with Zod client-side validation. JWT token and user persisted in localStorage. Protected routes redirect to `/login`.
- **Projects:** List, create, edit, and delete projects. Project cards show initial letter badge, description, and creation date.
- **Tasks:** Full CRUD via modal dialogs. Create and edit forms include title, description, priority, status (edit only), assignee dropdown, and due date.
- **Task assignment:** Any authenticated user can assign or reassign a task to any registered user via the assignee dropdown in the create/edit form.
- **Task detail view:** View full task details (status, priority, assignee, due date, created date, description) in a read-only modal. Accessible via the "View" option in the task card menu.
- **Filtering:** Filter tasks by status and by assignee on the project detail page.
- **Loading states:** Skeleton loaders on the projects list and project detail pages.
- **Error handling:** Global `ErrorBoundary`, inline API error messages on forms, toast notifications for mutations, retry buttons on failed data fetches.
- **Empty states:** Descriptive empty states with action buttons when no projects or tasks exist.

### Bonus

- **Drag-and-drop Kanban board:** Jira-style board with colored column bars (slate for To Do, blue for In Progress, emerald for Done). Tasks have a left-border priority accent (red/amber/green). Dragging uses @dnd-kit with optimistic updates and rollback on error.
- **Dark mode:** Defaults to dark. Toggle available in the navbar and on login/register pages. Preference persists across sessions via localStorage. Built with Tailwind's `dark:` variant and CSS custom properties.

### Design

- **Custom branding:** Custom SVG logo with task-list motif and checkmark. "Task**Flow**" wordmark with brand-colored accent.
- **Typography:** Plus Jakarta Sans for headings, Inter for body text. Imported via Google Fonts.
- **Color system:** Indigo-tinted brand palette using oklch color space. Both light and dark themes carry the indigo undertone rather than flat gray.
- **Responsive:** Mobile-first design. Single column at 375px, grid layouts at 640px+, three-column Kanban at 768px+, split login panel at 1024px+.

## What I'd Do With More Time

### Immediately

- **Code splitting:** Lazy-load routes to reduce the initial bundle (~709KB is too large). `React.lazy()` + `Suspense` for the project detail page would be the biggest win.
- **Pagination:** The projects list and task lists should paginate. The current implementation fetches everything at once.
- **Token expiry handling:** The API client should detect 401 responses and redirect to login automatically, clearing stale auth state.
- **Unit tests:** Test the MSW handlers directly, test the custom hooks with `@testing-library/react-hooks`, and test key components with React Testing Library.

### With a real backend

- **WebSocket/SSE for real-time updates:** When multiple users are on the same project, task changes should push to all clients.
- **User search for assignee:** The assignee dropdown currently lists all users from the mock database. With a real backend, this would be a searchable typeahead.
- **File attachments on tasks:** Upload screenshots, design files, etc.
- **Activity log:** Show who changed what and when on each task.
- **Keyboard shortcuts:** `n` for new task, `e` for edit, arrow keys for navigation within the Kanban board.

### Polish

- **Animations:** Page transitions, skeleton-to-content fade, toast slide-in improvements.
- **Mobile-optimized Kanban:** The three-column layout stacks vertically on mobile. A horizontal swipe-between-columns pattern would work better on small screens.
- **Accessibility audit:** While Radix handles most a11y, the drag-and-drop experience needs dedicated screen reader announcements for column changes.
