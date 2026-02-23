#!/usr/bin/env node
/**
 * Verification script for various level types in ASC FDL Learning Game
 * Run: node verify-level-types.mjs
 * Requires: dev server at http://localhost:5182/ascfdlgame/
 */
import { firefox } from 'playwright';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const BASE_URL = 'http://localhost:5182/ascfdlgame/';
const SCREENSHOT_DIR = join(process.cwd(), 'verification-screenshots');

const results = [];
function log(step, status, detail = '') {
  const msg = `[${status}] ${step}: ${detail}`;
  results.push({ step, status, detail });
  console.log(msg);
}

// Level ID -> node index in zone picker (all nodes in order: zone0 nodes 0-5, zone1 nodes 6-11, etc.)
const LEVEL_TO_NODE_INDEX = {
  4: 3,
  11: 10,
  14: 13,
  19: 18,
  22: 21,
  23: 22,
};

async function selectLevelFromPicker(page, levelId) {
  const nodeIndex = LEVEL_TO_NODE_INDEX[levelId];
  await page.locator('g.constellation-node').nth(nodeIndex).click();
  await page.waitForTimeout(500);
}

async function openZonePickerAndSelectLevel(page, levelId) {
  // On landing, zone picker is open (nodes in DOM). When viewing a level, picker is closed (nodes not in DOM).
  const nodesVisible = (await page.locator('g.constellation-node').count()) > 0;
  if (!nodesVisible) {
    await page.locator('header button[title="Choose a level"]').click({ force: true });
    await page.waitForTimeout(300);
  }
  await selectLevelFromPicker(page, levelId);
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
    consoleLogs.push({ type: msg.type(), text: msg.text() });
  });

  const page = await context.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 8000 });
    await page.waitForSelector('h1, header', { timeout: 5000 });
    await page.waitForTimeout(300);

    // --- Level 4: Connect type (roles to responsibilities) ---
    await openZonePickerAndSelectLevel(page, 4);

    const level4DIT = (await page.locator('text=DIT').count()) > 0;
    const level4CreatesFDL = (await page.locator('text=Creates the FDL').count()) > 0;
    const level4Slots = (await page.locator('text=Camera Format setup').count()) > 0;

    if (level4DIT && level4CreatesFDL) {
      log('Level 4', 'PASS', 'Cards (DIT) and slots (Creates the FDL) visible');
    } else {
      log('Level 4', 'FAIL', `DIT: ${level4DIT}, Creates the FDL: ${level4CreatesFDL}`);
    }

    await page.screenshot({ path: join(SCREENSHOT_DIR, '06-level4-connect.png'), fullPage: true });
    console.log('  Screenshot: 06-level4-connect.png');

    // --- Level 11: Anamorphic level ---
    await openZonePickerAndSelectLevel(page, 11);

    const level11Slider = (await page.locator('input[type="range"], [role="slider"]').count()) > 0;
    const level11Squeeze = (await page.locator('text=anamorphic_squeeze, text=squeeze').count()) > 0;

    if (level11Slider || level11Squeeze) {
      log('Level 11', 'PASS', 'Anamorphic squeeze slider/controls visible');
    } else {
      log('Level 11', 'FAIL', `Slider: ${level11Slider}, squeeze text: ${level11Squeeze}`);
    }

    await page.screenshot({ path: join(SCREENSHOT_DIR, '07-level11-anamorphic.png'), fullPage: true });
    console.log('  Screenshot: 07-level11-anamorphic.png');

    // --- Level 14: pipelineConfig level ---
    await openZonePickerAndSelectLevel(page, 14);

    const level14FitSource = (await page.locator('text=fit_source').count()) > 0;
    const level14Preserve = (await page.locator('text=preserve_from_source_canvas').count()) > 0;

    if (level14FitSource && level14Preserve) {
      log('Level 14', 'PASS', 'fit_source and preserve_from_source_canvas options visible');
    } else {
      log('Level 14', 'FAIL', `fit_source: ${level14FitSource}, preserve: ${level14Preserve}`);
    }

    await page.screenshot({ path: join(SCREENSHOT_DIR, '08-level14-pipelineConfig.png'), fullPage: true });
    console.log('  Screenshot: 08-level14-pipelineConfig.png');

    // --- Level 19: Fix level with JSON ---
    await openZonePickerAndSelectLevel(page, 19);

    const level19Json = (await page.locator('text=VENICE_FF').count()) > 0 || (await page.locator('text=VENICE_FF_6K').count()) > 0;
    const level19CanvasId = (await page.locator('text=canvas_id').count()) > 0;
    const level19Mismatch = (await page.locator('text=doesn\'t match').count()) > 0;

    if ((level19Json || level19Mismatch) && level19CanvasId) {
      log('Level 19', 'PASS', 'Broken JSON and canvas_id options visible');
    } else {
      log('Level 19', 'FAIL', `JSON/VENICE: ${level19Json}, canvas_id: ${level19CanvasId}, mismatch: ${level19Mismatch}`);
    }

    await page.screenshot({ path: join(SCREENSHOT_DIR, '09-level19-fix-json.png'), fullPage: true });
    console.log('  Screenshot: 09-level19-fix-json.png');

    // --- Level 22: roundingPick level ---
    await openZonePickerAndSelectLevel(page, 22);

    const level22Calc = (await page.locator('text=1862').count()) > 0 && (await page.locator('text=1607.7').count()) > 0;
    const level22Round = (await page.locator('text=1608').count()) > 0;

    if (level22Calc && level22Round) {
      log('Level 22', 'PASS', 'Calculation and round options visible');
    } else {
      log('Level 22', 'FAIL', `Calculation: ${level22Calc}, round options: ${level22Round}`);
    }

    await page.screenshot({ path: join(SCREENSHOT_DIR, '10-level22-rounding.png'), fullPage: true });
    console.log('  Screenshot: 10-level22-rounding.png');

    // --- Level 23: Alignment level ---
    await openZonePickerAndSelectLevel(page, 23);

    const level23Align = (await page.locator('text=Align').count()) > 0 || (await page.locator('text=center').count()) > 0;
    const level23Frame = (await page.locator('text=3840').count()) > 0 && (await page.locator('text=2160').count()) > 0;

    if (level23Align || level23Frame) {
      log('Level 23', 'PASS', 'Alignment visualization visible');
    } else {
      log('Level 23', 'FAIL', `Alignment: ${level23Align}, frame/container: ${level23Frame}`);
    }

    await page.screenshot({ path: join(SCREENSHOT_DIR, '11-level23-alignment.png'), fullPage: true });
    console.log('  Screenshot: 11-level23-alignment.png');

  } catch (err) {
    console.error('Error:', err.message);
    log('ERR', 'FAIL', err.message);
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'error-level-types.png'), fullPage: true }).catch(() => {});
  }

  await browser.close();

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
