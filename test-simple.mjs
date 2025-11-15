import { chromium } from 'playwright';

const browser = await chromium.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
});

const page = await browser.newPage();

console.log('Testing home page...');
try {
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 10000 });
  await page.screenshot({ path: '/home/user/kryptos/test-screenshots/home.png', fullPage: true });
  console.log('✅ Home page loaded');
} catch (e) {
  console.log('❌ Error:', e.message);
}

await browser.close();
