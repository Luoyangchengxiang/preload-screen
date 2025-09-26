#!/usr/bin/env node
import { execSync } from "child_process";
import { createInterface } from "readline/promises";
import { stdin as input, stdout as output } from "process";
import getLocalPluginInfo from "../utils/getLocalPluginInfo.js";
import updateVersionType from "../utils/updateVersionType.js";

const rl = createInterface({ input, output });

async function main() {
  const { packageName, packageLocalVersion } = getLocalPluginInfo();
  const localDefaultRegistryURL = "--registry=https://registry.npmjs.org";
  let versionType = updateVersionType(process.argv[2] || "z"); // 默认 patch
  console.log(`📦 当前提升版本类型: ${versionType}`);

  console.log(`🚀 开始发布 npm 插件，版本类型: ${versionType}`);

  // 0️⃣ 检查是否已登录 npm
  let pnpmWhoami = "";
  try {
    pnpmWhoami = execSync(`pnpm whoami ${localDefaultRegistryURL}`, { stdio: "pipe" }).toString().trim();
    console.log(`✅ 当前已登录 pnpm 用户: ${pnpmWhoami}， 登录地址: ${localDefaultRegistryURL}`);
  } catch {
    console.log("⚠️ 你还没有登录 pnpm，请先运行 pnpm login --registry=https://registry.npmjs.org");
    process.exit(1);
  }

  // 1️⃣ 获取线上最新版本
  let npmLatestVersion = execSync(`pnpm view ${packageName} version`, { stdio: "pipe" }).toString().trim();

  console.log(`📦 本地版本: ${packageLocalVersion}, 🌏 npm 版本: ${npmLatestVersion}`);

  // 2️⃣ 提示用户选择版本类型
  const promptMessage = `🎨 请选择发布类型 [x/y/z]（默认z: ${versionType}）: `;
  const answer = await rl.question(promptMessage);

  if (answer.trim()) {
    versionType = updateVersionType(answer.toString().toLowerCase().trim());
  }

  console.log(`📦 当前选择提升的版本类型: ${versionType}`);

  try {
    // 3️⃣ 更新版本号
    console.log(`🔄 正在更新版本号 🛴 ...`);
    execSync(`pnpm version ${versionType}`, { stdio: "inherit" });
    console.log(`👏 执行 pnpm version ${versionType} 更新版本号成功`);

    // 4️⃣ 构建项目
    console.log(`📦 正在构建项目 🛵 ...`);
    execSync("pnpm run build", { stdio: "inherit" });
    console.log(`🎂 执行 pnpm run build 打包构建成功`);

    // 5️⃣ 发布
    console.log(`🚄 正在发布插件 ${packageName} 到 npm 仓库 🚗 ...`);
    execSync(`pnpm publish --access public ${localDefaultRegistryURL}`, { stdio: "inherit" });
    console.log(`😎 执行 pnpm publish 发布到线上成功`);

    console.log("🎉 发布完成！");
  } catch (error) {
    console.error("❌ 发布失败:", err);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();
