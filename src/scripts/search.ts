import { imageUrl } from '../lib/catalog';
import { escapeHTML, formatVND } from '../lib/format';
import { highlight, loadProducts, searchProducts } from './catalog-client';
import { read, write } from './store';
import { openLayer, closeLayer, qs } from './ui';

const RECENT_KEY = 'recentSearches';
export function saveRecentSearch(q: string) {
  const t = q.trim();
  if (!t) return;
  const list = read<string[]>(RECENT_KEY, []).filter((x) => x.toLowerCase() !== t.toLowerCase());
  list.unshift(t);
  write(RECENT_KEY, list.slice(0, 6));
}

export function initSearch() {
  const panel = qs('[data-search-panel]');
  const input = qs<HTMLInputElement>('[data-search-input]');
  const results = qs('[data-search-results]');
  const heading = qs('[data-search-heading]');
  const all = qs<HTMLAnchorElement>('[data-search-all]');
  const form = qs<HTMLFormElement>('[data-search-form]');
  if (!panel || !input || !results) return;

  const renderRecent = () => {
    const wrap = qs('[data-recent-wrap]');
    const box = qs('[data-recent]');
    const list = read<string[]>(RECENT_KEY, []);
    if (!wrap || !box) return;
    wrap.hidden = !list.length;
    box.innerHTML = list.map((q) => `<a class="chip" href="/tim-kiem/?q=${encodeURIComponent(q)}">${escapeHTML(q)}</a>`).join('');
  };

  const card = (p: any, q: string) => `<a class="sresult" href="/san-pham/${p.slug}/"><img src="${imageUrl(p.images[0], 400)}" alt="" loading="lazy" width="400" height="500"><b>${q ? highlight(p.name, q) : escapeHTML(p.name)}</b><span>${p.hasVariants ? 'Từ ' : ''}${formatVND(p.price)}</span></a>`;

  let timer = 0;
  const run = async () => {
    const q = input.value.trim();
    let list;
    try { list = await loadProducts(); } catch { results.innerHTML = '<p class="muted">Không tải được dữ liệu sản phẩm.</p>'; return; }
    if (!q) {
      if (heading) heading.textContent = 'Gợi ý dành cho bạn';
      results.innerHTML = [...list].sort((a, b) => b.sold - a.sold).slice(0, 4).map((p) => card(p, '')).join('');
      if (all) all.hidden = true;
      return;
    }
    const found = searchProducts(list, q);
    if (heading) heading.textContent = found.length ? `${found.length} kết quả cho “${q}”` : `Không tìm thấy kết quả cho “${q}”`;
    results.innerHTML = found.length
      ? found.slice(0, 8).map((p) => card(p, q)).join('')
      : `<p class="muted" style="grid-column:1/-1">Thử từ khóa khác như “halo”, “vàng hồng”, “5.4 ly” hoặc <a class="link-inline" href="/dat-lich-hen/">đặt lịch để được tư vấn riêng</a>.</p>`;
    if (all) { all.hidden = found.length <= 8; all.href = `/tim-kiem/?q=${encodeURIComponent(q)}`; }
  };

  const open = () => {
    openLayer(panel, 'search');
    renderRecent();
    run();
    window.setTimeout(() => input.focus(), 80);
  };
  document.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('[data-search-open]')) { e.preventDefault(); open(); }
    if ((e.target as HTMLElement).closest('[data-search-close]')) closeLayer(panel);
  });
  document.addEventListener('keydown', (e) => {
    const typing = /input|textarea|select/i.test((e.target as HTMLElement).tagName) || (e.target as HTMLElement).isContentEditable;
    if (e.key === '/' && !typing) { e.preventDefault(); open(); }
  });
  input.addEventListener('input', () => { clearTimeout(timer); timer = window.setTimeout(run, 140); });
  form?.addEventListener('submit', (e) => {
    if (!input.value.trim()) { e.preventDefault(); return; }
    saveRecentSearch(input.value);
  });
  panel.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a.sresult');
    if (a && input.value.trim()) saveRecentSearch(input.value);
  });
}
