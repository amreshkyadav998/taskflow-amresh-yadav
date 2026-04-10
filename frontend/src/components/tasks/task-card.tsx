import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Task } from "@/types";
import { cn, formatDate } from "@/lib/utils";
import { TASK_PRIORITY_LABELS } from "@/lib/constants";

interface TaskCardProps {
  task: Task;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const priorityAccent: Record<string, string> = {
  high: "border-l-red-500",
  medium: "border-l-amber-500",
  low: "border-l-emerald-500",
};

const priorityBadge: Record<string, string> = {
  high: "bg-red-500/15 text-red-600 dark:text-red-400",
  medium: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  low: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
};

export function TaskCard({ task, onView, onEdit, onDelete }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group rounded border-l-[3px] bg-card shadow-sm transition-all duration-100",
        "hover:bg-accent/50 cursor-grab active:cursor-grabbing",
        priorityAccent[task.priority],
        isDragging && "opacity-50 shadow-lg ring-2 ring-primary/40"
      )}
    >
      <div className="px-3 py-2.5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-snug line-clamp-2 flex-1">
            {task.title}
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0 rounded opacity-0 group-hover:opacity-100 transition-opacity -mt-0.5 -mr-1"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem onClick={() => onView(task)}>
                <Eye className="mr-2 h-3.5 w-3.5" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Pencil className="mr-2 h-3.5 w-3.5" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(task)}
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {task.description && (
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <Badge
            variant="secondary"
            className={cn(
              "text-[10px] px-1.5 py-0 font-semibold rounded-sm border-0",
              priorityBadge[task.priority]
            )}
          >
            {TASK_PRIORITY_LABELS[task.priority]}
          </Badge>
          {task.due_date && (
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formatDate(task.due_date)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
