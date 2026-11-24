import { escapeHTML, formatDate, formatVND } from '../../lib/format';
import { icon } from '../../lib/icons';
import { productCardHTML } from '../../lib/card';
import { googleCalendarUrl, formatApptDate, SERVICES } from '../../lib/calendar';
import { SITE } from '../../config';
import {
  addToCart, cancelAppointment, cancelOrder, canCancel, changePassword, getCurrentUser, getMyOrders, getSession, getWishlist,
  isPhoneVN, myAppointments, on, orderStatus, ORDER_STEPS, passwordScore, uid, updateUser, type Address, type Order,
} from '../store';
import { itemImage, syncWishButtons } from '../cart-ui';
import { loadProducts } from '../catalog-client';
import { markLoadedImages, openDrawer, qs, qsa, toast } from '../ui';

const TABS = ['tong-quan', 'don-hang', 'lich-hen', 'yeu-thich', 'thong-tin', 'dia-chi', 'bao-mat'];
const TIERS = [
  { name: 'Silver', min: 0, next: 50e6 },
  { name: 'Gold', min: 50e6, next: 200e6 },
  { name: 'Diamond', min: 200e6, next: Infinity },
];
const spent = (orders: Order[]) => orders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);

function orderHTML(o: Order) {
  const st = orderStatus(o);
  const steps = ORDER_STEPS.map((s, i) => `<li class="${st.step >= i ? 'is-done' : ''}${st.step === i ? ' is-current' : ''}">${s}</li>`).join('');
  return `<article class="order" data-order="${o.code}">
    <div class="order__head">
      <div><span class="order__code">${o.code}</span><br><span class="tiny muted">Đặt lúc ${formatDate(o.createdAt, true)}</span></div>
      <span class="pill pill--${st.tone === 'red' ? 'red' : st.tone === 'green' ? 'green' : st.tone === 'gold' ? 'gold' : 'dark'}">${st.label}</span>
      <b>${formatVND(o.total)}</b>
    </div>
    <div class="order__thumbs">${o.items.slice(0, 5).map((i) => `<img class="${i.image.startsWith('data:') ? 'svgimg' : ''}" src="${itemImage(i)}" alt="${escapeHTML(i.name)}" title="${escapeHTML(i.name)}" loading="lazy">`).join('')}</div>
    <div class="order__body">
      ${st.step >= 0 ? `<ol class="timeline" role="list">${steps}</ol>` : `<p class="small muted" style="margin:0">Đơn hàng đã hủy lúc ${formatDate(o.cancelledAt || o.createdAt, true)}.</p>`}
      <details><summary>Chi tiết đơn hàng</summary>
        <ul class="co-items" role="list" style="margin-top:1rem">${o.items.map((i) => `<li class="co-item"><span class="co-item__img"><img class="${i.image.startsWith('data:') ? 'svgimg' : ''}" src="${itemImage(i)}" alt=""><b>${i.qty}</b></span><span><span class="co-item__name">${escapeHTML(i.name)}</span><br><span class="co-item__opts">${i.optionsText.map(escapeHTML).join(' · ')}</span></span><span>${formatVND(i.price * i.qty)}</span></li>`).join('')}</ul>
        <p class="small" style="margin:0">${escapeHTML(o.customer.name)} · ${escapeHTML(o.customer.phone)}<br>${escapeHTML(o.shipping.address)}, ${escapeHTML(o.shipping.province)} · ${escapeHTML(o.shipping.methodLabel)}<br>${escapeHTML(o.payment.label)}${o.discount ? ` · Ưu đãi ${o.promo}: −${formatVND(o.discount)}` : ''}</p>
      </details>
      <div class="order__actions">
        <button class="btn btn--sm" type="button" data-reorder="${o.code}">${icon('refresh')}Mua lại</button>
        ${canCancel(o) ? `<button class="btn btn--outline btn--sm" type="button" data-cancel-order="${o.code}">Hủy đơn</button>` : ''}
        <a class="btn btn--outline btn--sm" href="tel:${SITE.phoneHref.replace('tel:', '')}">${icon('phone')}Hỗ trợ</a>
      </div>
    </div>
  </article>`;
}

