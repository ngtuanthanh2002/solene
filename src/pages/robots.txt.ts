import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site).href;
  // Các trang giỏ hàng/thanh toán/tài khoản dùng thẻ meta "noindex" (không chặn ở đây để bot đọc được thẻ đó)
  const body = `User-agent: *
Allow: /

Sitemap: ${sitemap}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
