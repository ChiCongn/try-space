export function isModelViewerSupported() {
  return typeof customElements !== "undefined";
}

export function canUseQuickLook() {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export function canUseSceneViewer() {
  if (typeof navigator === "undefined") return false;
  return /Android/.test(navigator.userAgent);
}

export async function canUseWebXR() {
  if (typeof navigator === "undefined" || !("xr" in navigator)) return false;
  const xr = navigator.xr as { isSessionSupported?: (mode: string) => Promise<boolean> };
  return Boolean(await xr.isSessionSupported?.("immersive-ar").catch(() => false));
}

export async function captureARScreenshot(element: HTMLElement | null) {
  if (!element) return null;
  const canvas = element.shadowRoot?.querySelector("canvas");
  if (!(canvas instanceof HTMLCanvasElement)) return null;
  try {
    return canvas.toDataURL("image/png");
  } catch {
    return null;
  }
}
