/*
 * @Date: 2025-09-25 15:28:56
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-09-26 11:25:49
 * @FilePath: \sourceHTML\preload-screen\examples\react\main.tsx
 */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// import "@chyk/preload-screen";
import { initPreloadScreen } from "@chyk/preload-screen";
const loader = initPreloadScreen({
  mode: "manual",
  elId: "root",
  minShow: 300,
  fadeOut: 500,
  text: "Loading...",
  color: "#1890ff",
  debug: true,
})
function awaitTimeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

(async function () {
  setTimeout(() => {
    // 3秒后触发 hide 事件关闭Loading
    loader.hide();
  }, 3000);
  // await awaitTimeout(100000);
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
 
})()