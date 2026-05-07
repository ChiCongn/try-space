import { useEffect, useState } from "react";

type NavigatorWithXR = Navigator & {
  xr?: {
    isSessionSupported: (mode: "immersive-ar") => Promise<boolean>;
  };
};

export function useARSupport() {
  const [supported, setSupported] = useState<boolean | null>(() =>
    "xr" in navigator ? null : false,
  );

  useEffect(() => {
    const navigatorWithXR = navigator as NavigatorWithXR;

    if (navigatorWithXR.xr) {
      navigatorWithXR.xr
        .isSessionSupported("immersive-ar")
        .then(setSupported)
        .catch(() => setSupported(false));
      return;
    }

    return undefined;
  }, []);

  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  return {
    arSupported: supported,
    isMobile,
    useDesktopViewer: !isMobile,
    useModelViewer: isMobile && supported === false,
  };
}
