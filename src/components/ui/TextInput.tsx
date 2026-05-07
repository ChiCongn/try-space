import type { InputHTMLAttributes } from "react";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function TextInput({ className = "", label, ...props }: TextInputProps) {
  return (
    <label className={`ui-field ${className}`.trim()}>
      <span>{label}</span>
      <input {...props} />
    </label>
  );
}
