import { formatVND } from '../../lib/format';
import { productCardHTML } from '../../lib/card';
import { cartCount, checkPromo, computeTotals, getCart, on, updateCart } from '../store';
import { bindCartList, cartItemHTML, syncWishButtons } from '../cart-ui';
import { loadProducts } from '../catalog-client';
import { markLoadedImages, qs } from '../ui';

export function totalsHTML(t: ReturnType<typeof computeTotals>, shippingLabel = 'Miễn phí') {
  return `<div class="totals__row"><span>Tạm tính</span><span>${formatVND(t.subtotal)}</span></div>
  ${t.discount ? `<div class="totals__row totals__row--discount"><span>Ưu đãi (${t.promo?.code})</span><span>−${formatVND(t.discount)}</span></div>` : ''}
  <div class="totals__row"><span>Giao hàng &amp; bảo hiểm</span><span>${t.shippingFee ? formatVND(t.shippingFee) : shippingLabel}</span></div>
  <div class="totals__row totals__row--grand"><span>Tổng cộng</span><span>${formatVND(t.total)}</span></div>
  <p class="tiny muted" style="margin:.3rem 0 0;text-align:right">Đã bao gồm VAT</p>`;
}

export function initCartPage() {
  const root = qs('[data-cartpage]');
  if (!root) return;
  const list = qs('[data-cp-list]', root)!;
  const filled = qs('[data-cp-filled]', root)!;
  const empty = qs('[data-cp-empty]', root)!;
  const totals = qs('[data-cp-totals]', root)!;
  const promoForm = qs<HTMLFormElement>('[data-promo-form]', root);
  const promoMsg = qs('[data-promo-msg]', root);
  const giftToggle = qs<HTMLInputElement>('[data-gift-toggle]', root);
  const giftNote = qs<HTMLTextAreaElement>('[data-gift-note]', root);
  bindCartList(list);

  const render = () => {
    const cart = getCart();
    const n = cartCount(cart);
    qs('[data-cp-count]', root)!.textContent = n ? `(${n})` : '';
    filled.hidden = !cart.items.length;
    empty.hidden = !!cart.items.length;
    if (!cart.items.length) return;
    list.innerHTML = cart.items.map((i) => cartItemHTML(i)).join('');
    const t = computeTotals(cart.items, cart.promo);
    totals.innerHTML = totalsHTML(t);
    if (promoForm && cart.promo && !promoForm.code.value) promoForm.code.value = cart.promo;
    if (cart.promo && !t.promo && promoMsg) { promoMsg.textContent = `Mã ${cart.promo} chưa đủ điều kiện áp dụng cho giỏ hàng hiện tại.`; promoMsg.className = 'promo__msg tiny is-err'; }
  };

  promoForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = String(promoForm.code.value || '').trim().toUpperCase();
    const res = checkPromo(code, getCart().items);
    if (promoMsg) { promoMsg.textContent = res.message; promoMsg.className = `promo__msg tiny ${res.ok ? 'is-ok' : 'is-err'}`; }
    updateCart({ promo: res.ok ? code : undefined });
  });

  const cart = getCart();
  if (giftToggle && giftNote) {
    giftToggle.checked = !!cart.note;
    giftNote.hidden = !cart.note;
    giftNote.value = cart.note || '';
    giftToggle.addEventListener('change', () => { giftNote.hidden = !giftToggle.checked; if (giftToggle.checked) giftNote.focus(); else updateCart({ note: undefined }); });
    giftNote.addEventListener('change', () => updateCart({ note: giftNote.value.trim() || undefined }));
  }

  render();
  on('cart:change', render);

  // gợi ý
  loadProducts().then((all) => {
    const inCart = new Set(getCart().items.map((i) => i.id));
    const picks = all.filter((p) => !inCart.has(p.id) && (p.category === 'phu-kien' || p.category === 'trang-suc')).sort((a, b) => b.sold - a.sold).slice(0, 4);
    const grid = qs('[data-cp-suggest-grid]');
    if (!grid || !picks.length) return;
    grid.innerHTML = picks.map((p, i) => productCardHTML(p, { index: i })).join('');
    qs('[data-cp-suggest]')!.hidden = false;
    syncWishButtons(grid);
    markLoadedImages(grid);
  }).catch(() => {});
}
