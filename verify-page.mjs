#!/usr/bin/env node
/**
 * One-off script to verify the Frame It game loads correctly.
 * Run: node verify-page.mjs
 */
import { chromium } from 'playwright';

const URL = 'http://localhost:5181/ascfdlgame/';

const consoleLogs = [];
const consoleErrors = [];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', (msg) => {
    const text = msg.text();
    const type = msg.type();
    if (type === 'error') {
      consoleErrors.push(text);
    }
    consoleLogs.push({ type, text });
  });

  const response = await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 8000 });
  const status = response?.status();
  console.log('Status:', status);

  // Wait for React to render
  await page.waitForSelector('header', { timeout: 3000 }).catch(() => null);
  await new Promise((r) => setTimeout(r, 500)); // brief settle

  // Take screenshot
  await page.screenshot({ path: 'verify-screenshot.png', fullPage: true });
  console.log('Screenshot saved to verify-screenshot.png');

  // Check elements (flexible selectors for Tailwind/minified classes)
  const zoneDots = await page.locator('header button[title]').count(); // zone dots have title attr
  const level1Brief = (await page.locator('text=This is a camera sensor').count()) > 0;
  const canvasArea = (await page.locator('[style*="aspect-ratio"], main div.relative').count()) > 0;
  const streakCounter = (await page.locator('text=🔥').count()) > 0;
  const infoButton = (await page.getByRole('button', { name: /info|ℹ️/ }).count()) > 0;

  const checks = {
    zoneDots,
    level1Brief,
    canvas: canvasArea,
    streakCounter,
    infoButton,
  };

  console.log('\n--- Checks ---');
  console.log('Zone dots (6 expected):', checks.zoneDots);
  console.log('Level 1 brief visible:', checks.level1Brief);
  console.log('Canvas area visible:', checks.canvas);
  console.log('Streak counter visible:', checks.streakCounter);
  console.log('Info button visible:', checks.infoButton);

  if (consoleErrors.length > 0) {
    console.log('\n--- Console Errors ---');
    consoleErrors.forEach((e) => console.log(e));
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
