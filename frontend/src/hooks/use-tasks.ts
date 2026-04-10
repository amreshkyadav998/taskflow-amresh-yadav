import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
  TaskStatus,
} from "@/types";

export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskPayload) =>
      apiClient.post<Task>(`/projects/${projectId}/tasks`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
    },
  });
}

export function useUpdateTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: UpdateTaskPayload }) =>
      apiClient.patch<Task>(`/tasks/${taskId}`, data),

    onMutate: async ({ taskId, data }) => {
      await queryClient.cancelQueries({ queryKey: ["projects", projectId] });

      const previousData = queryClient.getQueryData(["projects", projectId]);

      queryClient.setQueryData(
        ["projects", projectId],
        (old: { tasks?: Task[] } | undefined) => {
          if (!old?.tasks) return old;
          return {
            ...old,
            tasks: old.tasks.map((t: Task) =>
              t.id === taskId ? { ...t, ...data, updated_at: new Date().toISOString() } : t
            ),
          };
        }
      );

      return { previousData };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["projects", projectId],
          context.previousData
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
    },
  });
}

export function useUpdateTaskStatus(projectId: string) {
  const updateTask = useUpdateTask(projectId);

  return {
    ...updateTask,
    mutate: (taskId: string, status: TaskStatus) =>
      updateTask.mutate({ taskId, data: { status } }),
  };
}

export function useDeleteTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => apiClient.delete(`/tasks/${taskId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
    },
  });
}
