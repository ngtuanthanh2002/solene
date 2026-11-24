/** UI dùng chung: lớp phủ (drawer/modal/search), toast, header, mega menu, hiệu ứng. */
import { icon } from '../lib/icons';
import { escapeHTML } from '../lib/format';
import { subscribe, isEmail } from './store';

export const qs = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
export const qsa = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel));
export const isDesktop = () => window.matchMedia('(min-width: 1100px)').matches;
export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ───────────────────────── layers ─────────────────────────
type Kind = 'drawer' | 'modal' | 'search';
interface Layer { el: HTMLElement; kind: Kind; trigger: Element | null; onClose?: () => void }
const stack: Layer[] = [];
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

function lockScroll() {
  if (document.body.classList.contains('is-locked')) return;
  const sw = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.paddingRight = sw > 0 ? `${sw}px` : '';
  document.body.classList.add('is-locked');
}
function unlockScroll() {
  document.body.classList.remove('is-locked');
  document.body.style.paddingRight = '';
}
function syncOverlay() {
  const overlay = qs('[data-overlay]');
  const need = stack.some((l) => l.kind !== 'modal');
  overlay?.classList.toggle('is-visible', need);
}
function syncTriggers(el: HTMLElement, open: boolean) {
  const name = el.dataset.drawer;
  if (name) qsa(`[data-drawer-open="${name}"]`).forEach((t) => t.setAttribute('aria-expanded', String(open)));
}

export function openLayer(el: HTMLElement | null, kind: Kind, onClose?: () => void) {
  if (!el || stack.some((l) => l.el === el)) return;
  if (kind !== 'modal') closeAllLayers(true);
  closeMega();
  const trigger = document.activeElement;
  stack.push({ el, kind, trigger, onClose });
  el.classList.add('is-open');
  el.setAttribute('aria-hidden', 'false');
  syncTriggers(el, true);
  syncOverlay();
  lockScroll();
  const target = qs<HTMLElement>('[autofocus], [data-autofocus]', el) || qs<HTMLElement>('.drawer__body ' + FOCUSABLE + ', ' + FOCUSABLE, el);
  window.setTimeout(() => (target || el).focus({ preventScroll: true }), kind === 'search' ? 350 : 60);
}

export function closeLayer(el?: HTMLElement | null, silent = false) {
  const idx = el ? stack.findIndex((l) => l.el === el) : stack.length - 1;
  if (idx < 0) return;
  const [layer] = stack.splice(idx, 1);
  layer.el.classList.remove('is-open');
  layer.el.setAttribute('aria-hidden', 'true');
  syncTriggers(layer.el, false);
  syncOverlay();
  if (!stack.length) unlockScroll();
  layer.onClose?.();
  if (!silent && layer.trigger instanceof HTMLElement && document.contains(layer.trigger)) layer.trigger.focus({ preventScroll: true });
}
export function closeAllLayers(silent = false) { while (stack.length) closeLayer(stack[stack.length - 1].el, silent); }
export const isLayerOpen = (el: HTMLElement | null) => !!el && stack.some((l) => l.el === el);
export const anyLayerOpen = () => stack.length > 0;

export const openDrawer = (name: string) => openLayer(qs(`[data-drawer="${name}"]`), 'drawer');
export const openModal = (name: string, onClose?: () => void) => openLayer(qs(`[data-modal="${name}"]`), 'modal', onClose);
export const closeModal = (name: string) => closeLayer(qs(`[data-modal="${name}"]`));

