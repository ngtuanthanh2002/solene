/** Điểm khởi tạo chung cho mọi trang */
import { initCrossTabSync } from './store';
import { initUI } from './ui';
import { initCartUI } from './cart-ui';
import { initAuthUI } from './auth-ui';
import { initQuickView } from './product-ui';
import { initSearch } from './search';

function boot() {
  initCrossTabSync();
  initUI();
  initCartUI();
  initAuthUI();
  initQuickView();
  initSearch();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
