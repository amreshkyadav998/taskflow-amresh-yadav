import { Calendar, Clock, Flag, Layers, Pencil, Trash2, UserCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Task, User } from "@/types";
import { cn, formatDate } from "@/lib/utils";
import { TASK_PRIORITY_LABELS, TASK_STATUS_LABELS } from "@/lib/constants";

interface TaskDetailDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  users: Pick<User, "id" | "name" | "email">[];
}

const priorityBadge: Record<string, string> = {
  high: "bg-red-500/15 text-red-600 dark:text-red-400",
  medium: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  low: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
};

const statusBadge: Record<string, string> = {
  todo: "bg-slate-500/15 text-slate-600 dark:text-slate-400",
  in_progress: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  done: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
};

export function TaskDetailDialog({
  task,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  users,
}: TaskDetailDialogProps) {
  if (!task) return null;

  const assignee = task.assignee_id
    ? users.find((u) => u.id === task.assignee_id)
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-lg font-semibold leading-snug pr-8">
            {task.title}
          </DialogTitle>
        </DialogHeader>

        <Separator />

        <div className="px-6 py-5 space-y-5">
          {task.description ? (
            <div className="space-y-1.5">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Description
              </p>
              <p className="text-sm leading-relaxed text-foreground/90">
                {task.description}
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Description
              </p>
              <p className="text-sm text-muted-foreground/60 italic">
                No description provided
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <DetailField
              icon={Layers}
              label="Status"
              value={
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-xs font-semibold border-0 rounded-sm",
                    statusBadge[task.status]
                  )}
                >
                  {TASK_STATUS_LABELS[task.status]}
                </Badge>
              }
            />
            <DetailField
              icon={Flag}
              label="Priority"
              value={
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-xs font-semibold border-0 rounded-sm",
                    priorityBadge[task.priority]
                  )}
                >
                  {TASK_PRIORITY_LABELS[task.priority]}
                </Badge>
              }
            />
            <DetailField
              icon={UserCircle}
              label="Assignee"
              value={
                <span className="text-sm">
                  {assignee ? assignee.name : "Unassigned"}
                </span>
              }
            />
            <DetailField
              icon={Calendar}
              label="Due Date"
              value={
                <span className="text-sm">
                  {task.due_date ? formatDate(task.due_date) : "Not set"}
                </span>
              }
            />
            <DetailField
              icon={Clock}
              label="Created"
              value={
                <span className="text-sm">
                  {formatDate(task.created_at)}
                </span>
              }
            />
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-end gap-2 px-6 py-4">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/5 hover:border-destructive/30"
            onClick={() => {
              onOpenChange(false);
              onDelete(task);
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => {
              onOpenChange(false);
              onEdit(task);
            }}
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailField({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div>{value}</div>
    </div>
  );
}
