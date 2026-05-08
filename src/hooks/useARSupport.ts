import { useEffect, useState } from "react";

type NavigatorWithXR = Navigator & {
  xr?: {
    isSessionSupported: (mode: "immersive-ar") => Promise<boolean>;
  };
};

function getUserAgent() {
  if (typeof navigator === "undefined") return "";
  return navigator.userAgent;
}

export function useARSupport() {
  const userAgent = getUserAgent();
  const isAndroid = /Android/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(userAgent);
  const sceneViewer = isAndroid;
  const quickLook = isIOS;

  const [webXR, setWebXR] = useState<boolean | null>(() =>
    typeof navigator !== "undefined" && "xr" in navigator ? null : false,
  );

  useEffect(() => {
    const navigatorWithXR = navigator as NavigatorWithXR;

    if (navigatorWithXR.xr) {
      navigatorWithXR.xr
        .isSessionSupported("immersive-ar")
        .then(setWebXR)
        .catch(() => setWebXR(false));
      return;
    }

    return undefined;
  }, []);

  const any = Boolean(webXR || sceneViewer || quickLook);

  return {
    any,
    arSupported: any,
    isAndroid,
    isIOS,
    isMobile,
    quickLook,
    sceneViewer,
    useDesktopViewer: !isMobile || !any,
    useModelViewer: isMobile,
    webXR,
  };
}
