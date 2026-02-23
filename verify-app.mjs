#!/usr/bin/env node
/**
 * Verification script for ASC FDL Learning Game
 * Run: node verify-app.mjs
 * Requires: dev server at http://localhost:5182/ascfdlgame/
 */
import { firefox } from 'playwright';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const BASE_URL = 'http://localhost:5182/ascfdlgame/';
const SCREENSHOT_DIR = join(process.cwd(), 'verification-screenshots');

const results = [];
function log(step, status, detail = '') {
  const msg = `[${status}] Step ${step}: ${detail}`;
  results.push({ step, status, detail });
  console.log(msg);
}

async function main() {
  if (!existsSync(SCREENSHOT_DIR)) {
    mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const browser = await firefox.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    ignoreHTTPSErrors: true,
  });

  const consoleLogs = [];
  context.on('console', (msg) => {
    const text = msg.text();
    const type = msg.type();
    consoleLogs.push({ type, text });
  });

  const page = await context.newPage();

  try {
    // Step 1: Navigate and take landing screenshot
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 8000 });
    await page.waitForSelector('h1, header', { timeout: 5000 });
    await page.waitForTimeout(300);

    const title = await page.locator('h1').first().textContent().catch(() => '');
    const subtitle = await page.locator('p').filter({ hasText: 'ASC FDL' }).first().textContent().catch(() => '');

    if (title?.includes('Frame It')) {
      log(1, 'PASS', `Title: "${title.trim()}"`);
    } else {
      log(1, 'FAIL', `Expected "Frame It", got: "${title}"`);
    }

    if (subtitle?.includes('The ASC FDL Learning Game')) {
      log(2, 'PASS', `Subtitle: "${subtitle.trim()}"`);
    } else {
      log(2, 'FAIL', `Expected "The ASC FDL Learning Game", got: "${subtitle}"`);
    }

    // Count zones
    const zoneLabels = await page.locator('text=The Post Supervisor, text=The DIT, text=The VFX Supervisor, text=The FDL Expert').count();
    const zoneCount = await page.locator('g.constellation-zone').count();
    if (zoneCount === 4) {
      log(3, 'PASS', `4 zones visible (${zoneCount} zone groups)`);
    } else {
      log(3, zoneCount === 4 ? 'PASS' : 'FAIL', `Expected 4 zones, found ${zoneCount}`);
    }

    // Count level nodes per zone (6 each)
    const nodes = await page.locator('g.constellation-node').count();
    if (nodes === 24) {
      log(4, 'PASS', `24 level nodes total (6 per zone)`);
    } else {
      log(4, 'FAIL', `Expected 24 nodes, found ${nodes}`);
    }

    const workflowLabel = await page.locator('text=PRODUCTION WORKFLOW').first().textContent().catch(() => '');
    if (workflowLabel?.includes('PRODUCTION WORKFLOW')) {
      log(5, 'PASS', 'PRODUCTION WORKFLOW label visible');
    } else {
      log(5, 'FAIL', `PRODUCTION WORKFLOW not found, got: "${workflowLabel}"`);
    }

    await page.screenshot({ path: join(SCREENSHOT_DIR, '01-landing.png'), fullPage: true });
    console.log('  Screenshot: 01-landing.png');

    // Step 6: Click level 1 (first node in Post Supervisor zone)
    const level1Node = page.locator('g.constellation-node').first();
    await level1Node.click();
    await page.waitForTimeout(400);

    const conceptTag = await page.locator('span:has-text("Rule of Defaults")').first().textContent().catch(() => '');
    const briefText = await page.locator('p:has-text("No FDL was provided")').first().textContent().catch(() => '');

    if (conceptTag?.includes('Rule of Defaults') || await page.locator('text=Rule of Defaults').count() > 0) {
      log(6, 'PASS', 'Level 1 loads with "Rule of Defaults" concept tag');
    } else {
      log(6, 'FAIL', `Rule of Defaults not found. Concept area: ${await page.locator('[class*="concept"], .text-xs').first().textContent().catch(() => 'N/A')}`);
    }

    if (briefText?.includes('MPS') || await page.locator('text=MPS').count() > 0) {
      log(7, 'PASS', 'Brief text about MPS visible');
    } else {
      log(7, 'FAIL', `MPS brief not found`);
    }

    await page.screenshot({ path: join(SCREENSHOT_DIR, '02-level1.png'), fullPage: true });
    console.log('  Screenshot: 02-level1.png');

    // Step 8: Click correct answer
    const correctOption = page.locator('button:has-text("Full source dimensions, scaled to the delivery container")');
    await correctOption.click();
    await page.waitForTimeout(500);

    const correctLabel = await page.locator('text=Correct').first().textContent().catch(() => '');
    const jsonRevealVisible = (await page.locator('text=MPS Rule of Defaults').count()) > 0 ||
      (await page.locator('text=JSON').count()) > 0;

    if (correctLabel?.includes('Correct') || await page.locator('text=✓ Correct').count() > 0) {
      log(8, 'PASS', 'Shows "Correct"');
    } else {
      log(8, 'FAIL', `Correct indicator not found`);
    }

    if (jsonRevealVisible) {
      log(9, 'PASS', 'JSON reveal visible');
    } else {
      log(9, 'FAIL', `JSON reveal not found`);
    }

    await page.screenshot({ path: join(SCREENSHOT_DIR, '03-correct-answer.png'), fullPage: true });
    console.log('  Screenshot: 03-correct-answer.png');

    // Step 10: Click Next
    await page.locator('button:has-text("Next")').click();
    await page.waitForTimeout(400);

    const level2Brief = await page.locator('p:has-text("Mid-shoot")').first().textContent().catch(() => '');
    if (level2Brief?.includes('B-cam') || level2Brief?.includes('anamorphic')) {
      log(10, 'PASS', 'Level 2 loaded (Camera Format question)');
    } else {
      log(10, 'FAIL', `Level 2 may not have loaded. Brief: ${level2Brief?.slice(0, 80)}`);
    }

    await page.screenshot({ path: join(SCREENSHOT_DIR, '04-level2.png'), fullPage: true });
    console.log('  Screenshot: 04-level2.png');

    // Step 11: Open zone picker and click level 7
    const zoneDots = page.locator('header button span').first();
    await page.locator('header button[title="Choose a level"]').click();
    await page.waitForTimeout(300);

    // Level 7 is first node in DIT zone (second zone). Zones are: 1-6 Post, 7-12 DIT
    const level7Node = page.locator('g.constellation-node').nth(6); // 0-indexed, 7th node
    await level7Node.click();
    await page.waitForTimeout(400);

    const canvasTag = await page.locator('text=Canvas').first().textContent().catch(() => '');
    const alexaBrief = await page.locator('p:has-text("ARRI Alexa LF")').first().textContent().catch(() => '');

    if (canvasTag?.includes('Canvas') || await page.locator('text=Canvas').count() > 0) {
      log(11, 'PASS', 'Level 7 loads with "Canvas" concept tag');
    } else {
      log(11, 'FAIL', `Canvas concept tag not found`);
    }

    if (alexaBrief?.includes('ARRI Alexa LF') || await page.locator('text=ARRI Alexa LF').count() > 0) {
      log(12, 'PASS', 'Brief about ARRI Alexa LF sensor visible');
    } else {
      log(12, 'FAIL', `ARRI Alexa LF brief not found`);
    }

    await page.screenshot({ path: join(SCREENSHOT_DIR, '05-level7.png'), fullPage: true });
    console.log('  Screenshot: 05-level7.png');

  } catch (err) {
    console.error('Error:', err.message);
    log('ERR', 'FAIL', err.message);
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'error.png'), fullPage: true }).catch(() => {});
  }

  await browser.close();

  // Report console errors
  const errors = consoleLogs.filter((l) => l.type === 'error');
  if (errors.length > 0) {
    console.log('\n--- Console errors ---');
    errors.forEach((e) => console.log('  ', e.text));
  }

  console.log('\n--- Summary ---');
  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  console.log(`Passed: ${passed}, Failed: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
