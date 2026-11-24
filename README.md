# Solène Fine Jewelry — Website trang sức cao cấp (demo)

Website thương mại điện tử trang sức sang trọng: nhẫn cầu hôn, nhẫn cưới, kim cương GIA, trang sức cao cấp và phụ kiện. Xây dựng bằng **Astro 7** (HTML tĩnh, chuẩn SEO) + TypeScript thuần, không phụ thuộc framework giao diện.

> Đây là **thương hiệu demo**. Tên, địa chỉ, hotline, tài khoản ngân hàng, đánh giá khách hàng… đều là dữ liệu minh họa — thay bằng thông tin thật trong `src/config.ts` và `src/data/` trước khi vận hành.

---

## 1. Chạy dự án

Yêu cầu: **Node.js ≥ 22**.

```bash
npm install
npm run dev        # http://localhost:4321  (phát triển)
npm run build      # xuất web tĩnh ra thư mục dist/
npm run preview    # xem bản build tại http://localhost:4321
```

Thư mục `dist/` có thể đưa lên bất kỳ hosting tĩnh nào (Netlify, Vercel, Cloudflare Pages, GitHub Pages, Nginx…). Khi build cho domain thật, đặt biến môi trường `SITE_URL` để canonical, Open Graph và sitemap dùng đúng domain:

```bash
# PowerShell
$env:SITE_URL="https://www.ten-mien-cua-ban.vn"; npm run build
```

## 2. Bật đăng nhập Google (thật)

Website dùng **Google Identity Services** (nút “Tiếp tục với Google” chính thức + One Tap). Để kích hoạt:

1. Vào [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials), tạo project (nếu chưa có).
2. Cấu hình **OAuth consent screen** (External, thêm tên ứng dụng, email hỗ trợ).
3. **Create credentials → OAuth client ID → Web application**.
4. Ở **Authorized JavaScript origins** thêm: `http://localhost:4321` **và** `http://localhost` (thêm domain thật khi deploy, ví dụ `https://www.ten-mien-cua-ban.vn`).
5. Copy `.env.example` thành `.env` rồi điền:

```
PUBLIC_GOOGLE_CLIENT_ID=xxxxxxxxxxxx-xxxxxxxx.apps.googleusercontent.com
```

6. Khởi động lại `npm run dev`.

Khi chưa cấu hình, nút Google vẫn hiển thị và sẽ hướng dẫn cách cấu hình khi bấm. Đăng nhập Google lấy tên, email, ảnh đại diện từ ID token (kiểm tra `aud`, `iss`, `exp`). ⚠️ Hệ thống thật cần xác minh chữ ký token ở server.

## 3. Chức năng hoạt động thực tế

| Chức năng | Mô tả |
|---|---|
| **Giỏ hàng** | Thêm/xóa/sửa số lượng (có hoàn tác), giỏ trượt + trang giỏ, lưu `localStorage`, đồng bộ giữa các tab trình duyệt |
| **Tùy chọn sản phẩm** | Chất liệu (bạch kim +15%), ni tay, cặp ni nam/nữ cho nhẫn cưới, chất lượng kim cương, **khắc chữ có xem trước** trên dải kim loại |
| **Mã ưu đãi** | `SOLENE10` (−10%, tối đa 5 triệu) · `CUOI2026` (−5% nhẫn cưới) · `WELCOME` (−1 triệu cho đơn từ 10 triệu) |
| **Thanh toán** | Kiểm tra hợp lệ (SĐT Việt Nam, email, MST), 34 tỉnh/thành mới, giao hỏa tốc (chỉ HCM/HN), COD (đơn < 50 triệu), chuyển khoản, trả góp, hóa đơn công ty, thiệp viết tay |
| **Đơn hàng** | Mã đơn, trang cảm ơn + hướng dẫn chuyển khoản, theo dõi tiến trình, hủy đơn, mua lại |
| **Tài khoản** | Đăng ký/đăng nhập email (mật khẩu băm SHA-256 + salt, “ghi nhớ đăng nhập”), Google, hạng thành viên, hồ sơ, sổ địa chỉ, đổi mật khẩu |
| **Thiết kế nhẫn** | 8 kiểu dáng × 7 dáng viên × 0.3–3 ct × 3 chất lượng × 4 kim loại, xem trước SVG trực tiếp, báo giá tức thì, liên kết chia sẻ, thêm vào giỏ |
| **Đo ni tay** | Đo trên màn hình bằng nhẫn có sẵn (hiệu chỉnh bằng thẻ ngân hàng), đo bằng sợi chỉ, bảng quy đổi; ni được lưu và **tự chọn sẵn** trên trang sản phẩm |
| **Tìm kiếm** | Tìm tức thì, gõ không dấu (“nhan cuoi vang hong”), bôi đậm từ khóa, lịch sử tìm kiếm, phím tắt `/` |
| **Bộ lọc** | Kiểu dáng, viên chủ, phong cách, chất liệu, bộ sưu tập, khoảng giá, sắp xếp; URL chia sẻ được |
| **Khác** | Yêu thích (chia sẻ danh sách), xem nhanh, đã xem gần đây, đánh giá sản phẩm, đặt lịch hẹn (+ Google Calendar), liên hệ, đăng ký nhận tin |

