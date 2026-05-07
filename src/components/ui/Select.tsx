import type { ReactNode, SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  children: ReactNode;
  label: string;
};

export function Select({
  children,
  className = "",
  label,
  ...props
}: SelectProps) {
  return (
    <label className={`ui-field ${className}`.trim()}>
      <span>{label}</span>
      <select {...props}>{children}</select>
    </label>
  );
}
