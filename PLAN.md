# preload-screen  

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

### 后续功能 
#### v1.0.3 2025-09-26 更新计划  
- [X] 添加支持配置图片，以自己项目 logo 为 Loading 文案
- [X] 添加加载进度
#### v1.1.0 2025-09-27 
- [X] 更改默认模式为自动模式
- [X] 添加自动感知挂载根元素[ ```#app``` , ```#root``` ]
#### v1.1.0 2025-09-28
- [X] 添加 ```logoConfig``` 配置项，展示为：图片+进度条
#### v1.1.0 2025-09-29
- [X] 分离 ```logoConfig``` 配置项中 ```src``` 为单独的 ```logo``` 配置项，配置为图片路径，以自己项目 logo 为 Loading 展示
- [X] ```logoConfig``` 中添加 ```progress.mode``` 配置项，展示为：进度条样式
- [X] ```logoConfig``` 中添加 ```progress.stroke``` 配置项，展示为：进度条宽度
- [X] 新增 ```LogoManager``` 组件，用来管理 ```logo``` 的展示与样式

### 后续优化

  - 监听依赖项引入进度以及简略内容
  - 扩展多项logo或progress样式类

