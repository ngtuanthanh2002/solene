import { imageUrl } from '../lib/catalog';
import { escapeHTML, formatVND } from '../lib/format';
import { icon } from '../lib/icons';
import { addToCart, cartCount, getCart, getWishlist, on, removeFromCart, setQty, toggleWishlist, MAX_QTY, type CartItem } from './store';
import { qs, qsa, toast } from './ui';

export const itemImage = (it: Pick<CartItem, 'image'>, w: 400 | 800 = 400) =>
  it.image.startsWith('data:') || it.image.startsWith('/') ? it.image : imageUrl(it.image, w);

export function cartItemHTML(it: CartItem, opts: { compact?: boolean } = {}) {
  const img = itemImage(it);
  const isSvg = it.image.startsWith('data:');
  const href = it.custom ? '/thiet-ke-nhan/' : `/san-pham/${it.slug}/`;
  return `<div class="citem" data-key="${escapeHTML(it.key)}">
    <a href="${href}" tabindex="-1" aria-hidden="true"><img class="citem__img${isSvg ? ' citem__img--svg' : ''}" src="${img}" alt="" width="84" height="105" loading="lazy"></a>
    <div>
      <div class="citem__top">
        <div><p class="citem__name"><a href="${href}">${escapeHTML(it.name)}</a></p>
        <p class="citem__opts">${it.optionsText.map(escapeHTML).join('<br>')}</p></div>
        <span class="price" style="white-space:nowrap">${formatVND(it.price * it.qty)}</span>
      </div>
      <div class="citem__bottom">
        <div class="qty" role="group" aria-label="Số lượng">
          <button type="button" data-qty-dec aria-label="Giảm số lượng" ${it.qty <= 1 ? 'disabled' : ''}>${icon('minus')}</button>
          <output aria-live="polite">${it.qty}</output>
          <button type="button" data-qty-inc aria-label="Tăng số lượng" ${it.qty >= MAX_QTY ? 'disabled' : ''}>${icon('plus')}</button>
        </div>
        <button type="button" class="citem__remove" data-remove>${opts.compact ? 'Xóa' : 'Xóa khỏi giỏ'}</button>
      </div>
    </div>
  </div>`;
}

/** Gắn xử lý tăng/giảm/xóa cho một vùng danh sách sản phẩm trong giỏ */
export function bindCartList(root: HTMLElement) {
  root.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const row = t.closest<HTMLElement>('.citem');
    if (!row) return;
    const key = row.dataset.key!;
    const it = getCart().items.find((i) => i.key === key);
    if (!it) return;
    if (t.closest('[data-qty-inc]')) setQty(key, it.qty + 1);
    else if (t.closest('[data-qty-dec]')) setQty(key, it.qty - 1);
    else if (t.closest('[data-remove]')) {
      const removed = removeFromCart(key);
      if (removed) toast({ message: `Đã xóa “${removed.name}” khỏi giỏ hàng.`, icon: 'trash', action: { label: 'Hoàn tác', onClick: () => addToCart({ ...removed }) } });
    }
  });
}

function renderDrawer() {
  const list = qs('[data-cart-items]');
  const foot = qs('[data-cart-foot]');
  if (!list) return;
  const cart = getCart();
  if (!cart.items.length) {
    list.innerHTML = `<div class="empty-state">${icon('bag')}<h3>Giỏ hàng đang trống</h3><p class="muted small">Hãy để Solène gợi ý những thiết kế được yêu thích nhất.</p><div style="display:grid;gap:.6rem;max-width:280px;margin:1.6rem auto 0"><a class="btn" href="/nhan-cau-hon/">Nhẫn cầu hôn</a><a class="btn btn--outline" href="/cua-hang/?sap-xep=ban-chay">Bán chạy nhất</a></div></div>`;
    foot?.setAttribute('hidden', '');
  } else {
    list.innerHTML = cart.items.map((i) => cartItemHTML(i, { compact: true })).join('');
    foot?.removeAttribute('hidden');
    const sub = qs('[data-cart-subtotal]');
    if (sub) sub.textContent = formatVND(cart.items.reduce((s, i) => s + i.price * i.qty, 0));
  }
}

let lastCount = -1;
function renderCounts() {
  const n = cartCount();
  qsa('[data-cart-count]').forEach((el) => {
    el.textContent = n > 99 ? '99+' : String(n);
    el.classList.toggle('is-visible', n > 0);
    if (lastCount >= 0 && n > lastCount) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
  });
  qsa('[data-cart-count-text]').forEach((el) => (el.textContent = `(${n})`));
  lastCount = n;
}

// ───────── wishlist buttons ─────────
export function syncWishButtons(root: ParentNode = document) {
  const list = getWishlist();
  qsa<HTMLButtonElement>('[data-wish]', root).forEach((b) => b.setAttribute('aria-pressed', String(list.includes(b.dataset.wish!))));
  qsa('[data-wish-count]').forEach((el) => {
    el.textContent = String(list.length);
    el.classList.toggle('is-visible', list.length > 0);
  });
}

export function initCartUI() {
  const list = qs('[data-cart-items]');
  if (list) bindCartList(list);
  renderDrawer();
  renderCounts();
  syncWishButtons();
  on('cart:change', () => { renderDrawer(); renderCounts(); });
  on('wishlist:change', () => syncWishButtons());

  document.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-wish]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(btn.dataset.wish!);
    const name = btn.dataset.name || btn.closest('.pcard')?.querySelector('.pcard__title')?.textContent?.trim() || 'Sản phẩm';
    toast(added
      ? { message: `Đã lưu “${name}” vào danh sách yêu thích.`, icon: 'heart', action: { label: 'Xem', href: '/yeu-thich/' } }
      : { message: `Đã bỏ “${name}” khỏi danh sách yêu thích.`, icon: 'heart' });
  });
}
