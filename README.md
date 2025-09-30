# preload-screen  

一个极简单易用的 **页面加载动画插件** ，在 React / Vue 原生项目中使用。  
支持 **自动模式** （在 *监听该元素内是否挂载子元素后* 自动消失）和 **手动模式** （自行控制消失时机）。

## ✨ 特性

 - 🚀 零依赖，直接引入即可使用
 - 🎨 可自定义文案、颜色
 - ⚙️ 可配置动画类型
 - ⚡ 支持自动模式 / 手动模式
 - 🛡️ 最少显示时间，避免闪屏
 - 🔧 可作为独立插件封装发布

## 📦 安装

```bash
npm install preload-screen --save
```
```或```
```bash
yarn add preload-screen
```
```或```
```bash
pnpm add preload-screen
```

## 🔨 使用方法

### 1. 在入口文件中引入插件  
  ```ts
    // main.ts / main.js / main.tsx / main.jsx

    import { initPreloadScreen } from "preload-screen"; 
    const loader = initPreloadScreen({
      mode: "auto",
      minShow: 300,
      fadeOut: 500,
      text: "Loading...",
      color: "#1890ff",
      animeStyle: '3dBox',
      debug: true,
    })
  ```

  引入后会自动插入一个全屏 Loading 动画。

  ---

### 2. 模式选择  

  **手动模式 (推荐)**  

  适合 React / Vue 等框架，需要等待应用挂载完成后再移除 Loading。
  ```ts
  import { initPreloadScreen } from "preload-screen"; 
  const loader = initPreloadScreen({
    // ...配置项...
  });

  // 手动关闭加载方式
  loader.hide();
  ```
  在应用完成初始化后手动触发：
  ```ts
    // main.ts (React 示例)

    import { StrictMode } from 'react'
    import { createRoot } from 'react-dom/client'
    import './index.css'
    import App from './App.tsx'
    // 以上引入皆为React示例项目，与插件无关
  
    import { initPreloadScreen } from "preload-screen"; 
    const loader = initPreloadScreen({
      mode: "manual",
      text: "Loading...",
      color: "#1890ff",
    });

    (async function () {
      setTimeout(() => {
        // 手动触发 hide 事件关闭Loading,
        loader.hide();
      }, 5000);
      createRoot(document.getElementById('root')!).render(
        <StrictMode>
          <App />
        </StrictMode>,
      )
    })()
  ```

  **自动模式 (默认)**

  需传入<span style="font-weight:600;color:rgb(253, 0, 0); background-color:rgb(77, 77, 77);padding:0 3px;margin:0 3px;border-radius:3px;">elId</span> 配置项，即承载框架渲染内容的根节点元素的 ```id``` 值，通过 ```mutationObserver``` 监听该元素内是否挂载子元素，当监听到有实际内容后自动关闭 Loading。

  若不传入```elId``` 时，首先会检测是否存在 ```#root(React)``` ```#app(Vue)```,若不存在，将会使用 ```document.body``` 监听。
  
  ```ts
  // main.ts (React 示例)
  import "preload-screen";
  ```

## ⚙️ 配置项
   | 参数                | 类型                         | 默认值           | 说明                                                    |
   | ------------------- | ---------------------------- | ---------------- | ------------------------------------------------------- |
   | ```elId```          | ```string```                 | -                | 承载框架渲染内容的根节点元素的 id 值                    |
   | ```mode```          | ```string```                 | ```auto```       | 模式选择，可选值：```auto``` / ```manual```             |
   | ```text```          | ```string```                 | ```Loading...``` | Loading 文案                                            |
   | ```color```         | ```string```                 | ```#1890ff```    | 环形加载动画的边框颜色                                  |
   | ```minShow```       | ```number```                 | ```300```        | 最少显示时间 (ms)，避免闪屏                             |
   | ```fadeOut```       | ```number```                 | ```500```        | Loading 消失动画时长 (ms)                               |
   | ```animeStyle```    | ```string```                 | ```spin```       | 动画样式，可选值 ```spin``` / ```3dBox``` / ```petal``` |
   | ```maxAttempts```   | ```number```                 | ```100```        | 查找根节点元素时最大尝试次数，避免死循环                |
   | ```checkInterval``` | ```number```                 | ```50```         | 尝试查找根节点元素时间隔时间 (ms)                       |
   | ```logo```          | ```string```                 | -                | logo 图片路径                                           |
   | ```logoConfig```    | ```object``` 或 ```string``` | -                | 下方 logo 配置项                                        |
  ------------------------------------------------------------------------------------------------------------------------------------
  **logo 配置项：**  
  | logoConfig 配置项         | 类型          | 默认值        | 说明                                         |
  | ------------------------- | ------------- | ------------- | -------------------------------------------- |
  | ```logoConfig```          | ```string```  | -             | 可直接以logoConfig为属性，传入图片路径       |
  | ```width```               | ```number```  | ```100```     | 图片宽度                                     |
  | ```height```              | ```number```  | ```100```     | 图片高度                                     |
  | ```rounded```             | ```number```  | ```0```       | 图片圆角                                     |
  | ```progress```            | ```object```  | -             | 进度条配置项                                 |
  | ```progress.mode```       | ```string```  | ```default``` | 进度条模式，可选值 ```bar``` / ```rainbow``` |
  | ```progress.stroke```     | ```number```  | ```4```       | 进度条宽度                                   |
  | ```progress.color```      | ```string```  | ```#1890ff``` | 进度条颜色                                   |
  | ```progress.isShowText``` | ```boolean``` | ```false```   | 是否展示进度数值                             |
  | ```progress.textColor```  | ```string```  | ```#666```    | 进度数值颜色                                 |
  | ```progress.textSize```   | ```number```  | ```14```      | 进度数值文字大小                             |
  ------------------------------------------------------------------------------------------------------------------------------------


## 🖐 手动 API
  即使在 ```manual``` 模式之外，也可以随时手动触发：
  ```ts
    // 1.使用window上挂载的关闭事件，立即移除预加载动画
    window.dispatchEvent(new CustomEvent('app-ready'));
    window.preloadHide();
  ```
  

## 📄 License

[MIT © 2025](https://github.com/Luoyangchengxiang/preload-screen?tab=MIT-1-ov-file#)

## v1.0.3 - 2025-09-28 更新日志

### ✨ Added 新增功能 
  新增 ```logoConfig``` 配置项，展示为：图片+进度条样式  
  可传入图片路径，以自己项目 logo 为 Loading 文案
  支持配置图片、图片大小、是否圆角、进度条展示、进度条颜色、进度数值展示、进度数值颜色、进度数值字体大小
****
  新增 ```progress.mode``` 配置项，展示为：进度条样式
  可选择 ```default``` / ```bar``` / ```rainbow``` 三种模式，默认为 ```default```