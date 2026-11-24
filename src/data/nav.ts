export interface NavItem { label: string; href: string; mega?: 'engagement' | 'wedding' | 'jewelry' | 'diamond' | 'collections'; highlight?: boolean }

export const NAV: NavItem[] = [
  { label: 'Nhẫn cầu hôn', href: '/nhan-cau-hon/', mega: 'engagement' },
  { label: 'Nhẫn cưới', href: '/nhan-cuoi/', mega: 'wedding' },
  { label: 'Trang sức', href: '/trang-suc/', mega: 'jewelry' },
  { label: 'Kim cương', href: '/kim-cuong/', mega: 'diamond' },
  { label: 'Cao cấp', href: '/trang-suc-cao-cap/' },
  { label: 'Phụ kiện', href: '/phu-kien/' },
  { label: 'Bộ sưu tập', href: '/bo-suu-tap/', mega: 'collections' },
  { label: 'Thiết kế nhẫn', href: '/thiet-ke-nhan/', highlight: true },
];

export const TOP_SEARCHES = [
  { label: 'Bán chạy nhất', href: '/cua-hang/?sap-xep=ban-chay' },
  { label: 'Signature Collection', href: '/bo-suu-tap/silk-veil/' },
  { label: 'Hướng dẫn đo ni tay', href: '/huong-dan-do-ni-tay/' },
  { label: 'Thiết kế nhẫn riêng', href: '/thiet-ke-nhan/' },
  { label: 'Cẩm nang kim cương 4C', href: '/kien-thuc-kim-cuong/' },
];

export const POPULAR_KEYWORDS = ['Nhẫn cầu hôn', 'Nhẫn cưới', 'Kim cương 5.4 ly', 'Halo', 'Ngọc trai', 'Bông tai kim cương', 'Vàng hồng', 'Dây chuyền trái tim'];
