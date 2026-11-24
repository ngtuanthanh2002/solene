/**
 * Bộ vẽ nhẫn SVG tham số hóa (chạy được cả server & client).
 *  - mode "line": icon nét mảnh cho mega menu / bộ lọc (dùng currentColor)
 *  - mode "color": minh họa màu kim loại + kim cương cho trình Thiết kế nhẫn
 */
import type { MetalKey, RingStyle, Shape } from './catalog';

export interface RingOptions {
  style: RingStyle;
  shape: Shape;
  metal?: MetalKey;
  carat?: number;
  mode?: 'color' | 'line';
  uid?: string;
  strokeWidth?: number;
  title?: string;
  className?: string;
}

type Pt = [number, number];
const f = (n: number) => Math.round(n * 100) / 100;
const rad = (deg: number) => (deg * Math.PI) / 180;

/** Kích thước tương đối của từng dáng viên (theo bán kính R) */
const EXT: Record<Shape, { top: number; bottom: number; half: number }> = {
  round: { top: 1, bottom: 1, half: 1 },
  oval: { top: 1.06, bottom: 1.06, half: 0.76 },
  cushion: { top: 0.81, bottom: 0.81, half: 0.81 },
  princess: { top: 0.78, bottom: 0.78, half: 0.78 },
  emerald: { top: 0.87, bottom: 0.87, half: 0.61 },
  pear: { top: 1.18, bottom: 1.18, half: 0.84 },
  heart: { top: 0.8, bottom: 1, half: 0.95 },
};

const METAL_STOPS: Record<MetalKey, [string, string, string, string]> = {
  'vang-trang-18k': ['#FFFFFF', '#E4E4DF', '#B9B9B2', '#8E8E88'],
  'vang-vang-18k': ['#FFF3CF', '#EBC678', '#BD8D3A', '#8A6224'],
  'vang-hong-18k': ['#FFE9DE', '#EAB49A', '#C07F64', '#8F5641'],
  'bach-kim': ['#FFFFFF', '#DCDDE4', '#AEB0BB', '#81838F'],
};

// ---------------- shapes ----------------
function circlePath(cx: number, cy: number, r: number) {
  return `M${f(cx - r)},${f(cy)}a${f(r)},${f(r)} 0 1,0 ${f(2 * r)},0a${f(r)},${f(r)} 0 1,0 ${f(-2 * r)},0Z`;
}
function ellipsePath(cx: number, cy: number, rx: number, ry: number) {
  return `M${f(cx - rx)},${f(cy)}a${f(rx)},${f(ry)} 0 1,0 ${f(2 * rx)},0a${f(rx)},${f(ry)} 0 1,0 ${f(-2 * rx)},0Z`;
}
function rectPath(cx: number, cy: number, w: number, h: number) {
  const x = cx - w / 2, y = cy - h / 2;
  return `M${f(x)},${f(y)}H${f(x + w)}V${f(y + h)}H${f(x)}Z`;
}
function roundRectPath(cx: number, cy: number, w: number, h: number, r: number) {
  const x = cx - w / 2, y = cy - h / 2;
  return `M${f(x + r)},${f(y)}H${f(x + w - r)}Q${f(x + w)},${f(y)} ${f(x + w)},${f(y + r)}V${f(y + h - r)}Q${f(x + w)},${f(y + h)} ${f(x + w - r)},${f(y + h)}H${f(x + r)}Q${f(x)},${f(y + h)} ${f(x)},${f(y + h - r)}V${f(y + r)}Q${f(x)},${f(y)} ${f(x + r)},${f(y)}Z`;
}
function octRectPath(cx: number, cy: number, w: number, h: number, c: number) {
  const x = cx - w / 2, y = cy - h / 2;
  return `M${f(x + c)},${f(y)}H${f(x + w - c)}L${f(x + w)},${f(y + c)}V${f(y + h - c)}L${f(x + w - c)},${f(y + h)}H${f(x + c)}L${f(x)},${f(y + h - c)}V${f(y + c)}Z`;
}
function pearPath(cx: number, cy: number, R: number) {
  const t = cy - 1.18 * R, r = 0.84 * R, by = cy + 0.34 * R;
  return `M${f(cx)},${f(t)}C${f(cx + 0.5 * R)},${f(cy - 0.62 * R)} ${f(cx + r)},${f(cy - 0.12 * R)} ${f(cx + r)},${f(by)}A${f(r)},${f(r)} 0 0,1 ${f(cx - r)},${f(by)}C${f(cx - r)},${f(cy - 0.12 * R)} ${f(cx - 0.5 * R)},${f(cy - 0.62 * R)} ${f(cx)},${f(t)}Z`;
}
function heartPath(cx: number, cy: number, R: number) {
  return `M${f(cx)},${f(cy + R)}C${f(cx - 1.35 * R)},${f(cy + 0.05 * R)} ${f(cx - 0.95 * R)},${f(cy - 1.1 * R)} ${f(cx)},${f(cy - 0.42 * R)}C${f(cx + 0.95 * R)},${f(cy - 1.1 * R)} ${f(cx + 1.35 * R)},${f(cy + 0.05 * R)} ${f(cx)},${f(cy + R)}Z`;
}

