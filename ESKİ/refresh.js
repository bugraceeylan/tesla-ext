#!/usr/bin/env node
// refreshCookies.cjs
import puppeteerExtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';

puppeteerExtra.use(StealthPlugin());

(async () => {
  console.log("🔄 Tarayıcı başlatılıyor (stealth modunda)…");
  const browser = await puppeteerExtra.launch({
    headless: false,
    defaultViewport: null,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled'
    ]
  });
  const [ page ] = await browser.pages();

  // Tesla hesap giriş URL’si
  await page.goto('https://auth.tesla.com/oauth2/v1/authorize?redirect_uri=https%3A%2F%2Fwww.tesla.com%2Fteslaaccount%2F&response_type=code&client_id=ownerapi&scope=openid%20email%20profile', {
    waitUntil: 'networkidle2'
  });

  console.log('👉 Lütfen tarayıcıda hesabınıza giriş yapın.');
  console.log('   Giriş tamamlandıktan sonra terminalde Enter tuşuna basın.');

  process.stdin.once('data', async () => {
    const cookies = await page.cookies();
    fs.writeFileSync('cookie.json', JSON.stringify(cookies, null, 2), 'utf8');
    console.log('✅ Başarıyla “cookie.json” oluşturuldu.');
    await browser.close();
    process.exit(0);
  });
})();
