import "@google/model-viewer";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

type MaterialModel = {
  materials?: Array<{
    pbrMetallicRoughness?: {
      setBaseColorFactor?: (color: [number, number, number, number]) => void;
    };
  }>;
};

type ModelViewerDomElement = HTMLElement & {
  activateAR?: () => Promise<void>;
  model?: MaterialModel;
  dismissPoster?: () => void;
};

export type ModelViewerHandle = {
  startAR: () => Promise<boolean>;
};

type ModelViewerProps = {
  src: string;
  poster: string;
  alt: string;
  selectedColor: string;
};

function hexToRgba(hexColor: string): [number, number, number, number] {
  const cleanHex = hexColor.replace("#", "");
  const red = Number.parseInt(cleanHex.slice(0, 2), 16) / 255;
  const green = Number.parseInt(cleanHex.slice(2, 4), 16) / 255;
  const blue = Number.parseInt(cleanHex.slice(4, 6), 16) / 255;

  return [red, green, blue, 1];
}

export const ModelViewer = forwardRef<ModelViewerHandle, ModelViewerProps>(
  function ModelViewer({ src, poster, alt, selectedColor }, ref) {
  const viewerRef = useRef<ModelViewerDomElement | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useImperativeHandle(ref, () => ({
    async startAR() {
      if (!viewerRef.current?.activateAR) {
        return false;
      }

      await viewerRef.current.activateAR();
      return true;
    },
  }));

  useEffect(() => {
    const viewer = viewerRef.current;

    if (!viewer?.model?.materials?.length) {
      return;
    }

    const [firstMaterial] = viewer.model.materials;
    firstMaterial.pbrMetallicRoughness?.setBaseColorFactor?.(
      hexToRgba(selectedColor),
    );
  }, [selectedColor, status]);

  return (
    <div className="model-viewer-frame" data-status={status}>
      <model-viewer
        ref={viewerRef}
        src={src}
        poster={poster}
        alt={alt}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        shadow-intensity="0.85"
        exposure="0.9"
        environment-image="neutral"
        interaction-prompt="auto"
        touch-action="pan-y"
        camera-orbit="-35deg 68deg 2.6m"
        field-of-view="32deg"
        loading="eager"
        reveal="auto"
        onLoad={() => setStatus("ready")}
        onError={() => setStatus("error")}
      />

      {status === "loading" ? (
        <div className="viewer-state" role="status">
          Đang tải model 3D
        </div>
      ) : null}

      {status === "error" ? (
        <div className="viewer-state viewer-state-error" role="alert">
          Không tải được model. Kiểm tra kết nối mạng hoặc thử lại sau.
        </div>
      ) : null}
    </div>
  );
});