export function shapePath(shape: Shape, cx: number, cy: number, R: number): string {
  switch (shape) {
    case 'oval': return ellipsePath(cx, cy, R * 0.76, R * 1.06);
    case 'cushion': return roundRectPath(cx, cy, R * 1.62, R * 1.62, R * 0.5);
    case 'princess': return rectPath(cx, cy, R * 1.56, R * 1.56);
    case 'emerald': return octRectPath(cx, cy, R * 1.22, R * 1.74, R * 0.3);
    case 'pear': return pearPath(cx, cy, R);
    case 'heart': return heartPath(cx, cy, R);
    default: return circlePath(cx, cy, R);
  }
}

/** Đường giác cắt (facet) bên trong viên đá */
function facetsPath(shape: Shape, cx: number, cy: number, R: number): string {
  const seg = (a: Pt, b: Pt) => `M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`;
  const radial = (rx: number, ry: number, tr: number) => {
    let d = '';
    const table: Pt[] = [];
    for (let k = 0; k < 8; k++) {
      const a = rad(22.5 + k * 45);
      const tp: Pt = [cx + rx * tr * Math.cos(a), cy + ry * tr * Math.sin(a)];
      table.push(tp);
      d += seg(tp, [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]);
    }
    d += `M${table.map((p) => `${f(p[0])},${f(p[1])}`).join('L')}Z`;
    return d;
  };
  switch (shape) {
    case 'oval': return radial(R * 0.76, R * 1.06, 0.52);
    case 'cushion': return radial(R * 0.78, R * 0.78, 0.5);
    case 'princess': {
      const o = R * 0.78, i = R * 0.36;
      let d = rectPath(cx, cy, i * 2, i * 2);
      for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) d += seg([cx + sx * i, cy + sy * i], [cx + sx * o, cy + sy * o]);
      for (const [sx, sy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) d += seg([cx + sx * i, cy + sy * i], [cx + sx * o, cy + sy * o]);
      return d;
    }
    case 'emerald': {
      const W = R * 1.22, H = R * 1.74, C = R * 0.3;
      let d = octRectPath(cx, cy, W * 0.7, H * 0.78, C * 0.7) + octRectPath(cx, cy, W * 0.42, H * 0.56, C * 0.42);
      d += seg([cx - W / 2 + C / 2, cy - H / 2 + C / 2], [cx - W * 0.21 + C * 0.21, cy - H * 0.28 + C * 0.21]);
      d += seg([cx + W / 2 - C / 2, cy - H / 2 + C / 2], [cx + W * 0.21 - C * 0.21, cy - H * 0.28 + C * 0.21]);
      d += seg([cx - W / 2 + C / 2, cy + H / 2 - C / 2], [cx - W * 0.21 + C * 0.21, cy + H * 0.28 - C * 0.21]);
      d += seg([cx + W / 2 - C / 2, cy + H / 2 - C / 2], [cx + W * 0.21 - C * 0.21, cy + H * 0.28 - C * 0.21]);
      return d;
    }
    case 'pear': {
      const ty = cy + 0.1 * R, tr = 0.5 * R;
      let d = pearPath(cx, ty, tr);
      d += seg([cx, ty - 1.18 * tr], [cx, cy - 1.18 * R]);
      d += seg([cx - 0.84 * tr, ty + 0.34 * tr], [cx - 0.84 * R, cy + 0.34 * R]);
      d += seg([cx + 0.84 * tr, ty + 0.34 * tr], [cx + 0.84 * R, cy + 0.34 * R]);
      d += seg([cx, ty + 1.18 * tr], [cx, cy + 1.18 * R]);
      d += seg([cx - 0.5 * tr, ty - 0.55 * tr], [cx - 0.58 * R, cy - 0.5 * R]);
      d += seg([cx + 0.5 * tr, ty - 0.55 * tr], [cx + 0.58 * R, cy - 0.5 * R]);
      return d;
    }
    case 'heart': {
      const ty = cy + 0.06 * R, tr = 0.5 * R;
      let d = heartPath(cx, ty, tr);
      d += seg([cx, ty + tr], [cx, cy + R]);
      d += seg([cx, ty - 0.42 * tr], [cx, cy - 0.42 * R]);
      d += seg([cx - 0.62 * tr, ty - 0.1 * tr], [cx - 0.92 * R, cy - 0.16 * R]);
      d += seg([cx + 0.62 * tr, ty - 0.1 * tr], [cx + 0.92 * R, cy - 0.16 * R]);
      return d;
    }
    default: return radial(R, R, 0.52);
  }
}

