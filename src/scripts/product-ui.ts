/** Gắn hành vi cho form sản phẩm + Xem nhanh */
import { METALS, RING_SIZES, TYPES, imageUrl, imageSrcset, type MetalKey } from '../lib/catalog';
import { escapeHTML, formatVND } from '../lib/format';
import { icon } from '../lib/icons';
import { productFormHTML, unitPrice, type OptProduct } from '../lib/options';
import { addToCart, read } from './store';
import { closeLayer, flyToCart, openDrawer, openModal, qs, qsa, toast } from './ui';
import { loadProducts } from './catalog-client';
import { syncWishButtons } from './cart-ui';

export function bindProductForm(form: HTMLFormElement, p: OptProduct, opts: { onAdded?: (buyNow: boolean) => void; imageEl?: () => Element | null } = {}) {
  if (form.dataset.bound) return;
  form.dataset.bound = '1';
  const priceEl = form.querySelector<HTMLElement>('[data-price-display]');
  const compareEl = form.querySelector<HTMLElement>('[data-compare-display]');
  const qtyOut = form.querySelector<HTMLOutputElement>('[data-qty]');
  const dec = form.querySelector<HTMLButtonElement>('[data-qty-dec]');
  const inc = form.querySelector<HTMLButtonElement>('[data-qty-inc]');
  const engraveWrap = form.querySelector<HTMLElement>('[data-engrave]');
  const engraveInput = form.querySelector<HTMLInputElement>('input[name="engraving"]');
  const preview = form.querySelector<HTMLElement>('[data-engrave-preview]');
  const band = form.querySelector<HTMLElement>('[data-engrave-band]');
  const counter = form.querySelector<HTMLElement>('[data-engrave-count]');
  let qty = 1;

  const metal = () => (form.querySelector<HTMLInputElement>('input[name="metal"]:checked')?.value || '') as MetalKey | '';
  const variant = () => form.querySelector<HTMLSelectElement>('select[name="variant"]');
  const base = () => { const v = variant(); return v ? Number(v.selectedOptions[0].dataset.price) : p.price; };
  const current = () => unitPrice(base(), metal() || undefined);

  const update = () => {
    if (priceEl) priceEl.textContent = formatVND(current());
    if (compareEl && p.compareAt) compareEl.textContent = formatVND(unitPrice(p.compareAt, metal() || undefined));
    const m = metal();
    const label = form.querySelector('[data-metal-label]');
    if (label && m) label.textContent = METALS[m].label;
    if (band && m) band.style.setProperty('--band', METALS[m].swatch);
    form.dispatchEvent(new CustomEvent('product:change', { bubbles: true, detail: { metal: m, price: current() } }));
  };
  form.addEventListener('change', (e) => {
    const t = e.target as HTMLInputElement;
    if (t.matches('[data-engrave-toggle]')) {
      if (engraveWrap) engraveWrap.hidden = !t.checked;
      if (t.checked) engraveInput?.focus();
      else if (engraveInput) engraveInput.value = '';
    }
    if (t.name === 'size' || t.name === 'sizeMale') {
      t.closest('.field')?.classList.remove('has-error');
      const err = form.querySelector(`[data-error-for="${t.name}"]`);
      if (err) err.textContent = '';
    }
    update();
  });
  engraveInput?.addEventListener('input', () => {
    if (preview) preview.textContent = engraveInput.value.trim() || 'Forever yours';
    if (counter) counter.textContent = String(engraveInput.value.length);
  });
  const setQty = (n: number) => {
    qty = Math.min(10, Math.max(1, n));
    if (qtyOut) qtyOut.textContent = String(qty);
    if (dec) dec.disabled = qty <= 1;
    if (inc) inc.disabled = qty >= 10;
  };
  dec?.addEventListener('click', () => setQty(qty - 1));
  inc?.addEventListener('click', () => setQty(qty + 1));

  const submit = (buyNow: boolean) => {
    const fd = new FormData(form);
    const size = String(fd.get('size') || '');
    const sizeMale = String(fd.get('sizeMale') || '');
    let firstBad: HTMLElement | null = null;
    const need = (name: string, ok: boolean, msg: string) => {
      if (ok) return;
      const el = form.querySelector<HTMLElement>(`[name="${name}"]`);
      el?.closest('.field')?.classList.add('has-error');
      const err = form.querySelector(`[data-error-for="${name}"]`);
      if (err) err.textContent = msg;
      firstBad ||= el;
    };
    if (p.sizing) need('size', !!size, p.sizing === 'pair' ? 'Chọn ni nhẫn nữ' : 'Vui lòng chọn ni tay');
    if (p.sizing === 'pair') need('sizeMale', !!sizeMale, 'Chọn ni nhẫn nam');
    if (firstBad) {
      (firstBad as HTMLElement).focus();
      toast({ type: 'error', message: 'Vui lòng chọn ni tay trước khi thêm vào giỏ.', action: { label: 'Đo ni', href: '/huong-dan-do-ni-tay/' } });
      return;
    }
    const m = metal();
    const v = variant();
    const engraving = String(fd.get('engraving') || '').trim();
    const options: Record<string, string> = {};
    const text: string[] = [];
    if (m) { options.metal = m; text.push(METALS[m].label); }
    if (v) { options.variant = v.value; text.push(`${p.variants!.label}: ${v.selectedOptions[0].textContent!.split(' — ')[0]}`); }
    if (p.sizing === 'ring') { options.size = size; text.push(`Ni ${size}`); }
    if (p.sizing === 'pair') { options.size = size; options.sizeMale = sizeMale; text.push(`Ni nữ ${size} · Ni nam ${sizeMale}`); }
    if (engraving) { options.engraving = engraving; text.push(`Khắc: “${engraving}”`); }
    addToCart({ id: p.id, slug: p.slug, name: p.name, image: p.images[0], price: current(), qty, category: p.category, options, optionsText: text });
    flyToCart(opts.imageEl?.() || form);
    opts.onAdded?.(buyNow);
    if (buyNow) { window.location.href = '/thanh-toan/'; return; }
    window.setTimeout(() => openDrawer('cart'), 380);
  };
  form.addEventListener('submit', (e) => { e.preventDefault(); submit(false); });
  form.querySelector('[data-buy-now]')?.addEventListener('click', () => submit(true));

  // Ni đã lưu từ công cụ đo ni → chọn sẵn
  const mySize = read<number | null>('mySize', null);
  const sizeSel = form.querySelector<HTMLSelectElement>('select[name="size"]');
  if (mySize && p.sizing === 'ring' && sizeSel && !sizeSel.value && sizeSel.querySelector(`option[value="${mySize}"]`)) {
    sizeSel.value = String(mySize);
    sizeSel.insertAdjacentHTML('afterend', `<span class="field-hint">${icon('check', 'pform__ico')} Đã chọn sẵn ni ${mySize} bạn đã lưu</span>`);
  }
  update();
}

