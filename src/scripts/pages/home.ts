import { qs, qsa, reducedMotion } from '../ui';

function initTabs() {
  qsa('[data-tabs]').forEach((list) => {
    const tabs = qsa<HTMLButtonElement>('[role="tab"]', list);
    const select = (tab: HTMLButtonElement) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls')!);
        if (panel) panel.hidden = !on;
      });
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
          n.focus();
          select(n);
        }
      });
    });
  });
}

function initBuilderTeaser() {
  const items = qsa('[data-bt-ring] .bt-ring__item');
  const cap = qs('[data-bt-caption]');
  if (items.length < 2 || reducedMotion()) return;
  let i = 0;
  let timer = 0;
  const step = () => {
    items[i].classList.remove('is-active');
    i = (i + 1) % items.length;
    items[i].classList.add('is-active');
    if (cap) { cap.style.opacity = '0'; window.setTimeout(() => { cap.textContent = items[i].dataset.label || ''; cap.style.opacity = '1'; }, 300); }
  };
  const stage = qs('.bt-stage');
  const io = new IntersectionObserver(([en]) => {
    clearInterval(timer);
    if (en.isIntersecting) timer = window.setInterval(step, 3500);
  });
  if (stage) io.observe(stage);
}

export function initHome() {
  initTabs();
  initBuilderTeaser();
}
