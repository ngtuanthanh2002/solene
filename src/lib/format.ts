const nf = new Intl.NumberFormat('vi-VN');

/** 68900000 → "68.900.000 ₫" */
export const formatVND = (n: number) => `${nf.format(Math.round(n))} ₫`;

/** 68900000 → "68,9 triệu", 1280000000 → "1,28 tỷ" */
export function formatShort(n: number) {
  if (n >= 1e9) return `${(n / 1e9).toLocaleString('vi-VN', { maximumFractionDigits: 2 })} tỷ`;
  if (n >= 1e6) return `${(n / 1e6).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} triệu`;
  return formatVND(n);
}

/** Bỏ dấu tiếng Việt để tìm kiếm không dấu: "Nhẫn cưới" → "nhan cuoi" */
export function normalize(s: string) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

export function formatDate(d: string | number | Date, withTime = false) {
  const date = new Date(d);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
}

export const escapeHTML = (s: string) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
