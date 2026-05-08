import { MonitorSmartphone } from "lucide-react";

interface ARFallbackProps {
  message: string;
}

export function ARFallback({ message }: ARFallbackProps) {
  return (
    <div className="ar-fallback" role="status">
      <MonitorSmartphone size={18} />
      <span>{message}</span>
    </div>
  );
}
