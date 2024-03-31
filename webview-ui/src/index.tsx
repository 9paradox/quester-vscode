import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import ApiTesterEditor from "./ApiTesterEditor";
import ApiTesterRunner from "./ApiTesterRunner";

const root = document.getElementById("root");
const uiMode = document.body.getAttribute("ui-mode");

if (uiMode === "runner") {
  ReactDOM.createRoot(root as HTMLElement).render(
    <React.StrictMode>
      <ApiTesterRunner />
    </React.StrictMode>
  );
} else {
  ReactDOM.createRoot(root as HTMLElement).render(
    <React.StrictMode>
      <ApiTesterEditor />
    </React.StrictMode>
  );
}
