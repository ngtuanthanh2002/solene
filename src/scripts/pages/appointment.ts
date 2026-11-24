import { SITE } from '../../config';
import { SERVICES, formatApptDate, googleCalendarUrl } from '../../lib/calendar';
import { addAppointment, getCurrentUser, getSession, isEmail, isPhoneVN } from '../store';
import { qs, qsa, toast } from '../ui';

const TIMES = ['09:30', '10:30', '11:30', '13:30', '14:30', '15:30', '16:30', '17:30', '18:30', '19:30'];
const WD = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
/** Mô phỏng khung giờ đã kín (cố định theo ngày + showroom) */
const booked = (date: string, boutique: string, time: string) => {
  let h = 0;
  for (const c of date + boutique + time) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h % 4 === 0;
};

export function initAppointment() {
  const form = qs<HTMLFormElement>('[data-appt-form]');
  if (!form) return;
  const datesBox = qs('[data-dates]', form)!;
  const slotsBox = qs('[data-slots]', form)!;
  let date = '';
  let time = '';
  const params = new URLSearchParams(location.search);
  const svc = params.get('dich-vu');
  if (svc && SERVICES[svc]) form.querySelector<HTMLInputElement>(`input[name="service"][value="${svc}"]`)!.checked = true;
  const note = params.get('ghi-chu');
  if (note) (form.elements.namedItem('note') as HTMLTextAreaElement).value = note;
  const s = getSession();
  const u = getCurrentUser();
  if (s) {
    (form.elements.namedItem('name') as HTMLInputElement).value = s.name;
    (form.elements.namedItem('email') as HTMLInputElement).value = s.email;
    if (u?.phone) (form.elements.namedItem('phone') as HTMLInputElement).value = u.phone;
  }

  const boutique = () => form.querySelector<HTMLInputElement>('input[name="boutique"]:checked')!.value;

  const renderDates = () => {
    const days: Date[] = [];
    const now = new Date();
    for (let i = 0; i < 21; i++) { const d = new Date(now); d.setDate(now.getDate() + i); days.push(d); }
    // hôm nay đã quá giờ hẹn cuối → bắt đầu từ ngày mai
    const lastToday = new Date(now); lastToday.setHours(19, 0, 0, 0);
    const list = now > lastToday ? days.slice(1) : days;
    if (!date) date = iso(list[0]);
    datesBox.innerHTML = list.map((d) => `<button type="button" class="date-btn" role="radio" aria-checked="${iso(d) === date}" data-date="${iso(d)}"><small>${WD[d.getDay()]}</small><b>${d.getDate()}</b><small>Th${d.getMonth() + 1}</small></button>`).join('');
  };
  const renderSlots = () => {
    const now = Date.now();
    slotsBox.innerHTML = TIMES.map((t) => {
      const past = new Date(`${date}T${t}:00`).getTime() < now + 60 * 60 * 1000;
      const off = past || booked(date, boutique(), t);
      if (off && time === t) time = '';
      return `<button type="button" class="slot" role="radio" aria-checked="${time === t}" data-time="${t}" ${off ? 'disabled aria-disabled="true" title="Đã kín lịch"' : ''}>${t}</button>`;
    }).join('');
  };

  datesBox.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-date]');
    if (!b) return;
    date = b.dataset.date!;
    qsa('[data-date]', datesBox).forEach((x) => x.setAttribute('aria-checked', String(x === b)));
    renderSlots();
  });
  slotsBox.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-time]');
    if (!b || b.disabled) return;
    time = b.dataset.time!;
    qsa('[data-time]', slotsBox).forEach((x) => x.setAttribute('aria-checked', String(x === b)));
    const err = form.querySelector('[data-error-for="slot"]');
    if (err) err.textContent = '';
  });
  form.addEventListener('change', (e) => { if ((e.target as HTMLInputElement).name === 'boutique') renderSlots(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const v = (k: string) => String(fd.get(k) || '').trim();
    let first: HTMLElement | null = null;
    const err = (k: string, m: string) => {
      const box = form.querySelector(`[data-error-for="${k}"]`);
      if (box) box.textContent = m;
      const el = form.querySelector<HTMLElement>(`[name="${k}"]`);
      el?.closest('.field')?.classList.toggle('has-error', !!m);
      if (m) first ||= el || slotsBox;
    };
    err('slot', time ? '' : 'Vui lòng chọn khung giờ.');
    err('name', v('name').length > 1 ? '' : 'Vui lòng nhập họ tên.');
    err('phone', isPhoneVN(v('phone')) ? '' : 'Số điện thoại không hợp lệ.');
    err('email', !v('email') || isEmail(v('email')) ? '' : 'Email không hợp lệ.');
    if (first) { (first as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    const a = addAppointment({ service: v('service'), boutique: v('boutique'), date, time, name: v('name'), phone: v('phone'), email: v('email').toLowerCase(), note: v('note') || undefined, userId: getSession()?.userId });
    const b = SITE.boutiques.find((x) => x.id === a.boutique)!;
    form.hidden = true;
    const done = qs('[data-appt-done]')!;
    done.hidden = false;
    qs('[data-ad-boutique]')!.textContent = b.name;
    qs('[data-ad-when]')!.textContent = `${SERVICES[a.service]} · ${formatApptDate(a.date)} lúc ${a.time}`;
    qs('[data-ad-code]')!.textContent = `Mã lịch hẹn ${a.id} · ${b.address} · Hotline ${SITE.phone}`;
    qs<HTMLAnchorElement>('[data-ad-gcal]')!.href = googleCalendarUrl(a);
    done.scrollIntoView({ behavior: 'smooth', block: 'center' });
    toast({ title: 'Đặt lịch thành công', message: 'Chuyên viên sẽ gọi xác nhận trong ít phút.', icon: 'calendar' });
  });

  renderDates();
  renderSlots();
}
