import { dirname, join } from "node:path";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
// 1. 造出 __dirname
const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

// 2. 读文件
const pkg = JSON.parse(
  readFileSync(join(__dirname, '../../package.json'), 'utf-8')
);
export default function getLocalPluginInfo() {
  return { packageName: pkg.name, packageLocalVersion: pkg.version };
}
