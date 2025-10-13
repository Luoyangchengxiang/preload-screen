/*
 * @Date: 2025-09-25 15:28:56
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-10-13 13:48:50
 * @FilePath: \preload-screen\examples\react\src\main.tsx
 */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// import "preload-screen";
import { initPreloadScreen } from "preload-screen";
const loader = initPreloadScreen({
  mode: "manual",
  elId: "root",
  minShow: 300,
  fadeOut: 500,
  // text: "Loading...",
  color: "#1890ff",
  debug: true,
});

(async function () {
  setTimeout(() => {
    // 3秒后触发 hide 事件关闭Loading
    loader.hide();
  }, 300000);
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

})()