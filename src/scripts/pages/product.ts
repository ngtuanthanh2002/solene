import { bindProductForm } from '../product-ui';
import { addReview, getRecent, getReviews, getSession, pushRecent } from '../store';
import { loadProducts } from '../catalog-client';
import { productCardHTML } from '../../lib/card';
import { imageUrl } from '../../lib/catalog';
import { escapeHTML, formatDate } from '../../lib/format';
import { icon } from '../../lib/icons';
import { markLoadedImages, openModal, qs, qsa, toast } from '../ui';
import { syncWishButtons } from '../cart-ui';

const starsHTML = (r: number) => `<span class="stars">${Array.from({ length: 5 }, (_, i) => `<span style="opacity:${i < r ? 1 : 0.25}">${icon('star')}</span>`).join('')}</span>`;

function initGallery(gallery: string[]) {
  const slides = qs('[data-slides]');
  if (!slides) return;
  const thumbs = qsa<HTMLButtonElement>('[data-thumb]');
  const dots = qsa('.pdp__dots span');
  let index = 0;
  const setActive = (i: number) => {
    index = i;
    thumbs.forEach((t, k) => t.setAttribute('aria-selected', String(k === i)));
    dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
  };
  thumbs.forEach((t) => t.addEventListener('click', () => {
    const i = Number(t.dataset.thumb);
    slides.scrollTo({ left: i * slides.clientWidth, behavior: 'smooth' });
    setActive(i);
  }));
  let raf = 0;
  slides.addEventListener('scroll', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => setActive(Math.round(slides.scrollLeft / slides.clientWidth)));
  }, { passive: true });
  slides.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const i = Math.max(0, Math.min(gallery.length - 1, index + (e.key === 'ArrowRight' ? 1 : -1)));
      slides.scrollTo({ left: i * slides.clientWidth, behavior: 'smooth' });
      setActive(i);
    }
  });

  // phóng to khi rê chuột (desktop)
  const canZoom = () => window.matchMedia('(hover: hover) and (min-width: 1000px)').matches;
  qsa<HTMLElement>('.pdp__slide').forEach((fig) => {
    const img = fig.querySelector('img')!;
    fig.addEventListener('mouseenter', () => {
      if (!canZoom()) return;
      if (img.dataset.zoom && !img.dataset.zoomed) { img.srcset = ''; img.src = img.dataset.zoom; img.dataset.zoomed = '1'; }
      fig.classList.add('is-zoom');
    });
    fig.addEventListener('mousemove', (e) => {
      if (!fig.classList.contains('is-zoom')) return;
      const r = fig.getBoundingClientRect();
      img.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
    });
    fig.addEventListener('mouseleave', () => fig.classList.remove('is-zoom'));
    fig.addEventListener('click', () => openLightbox(Number(fig.dataset.slide)));
  });

  // lightbox
  const lbImg = qs<HTMLImageElement>('[data-lightbox-img]');
  const lbCount = qs('[data-lightbox-count]');
  let lb = 0;
  const showLb = (i: number) => {
    lb = (i + gallery.length) % gallery.length;
    if (lbImg) { lbImg.src = imageUrl(gallery[lb], 1200); lbImg.alt = `Ảnh ${lb + 1}`; }
    if (lbCount) lbCount.textContent = `${lb + 1} / ${gallery.length}`;
  };
  function openLightbox(i: number) { showLb(i); openModal('lightbox'); }
  qs('[data-lightbox-open]')?.addEventListener('click', () => openLightbox(index));
  qs('[data-lightbox-prev]')?.addEventListener('click', () => showLb(lb - 1));
  qs('[data-lightbox-next]')?.addEventListener('click', () => showLb(lb + 1));
  document.addEventListener('keydown', (e) => {
    if (!qs('[data-modal="lightbox"]')?.classList.contains('is-open')) return;
    if (e.key === 'ArrowRight') showLb(lb + 1);
    if (e.key === 'ArrowLeft') showLb(lb - 1);
  });
}

