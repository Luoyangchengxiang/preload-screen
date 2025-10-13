declare module '*.css' {
  // 对于“副作用导入”（仅引入 CSS 生效，不使用导出内容），空声明即可
  const content: any;
  export default content;
}