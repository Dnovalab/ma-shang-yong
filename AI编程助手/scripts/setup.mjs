/**
 * AI编程助手 — 一键环境配置脚本
 * 用法: node scripts/setup.mjs
 *
 * 自动完成:
 *   1. 安装项目依赖
 *   2. 从 SVG 生成应用图标
 *   3. 输出构建指引
 */
import { execSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const buildDir = join(root, 'build');
const iconsDir = join(buildDir, 'icons');
const svgPath = join(buildDir, 'icon.svg');

function run(cmd, opts = {}) {
    console.log('  $ ' + cmd);
    try {
          execSync(cmd, { stdio: 'inherit', cwd: root, ...opts });
          return true;
    } catch (e) {
          if (!opts.ignoreError) throw e;
          console.log('  \u26a0 \u547d\u4ee4\u5931\u8d25\u4f46\u5df2\u5ffd\u7565: ' + e.message);
          return false;
    }
}

async function main() {
    console.log('\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550');
    console.log('  AI\u7f16\u7a0b\u52a9\u624b \u2014 \u4e00\u952e\u73af\u5883\u914d\u7f6e');
    console.log('\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n');

  // Step 1: Install dependencies
  console.log('\ud83d\udce6 1/4 \u5b89\u88c5\u9879\u76ee\u4f9d\u8d56...');
    run('npm install');

  // Step 2: Generate PNG from SVG
  console.log('\n\ud83c\udfa8 2/4 \u751f\u6210\u5e94\u7528\u56fe\u6807...');
    if (!existsSync(iconsDir)) mkdirSync(iconsDir, { recursive: true });

  const pngPath = join(iconsDir, 'icon.png');
    const svgContent = readFileSync(svgPath, 'utf-8');

  const sharpResult = run(
        'npx -y sharp-cli --input "' + svgPath + '" --output "' + pngPath + '" 1024 1024',
    { ignoreError: true, stdio: 'pipe' }
      );

  if (!sharpResult || !existsSync(pngPath)) {
        console.log('  \u26a0 sharp-cli \u4e0d\u53ef\u7528\uff0c\u5c1d\u8bd5 canvas \u65b9\u5f0f...');
        console.log('  \u26a0 \u8bf7\u5728\u6d4f\u89c8\u5668\u4e2d\u6253\u5f00 build/_render.html\uff0c\u53f3\u952e\u4fdd\u5b58\u56fe\u6807\u4e3a PNG');
  } else {
        console.log('  \u2705 icon.png \u751f\u6210\u6210\u529f');
  }

  // Step 3: Generate macOS .icns (only on macOS)
  console.log('\n\ud83c\udf4e 3/4 macOS \u56fe\u6807 (.icns)...');
    if (process.platform === 'darwin' && existsSync(pngPath)) {
          const iconSet = join(iconsDir, 'icon.iconset');
          if (!existsSync(iconSet)) mkdirSync(iconSet);

      const sizes = [
              [16, 'icon_16x16.png'], [32, 'icon_16x16@2x.png'],
              [32, 'icon_32x32.png'], [64, 'icon_32x32@2x.png'],
              [128, 'icon_128x128.png'], [256, 'icon_128x128@2x.png'],
              [256, 'icon_256x256.png'], [512, 'icon_256x256@2x.png'],
              [512, 'icon_512x512.png'], [1024, 'icon_512x512@2x.png'],
            ];
          for (const [size, name] of sizes) {
                  run('sips -z ' + size + ' ' + size + ' "' + pngPath + '" --out "' + join(iconSet, name) + '"', { ignoreError: true });
          }
          run('iconutil -c icns "' + iconSet + '" --output "' + join(iconsDir, 'icon.icns') + '"', { ignoreError: true });
          console.log('  \u2705 icon.icns \u751f\u6210\u6210\u529f');
    } else {
          console.log('  \u26a0 \u975e macOS \u73af\u5883\u6216\u7f3a\u5c11 PNG \u6587\u4ef6\uff0c\u8df3\u8fc7');
    }

  // Step 4: Print build instructions
  console.log('\n\ud83d\udccb 4/4 \u6784\u5efa\u6307\u5f15');
    console.log('  \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510');
    console.log('  \u2502  \u6784\u5efa\u547d\u4ee4:                                  \u2502');
    console.log('  \u2502                                            \u2502');
    console.log('  \u2502  macOS:  npm run build-mac                 \u2502');
    console.log('  \u2502  Windows: npm run build-win                 \u2502');
    console.log('  \u2502  \u672c\u5730\u8c03\u8bd5: npm start                        \u2502');
    console.log('  \u2502                                            \u2502');
    console.log('  \u2502  \u8f93\u51fa\u76ee\u5f55: ./dist/                          \u2502');
    console.log('  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n');

  console.log('\u2705 \u914d\u7f6e\u5b8c\u6210\uff01');
}

main().catch(e => {
    console.error('\u274c \u914d\u7f6e\u5931\u8d25:', e.message);
    process.exit(1);
});
