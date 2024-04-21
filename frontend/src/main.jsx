import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

//DONT TOUCH THESE COMMENTS
// const baseUrl = "/CSE442-542/2024-Spring/cse-442l/";
// <BrowserRouter basename={baseUrl}>

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
