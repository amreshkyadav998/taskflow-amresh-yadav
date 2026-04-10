import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TASK_STATUS_OPTIONS } from "@/lib/constants";
import type { TaskFilters as TaskFiltersType } from "@/types";
import type { User } from "@/types";

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onFiltersChange: (filters: TaskFiltersType) => void;
  users: User[];
}

export function TaskFilters({ filters, onFiltersChange, users }: TaskFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Select
        value={filters.status || "all"}
        onValueChange={(value) =>
          onFiltersChange({
            ...filters,
            status: value === "all" ? undefined : (value as TaskFiltersType["status"]),
          })
        }
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {TASK_STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.assignee || "all"}
        onValueChange={(value) =>
          onFiltersChange({
            ...filters,
            assignee: value === "all" ? undefined : value,
          })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All assignees" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All assignees</SelectItem>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
