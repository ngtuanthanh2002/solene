/** Tải chỉ mục sản phẩm tĩnh (/api/products.json) + tìm kiếm tiếng Việt không dấu */
import type { OptProduct } from '../lib/options';
import { MOODS, SHAPES, STYLES, TYPES } from '../lib/catalog';
import { normalize } from '../lib/format';
import { COLLECTIONS } from '../data/collections';

let cache: Promise<OptProduct[]> | null = null;
export function loadProducts(): Promise<OptProduct[]> {
  if (!cache) {
    cache = fetch('/api/products.json')
      .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .catch((e) => { cache = null; throw e; });
  }
  return cache;
}

const CAT_NAMES: Record<string, string> = {
  'nhan-cau-hon': 'nhẫn cầu hôn nhẫn đính hôn engagement', 'nhan-cuoi': 'nhẫn cưới wedding', 'trang-suc': 'trang sức',
  'kim-cuong': 'kim cương viên diamond ly', 'trang-suc-cao-cap': 'trang sức cao cấp high jewelry', 'phu-kien': 'phụ kiện quà tặng',
};

function haystack(p: OptProduct) {
  const parts = [
    p.name, p.subtitle, TYPES[p.type] || '', CAT_NAMES[p.category] || '',
    STYLES.find((s) => s.key === p.style)?.label || '', SHAPES.find((s) => s.key === p.shape)?.label || '', SHAPES.find((s) => s.key === p.shape)?.vi || '',
    COLLECTIONS.find((c) => c.slug === p.collection)?.name || '', ...p.moods.map((m) => MOODS.find((x) => x.key === m)?.label || ''),
    p.metals.map((m) => m.replace(/-/g, ' ')).join(' '),
  ];
  return normalize(parts.join(' '));
}

export function searchProducts(list: OptProduct[], query: string): OptProduct[] {
  const q = normalize(query);
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);
  return list
    .map((p) => {
      const name = normalize(p.name + ' ' + p.subtitle);
      const hay = haystack(p);
      if (!terms.every((t) => hay.includes(t))) return null;
      let score = 0;
      if (name.includes(q)) score += 10;
      for (const t of terms) { if (name.includes(t)) score += 3; if (hay.includes(t)) score += 1; }
      score += Math.min(3, p.sold / 300);
      return { p, score };
    })
    .filter(Boolean)
    .sort((a, b) => b!.score - a!.score)
    .map((x) => x!.p);
}

/** Bôi đậm từ khóa trong chuỗi (không dấu) */
export function highlight(text: string, query: string) {
  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
  const terms = normalize(query).split(/\s+/).filter((t) => t.length > 1);
  if (!terms.length) return esc(text);
  const norm = normalize(text);
  const marks = new Array(text.length).fill(false);
  for (const t of terms) {
    let i = norm.indexOf(t);
    while (i >= 0) { for (let k = i; k < i + t.length; k++) marks[k] = true; i = norm.indexOf(t, i + t.length); }
  }
  let out = '', open = false;
  for (let i = 0; i < text.length; i++) {
    if (marks[i] && !open) { out += '<mark>'; open = true; }
    if (!marks[i] && open) { out += '</mark>'; open = false; }
    out += esc(text[i]);
  }
  return out + (open ? '</mark>' : '');
}
