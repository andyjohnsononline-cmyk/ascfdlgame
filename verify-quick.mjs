import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newContext().then(c => c.newPage());
await page.goto('http://localhost:5181/ascfdlgame/', { waitUntil: 'load', timeout: 5000 });
await page.screenshot({ path: 'verify-screenshot.png' });
await browser.close();
console.log('Done');
