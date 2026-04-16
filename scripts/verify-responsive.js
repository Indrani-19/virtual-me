const { chromium, devices } = require('playwright');

const VIEWPORTS = [
  { name: 'iPhone SE',     w: 375,  h: 667,  mobile: true  },
  { name: 'iPhone 14 Pro', w: 393,  h: 852,  mobile: true  },
  { name: 'Pixel 7',       w: 412,  h: 915,  mobile: true  },
  { name: 'iPad Mini',     w: 768,  h: 1024, mobile: true  },
  { name: 'Desktop 1280',  w: 1280, h: 800,  mobile: false },
  { name: 'Desktop 1920',  w: 1920, h: 1080, mobile: false },
];

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chromium' });
  const results = [];

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport:        { width: vp.w, height: vp.h },
      deviceScaleFactor: 2,
      isMobile:        vp.mobile,
      hasTouch:        vp.mobile,
    });
    const page = await context.newPage();
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    // Let greeting fire + scrollIntoView attempt to run
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `/tmp/verify-${vp.name.replace(/\s/g,'-')}.png` });

    const info = await page.evaluate(() => {
      const r = (el) => {
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return {
          y: Math.round(rect.y),
          x: Math.round(rect.x),
          w: Math.round(rect.width),
          h: Math.round(rect.height),
          bg: cs.backgroundColor,
          bgImg: cs.backgroundImage,
        };
      };
      const container = document.querySelector('.app-container');
      const header    = document.querySelector('.app-header');
      // Coffee badge: find the fixed wrapper that contains a "Coffee" text or emoji
      const fixedWrappers = Array.from(document.querySelectorAll('div')).filter(d => {
        const cs = getComputedStyle(d);
        return cs.position === 'fixed' && (d.textContent || '').match(/Coffee|☕|🍵/);
      });
      const coffee    = fixedWrappers[0] || null;
      const coffeeBtn = coffee?.querySelector('button') || null;

      return {
        container: { ...r(container), scrollTop: container?.scrollTop ?? null, overflow: container ? getComputedStyle(container).overflow : null },
        header: r(header),
        headerVisible: header && r(header).y >= 0,
        coffeeWrap: coffee ? r(coffee) : null,
        coffeeBtn: coffeeBtn ? r(coffeeBtn) : null,
      };
    });

    results.push({ viewport: vp, ...info });
    await context.close();
  }

  await browser.close();

  console.log('\n===== RESPONSIVE TEST RESULTS =====\n');
  for (const r of results) {
    const vp = r.viewport;
    const ok = r.headerVisible && r.container?.scrollTop === 0;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${vp.name.padEnd(16)} (${vp.w}x${vp.h})`);
    console.log(`      container: y=${r.container?.y} scrollTop=${r.container?.scrollTop} overflow=${r.container?.overflow}`);
    console.log(`      header:    y=${r.header?.y} h=${r.header?.h}  visible=${r.headerVisible}`);
    console.log(`      coffee:    y=${r.coffeeBtn?.y} x=${r.coffeeBtn?.x}`);
    console.log('');
  }
})().catch(e => { console.error(e); process.exit(1); });