function initLayers() {
  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const opener = t.closest<HTMLElement>('[data-drawer-open]');
    if (opener) { e.preventDefault(); openDrawer(opener.dataset.drawerOpen!); return; }
    const modalOpener = t.closest<HTMLElement>('[data-modal-open]');
    if (modalOpener) { e.preventDefault(); openModal(modalOpener.dataset.modalOpen!); return; }
    if (t.closest('[data-drawer-close]')) { closeLayer(t.closest<HTMLElement>('[data-drawer]')); return; }
    if (t.closest('[data-modal-close]')) { closeLayer(t.closest<HTMLElement>('[data-modal]')); return; }
    if (t.closest('[data-overlay]')) {
      const top = [...stack].reverse().find((l) => l.kind !== 'modal');
      if (top) closeLayer(top.el);
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (stack.length) { e.preventDefault(); closeLayer(); }
      else closeMega();
      return;
    }
    if (e.key === 'Tab' && stack.length) {
      const el = stack[stack.length - 1].el;
      const f = qsa<HTMLElement>(FOCUSABLE, el).filter((x) => x.offsetParent !== null || x === document.activeElement);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || !el.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

// ───────────────────────── toast ─────────────────────────
interface ToastOpts { title?: string; message: string; icon?: string; image?: string; type?: 'success' | 'error' | 'info'; action?: { label: string; href?: string; onClick?: () => void }; duration?: number }
export function toast(input: string | ToastOpts) {
  const o: ToastOpts = typeof input === 'string' ? { message: input } : input;
  const box = qs('[data-toasts]');
  if (!box) return;
  const el = document.createElement('div');
  el.className = `toast${o.type === 'error' ? ' toast--error' : ''}`;
  const iconHTML = o.image ? `<img src="${o.image}" alt="">` : icon(o.icon || (o.type === 'error' ? 'info' : 'check'));
  el.innerHTML = `<span class="toast__icon">${iconHTML}</span><span>${o.title ? `<b class="toast__title">${escapeHTML(o.title)}</b>` : ''}${escapeHTML(o.message)}</span>${o.action ? `<${o.action.href ? `a href="${o.action.href}"` : 'button type="button"'} class="toast__action">${escapeHTML(o.action.label)}</${o.action.href ? 'a' : 'button'}>` : ''}`;
  if (o.action?.onClick) el.querySelector('.toast__action')?.addEventListener('click', () => { o.action!.onClick!(); dismiss(); });
  box.appendChild(el);
  while (box.children.length > 3) box.firstElementChild?.remove();
  let timer = window.setTimeout(dismiss, o.duration ?? 4600);
  el.addEventListener('mouseenter', () => clearTimeout(timer));
  el.addEventListener('mouseleave', () => { timer = window.setTimeout(dismiss, 2000); });
  function dismiss() {
    el.classList.add('is-leaving');
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }
}

// ───────────────────────── header & mega menu ─────────────────────────
let megaTimer = 0;
function closeMega() {
  qsa('.main-nav__item.is-open').forEach((i) => {
    i.classList.remove('is-open');
    i.querySelector('.main-nav__link')?.setAttribute('aria-expanded', 'false');
  });
  qs('[data-header]')?.classList.remove('mega-open');
  qs('[data-mega-backdrop]')?.classList.remove('is-visible');
}
function openMega(item: HTMLElement) {
  if (item.classList.contains('is-open')) return;
  closeMega();
  item.classList.add('is-open');
  item.querySelector('.main-nav__link')?.setAttribute('aria-expanded', 'true');
  qs('[data-header]')?.classList.add('mega-open');
  qs('[data-mega-backdrop]')?.classList.add('is-visible');
}
function initHeader() {
  const header = qs('[data-header]');
  if (!header) return;
  let lastY = window.scrollY;
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 8);
    const megaOpen = header.classList.contains('mega-open');
    if (!megaOpen && !anyLayerOpen()) {
      if (y > 420 && y - lastY > 6) header.classList.add('is-hidden');
      else if (lastY - y > 6 || y < 200) header.classList.remove('is-hidden');
    }
    qs('[data-to-top]')?.classList.toggle('is-visible', y > 900);
    lastY = y;
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  qsa('[data-mega-item]').forEach((item) => {
    item.addEventListener('mouseenter', () => { if (!isDesktop()) return; clearTimeout(megaTimer); megaTimer = window.setTimeout(() => openMega(item), 90); });
    item.addEventListener('mouseleave', () => { clearTimeout(megaTimer); megaTimer = window.setTimeout(closeMega, 170); });
    item.addEventListener('focusin', () => openMega(item));
    item.addEventListener('focusout', (e) => { if (!item.contains(e.relatedTarget as Node)) closeMega(); });
    const link = item.querySelector<HTMLAnchorElement>('.main-nav__link');
    link?.addEventListener('click', (e) => {
      if (window.matchMedia('(hover: none)').matches && !item.classList.contains('is-open')) { e.preventDefault(); openMega(item); }
    });
  });
  qsa('.main-nav__item:not([data-mega-item])').forEach((item) => item.addEventListener('mouseenter', () => { clearTimeout(megaTimer); megaTimer = window.setTimeout(closeMega, 120); }));
  qs('[data-mega-backdrop]')?.addEventListener('mouseenter', () => { clearTimeout(megaTimer); megaTimer = window.setTimeout(closeMega, 60); });
  qs('[data-mega-backdrop]')?.addEventListener('click', closeMega);

  // thông báo chạy
  const msgs = qsa('[data-announce] .announce__msg');
  if (msgs.length > 1 && !reducedMotion()) {
    let i = 0;
    window.setInterval(() => {
      const cur = msgs[i];
      cur.classList.remove('is-active');
      cur.classList.add('is-leaving');
      window.setTimeout(() => cur.classList.remove('is-leaving'), 800);
      i = (i + 1) % msgs.length;
      msgs[i].classList.add('is-active');
    }, 4800);
  }
}

// ───────────────────────── misc behaviours ─────────────────────────
function initReveal() {
  qsa('[data-stagger]').forEach((parent) => {
    const step = parseFloat(parent.dataset.stagger || '0.08');
    Array.from(parent.children).forEach((c, i) => (c as HTMLElement).style.setProperty('--d', `${(i % 8) * step}s`));
  });
  const els = qsa('[data-reveal]');
  if (!('IntersectionObserver' in window) || reducedMotion()) { els.forEach((e) => e.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach((e) => io.observe(e));
}
export function observeReveal(root: ParentNode = document) {
  const els = qsa('[data-reveal]:not(.is-in)', root);
  if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }), { threshold: 0.05 });
  els.forEach((e) => io.observe(e));
}

