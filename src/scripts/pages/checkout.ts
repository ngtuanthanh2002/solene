import { escapeHTML, formatVND } from '../../lib/format';
import { cartCount, checkPromo, clearCart, computeTotals, createOrder, getCart, getCurrentUser, getSession, isEmail, isPhoneVN, on, updateCart, updateUser, uid, type Address } from '../store';
import { itemImage } from '../cart-ui';
import { qs, toast } from '../ui';
import { totalsHTML } from './cart-page';

const COD_LIMIT = 50_000_000;
const EXPRESS_CITIES = ['TP. Hồ Chí Minh', 'Hà Nội'];

export function initCheckout() {
  const root = qs('[data-checkout]');
  const form = qs<HTMLFormElement>('[data-co-form]');
  if (!root || !form) return;
  const filled = qs('[data-co-filled]', root)!;
  const empty = qs('[data-co-empty]', root)!;
  const promoForm = qs<HTMLFormElement>('[data-promo-form]', root)!;
  const promoMsg = qs('[data-promo-msg]', root)!;
  let placing = false;

  const field = (n: string) => form.elements.namedItem(n) as HTMLInputElement | null;
  const shipFee = () => Number(form.querySelector<HTMLInputElement>('input[name="ship"]:checked')?.dataset.fee || 0);

  const renderSummary = () => {
    const cart = getCart();
    if (!cart.items.length) { if (!placing) { filled.hidden = true; empty.hidden = false; } return; }
    filled.hidden = false; empty.hidden = true;
    qs('[data-co-count]', root)!.textContent = `(${cartCount(cart)} sản phẩm)`;
    qs('[data-co-items]', root)!.innerHTML = cart.items.map((i) => `<li class="co-item"><span class="co-item__img"><img class="${i.image.startsWith('data:') ? 'svgimg' : ''}" src="${itemImage(i)}" alt="" width="64" height="80"><b>${i.qty}</b></span><span><span class="co-item__name">${escapeHTML(i.name)}</span><br><span class="co-item__opts">${i.optionsText.map(escapeHTML).join(' · ')}</span></span><span>${formatVND(i.price * i.qty)}</span></li>`).join('');
    const t = computeTotals(cart.items, cart.promo, shipFee());
    qs('[data-co-totals]', root)!.innerHTML = totalsHTML(t);
    qs('[data-co-total-btn]', root)!.textContent = formatVND(t.total);
    if (cart.promo && !promoForm.code.value) promoForm.code.value = cart.promo;
    const gift = qs('[data-co-gift]', root)!;
    gift.hidden = !cart.note;
    gift.textContent = cart.note ? `Thiệp viết tay: “${cart.note}”` : '';
    // COD chỉ cho đơn < 50 triệu
    const codInput = form.querySelector<HTMLInputElement>('input[name="pay"][value="cod"]')!;
    const codCard = codInput.closest('.option-card')!;
    const tooBig = t.total >= COD_LIMIT;
    codCard.classList.toggle('is-disabled', tooBig);
    codInput.disabled = tooBig;
    if (tooBig && codInput.checked) form.querySelector<HTMLInputElement>('input[name="pay"][value="bank"]')!.checked = true;
  };

  const syncExpress = () => {
    const p = field('province')?.value || '';
    const ok = !p || EXPRESS_CITIES.includes(p);
    const card = qs('[data-express]', form)!;
    const input = card.querySelector('input')!;
    card.classList.toggle('is-disabled', !ok);
    input.disabled = !ok;
    if (!ok && input.checked) form.querySelector<HTMLInputElement>('input[name="ship"][value="standard"]')!.checked = true;
  };

  // điền sẵn từ tài khoản
  const prefill = () => {
    const s = getSession();
    const u = getCurrentUser();
    qs('[data-co-login]', form)!.hidden = !!s;
    qs('[data-co-save-addr]', form)!.hidden = !s;
    if (!s) return;
    if (!field('email')!.value) field('email')!.value = s.email;
    if (u?.phone && !field('phone')!.value) field('phone')!.value = u.phone;
    if (!field('name')!.value) field('name')!.value = s.name;
    const addrs = u?.addresses || [];
    const wrap = qs('[data-co-saved]', form)!;
    const sel = qs<HTMLSelectElement>('[data-co-saved-select]', form)!;
    wrap.hidden = !addrs.length;
    if (addrs.length) {
      sel.innerHTML = addrs.map((a) => `<option value="${a.id}">${escapeHTML(a.name)} — ${escapeHTML(a.address)}, ${escapeHTML(a.province)}</option>`).join('') + '<option value="">+ Địa chỉ mới</option>';
      const apply = () => {
        const a = addrs.find((x) => x.id === sel.value);
        if (!a) { ['name', 'address', 'ward'].forEach((n) => (field(n)!.value = '')); field('province')!.value = ''; return; }
        const [street, ward = ''] = a.address.split(' | ');
        field('name')!.value = a.name; field('phone')!.value = a.phone; field('province')!.value = a.province; field('address')!.value = street; field('ward')!.value = ward;
        syncExpress(); renderSummary();
      };
      sel.onchange = apply;
      const def = addrs.find((a) => a.isDefault) || addrs[0];
      sel.value = def.id;
      apply();
    }
  };

  form.addEventListener('change', (e) => {
    const t = e.target as HTMLInputElement;
    if (t.name === 'province') syncExpress();
    if (t.matches('[data-invoice-toggle]')) qs('[data-invoice]', form)!.hidden = !t.checked;
    if (t.name) { const err = form.querySelector(`[data-error-for="${t.name}"]`); if (err) err.textContent = ''; t.closest('.field')?.classList.remove('has-error'); }
    renderSummary();
  });
  form.addEventListener('input', (e) => {
    const t = e.target as HTMLInputElement;
    if (t.name) { const err = form.querySelector(`[data-error-for="${t.name}"]`); if (err) err.textContent = ''; t.closest('.field')?.classList.remove('has-error'); }
  });

  promoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = String(promoForm.code.value || '').trim().toUpperCase();
    const res = checkPromo(code, getCart().items);
    promoMsg.textContent = res.message;
    promoMsg.className = `promo__msg tiny ${res.ok ? 'is-ok' : 'is-err'}`;
    updateCart({ promo: res.ok ? code : undefined });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const v = (k: string) => String(fd.get(k) || '').trim();
    let first: HTMLElement | null = null;
    const err = (k: string, m: string) => {
      const el = form.querySelector<HTMLElement>(`[name="${k}"]`);
      el?.closest('.field')?.classList.add('has-error');
      const box = form.querySelector(`[data-error-for="${k}"]`);
      if (box) box.textContent = m;
      first ||= el;
    };
    if (!isEmail(v('email'))) err('email', 'Email không hợp lệ.');
    if (!isPhoneVN(v('phone'))) err('phone', 'Số điện thoại Việt Nam gồm 10 số, ví dụ 0901 234 567.');
    if (v('name').length < 2) err('name', 'Vui lòng nhập họ tên người nhận.');
    if (!v('province')) err('province', 'Chọn tỉnh / thành phố.');
    if (!v('ward')) err('ward', 'Nhập phường / xã.');
    if (v('address').length < 4) err('address', 'Nhập số nhà, tên đường.');
    if (fd.get('invoice') === 'on') {
      if (!v('company')) err('company', 'Nhập tên công ty.');
      if (!/^\d{10}(-\d{3})?$/.test(v('taxCode'))) err('taxCode', 'Mã số thuế gồm 10 hoặc 13 số.');
    }
    if (fd.get('terms') !== 'on') err('terms', 'Vui lòng đồng ý với chính sách để tiếp tục.');
    const cart = getCart();
    if (!cart.items.length) { toast({ type: 'error', message: 'Giỏ hàng đang trống.' }); return; }
    if (first) {
      (first as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.setTimeout(() => (first as HTMLElement).focus({ preventScroll: true }), 400);
      toast({ type: 'error', message: 'Vui lòng kiểm tra lại thông tin được đánh dấu.' });
      return;
    }
    const shipInput = form.querySelector<HTMLInputElement>('input[name="ship"]:checked')!;
    const payInput = form.querySelector<HTMLInputElement>('input[name="pay"]:checked')!;
    const t = computeTotals(cart.items, cart.promo, Number(shipInput.dataset.fee || 0));
    if (payInput.value === 'cod' && t.total >= COD_LIMIT) { err('pay', 'COD chỉ áp dụng cho đơn dưới 50 triệu.'); return; }

    const btn = qs<HTMLButtonElement>('[data-co-submit]', form)!;
    btn.classList.add('is-loading');
    placing = true;
    const s = getSession();
    window.setTimeout(() => {
      const order = createOrder({
        userId: s?.userId, email: v('email').toLowerCase(),
        customer: { name: v('name'), phone: v('phone'), email: v('email').toLowerCase() },
        shipping: { province: v('province'), address: `${v('address')}, ${v('ward')}`, method: shipInput.value, methodLabel: shipInput.dataset.label!, fee: t.shippingFee },
        payment: { method: payInput.value, label: payInput.dataset.label! },
        items: cart.items, subtotal: t.subtotal, discount: t.discount, promo: t.promo?.code, shippingFee: t.shippingFee, total: t.total,
        note: v('note') || undefined, giftNote: cart.note,
        invoice: fd.get('invoice') === 'on' ? { company: v('company'), taxCode: v('taxCode'), address: v('companyAddress') } : undefined,
      });
      // lưu địa chỉ cho lần sau
      const u = getCurrentUser();
      if (u && fd.get('saveAddress') === 'on') {
        const addrs = u.addresses || [];
        const line = `${v('address')} | ${v('ward')}`;
        if (!addrs.some((a) => a.address === line && a.province === v('province'))) {
          const a: Address = { id: uid('a_'), name: v('name'), phone: v('phone'), province: v('province'), address: line, isDefault: !addrs.length };
          updateUser({ addresses: [...addrs, a], phone: u.phone || v('phone') });
        }
      }
      clearCart();
      window.location.href = `/dat-hang-thanh-cong/?ma=${encodeURIComponent(order.code)}`;
    }, 900);
  });

  prefill();
  syncExpress();
  renderSummary();
  on('cart:change', renderSummary);
  on('auth:change', () => { prefill(); renderSummary(); });
}