// ───────────────────────── Quick view ─────────────────────────
const stars = (r: number) => `<span class="stars" aria-label="${r} trên 5 sao">${Array.from({ length: 5 }, (_, i) => `<span style="opacity:${i < Math.round(r) ? 1 : 0.25}">${icon('star')}</span>`).join('')}</span>`;

export async function openQuickView(slug: string) {
  const body = qs('[data-quickview-body]');
  if (!body) return;
  body.innerHTML = `<div class="qv"><div class="qv__gallery"><div class="ratio ratio--45 skeleton"></div></div><div class="qv__info"><div class="skeleton" style="height:28px;width:60%;margin-bottom:1rem"></div><div class="skeleton" style="height:16px;width:40%"></div></div></div>`;
  openModal('quickview');
  try {
    const list = await loadProducts();
    const p = list.find((x) => x.slug === slug);
    if (!p) throw new Error('not found');
    const imgs = p.images;
    body.innerHTML = `<div class="qv">
      <div class="qv__gallery">
        <div class="ratio ratio--45 qv__main"><img src="${imageUrl(imgs[0], 800)}" srcset="${imageSrcset(imgs[0])}" sizes="(min-width: 900px) 480px, 100vw" alt="${escapeHTML(p.name)}" data-qv-main></div>
        ${imgs.length > 1 ? `<div class="qv__thumbs">${imgs.map((k, i) => `<button type="button" class="qv__thumb" aria-label="Ảnh ${i + 1}" aria-pressed="${i === 0}" data-qv-thumb="${k}"><img src="${imageUrl(k, 400)}" alt="" loading="lazy"></button>`).join('')}</div>` : ''}
      </div>
      <div class="qv__info">
        <p class="eyebrow">${escapeHTML(TYPES[p.type] || '')}</p>
        <h2 class="qv__title">${escapeHTML(p.name)}</h2>
        <p class="muted" style="margin:0 0 .6rem">${escapeHTML(p.subtitle)}</p>
        <div class="rating-line" style="margin-bottom:1.2rem">${stars(p.rating)}<span>${p.rating.toFixed(1)} · ${p.reviews} đánh giá</span></div>
        ${productFormHTML(p, 'qv')}
        <div class="qv__links"><a class="link" href="/san-pham/${p.slug}/">Xem chi tiết sản phẩm ${icon('arrow-right')}</a>
        <button type="button" class="wish-btn qv__wish" data-wish="${p.id}" data-name="${escapeHTML(p.name)}" aria-pressed="false">${icon('heart')}<span>Yêu thích</span></button></div>
      </div>
    </div>`;
    syncWishButtons(body);
    body.querySelectorAll<HTMLButtonElement>('[data-qv-thumb]').forEach((b) => b.addEventListener('click', () => {
      const main = body.querySelector<HTMLImageElement>('[data-qv-main]')!;
      main.src = imageUrl(b.dataset.qvThumb!, 800);
      main.srcset = imageSrcset(b.dataset.qvThumb!);
      body.querySelectorAll('[data-qv-thumb]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    }));
    const form = body.querySelector<HTMLFormElement>('[data-product-form]')!;
    bindProductForm(form, p, {
      imageEl: () => body.querySelector('[data-qv-main]'),
      onAdded: (buyNow) => { if (!buyNow) window.setTimeout(() => closeLayer(qs('[data-modal="quickview"]'), true), 150); },
    });
  } catch {
    body.innerHTML = `<div class="empty-state"><h3>Không tải được sản phẩm</h3><p class="muted">Vui lòng thử lại hoặc <a class="link-inline" href="/san-pham/${escapeHTML(slug)}/">mở trang sản phẩm</a>.</p></div>`;
  }
}

export function initQuickView() {
  document.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-quickview]');
    if (!b) return;
    e.preventDefault();
    e.stopPropagation();
    openQuickView(b.dataset.quickview!);
  });
}

export { RING_SIZES };
