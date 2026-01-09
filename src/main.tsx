import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import "./index.css";
import App from "./App";
import { store } from "./redux/store";

// Initialize theme on app load
const initializeTheme = () => {
  const theme = localStorage.getItem("theme") || "dark";
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

initializeTheme();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <Toaster
        position="top-center"
        theme="dark"
        toastOptions={{
          style: {
            background: "rgba(15, 23, 42, 0.8)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(139, 92, 246, 0.3)",
            color: "white",
          },
        }}
      />
    </Provider>
  </StrictMode>
);
