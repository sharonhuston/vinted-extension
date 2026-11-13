(async () => {
  if (window.__vintedSortRunning) return;
  window.__vintedSortRunning = true;

  const ITEM = '[data-testid="grid-item"]';
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const count = () => document.querySelectorAll(ITEM).length;

  // --- Small on-page status banner ---
  const banner = document.createElement("div");
  Object.assign(banner.style, {
    position: "fixed", top: "12px", right: "12px", zIndex: 2147483647,
    background: "#007782", color: "#fff", padding: "10px 14px", borderRadius: "8px",
    font: "14px/1.3 system-ui, sans-serif", boxShadow: "0 2px 10px rgba(0,0,0,.25)",
  });
  document.body.appendChild(banner);
  const status = (msg) => (banner.textContent = msg);

  try {
    // --- 1. Force all lazy-loaded items to load ---
    // Keep scrolling to the bottom until the count stops growing and no loader is showing.
    let last = count();
    let stable = 0;
    while (stable < 4) {
      document.querySelector('[data-testid="infinite-scroll"]')?.scrollIntoView({ block: "end" });
      window.scrollTo(0, document.documentElement.scrollHeight);
      await sleep(800);
      const loading = !!document.querySelector('[data-testid="items-list--loader"]');
      const c = count();
      if (c === last && !loading) stable++;
      else { stable = 0; last = c; }
      status(`Loading items… ${c}`);
    }

    // --- 2. Sort: sold first, then everything else by price (low → high) ---
    const items = [...document.querySelectorAll(ITEM)];
    if (!items.length) throw new Error("No items found on this page.");
    const grid = items[0].parentElement;

    const isSold = (el) =>
      [...el.querySelectorAll('[data-testid$="--status-text"]')].some((s) => /^\s*sold\s*$/i.test(s.textContent));

    const parsePrice = (text) => {
      if (!text) return Infinity;
      let s = text.replace(/[^\d.,]/g, "");
      // Last separator followed by exactly 1–2 digits is the decimal point ("1,234.50" or "1.234,50").
      const m = s.match(/[.,](\d{1,2})$/);
      if (m) s = s.slice(0, -m[0].length).replace(/[.,]/g, "") + "." + m[1];
      else s = s.replace(/[.,]/g, "");
      const n = parseFloat(s);
      return Number.isFinite(n) ? n : Infinity;
    };
    const price = (el) => parsePrice(el.querySelector('[data-testid$="--price-text"]')?.textContent);

    const decorated = items.map((el, i) => ({ el, i, sold: isSold(el), price: price(el) }));
    decorated.sort((a, b) => {
      if (a.sold !== b.sold) return a.sold ? -1 : 1;
      if (a.sold) return a.i - b.i; // sold items keep their original relative order
      return a.price - b.price || a.i - b.i;
    });

    const frag = document.createDocumentFragment();
    decorated.forEach((d) => frag.appendChild(d.el));
    grid.appendChild(frag);

    window.scrollTo(0, 0);
    const soldN = decorated.filter((d) => d.sold).length;
    status(`Sorted ${items.length} items: ${soldN} sold first, then by price.`);
  } catch (e) {
    status(`Load & Sort failed: ${e.message}`);
    banner.style.background = "#b00020";
  } finally {
    window.__vintedSortRunning = false;
    setTimeout(() => banner.remove(), 6000);
  }
})();
