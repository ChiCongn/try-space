import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  tone?: "default" | "success" | "warning" | "danger";
};

export function Badge({ children, className, tone = "default", ...props }: BadgeProps) {
  return (
    <span className={cn("ui-badge", `ui-badge--${tone}`, className)} {...props}>
      {children}
    </span>
  );
}
