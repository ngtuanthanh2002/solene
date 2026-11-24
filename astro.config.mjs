// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { realpathSync } from 'node:fs';

/**
 * Windows: VS Code thường mở terminal với ký tự ổ đĩa viết thường (e:\...) trong khi Vite dùng
 * đường dẫn thật (E:\...). Sự lệch này khiến CSS không được gắn vào trang. Chuẩn hóa root về đường dẫn thật.
 */
const ROOT = realpathSync.native(process.cwd());

/**
 * Domain thật của website khi deploy (dùng cho canonical, Open Graph, sitemap).
 * Đặt biến môi trường SITE_URL khi build, ví dụ: SITE_URL=https://www.ten-mien-cua-ban.vn npm run build
 */
const SITE_URL = process.env.SITE_URL || 'https://solene.example';

// Các trang cá nhân / giao dịch không cần index
const NOINDEX = ['/gio-hang/', '/thanh-toan/', '/dat-hang-thanh-cong/', '/tai-khoan/', '/yeu-thich/', '/tim-kiem/', '/404/'];

export default defineConfig({
  root: ROOT,
  site: SITE_URL,
  build: { format: 'directory' },
  // Cố định cổng để khớp với "Authorized JavaScript origins" của Google OAuth
  server: { port: 4321 },
  integrations: [
    sitemap({
      filter: (page) => !NOINDEX.some((p) => page.endsWith(p)),
      changefreq: 'weekly',
      priority: 0.7,
    }),
  ],
});