function initSticky(form: HTMLFormElement | null) {
  const bar = qs('[data-sticky-atc]');
  const addBtn = form?.querySelector('[data-add]');
  const priceOut = qs('[data-sticky-price]');
  if (!bar || !form || !addBtn) return;
  const syncPrice = () => { if (priceOut) priceOut.textContent = form.querySelector('[data-price-display]')?.textContent || ''; };
  syncPrice();
  form.addEventListener('product:change', syncPrice);
  new IntersectionObserver(([en]) => {
    const show = !en.isIntersecting && en.boundingClientRect.top < 0;
    bar.classList.toggle('is-visible', show);
    bar.setAttribute('aria-hidden', String(!show));
  }).observe(addBtn);
  qs('[data-sticky-add]')?.addEventListener('click', () => {
    const missing = qsa<HTMLSelectElement>('select[required]', form).find((s) => !s.value);
    if (missing) {
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.setTimeout(() => missing.focus(), 450);
      toast({ type: 'error', message: 'Vui lòng chọn ni tay trước khi thêm vào giỏ.' });
      return;
    }
    form.requestSubmit();
  });
}

function reviewHTML(r: { name: string; rating: number; title: string; text: string; date: string }, fresh = false) {
  return `<article class="review${fresh ? ' review--new' : ''}"><div class="review__head">${starsHTML(r.rating)}<time datetime="${r.date}">${formatDate(r.date)}</time></div><h3 class="review__title">${escapeHTML(r.title)}</h3><p>${escapeHTML(r.text)}</p><p class="review__by"><b>${escapeHTML(r.name)}</b> · Vừa đánh giá</p></article>`;
}

function initReviews(productId: string) {
  const list = qs('[data-reviews-list]');
  const form = qs<HTMLFormElement>('[data-review-form]');
  const toggle = qs<HTMLButtonElement>('[data-review-toggle]');
  if (!list || !form || !toggle) return;
  const mine = getReviews(productId);
  if (mine.length) list.insertAdjacentHTML('afterbegin', mine.map((r) => reviewHTML(r)).join(''));
  toggle.addEventListener('click', () => {
    const open = form.hidden;
    form.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Đóng' : 'Viết đánh giá';
    const s = getSession();
    const name = form.querySelector<HTMLInputElement>('[name="name"]');
    if (open && s && name && !name.value) name.value = s.name;
    if (open) form.querySelector<HTMLInputElement>(s ? '[name="title"]' : '[name="name"]')?.focus();
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = String(fd.get('name') || '').trim();
    const title = String(fd.get('title') || '').trim();
    const text = String(fd.get('text') || '').trim();
    const err = form.querySelector('[data-error-for="text"]');
    if (!name || !title || text.length < 10) {
      if (err) err.textContent = 'Vui lòng nhập tên, tiêu đề và nội dung (tối thiểu 10 ký tự).';
      return;
    }
    if (err) err.textContent = '';
    const r = addReview({ productId, name, title, text, rating: Number(fd.get('rating') || 5) });
    list.insertAdjacentHTML('afterbegin', reviewHTML(r, true));
    form.reset();
    form.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = 'Viết đánh giá';
    toast({ title: 'Cảm ơn bạn!', message: 'Đánh giá của bạn đã được đăng.', icon: 'star' });
  });
}

async function initRecent(currentId: string) {
  const ids = getRecent().filter((id) => id !== currentId).slice(0, 4);
  const section = qs('[data-recent-section]');
  const grid = qs('[data-recent-grid]');
  if (!ids.length || !section || !grid) return;
  try {
    const list = await loadProducts();
    const items = ids.map((id) => list.find((p) => p.id === id)).filter(Boolean);
    if (!items.length) return;
    grid.innerHTML = items.map((p, i) => productCardHTML(p!, { index: i })).join('');
    section.hidden = false;
    syncWishButtons(grid);
    markLoadedImages(grid);
  } catch {}
}

function initShare() {
  qsa('[data-copy-link]').forEach((b) => b.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      toast({ message: 'Đã sao chép liên kết sản phẩm.', icon: 'check' });
    } catch {
      window.prompt('Sao chép liên kết:', location.href);
    }
  }));
}

export function initProductPage() {
  const raw = qs('#product-data')?.textContent;
  if (!raw) return;
  const data = JSON.parse(raw);
  const form = qs<HTMLFormElement>('.pdp [data-product-form]');
  if (form) bindProductForm(form, data, { imageEl: () => qs('.pdp__slide img') });
  pushRecent(data.id);
  initGallery(data.gallery);
  initSticky(form);
  initReviews(data.id);
  initRecent(data.id);
  initShare();
}
