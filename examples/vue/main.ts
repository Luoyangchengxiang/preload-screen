/*
 * @Date: 2025-09-25 15:29:18
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-09-26 11:21:52
 * @FilePath: \sourceHTML\preload-screen\examples\vue\main.ts
 */
import { createApp } from "vue";
import App from "./App.vue";
// import "@chyk/preload-screen";
import { initPreloadScreen } from "@chyk/preload-screen";
// import "../../src/index";
// import { initPreloadScreen } from "../../src/index";
const loader = initPreloadScreen({
  mode: "manual",
  minShow: 300,
  fadeOut: 500,
  text: "Loading...",
  color: "#1890ff",
  animeStyle: '3dBox',
  debug: true,
})

// entryFileNames: `preload-screen.[format]-[hash].js`,
function awaitTimeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

(async function () {
  setTimeout(() => {
    // 手动触发beforeHide事件关闭Loading
    // window.dispatchEvent(new CustomEvent('app-ready'))
    // window.preloadHide();
    loader.hide();
  }, 5000);
  // await awaitTimeout(100000);
  const app = createApp(App);
  app.mount("#app");
})()
