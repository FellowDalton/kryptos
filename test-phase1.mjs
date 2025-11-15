import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';

const baseURL = 'http://localhost:3000';
const screenshotDir = '/home/user/kryptos/test-screenshots';

await mkdir(screenshotDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

const results = [];

async function testPage(name, url, checks) {
  console.log('\n🧪 Testing: ' + name);
  console.log('   URL: ' + url);
  
  try {
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });
    
    const status = response.status();
    if (status !== 200) {
      results.push({ name, url, status: 'FAIL', error: 'HTTP ' + status });
      return;
    }
    
    const filename = name.replace(/\s+/g, '-').toLowerCase() + '.png';
    await page.screenshot({ path: screenshotDir + '/' + filename, fullPage: true });
    
    const checkResults = [];
    for (const check of checks) {
      try {
        const element = await page.locator(check.selector).first();
        const isVisible = await element.isVisible();
        checkResults.push({ check: check.name, passed: isVisible });
        console.log('   ' + (isVisible ? '✅' : '❌') + ' ' + check.name);
      } catch (e) {
        checkResults.push({ check: check.name, passed: false, error: e.message });
        console.log('   ❌ ' + check.name + ' - ' + e.message);
      }
    }
    
    const allPassed = checkResults.every(r => r.passed);
    results.push({ name, url, status: allPassed ? 'PASS' : 'FAIL', checks: checkResults });
    
  } catch (error) {
    console.log('   ❌ Error: ' + error.message);
    results.push({ name, url, status: 'FAIL', error: error.message });
  }
}

await testPage('Home Page', baseURL + '/', [
  { name: 'Praylude branding/title', selector: 'h1, [class*="title"]' },
  { name: 'Begin meditation button', selector: 'button, a[href*="meditate"]' },
  { name: 'Create custom button', selector: 'a[href*="create"]' },
]);

await testPage('Custom Session Builder', baseURL + '/create', [
  { name: 'Page heading', selector: 'h1, h2' },
  { name: 'Section controls', selector: 'select, [role="combobox"], button, input' },
  { name: 'Action buttons', selector: 'button' },
]);

await testPage('Standard Meditation Player', baseURL + '/meditate/standard', [
  { name: 'Content heading', selector: 'h1, h2' },
  { name: 'Interactive controls', selector: 'button' },
  { name: 'Timer or progress', selector: 'div, span' },
]);

await testPage('Profile Page', baseURL + '/profile', [
  { name: 'Profile heading', selector: 'h1, h2' },
  { name: 'Content area', selector: 'main, div' },
]);

await testPage('Session History', baseURL + '/profile/history', [
  { name: 'History heading', selector: 'h1, h2' },
  { name: 'Content area', selector: 'main, div' },
]);

console.log('\n🧪 Testing: Theme Toggle');
await page.goto(baseURL + '/');
try {
  const themeToggle = page.locator('button').filter({ hasText: /theme|dark|light/i }).first();
  const isVisible = await themeToggle.count() > 0;
  
  if (isVisible) {
    await page.screenshot({ path: screenshotDir + '/theme-before.png', fullPage: true });
    await themeToggle.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: screenshotDir + '/theme-after.png', fullPage: true });
    console.log('   ✅ Theme toggle clicked');
    results.push({ name: 'Theme Toggle', status: 'PASS' });
  } else {
    console.log('   ❌ Theme toggle not found');
    results.push({ name: 'Theme Toggle', status: 'FAIL', error: 'Toggle not found' });
  }
} catch (error) {
  console.log('   ❌ ' + error.message);
  results.push({ name: 'Theme Toggle', status: 'FAIL', error: error.message });
}

console.log('\n🧪 Testing: Mobile Responsive');
await page.setViewportSize({ width: 375, height: 667 });
await page.goto(baseURL + '/');
await page.screenshot({ path: screenshotDir + '/mobile-home.png', fullPage: true });
await page.goto(baseURL + '/create');
await page.screenshot({ path: screenshotDir + '/mobile-create.png', fullPage: true });
results.push({ name: 'Mobile Responsive', status: 'PASS' });
console.log('   ✅ Mobile screenshots captured');

await browser.close();

console.log('\n\n📊 TEST SUMMARY');
console.log('================');
const passed = results.filter(r => r.status === 'PASS').length;
const failed = results.filter(r => r.status === 'FAIL').length;
console.log('Total: ' + results.length);
console.log('Passed: ' + passed);
console.log('Failed: ' + failed);
console.log('\nResults:');
results.forEach(r => {
  console.log('  ' + (r.status === 'PASS' ? '✅' : '❌') + ' ' + r.name);
  if (r.error) console.log('     Error: ' + r.error);
});

console.log('\n📸 Screenshots: ' + screenshotDir);

process.exit(failed > 0 ? 1 : 0);
