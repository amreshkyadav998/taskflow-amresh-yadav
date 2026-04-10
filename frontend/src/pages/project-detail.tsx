import { useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, ListTodo, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskBoard } from "@/components/tasks/task-board";
import { TaskFilters } from "@/components/tasks/task-filters";
import { TaskFormDialog } from "@/components/tasks/task-form";
import { TaskDetailDialog } from "@/components/tasks/task-detail-dialog";
import { EditProjectDialog } from "@/components/projects/edit-project-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorMessage } from "@/components/shared/error-message";
import { useProject, useDeleteProject } from "@/hooks/use-projects";
import { useCreateTask, useUpdateTask, useDeleteTask } from "@/hooks/use-tasks";
import { toast } from "@/hooks/use-toast";
import type { Task, TaskFilters as TaskFiltersType, TaskStatus } from "@/types";
import { db } from "@/mocks/data/seed";

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading, error, refetch } = useProject(id!);
  const createTask = useCreateTask(id!);
  const updateTask = useUpdateTask(id!);
  const deleteTask = useDeleteTask(id!);
  const deleteProject = useDeleteProject();

  const [filters, setFilters] = useState<TaskFiltersType>({});
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [editProjectOpen, setEditProjectOpen] = useState(false);

  const allUsers = useMemo(() => {
    return db.users.map((u) => ({ id: u.id, name: u.name, email: u.email }));
  }, []);

  const filteredTasks = useMemo(() => {
    if (!project?.tasks) return [];
    let tasks = project.tasks;
    if (filters.status) {
      tasks = tasks.filter((t) => t.status === filters.status);
    }
    if (filters.assignee) {
      tasks = tasks.filter((t) => t.assignee_id === filters.assignee);
    }
    return tasks;
  }, [project?.tasks, filters]);

  const handleCreateTask = (data: Record<string, unknown>) => {
    createTask.mutate(
      {
        title: data.title as string,
        description: data.description as string | undefined,
        priority: data.priority as Task["priority"] | undefined,
        due_date: (data.due_date as string) || undefined,
        assignee_id: (data.assignee_id as string) || undefined,
      },
      {
        onSuccess: () => {
          toast({ title: "Task created", variant: "success" });
          setTaskDialogOpen(false);
        },
        onError: () => {
          toast({ title: "Failed to create task", variant: "destructive" });
        },
      }
    );
  };

  const handleUpdateTask = (data: Record<string, unknown>) => {
    if (!editingTask) return;
    updateTask.mutate(
      {
        taskId: editingTask.id,
        data: {
          title: data.title as string,
          description: data.description as string | undefined,
          status: data.status as TaskStatus,
          priority: data.priority as Task["priority"],
          assignee_id: (data.assignee_id as string) || null,
          due_date: (data.due_date as string) || null,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Task updated", variant: "success" });
          setEditingTask(null);
        },
        onError: () => {
          toast({ title: "Failed to update task", variant: "destructive" });
        },
      }
    );
  };

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    updateTask.mutate(
      { taskId, data: { status } },
      {
        onError: () => {
          toast({ title: "Failed to update task status", variant: "destructive" });
        },
      }
    );
  };

  const handleDeleteTask = (task: Task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    deleteTask.mutate(task.id, {
      onSuccess: () => {
        toast({ title: "Task deleted", variant: "success" });
      },
      onError: () => {
        toast({ title: "Failed to delete task", variant: "destructive" });
      },
    });
  };

  const handleDeleteProject = () => {
    if (!project) return;
    if (!window.confirm(`Delete "${project.name}" and all its tasks? This cannot be undone.`)) return;
    deleteProject.mutate(project.id, {
      onSuccess: () => {
        toast({ title: "Project deleted", variant: "success" });
        navigate("/projects");
      },
    });
  };

  if (error) {
    return <ErrorMessage message="Failed to load project" onRetry={() => refetch()} />;
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-muted/40 p-3 space-y-3">
              <Skeleton className="h-8 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!project) {
    return <ErrorMessage message="Project not found" />;
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link
          to="/projects"
          className="hover:text-foreground transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="h-3.5 w-3.5 sm:hidden" />
          <span>Projects</span>
        </Link>
        <ChevronRight className="h-3.5 w-3.5 hidden sm:block" />
        <span className="text-foreground font-medium truncate max-w-[200px]">
          {project.name}
        </span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>
              {project.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h1
                className="text-xl sm:text-2xl font-bold tracking-tight truncate"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {project.name}
              </h1>
              {project.description && (
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                  {project.description}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditProjectOpen(true)}
            className="gap-1.5"
          >
            <Pencil className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/5 hover:border-destructive/30"
            onClick={handleDeleteProject}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
          <Button size="sm" onClick={() => setTaskDialogOpen(true)} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between py-3 border-y">
        <TaskFilters
          filters={filters}
          onFiltersChange={setFilters}
          users={allUsers}
        />
        <p className="text-sm text-muted-foreground tabular-nums">
          {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Board */}
      {project.tasks?.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="No tasks yet"
          description="Start adding tasks to track your project's progress."
          action={
            <Button onClick={() => setTaskDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create your first task
            </Button>
          }
        />
      ) : (
        <TaskBoard
          tasks={filteredTasks}
          onStatusChange={handleStatusChange}
          onViewTask={setViewingTask}
          onEditTask={setEditingTask}
          onDeleteTask={handleDeleteTask}
        />
      )}

      <TaskFormDialog
        task={null}
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        onSubmit={handleCreateTask}
        isPending={createTask.isPending}
        users={allUsers}
      />

      <TaskFormDialog
        task={editingTask}
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
        onSubmit={handleUpdateTask}
        isPending={updateTask.isPending}
        users={allUsers}
      />

      <TaskDetailDialog
        task={viewingTask}
        open={!!viewingTask}
        onOpenChange={(open) => !open && setViewingTask(null)}
        onEdit={(task) => {
          setViewingTask(null);
          setEditingTask(task);
        }}
        onDelete={(task) => {
          setViewingTask(null);
          handleDeleteTask(task);
        }}
        users={allUsers}
      />

      <EditProjectDialog
        project={project}
        open={editProjectOpen}
        onOpenChange={setEditProjectOpen}
      />
    </div>
  );
}
