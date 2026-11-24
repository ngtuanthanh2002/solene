/** Hằng số danh mục dùng chung cho server (Astro) và client. */

export type MetalKey = 'vang-trang-18k' | 'vang-vang-18k' | 'vang-hong-18k' | 'bach-kim';
export type RingStyle = 'solitaire' | 'cathedral' | 'halo' | 'bridge-accent' | 'twist' | 'royal' | 'three-stone' | 'trellis';
export type Shape = 'round' | 'heart' | 'pear' | 'princess' | 'emerald' | 'oval' | 'cushion';
export type Mood = 'thanh-lich' | 'hien-dai' | 'quyen-ru' | 'dai-cac' | 'ngot-ngao';
export type CategoryKey = 'nhan-cau-hon' | 'nhan-cuoi' | 'trang-suc' | 'kim-cuong' | 'trang-suc-cao-cap' | 'phu-kien';

export const METALS: Record<MetalKey, { label: string; short: string; swatch: string; factor: number }> = {
  'vang-trang-18k': { label: 'Vàng trắng 18K', short: 'Vàng trắng', swatch: 'linear-gradient(135deg,#fbfbf9 0%,#dcdcd7 55%,#b5b5ae 100%)', factor: 1 },
  'vang-vang-18k': { label: 'Vàng vàng 18K', short: 'Vàng vàng', swatch: 'linear-gradient(135deg,#fcebc0 0%,#e2b865 55%,#b48737 100%)', factor: 1 },
  'vang-hong-18k': { label: 'Vàng hồng 18K', short: 'Vàng hồng', swatch: 'linear-gradient(135deg,#fbe0d2 0%,#e3a68a 55%,#b67a60 100%)', factor: 1 },
  'bach-kim': { label: 'Bạch kim PT950', short: 'Bạch kim', swatch: 'linear-gradient(135deg,#f7f7fa 0%,#cfd0d8 55%,#a3a4ae 100%)', factor: 1.15 },
};
export const METAL_KEYS = Object.keys(METALS) as MetalKey[];

export const STYLES: { key: RingStyle; label: string; desc: string }[] = [
  { key: 'solitaire', label: 'Solitaire', desc: 'Một viên chủ duy nhất — tinh khiết và vượt thời gian.' },
  { key: 'cathedral', label: 'Cathedral', desc: 'Vai nhẫn vươn cao như mái vòm thánh đường, nâng niu viên chủ.' },
  { key: 'halo', label: 'Halo', desc: 'Vòng kim cương tấm bao quanh, khuếch đại ánh lửa viên chủ.' },
  { key: 'bridge-accent', label: 'Bridge Accent', desc: 'Kim cương nhỏ điểm xuyết dưới ổ chấu — tinh tế khi nhìn nghiêng.' },
  { key: 'twist', label: 'Twist', desc: 'Hai dải đai xoắn quấn quýt — biểu tượng của sự gắn kết.' },
  { key: 'royal', label: 'Royal', desc: 'Ổ chấu vương miện cùng đai đính đá, lộng lẫy kiểu hoàng gia.' },
  { key: 'three-stone', label: 'ThreeStone', desc: 'Ba viên đá cho quá khứ, hiện tại và tương lai.' },
  { key: 'trellis', label: 'Trellis', desc: 'Chấu đan chéo như giàn hoa, nâng viên chủ lấp lánh.' },
];

export const SHAPES: { key: Shape; label: string; vi: string; factor: number }[] = [
  { key: 'round', label: 'Round', vi: 'Tròn', factor: 1 },
  { key: 'heart', label: 'Heart', vi: 'Trái tim', factor: 0.9 },
  { key: 'pear', label: 'Pear', vi: 'Giọt lệ', factor: 0.86 },
  { key: 'princess', label: 'Princess', vi: 'Vuông', factor: 0.8 },
  { key: 'emerald', label: 'Emerald', vi: 'Chữ nhật', factor: 0.82 },
  { key: 'oval', label: 'Oval', vi: 'Bầu dục', factor: 0.88 },
  { key: 'cushion', label: 'Cushion', vi: 'Gối vuông', factor: 0.84 },
];

export const MOODS: { key: Mood; label: string }[] = [
  { key: 'thanh-lich', label: 'Thanh lịch' },
  { key: 'hien-dai', label: 'Hiện đại' },
  { key: 'quyen-ru', label: 'Quyến rũ' },
  { key: 'dai-cac', label: 'Đài các' },
  { key: 'ngot-ngao', label: 'Ngọt ngào' },
];

export const TYPES: Record<string, string> = {
  'nhan-cau-hon': 'Nhẫn cầu hôn',
  'cap-nhan-cuoi': 'Cặp nhẫn cưới',
  'bo-nhan-cuoi': 'Bộ nhẫn cô dâu',
  'day-chuyen': 'Dây chuyền',
  'bong-tai': 'Bông tai',
  'lac-tay': 'Lắc & vòng tay',
  'bo-trang-suc': 'Bộ trang sức',
  'khuy-mang-set': 'Khuy măng sét',
  'cai-ao': 'Cài áo',
  'nhan-nam': 'Nhẫn nam',
  'hop-trang-suc': 'Hộp trang sức',
  'kim-cuong-vien': 'Kim cương viên',
};

export const RING_SIZES = Array.from({ length: 17 }, (_, i) => i + 6); // ni 6 → 22

export const PRICE_RANGES = [
  { key: 'duoi-20', label: 'Dưới 20 triệu', min: 0, max: 20e6 },
  { key: '20-50', label: '20 – 50 triệu', min: 20e6, max: 50e6 },
  { key: '50-100', label: '50 – 100 triệu', min: 50e6, max: 100e6 },
  { key: '100-500', label: '100 – 500 triệu', min: 100e6, max: 500e6 },
  { key: 'tren-500', label: 'Trên 500 triệu', min: 500e6, max: Number.POSITIVE_INFINITY },
];

export const SORTS = [
  { key: 'noi-bat', label: 'Nổi bật' },
  { key: 'ban-chay', label: 'Bán chạy' },
  { key: 'moi-nhat', label: 'Mới nhất' },
  { key: 'gia-tang', label: 'Giá: thấp → cao' },
  { key: 'gia-giam', label: 'Giá: cao → thấp' },
];

export const BADGES: Record<string, string> = {
  new: 'Mới',
  bestseller: 'Bán chạy',
  signature: 'Signature',
  limited: 'Phiên bản giới hạn',
};

/** Ni (VN) ≈ chu vi (mm) − 40 — quy ước phổ biến tại Việt Nam & Nhật Bản. */
export function sizeInfo(ni: number) {
  const circumference = ni + 40;
  const diameter = circumference / Math.PI;
  const us = Math.max(0, Math.round(((diameter - 11.63) / 0.8128) * 4) / 4);
  return { ni, circumference, diameter: Math.round(diameter * 10) / 10, us };
}

export const imageUrl = (key: string, w: 400 | 800 | 1200 = 800) => `/images/p/${key}-${w}.webp`;
export const imageSrcset = (key: string) => `/images/p/${key}-400.webp 400w, /images/p/${key}-800.webp 800w, /images/p/${key}-1200.webp 1200w`;
export const bannerUrl = (key: string, w: 960 | 1920 = 1920) => `/images/b/${key}-${w}.webp`;