Toàn bộ dữ liệu người dùng lưu trên trình duyệt (`localStorage`, tiền tố `solene:`) — phù hợp demo; khi vận hành thật hãy nối các hàm trong `src/scripts/store.ts` với API/backend.

## 4. SEO

- Mỗi trang có `title`, `meta description`, canonical, Open Graph, Twitter Card riêng; ảnh OG 1200×630 cho từng sản phẩm/danh mục.
- **JSON-LD**: `JewelryStore`, `WebSite` + `SearchAction`, `Product` + `Offer`/`AggregateOffer`, `BreadcrumbList`, `CollectionPage`/`ItemList`, `FAQPage`, `Article`.
- `sitemap-index.xml` tự sinh, `robots.txt`; trang giỏ hàng/thanh toán/tài khoản đặt `noindex`.
- URL tiếng Việt thân thiện (`/nhan-cau-hon/`, `/san-pham/nhan-cuoi-hand-in-hand-classic/`), HTML ngữ nghĩa, alt ảnh tiếng Việt.
- Hiệu năng: ảnh WebP 400/800/1200 với `srcset`, lazy-load, preload ảnh hero & font, JS tối thiểu.

## 5. Font & hình ảnh

- Font tự host trong `public/fonts/` (không phụ thuộc Google Fonts), đầy đủ subset **tiếng Việt**: họ chữ không chân hiện đại **Manrope** (variable, dùng cho tiêu đề lẫn nội dung) và **Zalando Sans Expanded** (variable, chữ trình diễn ở hero banner). Giấy phép SIL OFL 1.1 — xem `public/fonts/licenses/`.
- Ảnh từ Unsplash (giấy phép miễn phí) — danh sách tác giả trong `IMAGE_CREDITS.md`. Ảnh hero từ `hero_banner.png`.

## 6. Cấu trúc

```
src/
  config.ts            thông tin thương hiệu, liên hệ, Google Client ID
  data/                sản phẩm, danh mục, bộ sưu tập, chính sách, nội dung
  lib/                 dùng chung server/client: catalog, vẽ nhẫn SVG, giá, SEO, icon
  components/          Header + mega menu, Footer, thẻ sản phẩm, form đăng nhập…
  layouts/Base.astro   khung trang + thẻ SEO
  pages/               các trang (định tuyến theo file)
  scripts/             JS phía trình duyệt (store, giỏ hàng, đăng nhập, từng trang)
  styles/              design tokens, thành phần, font
public/                ảnh, font, favicon, manifest
```

Thêm sản phẩm: khai báo trong `src/data/products.ts` (ảnh đặt tại `public/images/p/<key>-{400,800,1200}.webp`) — trang sản phẩm, danh mục, sitemap, tìm kiếm tự cập nhật.

## 7. Ghi chú kỹ thuật

- `astro.config.mjs` chuẩn hóa đường dẫn gốc dự án — khắc phục lỗi Vite/Astro trên Windows khi terminal mở với ký tự ổ đĩa viết thường (`e:\...`) khiến CSS không được gắn vào trang.
- Trình duyệt hỗ trợ: Chrome, Edge, Safari, Firefox bản mới; hỗ trợ `prefers-reduced-motion`, điều hướng bàn phím, ARIA cho menu/drawer/modal.
