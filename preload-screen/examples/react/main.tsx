/*
 * @Date: 2025-09-25 15:28:56
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-09-25 16:50:45
 * @FilePath: \sourceHTML\preload-screen\examples\react\main.tsx
 */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// import "@chyk/preload-screen";
// import { initPreloadScreen } from "@chyk/preload-screen";
import "../../src/index";
// import { initPreloadScreen } from "../../src/index";
function awaitTimeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

(async function () {
  await awaitTimeout(100000);
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  // 手动触发beforeHide事件关闭Loading
  // loader.beforeHide();
})()