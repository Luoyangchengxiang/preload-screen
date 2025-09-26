/*
 * @Date: 2025-09-26 11:43:52
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-09-26 12:01:23
 * @FilePath: \sourceHTML\preload-screen\build\scripts\release.js
 */
#!/usr/bin/env node
const { execSync } = require("child_process");

const versionType = process.argv[2] || "patch"; // 默认 patch
console.log(`🚀 开始发布 pnpm 插件，版本类型: ${versionType}`);

try {
  // 0️⃣ 检查是否已登录 pnpm
  let pnpmWhoami = "";
  try {
    pnpmWhoami = execSync("pnpm whoami", { stdio: "pipe" }).toString().trim();
  } catch {
    console.log("⚠️ 你还没有登录 pnpm，请先运行 pnpm login");
    process.exit(1);
  }
  console.log(`✅ 当前已登录 pnpm 用户: ${pnpmWhoami}`);

  // 1️⃣ 更新版本号
  execSync(`pnpm version ${versionType}`, { stdio: "inherit" });

  // 2️⃣ 构建项目
  execSync("pnpm run build", { stdio: "inherit" });

  // 3️⃣ 发布到 pnpm
  execSync("pnpm publish --access public", { stdio: "inherit" });

  console.log("🎉 发布完成！");
} catch (err) {
  console.error("❌ 发布失败:", err);
  process.exit(1);
}
