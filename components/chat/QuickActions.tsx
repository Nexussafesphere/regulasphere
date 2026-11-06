"use client";

interface QuickActionsProps {
  actions: string[];
  onActionClick: (action: string) => void;
  disabled?: boolean;
}

export default function QuickActions({
  actions,
  onActionClick,
  disabled = false,
}: QuickActionsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {actions.map((action) => (
        <button
          key={action}
          onClick={() => onActionClick(action)}
          disabled={disabled}
          className="btn btn-secondary btn-sm"
        >
          {action}
        </button>
      ))}
    </div>
  );
}