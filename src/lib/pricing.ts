/** Bảng giá tham khảo cho công cụ Thiết kế nhẫn */
import { METALS, SHAPES, STYLES, type MetalKey, type RingStyle, type Shape } from './catalog';

export const SETTING_PRICE: Record<RingStyle, number> = {
  solitaire: 12900000, cathedral: 15900000, halo: 21900000, 'bridge-accent': 16900000,
  twist: 18900000, royal: 27900000, 'three-stone': 19900000, trellis: 17900000,
};

export const QUALITIES = [
  { key: 'tieu-chuan', label: 'Tiêu chuẩn', grade: 'H · VS2', factor: 0.82, desc: 'Trắng sáng, sạch dưới mắt thường' },
  { key: 'cao-cap', label: 'Cao cấp', grade: 'F · VS1', factor: 1, desc: 'Lựa chọn được yêu thích nhất' },
  { key: 'hoan-hao', label: 'Hoàn hảo', grade: 'D · VVS1', factor: 1.38, desc: 'Nước D tinh khiết, gần như không tì vết' },
] as const;
export type QualityKey = (typeof QUALITIES)[number]['key'];

/** Giá kim cương ≈ 219 triệu × ct² × hệ số dáng × hệ số chất lượng (khớp bảng giá kim cương viên của shop) */
export function diamondPrice(ct: number, shape: Shape, quality: QualityKey) {
  const sf = SHAPES.find((s) => s.key === shape)?.factor ?? 1;
  const qf = QUALITIES.find((q) => q.key === quality)?.factor ?? 1;
  return 219_000_000 * ct * ct * sf * qf;
}

export const caratToMm = (ct: number) => Math.round(6.5 * Math.cbrt(ct) * 10) / 10;

export interface BuildConfig { style: RingStyle; shape: Shape; carat: number; quality: QualityKey; metal: MetalKey }

export function quote(c: BuildConfig) {
  const mf = METALS[c.metal].factor;
  const setting = Math.round((SETTING_PRICE[c.style] * mf) / 100000) * 100000;
  let center = diamondPrice(c.carat, c.shape, c.quality);
  let sides = 0;
  if (c.style === 'three-stone') sides = 2 * diamondPrice(c.carat * 0.3, c.shape, c.quality) * 0.9;
  center = Math.round(center / 100000) * 100000;
  sides = Math.round(sides / 100000) * 100000;
  return { setting, center, sides, total: setting + center + sides };
}

export const styleLabel = (k: string) => STYLES.find((s) => s.key === k)?.label || k;
export const shapeLabel = (k: string) => SHAPES.find((s) => s.key === k)?.label || k;
