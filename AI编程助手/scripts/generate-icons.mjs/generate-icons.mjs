/**
 * AI编程助手 — 图标生成脚本
 * 用法: node scripts/generate-icons.mjs
 *
 * 从 build/icon.svg 生成各平台所需图标文件:
 *   - build/icons/icon.png       (1024x1024, 主用)
 *   - build/icons/icon.icns      (macOS)
 *   - build/icons/icon.ico       (Windows)
 */
import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const buildDir = join(projectRoot, 'build');
const iconsDir = join(buildDir, 'icons');
const svgPath = join(buildDir, 'icon.svg');
const pngPath = join(iconsDir, 'icon.png');

if (!existsSync(iconsDir)) mkdirSync(iconsDir, { recursive: true });

async function main() {
    console.log('Generating app icons...\n');

  // Step 1: SVG to PNG
  console.log('1/3 Render SVG to PNG...');
    try {
          const svgContent = readFileSync(svgPath, 'utf-8');
          const svgBase64 = Buffer.from(svgContent).toString('base64');
          const htmlPath = join(projectRoot, 'scripts', '_render-icon.html');
          writeFileSync(htmlPath, '<!DOCTYPE html>\n<html><body>\n<canvas id="c" width="1024" height="1024"></canvas>\n<script>\nconst canvas = document.getElementById(\'c\');\nconst ctx = canvas.getContext(\'2d\');\nconst img = new Image();\nimg.onload = () => {\n  ctx.drawImage(img, 0, 0, 1024, 1024);\n  const link = document.createElement(\'a\');\n  link.download = \'icon.png\';\n  link.href = canvas.toDataURL(\'image/png\');\n  document.body.appendChild(link);\n  link.click();\n};\nimg.src = \'data:image/svg+xml;base64,' + svgBase64 + '\';\n</script>\n</body></html>');
          console.log('   HTML ready at scripts/_render-icon.html');
          console.log('   Or run: npx -y sharp-cli --input "' + svgPath + '" --output "' + pngPath + '" 1024 1024');
    } catch (e) {
          console.error('  SVG render failed:', e.message);
          process.exit(1);
    }

  // Step 2: Generate macOS .icns
  console.log('\n2/3 Generate .icns (macOS)...');
    try {
          const iconSetPath = join(iconsDir, 'icon.iconset');
          if (!existsSync(iconSetPath)) mkdirSync(iconSetPath);
          if (existsSync(pngPath)) {
                  const sizes = [
                    { size: 16, name: 'icon_16x16.png' },
                    { size: 32, name: 'icon_16x16@2x.png' },
                    { size: 32, name: 'icon_32x32.png' },
                    { size: 64, name: 'icon_32x32@2x.png' },
                    { size: 128, name: 'icon_128x128.png' },
                    { size: 256, name: 'icon_128x128@2x.png' },
                    { size: 256, name: 'icon_256x256.png' },
                    { size: 512, name: 'icon_256x256@2x.png' },
                    { size: 512, name: 'icon_512x512.png' },
                    { size: 1024, name: 'icon_512x512@2x.png' },
                          ];
                  for (const { size, name } of sizes) {
                            execSync('sips -z ' + size + ' ' + size + ' "' + pngPath + '" --out "' + join(iconSetPath, name) + '"', { stdio: 'ignore' });
                  }
                  execSync('iconutil -c icns "' + iconSetPath + '" --output "' + join(iconsDir, 'icon.icns') + '"', { stdio: 'ignore' });
                  console.log('  icon.icns generated');
          } else {
                  console.log('  Skip: PNG file required first');
          }
    } catch (e) {
          console.log('  macOS icon generation skipped (non-macOS or missing sips/iconutil)');
    }

  // Step 3: Generate Windows .ico
  console.log('\n3/3 Generate .ico (Windows)...');
    try {
          if (existsSync(pngPath)) {
                  execSync('npx -y png-to-ico "' + pngPath + '" > "' + join(iconsDir, 'icon.ico') + '"', { stdio: 'ignore' });
                  console.log('  icon.ico generated');
          } else {
                  console.log('  Skip: PNG file required first');
          }
    } catch (e) {
          console.log('  Windows icon generation skipped: ' + e.message);
    }

  console.log('\nIcons generated!');
    console.log('  SVG source: ' + svgPath);
    console.log('  Output: ' + iconsDir + '/');
}

main();
