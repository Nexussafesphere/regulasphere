import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "N/A";

  const d = typeof date === "string" ? new Date(date) : date;

  if (isNaN(d.getTime())) return "N/A";

  return d.toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(
  date: string | Date | null | undefined
): string {
  if (!date) return "N/A";

  const d = typeof date === "string" ? new Date(date) : date;

  if (isNaN(d.getTime())) return "N/A";

  return d.toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-NG").format(num);
}

export function calculateDaysUntil(date: string | Date): number {
  const target = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  const diffMs = target.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function calculateDaysOverdue(date: string | Date): number {
  const daysUntil = calculateDaysUntil(date);
  return daysUntil < 0 ? Math.abs(daysUntil) : 0;
}

export function isOverdue(date: string | Date): boolean {
  return calculateDaysUntil(date) < 0;
}

export function isDueSoon(date: string | Date, thresholdDays: number = 30): boolean {
  const days = calculateDaysUntil(date);
  return days >= 0 && days <= thresholdDays;
}

export function formatDeadline(date: string | Date): string {
  const days = calculateDaysUntil(date);

  if (days < 0) {
    return `${Math.abs(days)} days overdue`;
  }

  if (days === 0) {
    return "Due today";
  }

  if (days === 1) {
    return "Due tomorrow";
  }

  return `${days} days remaining`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateReference(prefix: string): string {
  const timestamp = new Date().getTime().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

export function getComplianceScoreColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-amber-500";
  if (score >= 40) return "text-orange-500";
  return "text-red-500";
}

export function getComplianceScoreBadge(score: number): string {
  if (score >= 80) return "badge badge-gold";
  if (score >= 60) return "badge badge-outline";
  return "badge badge-silver";
}

export function getPriorityBadge(priority: string | undefined): string {
  switch (priority) {
    case "Critical":
      return "badge badge-gold";
    case "High":
      return "badge badge-outline";
    case "Medium":
      return "badge badge-silver";
    case "Low":
      return "badge badge-silver";
    default:
      return "badge badge-silver";
  }
}

export function getStatusBadge(status: string): string {
  switch (status) {
    case "Completed":
      return "badge badge-gold";
    case "Verified":
      return "badge badge-gold";
    case "In Progress":
      return "badge badge-outline";
    case "Pending":
      return "badge badge-silver";
    case "Overdue":
      return "badge badge-silver";
    case "Rejected":
      return "badge badge-silver";
    case "Needs Review":
      return "badge badge-outline";
    case "Under Review":
      return "badge badge-outline";
    default:
      return "badge badge-silver";
  }
}

export function groupBy<T>(
  array: T[],
  keyFn: (item: T) => string
): Record<string, T[]> {
  return array.reduce(
    (acc, item) => {
      const key = keyFn(item);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    },
    {} as Record<string, T[]>
  );
}

export function sortByDate<T>(
  array: T[],
  dateFn: (item: T) => string | Date | null | undefined,
  ascending: boolean = true
): T[] {
  return [...array].sort((a, b) => {
    const dateA = dateFn(a);
    const dateB = dateFn(b);

    if (!dateA && !dateB) return 0;
    if (!dateA) return ascending ? 1 : -1;
    if (!dateB) return ascending ? -1 : 1;

    const timeA = new Date(dateA).getTime();
    const timeB = new Date(dateB).getTime();

    return ascending ? timeA - timeB : timeB - timeA;
  });
}

export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
      timeout = null;
    }, wait);
  };
}

export function generateId(prefix: string = "id"): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}_${timestamp}_${random}`;
}