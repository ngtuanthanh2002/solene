import { escapeHTML, formatVND } from '../../lib/format';
import { getOrder } from '../store';
import { itemImage } from '../cart-ui';
import { qs, qsa, reducedMotion, toast } from '../ui';
import { totalsHTML } from './cart-page';

/** Hiệu ứng lấp lánh vàng khi đặt hàng thành công */
function sparkle(canvas: HTMLCanvasElement) {
  if (reducedMotion()) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const resize = () => { canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr; };
  resize();
  const colors = ['#151515', '#9c8462', '#d9d9d9', '#ffffff', '#bdbdbd'];
  const parts = Array.from({ length: 120 }, () => ({
    x: innerWidth / 2 + (Math.random() - 0.5) * 160, y: innerHeight * 0.32,
    vx: (Math.random() - 0.5) * 9, vy: -Math.random() * 10 - 3,
    s: Math.random() * 4 + 2, r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
    c: colors[(Math.random() * colors.length) | 0], star: Math.random() < 0.45, life: 1,
  }));
  const t0 = performance.now();
  const tick = (t: number) => {
    const el = (t - t0) / 1000;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of parts) {
      p.vy += 0.22; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      p.life = Math.max(0, 1 - el / 3.2);
      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.c;
      if (p.star) {
        ctx.beginPath();
        for (let i = 0; i < 8; i++) { const rr = i % 2 ? p.s * 0.35 : p.s * 1.6; const a = (i * Math.PI) / 4; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
        ctx.closePath(); ctx.fill();
      } else ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
      ctx.restore();
    }
    if (el < 3.3) requestAnimationFrame(tick); else ctx.clearRect(0, 0, innerWidth, innerHeight);
  };
  requestAnimationFrame(tick);
}

export function initSuccess() {
  const code = new URLSearchParams(location.search).get('ma') || '';
  const o = code ? getOrder(code) : undefined;
  if (!o) { qs('[data-success-missing]')!.hidden = false; return; }
  qs('[data-success-ok]')!.hidden = false;
  qs('[data-s-name]')!.textContent = o.customer.name.split(/\s+/).pop() || 'quý khách';
  qsa('[data-s-code], [data-s-code2]').forEach((e) => (e.textContent = o.code));
  qs('[data-s-amount]')!.textContent = formatVND(o.total);
  qs('[data-s-bank]')!.hidden = o.payment.method !== 'bank';
  qs('[data-s-items]')!.innerHTML = o.items.map((i) => `<li class="co-item"><span class="co-item__img"><img class="${i.image.startsWith('data:') ? 'svgimg' : ''}" src="${itemImage(i)}" alt="" width="64" height="80"><b>${i.qty}</b></span><span><span class="co-item__name">${escapeHTML(i.name)}</span><br><span class="co-item__opts">${i.optionsText.map(escapeHTML).join(' · ')}</span></span><span>${formatVND(i.price * i.qty)}</span></li>`).join('');
  qs('[data-s-totals]')!.innerHTML = totalsHTML({ subtotal: o.subtotal, discount: o.discount, shippingFee: o.shippingFee, total: o.total, promo: o.promo ? ({ code: o.promo } as any) : null });
  qs('[data-s-ship]')!.innerHTML = `<b>${escapeHTML(o.customer.name)}</b> · ${escapeHTML(o.customer.phone)}<br>${escapeHTML(o.shipping.address)}, ${escapeHTML(o.shipping.province)}<br><span class="muted">${escapeHTML(o.shipping.methodLabel)}</span>`;
  qs('[data-s-pay]')!.textContent = o.payment.label;
  const copy = async (text: string) => { try { await navigator.clipboard.writeText(text); toast({ message: `Đã sao chép: ${text}`, icon: 'check' }); } catch { window.prompt('Sao chép:', text); } };
  qsa<HTMLButtonElement>('[data-copy]').forEach((b) => b.addEventListener('click', () => copy(b.dataset.copy!)));
  qs('[data-copy-code]')?.addEventListener('click', () => copy(o.code));
  // chỉ bắn pháo hoa lần đầu mở đơn
  const key = `solene:celebrated:${o.code}`;
  try { if (!sessionStorage.getItem(key)) { sessionStorage.setItem(key, '1'); sparkle(qs<HTMLCanvasElement>('[data-sparkle]')!); } } catch { sparkle(qs<HTMLCanvasElement>('[data-sparkle]')!); }
}
