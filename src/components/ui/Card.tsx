import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

export function Card({ children, className, ...props }: CardProps) {
  return (
    <article className={cn("ui-card", className)} {...props}>
      {children}
    </article>
  );
}
