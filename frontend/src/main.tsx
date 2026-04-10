import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { useAuthStore } from "./stores/auth-store";
import "./index.css";

async function enableMocking() {
  const { worker } = await import("./mocks/browser");

  return worker.start({
    onUnhandledRequest: "bypass",
    serviceWorker: {
      url: "/mockServiceWorker.js",
    },
    findWorker(scriptURL) {
      return scriptURL.includes("mockServiceWorker");
    },
  });
}

async function bootstrap() {
  try {
    await enableMocking();
  } catch (err) {
    console.error("[MSW] Failed to start service worker:", err);
  }

  useAuthStore.getState().hydrate();

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

bootstrap();