export function initAccount() {
  const guest = qs('[data-guest]');
  const acc = qs('[data-account]');
  if (!guest || !acc) return;

  const showTab = (tab: string) => {
    const t = TABS.includes(tab) ? tab : 'tong-quan';
    qsa<HTMLElement>('[data-acc-panel]').forEach((p) => (p.hidden = p.dataset.accPanel !== t));
    qsa('[data-acc-tab]').forEach((a) => a.setAttribute('aria-current', String(a.getAttribute('data-acc-tab') === t)));
  };

  const renderOverview = (orders: Order[]) => {
    const u = getCurrentUser()!;
    const total = spent(orders);
    const tier = [...TIERS].reverse().find((t) => total >= t.min)!;
    const pct = tier.next === Infinity ? 100 : Math.min(100, ((total - tier.min) / (tier.next - tier.min)) * 100);
    const appts = myAppointments().filter((a) => a.status !== 'cancelled');
    const latest = orders[0];
    qs('[data-acc-panel="tong-quan"]')!.innerHTML = `
      <div class="tier-card"><span class="caps" style="color:var(--c-gold-2)">Hạng thành viên</span><p class="serif">Solène Circle <em>${tier.name}</em></p>
        <div class="tier-bar"><i style="width:${pct}%"></i></div>
        <span class="tiny" style="color:#a3a3a3">${tier.next === Infinity ? 'Bạn đang ở hạng cao nhất — tận hưởng dịch vụ concierge riêng.' : `Chi tiêu thêm ${formatVND(tier.next - total)} để lên hạng ${TIERS[TIERS.indexOf(tier) + 1].name}.`}</span></div>
      <div class="acc-stats">
        <div><b>${orders.length}</b><span>Đơn hàng</span></div>
        <div><b>${formatVND(total).replace(' ₫', '')}</b><span>Tổng chi tiêu (₫)</span></div>
        <div><b>${getWishlist().length}</b><span>Yêu thích</span></div>
        <div><b>${appts.length}</b><span>Lịch hẹn</span></div>
      </div>
      <h2 class="acc-h">Đơn hàng gần nhất</h2>
      ${latest ? orderHTML(latest) : `<div class="empty-state" style="padding:2rem 1rem">${icon('package')}<p class="muted">Bạn chưa có đơn hàng nào.</p><a class="btn" href="/cua-hang/">Khám phá cửa hàng</a></div>`}
      <p class="small muted">Thành viên từ ${formatDate(u.createdAt)} · Đăng nhập bằng ${u.provider === 'google' ? 'Google' : 'email'}</p>`;
  };

  const renderOrders = (orders: Order[]) => {
    qs('[data-acc-panel="don-hang"]')!.innerHTML = `<h2 class="acc-h">Đơn hàng của tôi</h2>` + (orders.length
      ? orders.map(orderHTML).join('')
      : `<div class="empty-state">${icon('package')}<h3>Chưa có đơn hàng</h3><p class="muted">Các đơn hàng bạn đặt sẽ xuất hiện tại đây để theo dõi tiến độ.</p><a class="btn" href="/cua-hang/">Mua sắm ngay</a></div>`);
  };

  const renderAppts = () => {
    const list = myAppointments();
    qs('[data-acc-panel="lich-hen"]')!.innerHTML = `<div class="acc-row"><h2 class="acc-h">Lịch hẹn</h2><a class="btn btn--outline btn--sm" href="/dat-lich-hen/">${icon('plus')}Đặt lịch mới</a></div>` + (list.length
      ? list.map((a) => {
          const b = SITE.boutiques.find((x) => x.id === a.boutique) || SITE.boutiques[0];
          const past = new Date(`${a.date}T${a.time}:00`).getTime() < Date.now();
          const status = a.status === 'cancelled' ? '<span class="pill pill--red">Đã hủy</span>' : past ? '<span class="pill">Đã diễn ra</span>' : '<span class="pill pill--green">Đã xác nhận</span>';
          return `<article class="appt"><div class="appt__top"><span class="appt__date">${formatApptDate(a.date)} · ${a.time}</span>${status}</div>
            <span><b>${escapeHTML(SERVICES[a.service] || a.service)}</b> · ${escapeHTML(b.name)}</span><span class="muted">${escapeHTML(b.address)} · Mã hẹn ${a.id}</span>
            ${a.status !== 'cancelled' && !past ? `<div class="order__actions" style="margin-top:.5rem"><a class="btn btn--sm" target="_blank" rel="noopener" href="${googleCalendarUrl(a)}">${icon('calendar')}Thêm vào Google Calendar</a><button class="btn btn--outline btn--sm" type="button" data-cancel-appt="${a.id}">Hủy lịch</button></div>` : ''}</article>`;
        }).join('')
      : `<div class="empty-state">${icon('calendar')}<h3>Chưa có lịch hẹn</h3><p class="muted">Đặt lịch để được tư vấn riêng và xem kim cương trực tiếp tại showroom.</p><a class="btn" href="/dat-lich-hen/">Đặt lịch hẹn</a></div>`);
  };

  const renderWish = async () => {
    const panel = qs('[data-acc-panel="yeu-thich"]')!;
    const ids = getWishlist();
    if (!ids.length) { panel.innerHTML = `<h2 class="acc-h">Yêu thích</h2><div class="empty-state">${icon('heart')}<h3>Danh sách trống</h3><p class="muted">Nhấn biểu tượng trái tim trên sản phẩm để lưu lại.</p><a class="btn" href="/cua-hang/">Khám phá</a></div>`; return; }
    try {
      const all = await loadProducts();
      const items = ids.map((id) => all.find((p) => p.id === id)).filter(Boolean);
      panel.innerHTML = `<h2 class="acc-h">Yêu thích (${items.length})</h2><div class="product-grid">${items.map((p, i) => productCardHTML(p!, { index: i })).join('')}</div>`;
      syncWishButtons(panel);
      markLoadedImages(panel);
    } catch { panel.innerHTML = '<p class="muted">Không tải được danh sách.</p>'; }
  };

  const fillProfile = () => {
    const u = getCurrentUser()!;
    const f = qs<HTMLFormElement>('[data-profile-form]')!;
    (f.elements.namedItem('name') as HTMLInputElement).value = u.name;
    (f.elements.namedItem('email') as HTMLInputElement).value = u.email;
    (f.elements.namedItem('phone') as HTMLInputElement).value = u.phone || '';
    (f.elements.namedItem('birthday') as HTMLInputElement).value = u.birthday || '';
    (f.elements.namedItem('anniversary') as HTMLInputElement).value = u.anniversary || '';
    (f.elements.namedItem('newsletter') as HTMLInputElement).checked = !!u.newsletter;
    const isGoogleOnly = !u.hash;
    qs('[data-sec-google]')!.hidden = u.provider !== 'google';
    qs('[data-pw-current]')!.hidden = isGoogleOnly;
  };

  const renderAddresses = () => {
    const u = getCurrentUser()!;
    const list = u.addresses || [];
    qs('[data-addr-list]')!.innerHTML = list.length
      ? list.map((a) => `<div class="addr${a.isDefault ? ' is-default' : ''}"><b>${escapeHTML(a.name)}${a.isDefault ? ' <span class="pill pill--gold">Mặc định</span>' : ''}</b><span>${escapeHTML(a.phone)}</span><span class="muted">${escapeHTML(a.address.replace(' | ', ', '))}, ${escapeHTML(a.province)}</span>
          <div class="addr__actions"><button type="button" class="link-inline small" data-addr-edit="${a.id}">Sửa</button>${a.isDefault ? '' : `<button type="button" class="link-inline small" data-addr-default="${a.id}">Đặt mặc định</button>`}<button type="button" class="link-inline small" data-addr-del="${a.id}">Xóa</button></div></div>`).join('')
      : '<p class="muted small">Chưa có địa chỉ nào. Địa chỉ sẽ được lưu tự động khi bạn đặt hàng.</p>';
  };

  const render = () => {
    const s = getSession();
    const u = getCurrentUser();
    guest.hidden = !!(s && u);
    acc.hidden = !(s && u);
    if (!s || !u) return;
    const orders = getMyOrders();
    qs('[data-acc-name]')!.textContent = u.name.split(/\s+/).pop() || u.name;
    qs('[data-acc-meta]')!.textContent = `${u.email}${u.phone ? ' · ' + u.phone : ''}`;
    const total = spent(orders);
    qs('[data-acc-tier]')!.textContent = `Solène Circle · ${[...TIERS].reverse().find((t) => total >= t.min)!.name}`;
    qs('[data-acc-avatar]')!.innerHTML = u.avatar ? `<img src="${escapeHTML(u.avatar)}" alt="" referrerpolicy="no-referrer">` : escapeHTML(u.name.trim().charAt(0).toUpperCase());
    renderOverview(orders);
    renderOrders(orders);
    renderAppts();
    renderWish();
    fillProfile();
    renderAddresses();
    showTab(location.hash.slice(1));
  };

  window.addEventListener('hashchange', () => showTab(location.hash.slice(1)));

  // ── hành động ──
  acc.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const cancelBtn = t.closest<HTMLElement>('[data-cancel-order]');
    if (cancelBtn) {
      if (confirm('Bạn chắc chắn muốn hủy đơn hàng này?')) { cancelOrder(cancelBtn.dataset.cancelOrder!); toast({ message: 'Đơn hàng đã được hủy.', icon: 'info' }); render(); }
      return;
    }
    const re = t.closest<HTMLElement>('[data-reorder]');
    if (re) {
      const o = getMyOrders().find((x) => x.code === re.dataset.reorder);
      o?.items.forEach((i) => addToCart({ ...i }));
      toast({ message: 'Đã thêm lại các sản phẩm vào giỏ hàng.', icon: 'bag' });
      openDrawer('cart');
      return;
    }
    const ca = t.closest<HTMLElement>('[data-cancel-appt]');
    if (ca) { if (confirm('Hủy lịch hẹn này?')) { cancelAppointment(ca.dataset.cancelAppt!); renderAppts(); toast({ message: 'Đã hủy lịch hẹn.', icon: 'calendar' }); } return; }
    const u = getCurrentUser();
    if (!u) return;
    const addrs = [...(u.addresses || [])];
    const del = t.closest<HTMLElement>('[data-addr-del]');
    if (del) { const rest = addrs.filter((a) => a.id !== del.dataset.addrDel); if (rest.length && !rest.some((a) => a.isDefault)) rest[0].isDefault = true; updateUser({ addresses: rest }); renderAddresses(); return; }
    const def = t.closest<HTMLElement>('[data-addr-default]');
    if (def) { updateUser({ addresses: addrs.map((a) => ({ ...a, isDefault: a.id === def.dataset.addrDefault })) }); renderAddresses(); return; }
    const edit = t.closest<HTMLElement>('[data-addr-edit]');
    if (edit || t.closest('[data-addr-new]')) {
      const f = qs<HTMLFormElement>('[data-addr-form]')!;
      f.reset();
      const a = addrs.find((x) => x.id === edit?.dataset.addrEdit);
      const set = (n: string, v: string) => ((f.elements.namedItem(n) as HTMLInputElement).value = v);
      if (a) { const [street, ward = ''] = a.address.split(' | '); set('id', a.id); set('name', a.name); set('phone', a.phone); set('province', a.province); set('ward', ward); set('street', street); (f.elements.namedItem('isDefault') as HTMLInputElement).checked = !!a.isDefault; }
      else { set('id', ''); set('name', u.name); set('phone', u.phone || ''); }
      f.hidden = false;
      f.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (t.closest('[data-addr-cancel]')) qs('[data-addr-form]')!.hidden = true;
  });

  const setErr = (f: HTMLFormElement, n: string, m: string) => {
    const e = f.querySelector(`[data-error-for="${n}"]`);
    if (e) e.textContent = m;
    f.querySelector(`[name="${n}"]`)?.closest('.field')?.classList.toggle('has-error', !!m);
  };

  qs<HTMLFormElement>('[data-addr-form]')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.currentTarget as HTMLFormElement;
    const fd = new FormData(f);
    const v = (k: string) => String(fd.get(k) || '').trim();
    let bad = false;
    for (const [k, ok, m] of [['name', v('name').length > 1, 'Nhập họ tên'], ['phone', isPhoneVN(v('phone')), 'Số điện thoại không hợp lệ'], ['province', !!v('province'), 'Chọn tỉnh/thành'], ['ward', !!v('ward'), 'Nhập phường/xã'], ['street', v('street').length > 3, 'Nhập địa chỉ']] as const) {
      setErr(f, k, ok ? '' : m); if (!ok) bad = true;
    }
    if (bad) return;
    const u = getCurrentUser()!;
    let addrs: Address[] = [...(u.addresses || [])];
    const isDefault = fd.get('isDefault') === 'on' || !addrs.length;
    const a: Address = { id: v('id') || uid('a_'), name: v('name'), phone: v('phone'), province: v('province'), address: `${v('street')} | ${v('ward')}`, isDefault };
    if (isDefault) addrs = addrs.map((x) => ({ ...x, isDefault: false }));
    const idx = addrs.findIndex((x) => x.id === a.id);
    if (idx >= 0) addrs[idx] = a; else addrs.push(a);
    updateUser({ addresses: addrs });
    f.hidden = true;
    renderAddresses();
    toast({ message: 'Đã lưu địa chỉ.', icon: 'pin' });
  });

  qs<HTMLFormElement>('[data-profile-form]')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.currentTarget as HTMLFormElement;
    const fd = new FormData(f);
    const name = String(fd.get('name') || '').trim();
    const phone = String(fd.get('phone') || '').trim();
    setErr(f, 'name', name.length < 2 ? 'Vui lòng nhập họ tên' : '');
    setErr(f, 'phone', phone && !isPhoneVN(phone) ? 'Số điện thoại không hợp lệ' : '');
    if (name.length < 2 || (phone && !isPhoneVN(phone))) return;
    updateUser({ name, phone: phone || undefined, birthday: String(fd.get('birthday') || '') || undefined, anniversary: String(fd.get('anniversary') || '') || undefined, newsletter: fd.get('newsletter') === 'on' });
    toast({ message: 'Đã cập nhật thông tin cá nhân.', icon: 'check' });
  });

  qs<HTMLFormElement>('[data-pw-form]')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.currentTarget as HTMLFormElement;
    const fd = new FormData(f);
    const cur = String(fd.get('current') || ''), next = String(fd.get('next') || ''), next2 = String(fd.get('next2') || '');
    setErr(f, 'next', next.length < 8 ? 'Tối thiểu 8 ký tự' : passwordScore(next) < 2 ? 'Nên kết hợp chữ hoa, chữ thường và số' : '');
    setErr(f, 'next2', next !== next2 ? 'Mật khẩu nhập lại không khớp' : '');
    if (next.length < 8 || passwordScore(next) < 2 || next !== next2) return;
    try { await changePassword(cur, next); f.reset(); setErr(f, 'current', ''); fillProfile(); toast({ message: 'Đã cập nhật mật khẩu.', icon: 'lock' }); }
    catch (ex: any) { setErr(f, 'current', ex.message); }
  });

  render();
  on('auth:change', render);
  on('orders:change', render);
  on('wishlist:change', () => { if (getSession()) renderWish(); });
}
