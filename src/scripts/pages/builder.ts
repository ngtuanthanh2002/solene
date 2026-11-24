/** Công cụ Thiết kế nhẫn: xem trước SVG + báo giá + thêm vào giỏ */
import { ringSVG, svgDataUri } from '../../lib/ring-svg';
import { METALS, STYLES, type MetalKey, type RingStyle, type Shape } from '../../lib/catalog';
import { QUALITIES, caratToMm, quote, shapeLabel, styleLabel, type BuildConfig, type QualityKey } from '../../lib/pricing';
import { formatVND } from '../../lib/format';
import { addToCart, read } from '../store';
import { flyToCart, openDrawer, qs, qsa, toast } from '../ui';

export function initBuilder() {
  const root = qs('[data-builder]');
  const form = qs<HTMLFormElement>('[data-builder-form]');
  const caratInput = qs<HTMLInputElement>('[data-carat]');
  if (!root || !form || !caratInput) return;
  const layers = qsa('.builder__layer', root);
  let active = 0;

  // ── khôi phục cấu hình từ URL (liên kết chia sẻ / từ trang danh mục) ──
  const url = new URL(location.href);
  const setRadio = (name: string, value: string | null) => {
    if (!value) return;
    const el = form.querySelector<HTMLInputElement>(`input[name="${name}"][value="${CSS.escape(value)}"]`);
    if (el) el.checked = true;
  };
  setRadio('style', url.searchParams.get('kieu-dang'));
  setRadio('shape', url.searchParams.get('vien-chu'));
  setRadio('metal', url.searchParams.get('chat-lieu'));
  setRadio('quality', url.searchParams.get('chat-luong'));
  const ctParam = Number(url.searchParams.get('carat'));
  if (ctParam >= 0.3 && ctParam <= 3) caratInput.value = String(ctParam);

  const val = (n: string) => form.querySelector<HTMLInputElement>(`input[name="${n}"]:checked`)?.value || '';
  const cfg = (): BuildConfig => ({
    style: val('style') as RingStyle, shape: val('shape') as Shape, metal: val('metal') as MetalKey,
    quality: val('quality') as QualityKey, carat: Math.round(Number(caratInput.value) * 100) / 100,
  });
  const caption = (c: BuildConfig) => `${styleLabel(c.style)} · ${shapeLabel(c.shape)} · ${c.carat.toFixed(2)} ct · ${METALS[c.metal].label}`;
  const setText = (sel: string, text: string) => qsa(sel).forEach((e) => (e.textContent = text));

  let lastShapeKey = '';
  let lastTotal = 0;
  const render = (crossfade: boolean) => {
    const c = cfg();
    const q = quote(c);
    const cap = caption(c);
    const shapeKey = `${c.style}|${c.shape}|${c.metal}`;
    const svg = ringSVG({ ...c, uid: 'b' + Math.random().toString(36).slice(2, 7), title: cap });
    if (crossfade && shapeKey !== lastShapeKey) {
      const next = layers[1 - active];
      next.innerHTML = svg;
      next.classList.add('is-active');
      layers[active].classList.remove('is-active');
      active = 1 - active;
    } else {
      layers[active].innerHTML = svg;
    }
    lastShapeKey = shapeKey;

    setText('[data-caption]', cap);
    setText('[data-fact-mm]', `≈ ${caratToMm(c.carat)} ly`);
    setText('[data-sum="style"]', styleLabel(c.style));
    setText('[data-sum="shape"]', `${shapeLabel(c.shape)} · ${c.carat.toFixed(2)} ct`);
    setText('[data-sum="metal"]', METALS[c.metal].label);
    const desc = STYLES.find((s) => s.key === c.style)?.desc || '';
    setText('[data-style-desc]', desc);
    const out = qs('[data-carat-out]');
    if (out) out.innerHTML = `<b>${c.carat.toFixed(2)} ct</b> · ≈ ${caratToMm(c.carat)} ly`;
    caratInput.style.setProperty('--fill', `${((c.carat - 0.3) / 2.7) * 100}%`);
    qsa<HTMLButtonElement>('[data-carat-chip]').forEach((b) => b.classList.toggle('is-active', Number(b.dataset.caratChip) === c.carat));

    const quality = QUALITIES.find((x) => x.key === c.quality)!;
    setText('[data-q-setting-label]', `${styleLabel(c.style)} · ${METALS[c.metal].label}`);
    setText('[data-q-setting]', formatVND(q.setting));
    setText('[data-q-center-label]', `${shapeLabel(c.shape)} ${c.carat.toFixed(2)} ct · ${quality.grade} · GIA`);
    setText('[data-q-center]', formatVND(q.center));
    const sidesRow = qs('[data-q-sides-row]');
    if (sidesRow) sidesRow.hidden = !q.sides;
    setText('[data-q-sides]', formatVND(q.sides));
    setText('[data-q-total]', formatVND(q.total));
    setText('[data-q-total-bar]', formatVND(q.total));
    setText('[data-q-month]', formatVND(Math.round(q.total / 12 / 1000) * 1000));
    if (lastTotal && lastTotal !== q.total) {
      const t = qs('[data-q-total]');
      t?.classList.remove('flash'); void t?.offsetWidth; t?.classList.add('flash');
      window.setTimeout(() => t?.classList.remove('flash'), 600);
    }
    lastTotal = q.total;

    const band = qs('[data-b-band]');
    band?.style.setProperty('--band', METALS[c.metal].swatch);
    const appt = qs<HTMLAnchorElement>('[data-builder-appt]');
    if (appt) appt.href = `/dat-lich-hen/?dich-vu=thiet-ke-rieng&ghi-chu=${encodeURIComponent(`Thiết kế: ${cap} · ${quality.grade} · ${formatVND(q.total)}`)}`;

    const u = new URL(location.href);
    u.searchParams.set('kieu-dang', c.style);
    u.searchParams.set('vien-chu', c.shape);
    u.searchParams.set('carat', String(c.carat));
    u.searchParams.set('chat-lieu', c.metal);
    u.searchParams.set('chat-luong', c.quality);
    history.replaceState(history.state, '', u.pathname + u.search);
  };

  form.addEventListener('change', (e) => {
    const t = e.target as HTMLInputElement;
    if (t.name === 'carat') return;
    if (t.name === 'size') { t.closest('.field')?.classList.remove('has-error'); const err = form.querySelector('[data-error-for="size"]'); if (err) err.textContent = ''; return; }
    render(true);
  });
  let raf = 0;
  caratInput.addEventListener('input', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => render(false)); });
  qsa<HTMLButtonElement>('[data-carat-chip]').forEach((b) => b.addEventListener('click', () => { caratInput.value = b.dataset.caratChip!; render(false); }));

  const engrave = form.querySelector<HTMLInputElement>('[name="engraving"]');
  engrave?.addEventListener('input', () => setText('[data-b-engrave]', engrave.value.trim() || 'Forever yours'));

  const add = () => {
    const size = form.querySelector<HTMLSelectElement>('[name="size"]')!;
    if (!size.value) {
      size.closest('.field')?.classList.add('has-error');
      const err = form.querySelector('[data-error-for="size"]');
      if (err) err.textContent = 'Vui lòng chọn ni tay';
      size.scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.setTimeout(() => size.focus(), 400);
      toast({ type: 'error', message: 'Chọn ni tay để hoàn tất thiết kế.', action: { label: 'Đo ni', href: '/huong-dan-do-ni-tay/' } });
      return;
    }
    const c = cfg();
    const q = quote(c);
    const quality = QUALITIES.find((x) => x.key === c.quality)!;
    const engraving = engrave?.value.trim() || '';
    const svg = ringSVG({ ...c, uid: 'cart' });
    const optionsText = [
      `${styleLabel(c.style)} · ${shapeLabel(c.shape)} ${c.carat.toFixed(2)} ct`,
      `Kim cương ${quality.grade} · GIA`,
      METALS[c.metal].label,
      `Ni ${size.value}`,
    ];
    if (engraving) optionsText.push(`Khắc: “${engraving}”`);
    addToCart({
      id: 'SL-CUSTOM', slug: 'thiet-ke-nhan', name: 'Nhẫn thiết kế riêng', image: svgDataUri(svg), price: q.total, category: 'nhan-cau-hon',
      options: { style: c.style, shape: c.shape, carat: String(c.carat), quality: c.quality, metal: c.metal, size: size.value, ...(engraving ? { engraving } : {}) },
      optionsText, custom: true,
    });
    flyToCart(qs('.builder__layer.is-active'));
    toast({ title: 'Đã thêm thiết kế vào giỏ', message: 'Chuyên viên sẽ gọi xác nhận viên kim cương GIA trong 24 giờ.', icon: 'sparkle' });
    window.setTimeout(() => openDrawer('cart'), 420);
  };
  qsa('[data-builder-add]').forEach((b) => b.addEventListener('click', add));

  qs('[data-builder-share]')?.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(location.href); toast({ message: 'Đã sao chép liên kết — gửi cho người thương hoặc bạn bè để xin ý kiến nhé!', icon: 'check' }); }
    catch { window.prompt('Sao chép liên kết thiết kế:', location.href); }
  });

  const mySize = read<number | null>('mySize', null);
  const sizeSel = form.querySelector<HTMLSelectElement>('[name="size"]');
  if (mySize && sizeSel && !sizeSel.value) sizeSel.value = String(mySize);

  lastShapeKey = '';
  render(false);
}
