import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

const baseUrl = "/CSE442-542/2024-Spring/cse-442l/";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename={baseUrl}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
