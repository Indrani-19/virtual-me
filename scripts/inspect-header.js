const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chromium' });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.goto('https://virtual-me-gules.vercel.app', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/tmp/shot-check.png' });

  const info = await page.evaluate(() => {
    const header = document.querySelector('.app-header');
    const container = document.querySelector('.app-container');

    const ancestors = [];
    let el = header;
    while (el && el !== document.documentElement) {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      ancestors.push({
        tag: el.tagName,
        class: el.className?.toString?.().slice(0, 60) || '',
        id: el.id || '',
        rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
        position: cs.position,
        top: cs.top,
        transform: cs.transform,
        overflow: cs.overflow,
        scrollTop: el.scrollTop,
        offsetTop: el.offsetTop,
      });
      el = el.parentElement;
    }

    return {
      scrollY: window.scrollY,
      pageYOffset: window.pageYOffset,
      documentScrollTop: document.documentElement.scrollTop,
      bodyScrollTop: document.body.scrollTop,
      htmlHeight: document.documentElement.scrollHeight,
      bodyHeight: document.body.scrollHeight,
      innerHeight: window.innerHeight,
      ancestorsFromHeader: ancestors,
    };
  });

  console.log(JSON.stringify(info, null, 2));

  await context.close();
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
