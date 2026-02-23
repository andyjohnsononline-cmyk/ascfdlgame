#!/usr/bin/env node
import { firefox } from 'playwright';

async function main() {
  console.log('Launching browser...');
  const browser = await firefox.launch({ headless: true });
  const page = await browser.newPage();
  console.log('Navigating...');
  await page.goto('http://localhost:5182/ascfdlgame/', { waitUntil: 'domcontentloaded', timeout: 10000 });
  console.log('Waiting for content...');
  await page.waitForSelector('h1', { timeout: 5000 });
  const title = await page.locator('h1').first().textContent();
  console.log('Title:', title);
  await page.screenshot({ path: 'verify-simple.png' });
  console.log('Screenshot saved');
  await browser.close();
  console.log('Done');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
