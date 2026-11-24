/** Công cụ đo ni trên màn hình: hiệu chỉnh bằng thẻ chuẩn ISO/IEC 7810 (85,6 × 53,98 mm) */
import { sizeInfo } from '../../lib/catalog';
import { read, write } from '../store';
import { qs, qsa, toast } from '../ui';

const CARD_W = 85.6, CARD_H = 53.98;

export function niFromCircumference(c: number) { return Math.round(c - 40); }
const usFromDiameter = (d: number) => Math.max(0, Math.round(((d - 11.63) / 0.8128) * 4) / 4);
const fmt = (n: number, d = 1) => n.toLocaleString('vi-VN', { maximumFractionDigits: d, minimumFractionDigits: d });

export function initSizer() {
  const root = qs('[data-sizer]');
  if (root) {
    const ppmInput = qs<HTMLInputElement>('[data-ppm]', root)!;
    const diamInput = qs<HTMLInputElement>('[data-diam]', root)!;
    const card = qs('[data-card]', root)!;
    const circle = qs('[data-circle]', root)!;
    const panes = qsa<HTMLElement>('[data-pane]', root);
    const steps = qsa('[data-step-label]', root);
    const saved = read<{ ppm?: number }>('sizer', {});
    if (saved.ppm) ppmInput.value = String(saved.ppm);

    const ppm = () => Number(ppmInput.value);
    const drawCard = () => { card.style.width = `${CARD_W * ppm()}px`; card.style.height = `${CARD_H * ppm()}px`; };
    const drawCircle = () => {
      const d = Number(diamInput.value);
      circle.style.width = circle.style.height = `${d * ppm()}px`;
      const c = d * Math.PI;
      const ni = niFromCircumference(c);
      qs('[data-circle-mm]', root)!.textContent = `Ø ${fmt(d, 2)} mm`;
      qs('[data-r-ni]', root)!.textContent = String(ni);
      qs('[data-r-c]', root)!.textContent = `${fmt(c)} mm`;
      qs('[data-r-us]', root)!.textContent = String(usFromDiameter(d));
    };
    const show = (n: number) => {
      panes.forEach((p) => (p.hidden = p.dataset.pane !== String(n)));
      steps.forEach((s) => s.classList.toggle('is-active', Number(s.dataset.stepLabel) <= n));
    };
    ppmInput.addEventListener('input', drawCard);
    diamInput.addEventListener('input', drawCircle);
    qs('[data-next]', root)?.addEventListener('click', () => { write('sizer', { ppm: ppm() }); drawCircle(); show(2); });
    qs('[data-back]', root)?.addEventListener('click', () => show(1));
    qs('[data-save]', root)?.addEventListener('click', () => {
      const ni = niFromCircumference(Number(diamInput.value) * Math.PI);
      if (ni < 6 || ni > 22) { toast({ type: 'error', message: 'Ni ngoài khoảng 6–22, vui lòng kiểm tra lại hoặc đặt lịch đo tại showroom.' }); return; }
      write('mySize', ni);
      steps.forEach((s) => s.classList.add('is-active'));
      qs('[data-saved-note]', root)!.hidden = false;
      markRow(ni);
      toast({ title: `Ni của bạn: ${ni}`, message: 'Đã lưu — ni này sẽ được chọn sẵn khi bạn mua nhẫn.', icon: 'ring', action: { label: 'Mua nhẫn', href: '/nhan-cau-hon/' } });
    });
    drawCard();
    drawCircle();
  }

  // Đo bằng sợi chỉ
  const circ = qs<HTMLInputElement>('[data-circ]');
  const out = qs('[data-circ-out]');
  circ?.addEventListener('input', () => {
    const c = Number(circ.value);
    if (!out) return;
    if (!c || c < 40 || c > 75) { out.textContent = 'Nhập chu vi trong khoảng 40–75 mm'; return; }
    const ni = niFromCircumference(c);
    const s = sizeInfo(ni);
    out.innerHTML = `Ni tay của bạn:<b>${ni}</b>· đường kính ${fmt(s.diameter)} mm · size US ${s.us}`;
    markRow(ni);
  });

  const mine = read<number | null>('mySize', null);
  if (mine) markRow(mine);
}

function markRow(ni: number) {
  qsa('.size-table tr[data-ni]').forEach((tr) => tr.classList.toggle('is-mine', tr.getAttribute('data-ni') === String(ni)));
}
