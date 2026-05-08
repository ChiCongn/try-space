import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Spinner } from "./Spinner";
import { cn } from "../../utils/cn";

type ButtonSize = "sm" | "md" | "lg";
type ButtonVariant = "ar" | "ghost" | "icon" | "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export function Button({
  children,
  className = "",
  disabled,
  isLoading = false,
  leftIcon,
  rightIcon,
  size = "md",
  variant = "secondary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn("ui-button", `ui-button-${variant}`, `ui-button-${size}`, className)}
      disabled={disabled || isLoading}
      type="button"
      {...props}
    >
      {isLoading ? <Spinner /> : leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}
