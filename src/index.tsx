import React from "react";
import { HashRouter } from "react-router-dom";
import ReactDom from "react-dom/client";
import App from "./App";
import "./styles/main.scss";

const container = document.getElementById("root")!;
const core = ReactDom.createRoot(container);
core.render(
  <HashRouter>
    <App />
  </HashRouter>
);
