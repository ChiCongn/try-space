import { ScanLine } from "lucide-react";

export function PlaneDetector() {
  return (
    <div className="plane-detector" aria-hidden>
      <ScanLine size={16} />
      <span>Quét mặt sàn chậm</span>
    </div>
  );
}
