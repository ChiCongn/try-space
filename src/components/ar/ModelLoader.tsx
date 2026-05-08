import { Spinner } from "../ui";

interface ModelLoaderProps {
  label?: string;
}

export function ModelLoader({ label = "Đang tải model 3D" }: ModelLoaderProps) {
  return (
    <div className="model-loader" role="status">
      <Spinner />
      <span>{label}</span>
    </div>
  );
}
