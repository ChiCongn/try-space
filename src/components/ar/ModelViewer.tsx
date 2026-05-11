import "@google/model-viewer";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

type MaterialModel = {
  materials?: Array<{
    pbrMetallicRoughness?: {
      setBaseColorFactor?: (color: [number, number, number, number]) => void;
    };
  }>;
};

export type ModelViewerDimensions = {
  x: number;
  y: number;
  z: number;
};

type ModelViewerDomElement = HTMLElement & {
  activateAR?: () => Promise<void>;
  canActivateAR?: boolean;
  dismissPoster?: () => void;
  getDimensions?: () => ModelViewerDimensions;
  model?: MaterialModel;
};

export type ModelViewerArStatus =
  | "failed"
  | "not-presenting"
  | "object-placed"
  | "session-started";

export type ModelViewerHandle = {
  canStartAR: () => boolean;
  getElement: () => ModelViewerDomElement | null;
  startAR: () => Promise<boolean>;
};

export type ModelViewerLoadStatus = "error" | "loading" | "ready";

type ModelViewerProps = {
  src: string;
  poster: string;
  alt: string;
  iosSrc?: string;
  onArAvailabilityChange?: (canActivateAR: boolean) => void;
  onArStatusChange?: (status: ModelViewerArStatus) => void;
  onModelDimensionsChange?: (dimensions: ModelViewerDimensions) => void;
  onLoadStatusChange?: (status: ModelViewerLoadStatus) => void;
  modelScale?: string;
  selectedColor: string;
};

function hexToRgba(hexColor: string): [number, number, number, number] {
  const cleanHex = hexColor.replace("#", "");
  const red = Number.parseInt(cleanHex.slice(0, 2), 16) / 255;
  const green = Number.parseInt(cleanHex.slice(2, 4), 16) / 255;
  const blue = Number.parseInt(cleanHex.slice(4, 6), 16) / 255;

  return [red, green, blue, 1];
}

function waitForEventOrTimeout(
  element: HTMLElement,
  eventName: string,
  timeoutMs: number,
) {
  return new Promise<void>((resolve) => {
    let settled = false;
    const timeout = window.setTimeout(finish, timeoutMs);

    function finish() {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      element.removeEventListener(eventName, finish);
      resolve();
    }

    element.addEventListener(eventName, finish, { once: true });
  });
}

export const ModelViewer = forwardRef<ModelViewerHandle, ModelViewerProps>(
  function ModelViewer(
    {
      src,
      poster,
      alt,
      iosSrc,
      modelScale = "1 1 1",
      onArAvailabilityChange,
      onArStatusChange,
      onModelDimensionsChange,
      onLoadStatusChange,
      selectedColor,
    },
    ref,
  ) {
    const viewerRef = useRef<ModelViewerDomElement | null>(null);
    const previousSrcRef = useRef(src);
    const [status, setStatus] = useState<"loading" | "ready" | "error">(
      "loading",
    );

    const syncAvailability = useCallback(() => {
      onArAvailabilityChange?.(Boolean(viewerRef.current?.canActivateAR));
    }, [onArAvailabilityChange]);

    function updateStatus(nextStatus: ModelViewerLoadStatus) {
      setStatus(nextStatus);
      onLoadStatusChange?.(nextStatus);
    }

    function handleLoad() {
      const viewer = viewerRef.current;
      updateStatus("ready");
      syncAvailability();

      const dimensions = viewer?.getDimensions?.();
      if (dimensions) {
        onModelDimensionsChange?.(dimensions);
      }
    }

    useImperativeHandle(ref, () => ({
      canStartAR() {
        return Boolean(
          viewerRef.current?.activateAR && viewerRef.current.canActivateAR,
        );
      },
      getElement() {
        return viewerRef.current;
      },
      async startAR() {
        const viewer = viewerRef.current;

        if (!viewer?.activateAR || status === "error") {
          return false;
        }

        viewer.dismissPoster?.();

        if (status === "loading") {
          await waitForEventOrTimeout(viewer, "load", 2200);
        }

        await new Promise<void>((resolve) => {
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => resolve());
          });
        });

        syncAvailability();

        if (!viewer.canActivateAR) {
          return false;
        }

        await viewer.activateAR();
        return true;
      },
    }));

    useEffect(() => {
      const viewer = viewerRef.current;

      if (!viewer) {
        return undefined;
      }

      function handleArStatus(event: Event) {
        const statusDetail = (event as CustomEvent<{ status: ModelViewerArStatus }>)
          .detail.status;
        onArStatusChange?.(statusDetail);
        syncAvailability();
      }

      viewer.addEventListener("ar-status", handleArStatus);
      viewer.addEventListener("load", syncAvailability);
      const timers = [0, 250, 750, 1500].map((delay) =>
        window.setTimeout(syncAvailability, delay),
      );

      return () => {
        timers.forEach((timer) => window.clearTimeout(timer));
        viewer.removeEventListener("ar-status", handleArStatus);
        viewer.removeEventListener("load", syncAvailability);
      };
    }, [onArStatusChange, syncAvailability]);

    useEffect(() => {
      if (previousSrcRef.current === src) {
        return;
      }

      previousSrcRef.current = src;
      setStatus("loading");
      onLoadStatusChange?.("loading");
      onArAvailabilityChange?.(false);
    }, [onArAvailabilityChange, onLoadStatusChange, src]);

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
          ar-modes="scene-viewer webxr quick-look"
          ar-placement="floor"
          ar-scale="fixed"
          ar-usdz-max-texture-size="1024"
          scale={modelScale}
          camera-controls
          auto-rotate
          shadow-intensity="0.85"
          exposure="0.9"
          environment-image="neutral"
          interaction-prompt="auto"
          touch-action="pan-y"
          camera-orbit="-35deg 68deg 2.6m"
          field-of-view="32deg"
          ios-src={iosSrc}
          loading="eager"
          quick-look-browsers="safari chrome"
          reveal="auto"
          xr-environment
          onLoad={handleLoad}
          onError={() => updateStatus("error")}
        >
          <button className="model-viewer-ar-button" slot="ar-button" type="button">
            Mở camera AR
          </button>
        </model-viewer>

        {/* {status === "loading" ? (
          <div className="viewer-state" role="status">
            Đang tải model 3D
          </div>
        ) : null} */}

        {status === "error" ? (
          <div className="viewer-state viewer-state-error" role="alert">
            Không tải được model. Kiểm tra kết nối mạng hoặc thử lại sau.
          </div>
        ) : null}
      </div>
    );
  },
);