/** Vị trí chấu giữ đá */
function prongAnchors(shape: Shape, cx: number, cy: number, R: number, six = false): Pt[] {
  const ell = (rx: number, ry: number, angles: number[]) => angles.map((a) => [cx + rx * Math.cos(rad(a)), cy + ry * Math.sin(rad(a))] as Pt);
  const four = [45, 135, 225, 315], sixA = [30, 90, 150, 210, 270, 330];
  switch (shape) {
    case 'oval': return ell(R * 0.76, R * 1.06, six ? sixA : four);
    case 'cushion': return six ? ell(R * 0.82, R * 0.82, sixA) : ([[cx - 0.64 * R, cy - 0.64 * R], [cx + 0.64 * R, cy - 0.64 * R], [cx + 0.64 * R, cy + 0.64 * R], [cx - 0.64 * R, cy + 0.64 * R]] as Pt[]);
    case 'princess': return [[cx - 0.78 * R, cy - 0.78 * R], [cx + 0.78 * R, cy - 0.78 * R], [cx + 0.78 * R, cy + 0.78 * R], [cx - 0.78 * R, cy + 0.78 * R]];
    case 'emerald': return [[cx - 0.47 * R, cy - 0.73 * R], [cx + 0.47 * R, cy - 0.73 * R], [cx + 0.47 * R, cy + 0.73 * R], [cx - 0.47 * R, cy + 0.73 * R]];
    case 'pear': {
      const pts: Pt[] = [[cx, cy - 1.18 * R], [cx - 0.73 * R, cy + 0.76 * R], [cx + 0.73 * R, cy + 0.76 * R]];
      if (six) pts.push([cx - 0.82 * R, cy + 0.1 * R], [cx + 0.82 * R, cy + 0.1 * R]);
      return pts;
    }
    case 'heart': return [[cx, cy + R], [cx - 0.78 * R, cy - 0.5 * R], [cx + 0.78 * R, cy - 0.5 * R]];
    default: return ell(R, R, six ? sixA : four);
  }
}

