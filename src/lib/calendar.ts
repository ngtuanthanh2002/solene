import { SITE } from '../config';

export const SERVICES: Record<string, string> = {
  'nhan-cau-hon': 'Tư vấn nhẫn cầu hôn',
  'nhan-cuoi': 'Tư vấn nhẫn cưới',
  'thiet-ke-rieng': 'Thiết kế nhẫn riêng',
  'kim-cuong': 'Xem kim cương GIA',
  'do-ni': 'Đo ni & thử nhẫn',
  'bao-hanh': 'Bảo hành & làm sạch',
};

/** Liên kết "Thêm vào Google Calendar" (giờ Việt Nam) */
export function googleCalendarUrl(a: { date: string; time: string; service: string; boutique: string; note?: string }) {
  const b = SITE.boutiques.find((x) => x.id === a.boutique) || SITE.boutiques[0];
  const [h, m] = a.time.split(':').map(Number);
  const d = a.date.replace(/-/g, '');
  const pad = (n: number) => String(n).padStart(2, '0');
  const start = `${d}T${pad(h)}${pad(m)}00`;
  const end = `${d}T${pad(h + 1)}${pad(m)}00`;
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${SERVICES[a.service] || a.service} · ${b.name}`,
    dates: `${start}/${end}`,
    ctz: 'Asia/Ho_Chi_Minh',
    details: `Lịch hẹn riêng tại ${b.name}. Hotline: ${SITE.phone}.${a.note ? `\nGhi chú: ${a.note}` : ''}`,
    location: b.address,
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

export function formatApptDate(date: string) {
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
}