function initImageFade() {
  const mark = (img: HTMLImageElement) => img.classList.add('is-loaded');
  document.addEventListener('load', (e) => { const t = e.target as HTMLElement; if (t instanceof HTMLImageElement && t.classList.contains('img-fade')) mark(t); }, true);
  document.addEventListener('error', (e) => { const t = e.target as HTMLElement; if (t instanceof HTMLImageElement && t.classList.contains('img-fade')) mark(t); }, true);
  qsa<HTMLImageElement>('img.img-fade').forEach((img) => { if (img.complete) mark(img); });
}
export function markLoadedImages(root: ParentNode) {
  qsa<HTMLImageElement>('img.img-fade', root).forEach((img) => { if (img.complete) img.classList.add('is-loaded'); });
}

function initMisc() {
  qs('[data-to-top]')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' }));

  const concierge = qs('[data-concierge]');
  const ctoggle = qs('[data-concierge-toggle]');
  ctoggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = !concierge?.classList.contains('is-open');
    concierge?.classList.toggle('is-open', open);
    ctoggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (e) => {
    if (concierge?.classList.contains('is-open') && !concierge.contains(e.target as Node)) {
      concierge.classList.remove('is-open');
      ctoggle?.setAttribute('aria-expanded', 'false');
    }
  });

  qsa<HTMLFormElement>('[data-newsletter]').forEach((form) => form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]') as HTMLInputElement;
    if (!isEmail(input.value)) { toast({ type: 'error', message: 'Vui lòng nhập email hợp lệ.' }); input.focus(); return; }
    const isNew = subscribe(input.value);
    toast({ title: isNew ? 'Cảm ơn quý khách!' : 'Email đã đăng ký', message: isNew ? 'Mã WELCOME giảm 1.000.000 ₫ đã sẵn sàng cho đơn đầu tiên.' : 'Bạn đã có trong danh sách Solène Circle.', icon: 'mail' });
    form.reset();
  }));

  // footer accordion (mobile)
  const mq = window.matchMedia('(max-width: 699px)');
  const syncFooter = () => qsa<HTMLDetailsElement>('[data-footer-acc]').forEach((d) => { d.open = !mq.matches; });
  syncFooter();
  mq.addEventListener('change', syncFooter);
  qsa('[data-footer-acc] > summary').forEach((s) => s.addEventListener('click', (e) => { if (!mq.matches) e.preventDefault(); }));

  // mobile nav accordion
  qsa<HTMLButtonElement>('[data-mnav-toggle]').forEach((btn) => btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', String(open));
    document.getElementById(btn.getAttribute('aria-controls')!)?.classList.toggle('is-open', open);
  }));

  // password show/hide (mọi form)
  document.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-pw-toggle]');
    if (!btn) return;
    const input = btn.parentElement?.querySelector('input');
    if (!input) return;
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.innerHTML = icon(show ? 'eye-off' : 'eye');
    btn.setAttribute('aria-label', show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu');
  });

  // tắt intro cho các lần tải trang sau trong phiên
  if (qs('[data-preloader]')) {
    try { sessionStorage.setItem('solene:intro', '1'); } catch {}
    window.setTimeout(() => qs('[data-preloader]')?.remove(), 2200);
  }
}

/** Hiệu ứng "bay vào giỏ" từ ảnh sản phẩm tới icon giỏ hàng */
export function flyToCart(from: Element | null) {
  const target = qsa('[data-drawer-open="cart"]').find((el) => el.getBoundingClientRect().width > 0);
  if (!from || !target || reducedMotion()) return;
  const a = from.getBoundingClientRect(), b = target.getBoundingClientRect();
  const dot = document.createElement('span');
  dot.style.cssText = `position:fixed;z-index:140;left:${a.left + a.width / 2 - 9}px;top:${a.top + a.height / 2 - 9}px;width:12px;height:12px;border-radius:50%;background:#151515;pointer-events:none;transition:transform .9s cubic-bezier(.5,-0.3,.7,1),opacity .9s;`;
  document.body.appendChild(dot);
  requestAnimationFrame(() => {
    dot.style.transform = `translate(${b.left + b.width / 2 - (a.left + a.width / 2)}px, ${b.top + b.height / 2 - (a.top + a.height / 2)}px) scale(.4)`;
    dot.style.opacity = '0.2';
  });
  window.setTimeout(() => dot.remove(), 950);
}

export function initUI() {
  initLayers();
  initHeader();
  initReveal();
  initImageFade();
  initMisc();
}