// ---------------- main ----------------
// Đai nhẫn nhìn phối cảnh 3/4: elip ngoài + elip trong dịch lên → phía trước dày, phía sau mỏng
const BAND = { cx: 100, cy: 132, rx: 58, ry: 30, t: 6.5, d: 3 };

function bandShape(cx: number, cy: number, rx: number, ry: number, t: number, d: number) {
  return ellipsePath(cx, cy, rx, ry) + ellipsePath(cx, cy - d, rx - t, ry - t);
}
/** Điểm trên elip tâm đai (giữa mép ngoài & mép trong) theo góc (0° = phải, 90° = đỉnh) */
function bandPoint(deg: number): Pt {
  const cyc = BAND.cy - BAND.d / 2, rxc = BAND.rx - BAND.t / 2, ryc = BAND.ry - BAND.t / 2 + BAND.d / 2;
  return [BAND.cx + rxc * Math.cos(rad(deg)), cyc - ryc * Math.sin(rad(deg))];
}

export function ringSVG(opts: RingOptions): string {
  const { style, shape, metal = 'vang-trang-18k', mode = 'color', strokeWidth = 3, title, className = '' } = opts;
  const uid = opts.uid || `r${Math.random().toString(36).slice(2, 8)}`;
  const carat = Math.min(3, Math.max(0.25, opts.carat ?? 1));
  const line = mode === 'line';
  const R = line ? 19 : Math.min(30, Math.max(12, 21 * Math.cbrt(carat)));
  const e = EXT[shape];
  const outer = style === 'halo' ? 1.32 : style === 'royal' ? 1.1 : 1;
  const lift = style === 'cathedral' ? 8 : style === 'trellis' ? 9 : style === 'bridge-accent' ? 6 : 0;
  const bandTop = BAND.cy - BAND.ry;
  const cx = BAND.cx;
  const cy = bandTop + 2 - lift - e.bottom * R * outer;
  const stoneBottom = cy + e.bottom * R;

  const parts: string[] = [];
  const P = (d: string, attrs: string) => parts.push(`<path d="${d}" ${attrs}/>`);
  const sw = (k = 1) => f(strokeWidth * k);
  const metalStroke = (w: number) =>
    line
      ? `fill="none" stroke="currentColor" stroke-width="${sw()}" stroke-linecap="round" stroke-linejoin="round"`
      : `fill="none" stroke="url(#${uid}m)" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
  const metalFill = line
    ? `fill="var(--ring-fill, none)" stroke="currentColor" stroke-width="${sw()}" stroke-linejoin="round"`
    : `fill="url(#${uid}m)" stroke="#000" stroke-opacity=".08" stroke-width=".5"`;
  const dotted = (d: string, size: number, gap: number) =>
    P(d, line
      ? `fill="none" stroke="currentColor" stroke-width="${sw(0.9)}" stroke-dasharray="0 ${gap}" stroke-linecap="round"`
      : `fill="none" stroke="#FFFFFF" stroke-width="${size}" stroke-dasharray="0 ${gap}" stroke-linecap="round" filter="url(#${uid}g)"`);

  // ---- bóng đổ ----
  if (!line) parts.push(`<ellipse cx="${BAND.cx}" cy="${BAND.cy + BAND.ry + 9}" rx="${BAND.rx * 0.95}" ry="7" fill="#5a4330" opacity=".2" filter="url(#${uid}s)"/>`);

  // ---- đai nhẫn ----
  const drawBand = (rot: number, t: number, d: number) => {
    const tr = rot ? ` transform="rotate(${rot} ${BAND.cx} ${BAND.cy})"` : '';
    const shapeD = bandShape(BAND.cx, BAND.cy, BAND.rx, BAND.ry, t, d);
    if (line && style === 'twist') {
      parts.push(`<path d="${ellipsePath(BAND.cx, BAND.cy - d / 2, BAND.rx - t / 2, BAND.ry - t / 2)}" fill="none" stroke="currentColor" stroke-width="${sw(1.15)}"${tr}/>`);
    } else if (line) {
      parts.push(`<path d="${shapeD}" fill-rule="evenodd" fill="var(--ring-fill, none)" stroke="currentColor" stroke-width="${sw()}"${tr}/>`);
    } else {
      parts.push(`<path d="${shapeD}" fill-rule="evenodd" fill="url(#${uid}b)"${tr}/>`);
      // ánh sáng phản chiếu trên mặt trước của đai
      parts.push(`<path d="M${f(BAND.cx - BAND.rx + 8)},${f(BAND.cy + 8)}A${BAND.rx - 4},${BAND.ry - 3} 0 0,0 ${f(BAND.cx + BAND.rx - 8)},${f(BAND.cy + 8)}" fill="none" stroke="#FFFFFF" stroke-opacity=".7" stroke-width="1.3" stroke-linecap="round"${tr}/>`);
      parts.push(`<path d="${ellipsePath(BAND.cx, BAND.cy - d, BAND.rx - t, BAND.ry - t)}" fill="none" stroke="#000" stroke-opacity=".16" stroke-width=".8"${tr}/>`);
    }
  };
  if (style === 'twist') {
    drawBand(-5, 4.2, 2);
    drawBand(5, 4.2, 2);
  } else {
    drawBand(0, BAND.t, BAND.d);
  }

  // pavé nửa trước đai (Royal)
  if (style === 'royal') {
    const a = bandPoint(205), b = bandPoint(335);
    const rxc = BAND.rx - BAND.t / 2, ryc = BAND.ry - BAND.t / 2 + BAND.d / 2;
    dotted(`M${f(a[0])},${f(a[1])}A${f(rxc)},${f(ryc)} 0 0,0 ${f(b[0])},${f(b[1])}`, 3, 5.2);
  }

  // ---- vai nhẫn: Cathedral ----
  if (style === 'cathedral') {
    for (const s of [-1, 1]) {
      const [x0, y0] = bandPoint(s < 0 ? 152 : 28);
      const [x1, y1] = bandPoint(s < 0 ? 128 : 52);
      const tipX = cx + s * e.half * R * 0.8, tipY = cy + e.bottom * R * 0.55;
      if (line) {
        P(`M${f(x0)},${f(y0)}Q${f(cx + s * (e.half * R + 12))},${f(bandTop - 3)} ${f(tipX)},${f(tipY)}`, metalStroke(0));
        P(`M${f(x1)},${f(y1)}Q${f(cx + s * (e.half * R * 0.6 + 5))},${f(bandTop + 1)} ${f(tipX)},${f(tipY)}`, metalStroke(0));
      } else {
        // vai dạng khối thuôn: cạnh ngoài + cạnh trong cùng hội tụ dưới viên chủ
        P(`M${f(x0)},${f(y0)}Q${f(cx + s * (e.half * R + 12))},${f(bandTop - 3)} ${f(tipX)},${f(tipY)}Q${f(cx + s * (e.half * R * 0.6 + 5))},${f(bandTop + 1)} ${f(x1)},${f(y1)}Z`, metalFill);
      }
    }
  }

  // ---- Trellis: chấu đan chéo ----
  if (style === 'trellis') {
    for (const s of [-1, 1]) {
      P(`M${f(cx - s * 10)},${f(bandTop + 3)}C${f(cx - s * 8)},${f(bandTop - 6)} ${f(cx + s * e.half * R * 0.5)},${f(stoneBottom + 2)} ${f(cx + s * e.half * R * 0.72)},${f(cy + e.bottom * R * 0.5)}`, metalStroke(3));
    }
  }

  // ---- giỏ chấu ----
  const six = style === 'royal';
  const anchors = prongAnchors(shape, cx, cy, R, six);
  if (style !== 'trellis') {
    const lower = anchors.filter((p) => p[1] > cy + 0.1 * R);
    const legs = lower.length ? lower : [[cx, stoneBottom] as Pt];
    for (const [ax, ay] of legs) {
      const dir = Math.sign(ax - cx);
      const bx = cx + dir * Math.min(Math.abs(ax - cx), 9);
      P(`M${f(ax)},${f(ay)}L${f(bx)},${f(bandTop + 4)}`, metalStroke(2.6));
    }
  }

  // ---- Bridge accent: thanh cầu + đá tấm trên vai ----
  if (style === 'bridge-accent') {
    P(`M${f(cx - e.half * R * 0.7)},${f(stoneBottom + 1)}Q${f(cx)},${f(stoneBottom + 7)} ${f(cx + e.half * R * 0.7)},${f(stoneBottom + 1)}`, metalStroke(2.6));
    for (const t of [52, 60, 68, 76, 104, 112, 120, 128]) {
      const [x, y] = bandPoint(t);
      parts.push(line ? `<circle cx="${f(x)}" cy="${f(y)}" r="${sw(0.6)}" fill="currentColor"/>` : `<circle cx="${f(x)}" cy="${f(y)}" r="2.1" fill="url(#${uid}d)" stroke="#8ea0b2" stroke-width=".4"/>`);
    }
  }

  // ---- Halo ----
  if (style === 'halo') {
    P(shapePath(shape, cx, cy, R * 1.3), line ? `fill="none" stroke="currentColor" stroke-width="${sw()}"` : `fill="url(#${uid}m)" stroke="#000" stroke-opacity=".1" stroke-width=".5"`);
    if (line) P(shapePath(shape, cx, cy, R * 1.15), `fill="none" stroke="currentColor" stroke-width="${sw(0.7)}" stroke-dasharray="0 4.6" stroke-linecap="round"`);
    else dotted(shapePath(shape, cx, cy, R * 1.155), 3.6, 4.9);
  }
  // ---- Royal: viền milgrain ----
  if (style === 'royal') {
    const md = shapePath(shape, cx, cy, R * 1.09);
    P(md, line
      ? `fill="none" stroke="currentColor" stroke-width="${sw(0.7)}" stroke-dasharray="0 3.4" stroke-linecap="round"`
      : `fill="none" stroke="url(#${uid}m)" stroke-width="2.6" stroke-dasharray="0 3.2" stroke-linecap="round"`);
  }

  // ---- đá ----
  const stone = (sx: number, sy: number, sR: number, withSpark: boolean) => {
    const d = shapePath(shape, sx, sy, sR);
    if (line) {
      P(d, `fill="var(--ring-fill, none)" stroke="currentColor" stroke-width="${sw()}" stroke-linejoin="round"`);
      P(facetsPath(shape, sx, sy, sR), `fill="none" stroke="currentColor" stroke-width="${sw(0.5)}" stroke-linecap="round" stroke-linejoin="round" opacity=".75"`);
      return;
    }
    P(d, `fill="url(#${uid}d)" stroke="#7f91a3" stroke-opacity=".7" stroke-width=".8"`);
    P(facetsPath(shape, sx + 0.7, sy + 0.8, sR), `fill="none" stroke="#5f7387" stroke-width=".6" stroke-opacity=".35" stroke-linejoin="round"`);
    P(facetsPath(shape, sx, sy, sR), `fill="none" stroke="#FFFFFF" stroke-width=".8" stroke-opacity=".95" stroke-linejoin="round"`);
    // ánh lửa (fire) rất nhẹ
    parts.push(`<circle cx="${f(sx + sR * 0.32)}" cy="${f(sy + sR * 0.36)}" r="${f(sR * 0.13)}" fill="#ffd9a8" opacity=".45"/>`);
    parts.push(`<circle cx="${f(sx - sR * 0.3)}" cy="${f(sy + sR * 0.45)}" r="${f(sR * 0.1)}" fill="#b9d6ff" opacity=".5"/>`);
    if (withSpark) {
      const spark = (x: number, y: number, s: number, delay: number) =>
        parts.push(`<path class="spark" style="animation-delay:${delay}s" d="M${f(x)},${f(y - s)}L${f(x + s * 0.16)},${f(y - s * 0.16)}L${f(x + s)},${f(y)}L${f(x + s * 0.16)},${f(y + s * 0.16)}L${f(x)},${f(y + s)}L${f(x - s * 0.16)},${f(y + s * 0.16)}L${f(x - s)},${f(y)}L${f(x - s * 0.16)},${f(y - s * 0.16)}Z" fill="#FFFFFF"/>`);
      spark(sx - sR * 0.4, sy - sR * 0.36, Math.max(5, sR * 0.42), 0);
      spark(sx + sR * 0.52, sy + sR * 0.18, Math.max(3, sR * 0.24), 1.3);
    }
  };
  const prong = (x: number, y: number, r: number) =>
    line
      ? `<circle cx="${f(x)}" cy="${f(y)}" r="${f(Math.max(r * 0.8, strokeWidth * 0.75))}" fill="currentColor"/>`
      : `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="url(#${uid}m)" stroke="#000" stroke-opacity=".15" stroke-width=".4"/>`;

  if (style === 'three-stone') {
    const R2 = R * 0.6;
    for (const s of [-1, 1]) {
      const sx = cx + s * (e.half * R + e.half * R2 + 2.5);
      const sy = cy + (e.bottom * R - e.bottom * R2) + 1;
      P(`M${f(sx)},${f(sy + e.bottom * R2 * 0.8)}L${f(cx + s * 13)},${f(bandTop + 4)}`, metalStroke(2.4));
      stone(sx, sy, R2, false);
      for (const [ax, ay] of prongAnchors(shape, sx, sy, R2)) parts.push(prong(ax, ay, 1.7));
    }
  }

  stone(cx, cy, R, true);
  for (const [ax, ay] of anchors) parts.push(prong(ax, ay, style === 'royal' ? 2.1 : 2.5));

  // ---- defs ----
  let defs = '';
  if (!line) {
    const [c0, c1, c2, c3] = METAL_STOPS[metal];
    defs = `<defs><linearGradient id="${uid}m" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c0}"/><stop offset=".45" stop-color="${c1}"/><stop offset=".8" stop-color="${c2}"/><stop offset="1" stop-color="${c3}"/></linearGradient><linearGradient id="${uid}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c2}"/><stop offset=".22" stop-color="${c1}"/><stop offset=".55" stop-color="${c0}"/><stop offset=".72" stop-color="${c1}"/><stop offset="1" stop-color="${c3}"/></linearGradient><radialGradient id="${uid}d" cx=".36" cy=".3" r=".85"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".4" stop-color="#EEF3F8"/><stop offset=".72" stop-color="#C3D0DC"/><stop offset="1" stop-color="#93A6B9"/></radialGradient><filter id="${uid}s" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="4"/></filter><filter id="${uid}g" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy=".35" stdDeviation=".3" flood-color="#5b6b7b" flood-opacity=".65"/></filter></defs>`;
  }

  const viewBox = line ? '28 30 144 140' : '0 4 200 180';
  const label = title ? `<title>${title}</title>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" class="ring-svg ${className}" role="img" aria-label="${title || ''}">${label}${defs}${parts.join('')}</svg>`;
}

/** Icon dáng viên chủ (line) */
export function shapeIconSVG(shape: Shape, opts: { strokeWidth?: number; title?: string; className?: string } = {}) {
  const sw = opts.strokeWidth ?? 2.4;
  const R = 34;
  const e = EXT[shape];
  const cy = 50 + ((e.top - e.bottom) * R) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="shape-svg ${opts.className || ''}" role="img" aria-label="${opts.title || shape}"><path d="${shapePath(shape, 50, cy, R)}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linejoin="round"/><path d="${facetsPath(shape, 50, cy, R)}" fill="none" stroke="currentColor" stroke-width="${f(sw * 0.55)}" stroke-linejoin="round" stroke-linecap="round" opacity=".7"/></svg>`;
}

export const svgDataUri = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
