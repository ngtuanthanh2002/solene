import { PRODUCTS } from '../../data/products';
import { toCard } from '../../lib/card';

/** Chỉ mục sản phẩm tĩnh (tạo lúc build) cho giỏ hàng, tìm kiếm, xem nhanh, yêu thích */
export function GET() {
  const data = PRODUCTS.map((p) => ({ ...toCard(p), variants: p.variants, leadTime: p.leadTime }));
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
