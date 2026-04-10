import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";
import { TaskCard } from "./task-card";
import { TASK_STATUS_LABELS } from "@/lib/constants";

interface TaskColumnProps {
  status: string;
  tasks: Task[];
  onViewTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

const statusLine: Record<string, string> = {
  todo: "bg-slate-400",
  in_progress: "bg-blue-500",
  done: "bg-emerald-500",
};

export function TaskColumn({ status, tasks, onViewTask, onEditTask, onDeleteTask }: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex flex-col min-w-0">
      {/* Column header — Jira-style: colored bar + name + count */}
      <div className="mb-1">
        <div className={cn("h-[3px] rounded-full", statusLine[status])} />
        <div className="flex items-center justify-between px-1 pt-2.5 pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {TASK_STATUS_LABELS[status]}
          </h3>
          <span className="text-xs font-semibold text-muted-foreground tabular-nums">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 space-y-1.5 rounded-md p-1.5 min-h-[80px] transition-colors duration-100",
          "bg-muted/30 dark:bg-muted/15",
          isOver && "bg-primary/8 dark:bg-primary/10 ring-1 ring-inset ring-primary/25"
        )}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onView={onViewTask}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && !isOver && (
          <div className="flex h-16 items-center justify-center">
            <p className="text-xs text-muted-foreground/40">Drop tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
}
