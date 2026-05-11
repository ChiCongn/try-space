import type { DetailedHTMLProps, HTMLAttributes } from "react";

type ModelViewerElementAttributes = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  src?: string;
  poster?: string;
  alt?: string;
  ar?: boolean;
  "ar-modes"?: string;
  "ar-placement"?: "floor" | "wall";
  "ar-scale"?: "auto" | "fixed";
  "ar-usdz-max-texture-size"?: string;
  scale?: string;
  "camera-controls"?: boolean;
  "auto-rotate"?: boolean;
  "shadow-intensity"?: string;
  exposure?: string;
  "environment-image"?: string;
  "interaction-prompt"?: string;
  "touch-action"?: string;
  "camera-orbit"?: string;
  "field-of-view"?: string;
  "ios-src"?: string;
  loading?: "auto" | "lazy" | "eager";
  onLoad?: () => void;
  onError?: () => void;
  "quick-look-browsers"?: string;
  reveal?: "auto" | "interaction" | "manual";
  "xr-environment"?: boolean;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerElementAttributes;
    }
  }
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerElementAttributes;
    }
  }
}
