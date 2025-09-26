# preload-screen  

一个简单易用的**页面加载动画插件**，在 React 原生项目中使用。  
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

    import "preload-screen"; 

  ```

  引入后会自动插入一个全屏 Loading 动画。

  ---

### 2. 模式选择  

  **手动模式 (推荐)**  

  适合 React / Vue 等框架，需要等待应用挂载完成后再移除 Loading。
  ```ts
  import { initPreloadScreen } from "preload-screen"; 
  const loader = initPreloadScreen({
      mode: "auto",
      minShow: 300,
      fadeOut: 500,
      text: "Loading...",
      color: "#1890ff",
      animeStyle: '3dBox',
      debug: true,
  });

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
      text: "Loading...",
      color: "#1890ff",
    });

    function awaitTimeout(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    }

    (async function () {
      setTimeout(() => {
        // 手动关闭加载方式
        // 1.使用window上挂载的关闭事件
        window.dispatchEvent(new CustomEvent('app-ready'));
        window.preloadHide();
        // 2.手动触发 hide 事件关闭Loading
        loader.hide();
      }, 5000);
      await awaitTimeout(100000);
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
  // 不需要配置任何内容，引入即可使用
  import "preload-screen";

  ```

## ⚙️ 配置项
   | 参数             | 类型         | 默认值           | 说明                                                    |
   | ---------------- | ------------ | ---------------- | ------------------------------------------------------- |
   | ```elId```       | ```string``` | -                | 承载框架渲染内容的根节点元素的 id 值                    |
   | ```mode```       | ```string``` | ```auto```       | 模式选择，可选值：```auto``` / ```manual```             |
   | ```text```       | ```string``` | ```Loading...``` | Loading 文案                                            |
   | ```color```      | ```string``` | ```#1890ff```    | 环形加载动画的边框颜色                                  |
   | ```minShow```    | ```number``` | ```300```        | 最少显示时间 (ms)，避免闪屏                             |
   | ```fadeOut```    | ```number``` | ```500```        | Loading 消失动画时长 (ms)                               |
   | ```animeStyle``` | ```string``` | ```spin```       | 动画样式，可选值 ```spin``` / ```3dBox``` / ```petal``` |
  --------

## 🖐 手动 API
  即使在 ```manual``` 模式之外，也可以随时手动触发：
  ```ts
    // 立即移除预加载动画
    window.dispatchEvent(new CustomEvent('app-ready'));
    window.preloadHide();
  ```
  

## 📄 License

[MIT © 2025](https://github.com/Luoyangchengxiang/preload-screen?tab=MIT-1-ov-file#)

## v1.0.3 - 2025-09-26 更新日志

### ✨ Added 新增功能
  添加 ```animeStyle``` 参数，可选值 ```spin``` / ```3dBox``` / ```petal```  
  默认使用 ```spin``` 旋转动画  
  新增花瓣旋转动画组件 `Flower` ，动画配置选择 ```petal```  
  新增3D立方体旋转动画组件 `3dBoxSpin` ,动画配置选择 ```3dBox```

### 🚀 优化
  - 调整内容架构
  - 添加examples示例文件夹
    - 添加React示例
    - 添加Vue示例

### 后续功能（待开发）

- [ ] 添加支持配置图片，以自己项目 logo 为 Loading 文案
- [ ] 添加加载进度


### 后续优化

  - 监听依赖项引入进度以及简略内容

