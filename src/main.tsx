import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import "./index.css";
import "./App.css";
import { ErrorBoundary } from "./components/ui";
import { router } from "./router";
import { useAuthStore } from "./store/authStore";
import { initBrowserLogging, logger } from "./utils/logger";

initBrowserLogging();
void useAuthStore.getState().initialize();

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js").catch((error) => {
      logger.warn("service_worker.registration_failed", undefined, error);
    });
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
    <Toaster closeButton position="top-right" richColors />
  </StrictMode>,
);
