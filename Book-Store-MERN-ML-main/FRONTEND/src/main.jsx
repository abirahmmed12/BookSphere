import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

import "./index.css";
import AuthProvider from "../vite-project/src/AuthProvider/AuthProvider";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <div className="dark:bg-slate-900 dark:text-white">
          <App />
        </div>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
