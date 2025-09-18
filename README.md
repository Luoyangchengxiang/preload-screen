# preload-screen  

一个简单易用的**页面加载动画插件**，在 React / Vue / angular 原生项目中都能使用。

## ✨ 特性

 - 🚀 零依赖，直接引入即可使用
 - 🎨 可自定义文案、颜色
 - 🛡️ 最少显示时间，避免闪屏
 - 🔧 可作为独立插件封装发布

## 🔨 使用方法

  在入口文件中引入插件

  ```ts
    // main.ts / main.js / main.tsx / main.jsx

    import { StrictMode } from 'react'
    import { createRoot } from 'react-dom/client'
    import './index.css'
    import App from './App.tsx'
    import PreloadScreen from 'preload-screen';
    const loader = new PreloadScreen({text: '加载中...'});

    function awaitTimeout(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    }

    (async function () {
      await awaitTimeout(5000);
      createRoot(document.getElementById('root')!).render(
        <StrictMode>
          <App />
        </StrictMode>,
      )
      // 在createRoot后，手动移除 Loading
      loader.hide();
    })()
  ```

  引入后会自动插入一个全屏 Loading 动画。

  ---



## 📄 License

MIT © 2025
