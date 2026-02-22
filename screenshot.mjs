import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:5178/', { waitUntil: 'networkidle', timeout: 10000 });
await page.screenshot({ path: 'frame-it-screenshot.png', fullPage: true });
await browser.close();
console.log('Screenshot saved to frame-it-screenshot.png');
