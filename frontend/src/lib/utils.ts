import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, isValid } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const date = parseISO(dateStr);
  if (!isValid(date)) return "—";
  return format(date, "MMM d, yyyy");
}

export function formatDateTime(dateStr: string): string {
  const date = parseISO(dateStr);
  if (!isValid(date)) return "—";
  return format(date, "MMM d, yyyy 'at' h:mm a");
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
