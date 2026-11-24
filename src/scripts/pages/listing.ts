/** Bộ lọc & sắp xếp trang danh sách (thẻ sản phẩm đã render sẵn từ server cho SEO) */
import { PRICE_RANGES, STYLES, SHAPES, MOODS, METALS, TYPES, type MetalKey } from '../../lib/catalog';
import { COLLECTIONS } from '../../data/collections';
import { ringSVG } from '../../lib/ring-svg';
import { icon } from '../../lib/icons';
import { escapeHTML } from '../../lib/format';
import { qs, qsa } from '../ui';

const PARAMS = ['kieu-dang', 'vien-chu', 'loai', 'chat-lieu', 'phong-cach', 'bo-suu-tap', 'gia'] as const;
type Param = (typeof PARAMS)[number];

const LABEL: Record<Param, (v: string) => string> = {
  'kieu-dang': (v) => STYLES.find((s) => s.key === v)?.label || v,
  'vien-chu': (v) => SHAPES.find((s) => s.key === v)?.label || v,
  loai: (v) => TYPES[v] || v,
  'chat-lieu': (v) => METALS[v as MetalKey]?.label || v,
  'phong-cach': (v) => MOODS.find((m) => m.key === v)?.label || v,
  'bo-suu-tap': (v) => COLLECTIONS.find((c) => c.slug === v)?.name || v,
  gia: (v) => PRICE_RANGES.find((r) => r.key === v)?.label || v,
};

function cardHas(c: HTMLElement, param: Param, value: string) {
  const d = c.dataset;
  switch (param) {
    case 'kieu-dang': return d.style === value;
    case 'vien-chu': return d.shape === value;
    case 'loai': return d.type === value;
    case 'bo-suu-tap': return d.collection === value;
    case 'chat-lieu': return (d.metals || '').split(' ').includes(value);
    case 'phong-cach': return (d.moods || '').split(' ').includes(value);
    case 'gia': { const r = PRICE_RANGES.find((x) => x.key === value); const p = Number(d.price); return !!r && p >= r.min && p < r.max; }
  }
}

