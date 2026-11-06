import Link from "next/link";
import { FileText } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  icon: Icon = FileText,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <Icon className="w-12 h-12 text-muted mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-navy mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted mb-6">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn btn-primary btn-sm">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}