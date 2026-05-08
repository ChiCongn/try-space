import type { ReactNode } from "react";

interface EmptyStateProps {
  action?: ReactNode;
  description: string;
  icon?: ReactNode;
  title: string;
}

export function EmptyState({ action, description, icon, title }: EmptyStateProps) {
  return (
    <div className="empty-panel page-empty">
      {icon}
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </div>
  );
}
