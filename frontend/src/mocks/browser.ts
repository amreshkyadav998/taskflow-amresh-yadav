import { setupWorker } from "msw/browser";
import { authHandlers } from "./handlers/auth";
import { projectHandlers } from "./handlers/projects";
import { taskHandlers } from "./handlers/tasks";

export const worker = setupWorker(
  ...authHandlers,
  ...projectHandlers,
  ...taskHandlers
);
