import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

import "antd/dist/reset.css";
import "./index.css";

// 💡 Cấu hình màu chủ đạo trước khi render app
document.documentElement.style.setProperty("--primary-color", "#ffb547");
document.documentElement.style.setProperty("--primary-color-hover", "#ffc066");
document.documentElement.style.setProperty("--primary-color-active", "#e6a33d");
document.documentElement.style.setProperty(
  "--primary-color-shadow",
  "rgba(255, 181, 71, 0.25)"
);

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <App />
  // </StrictMode>
);
