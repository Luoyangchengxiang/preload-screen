/*
 * @Date: 2025-09-25 15:29:18
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-10-13 13:49:20
 * @FilePath: \preload-screen\examples\vue\src\main.ts
 */
import { createApp } from "vue";
import App from "./App.vue";
import "preload-screen";
// import { initPreloadScreen } from "preload-screen";
// const loader = initPreloadScreen({
//   mode: "manual",
//   minShow: 300,
//   fadeOut: 500,
//   text: "Loading...",
//   color: "#FF0011",
//   // animeStyle: '3dBox',
//   // debug: true,
//   logo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
//     <circle cx="50" cy="50" r="40" />
//   </svg>`,
//   logoConfig: {
//     mode: 'svg',
//     color: '#FF0',
//     anime: 'asymptotic',
//     width: '150px',
//     height: 150,
//     rounded: 5,
//     progress: {
//       stroke: 4,
//       isShowText: false,
//       // color: "#FF0",
//       textColor: '#999999',
//       textSize: 12,
//     }
//   }
// })

// entryFileNames: `preload-screen.[format]-[hash].js`,
function awaitTimeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

(async function () {
  setTimeout(() => {
    // 手动触发beforeHide事件关闭Loading
    // window.dispatchEvent(new CustomEvent('app-ready'))
    // window.preloadHide();
    // loader.hide();
  }, 500000);
  // await awaitTimeout(100000);
  const app = createApp(App);
  app.mount("#app");
})()