export function initListing() {
  const root = qs('[data-listing]');
  const grid = qs('[data-grid]', root || document);
  if (!root || !grid) return;
  const cards = qsa<HTMLElement>('.pcard', grid);
  const form = qs<HTMLFormElement>('[data-filter-form]');
  const sortSel = qs<HTMLSelectElement>('[data-sort]', root);
  const empty = qs('[data-empty]', root);
  const quick = qs('[data-quick]', root);
  const quickParam = quick?.dataset.quick as Param | undefined;
  const chips = qs('[data-active-filters]', root);
  const allowBuilder = !!root.dataset.emptyBuilder;

  const state: Partial<Record<Param, string[]>> = {};
  const url = new URL(location.href);
  for (const p of PARAMS) { const v = url.searchParams.get(p); if (v) state[p] = v.split(',').filter(Boolean); }
  let sort = url.searchParams.get('sap-xep') || 'noi-bat';

  const matches = (c: HTMLElement, except?: Param) => {
    for (const p of PARAMS) {
      const vals = state[p];
      if (!vals?.length || p === except) continue;
      if (!vals.some((v) => cardHas(c, p, v))) return false;
    }
    return true;
  };

  const syncControls = () => {
    if (form) qsa<HTMLInputElement>('input', form).forEach((i) => (i.checked = !!state[i.name as Param]?.includes(i.value)));
    if (quick && quickParam) qsa<HTMLButtonElement>('[data-quick-value]', quick).forEach((b) => b.setAttribute('aria-pressed', String(!!state[quickParam]?.includes(b.dataset.quickValue!))));
    if (sortSel) sortSel.value = sort;
  };

  const sorter = (a: HTMLElement, b: HTMLElement) => {
    const n = (el: HTMLElement, k: string) => Number(el.dataset[k]);
    switch (sort) {
      case 'ban-chay': return n(b, 'sold') - n(a, 'sold');
      case 'moi-nhat': return (b.dataset.created || '').localeCompare(a.dataset.created || '');
      case 'gia-tang': return n(a, 'price') - n(b, 'price');
      case 'gia-giam': return n(b, 'price') - n(a, 'price');
      default: return n(a, 'order') - n(b, 'order');
    }
  };

  const renderChips = () => {
    if (!chips) return;
    const items: string[] = [];
    for (const p of PARAMS) for (const v of state[p] || []) items.push(`<button type="button" class="chip is-active" data-remove-filter="${p}:${escapeHTML(v)}" aria-label="Bỏ lọc ${escapeHTML(LABEL[p](v))}">${escapeHTML(LABEL[p](v))}${icon('close')}</button>`);
    chips.innerHTML = items.length ? items.join('') + `<button type="button" class="chip" data-filter-clear>Xóa tất cả</button>` : '';
  };

  const renderEmpty = () => {
    const style = state['kieu-dang']?.[0];
    const shape = state['vien-chu']?.[0];
    const ring = qs('[data-empty-ring]', root);
    const title = qs('[data-empty-title]', root);
    const text = qs('[data-empty-text]', root);
    const link = qs<HTMLAnchorElement>('[data-empty-builder-link]', root);
    if (allowBuilder && ring) {
      ring.innerHTML = ringSVG({ style: (style as any) || 'solitaire', shape: (shape as any) || 'round', metal: 'vang-vang-18k', carat: 1, uid: 'empty' });
      if (title) title.textContent = style || shape ? `Mẫu ${[style && LABEL['kieu-dang'](style), shape && LABEL['vien-chu'](shape)].filter(Boolean).join(' · ')} — chế tác riêng cho bạn` : 'Chưa có mẫu sẵn phù hợp';
      if (text) text.textContent = 'Chưa có thiết kế sẵn khớp bộ lọc này, nhưng nghệ nhân Solène có thể chế tác đúng ý bạn trong 10–14 ngày. Xem trước và báo giá ngay với công cụ Thiết kế nhẫn.';
      if (link) { const u = new URL('/thiet-ke-nhan/', location.origin); if (style) u.searchParams.set('kieu-dang', style); if (shape) u.searchParams.set('vien-chu', shape); link.href = u.pathname + u.search; }
    } else if (ring) {
      ring.hidden = true;
      if (link) link.hidden = true;
    }
  };

  const apply = (updateUrl = true) => {
    let visible = 0;
    cards.forEach((c) => { const ok = matches(c); c.classList.toggle('is-hidden', !ok); if (ok) visible++; });
    [...cards].sort(sorter).forEach((c) => grid.appendChild(c));
    qsa('[data-result-count]').forEach((e) => (e.textContent = String(visible)));
    qsa<HTMLElement>('[data-count-for]').forEach((el) => {
      const [p, v] = el.dataset.countFor!.split(':') as [Param, string];
      const n = cards.filter((c) => matches(c, p) && cardHas(c, p, v)).length;
      el.textContent = String(n);
      el.closest('.filters__opt')?.classList.toggle('is-empty', n === 0);
    });
    const active = PARAMS.reduce((s, p) => s + (state[p]?.length || 0), 0);
    qsa('[data-filter-count]').forEach((b) => { b.hidden = !active; b.textContent = String(active); });
    renderChips();
    if (empty) { empty.hidden = visible > 0; if (!visible) renderEmpty(); }
    grid.hidden = visible === 0;
    if (updateUrl) {
      const u = new URL(location.href);
      for (const p of PARAMS) state[p]?.length ? u.searchParams.set(p, state[p]!.join(',')) : u.searchParams.delete(p);
      sort !== 'noi-bat' ? u.searchParams.set('sap-xep', sort) : u.searchParams.delete('sap-xep');
      history.replaceState(history.state, '', u.pathname + u.search);
    }
  };

  const scrollToTop = () => {
    const tb = qs('.toolbar', root);
    if (tb && root.getBoundingClientRect().top < 0) window.scrollTo({ top: window.scrollY + root.getBoundingClientRect().top - 40, behavior: 'smooth' });
    void tb;
  };

  form?.addEventListener('change', () => {
    const fd = new FormData(form);
    for (const p of PARAMS) { if (form.querySelector(`[name="${p}"]`)) state[p] = fd.getAll(p).map(String); }
    syncControls();
    apply();
  });
  quick?.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-quick-value]');
    if (!b || !quickParam) return;
    const v = b.dataset.quickValue!;
    state[quickParam] = state[quickParam]?.includes(v) && state[quickParam]!.length === 1 ? [] : [v];
    syncControls();
    apply();
  });
  sortSel?.addEventListener('change', () => { sort = sortSel.value; apply(); });
  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const rm = t.closest<HTMLElement>('[data-remove-filter]');
    if (rm) {
      const [p, v] = rm.dataset.removeFilter!.split(':') as [Param, string];
      state[p] = (state[p] || []).filter((x) => x !== v);
      syncControls(); apply(); scrollToTop();
      return;
    }
    if (t.closest('[data-filter-clear]')) {
      for (const p of PARAMS) delete state[p];
      syncControls(); apply(); scrollToTop();
    }
  });

  syncControls();
  apply(false);
}
