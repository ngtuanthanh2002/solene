/**
 * Thông tin thương hiệu & cấu hình chung.
 * Đây là thương hiệu DEMO — thay toàn bộ thông tin liên hệ bằng thông tin thật trước khi đưa vào sử dụng.
 */
export const SITE = {
  name: 'Solène',
  legalName: 'Solène Fine Jewelry',
  tagline: 'Trang sức kim cương & nhẫn cưới cao cấp',
  description:
    'Solène Fine Jewelry — nhẫn cầu hôn, nhẫn cưới, kim cương kiểm định GIA và trang sức cao cấp chế tác thủ công. Bảo hành trọn đời, khắc chữ miễn phí, giao hàng bảo hiểm toàn quốc.',
  founded: 1998,
  locale: 'vi_VN',
  phone: '1800 1998',
  phoneHref: 'tel:18001998',
  email: 'concierge@solene.example',
  zalo: 'https://zalo.me/',
  hours: 'Thứ Hai – Chủ Nhật · 9:00 – 21:00',
  boutiques: [
    {
      id: 'hcm',
      name: 'Solène Maison Sài Gòn',
      address: '68 Đồng Khởi, Phường Sài Gòn, TP. Hồ Chí Minh',
      street: '68 Đồng Khởi',
      locality: 'TP. Hồ Chí Minh',
      phone: '028 3820 1998',
      hours: '9:00 – 21:00 hằng ngày',
      image: 'ed-boutique',
    },
    {
      id: 'hn',
      name: 'Solène Maison Hà Nội',
      address: '15 Tràng Tiền, Phường Hoàn Kiếm, Hà Nội',
      street: '15 Tràng Tiền',
      locality: 'Hà Nội',
      phone: '024 3936 1998',
      hours: '9:00 – 21:00 hằng ngày',
      image: 'ed-gold-stilllife',
    },
  ],
  social: {
    facebook: 'https://www.facebook.com/',
    instagram: 'https://www.instagram.com/',
    tiktok: 'https://www.tiktok.com/',
    youtube: 'https://www.youtube.com/',
  },
  bank: {
    name: 'Vietcombank — CN Sài Gòn',
    account: '0071 0000 19980',
    holder: 'CONG TY TNHH SOLENE FINE JEWELRY (DEMO)',
  },
} as const;

/** Google OAuth Client ID — đặt trong file .env (PUBLIC_GOOGLE_CLIENT_ID=...) */
export const GOOGLE_CLIENT_ID: string = import.meta.env.PUBLIC_GOOGLE_CLIENT_ID || '';
