import { useState } from "react";
import { FolderOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectCard } from "@/components/projects/project-card";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { EditProjectDialog } from "@/components/projects/edit-project-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorMessage } from "@/components/shared/error-message";
import { useProjects, useDeleteProject } from "@/hooks/use-projects";
import { toast } from "@/hooks/use-toast";
import type { Project } from "@/types";

export function ProjectsPage() {
  const { data: projects, isLoading, error, refetch } = useProjects();
  const deleteMutation = useDeleteProject();
  const [createOpen, setCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);

  const handleDelete = (project: Project) => {
    if (!window.confirm(`Delete "${project.name}" and all its tasks?`)) return;

    deleteMutation.mutate(project.id, {
      onSuccess: () => {
        toast({ title: "Project deleted", variant: "success" });
      },
      onError: () => {
        toast({ title: "Failed to delete project", variant: "destructive" });
      },
    });
  };

  if (error) {
    return <ErrorMessage message="Failed to load projects" onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Projects
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Your workspace for managing tasks across projects
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="shrink-0 gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Project</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border p-5 space-y-4">
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
              <div className="pt-2 border-t">
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : !projects?.length ? (
        <EmptyState
          icon={FolderOpen}
          title="No projects yet"
          description="Create your first project to start organizing your tasks and tracking progress."
          action={
            <Button onClick={() => setCreateOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create your first project
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={setEditProject}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <CreateProjectDialog open={createOpen} onOpenChange={setCreateOpen} />
      <EditProjectDialog
        project={editProject}
        open={!!editProject}
        onOpenChange={(open) => !open && setEditProject(null)}
      />
    </div>
  );
}
