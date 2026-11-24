/**
 * Đăng nhập Google (Google Identity Services) + đăng ký/đăng nhập email (mô phỏng phía client).
 * LƯU Ý BẢO MẬT: trong hệ thống thật, ID token Google phải được xác minh chữ ký ở server,
 * và mật khẩu phải băm/lưu ở server. Bản demo này lưu trong localStorage.
 */
import { GOOGLE_CLIENT_ID } from '../config';
import { icon } from '../lib/icons';
import { escapeHTML } from '../lib/format';
import { getSession, isEmail, isPhoneVN, login, loginWithGoogle, on, passwordScore, register, getUsers, normEmail, logout } from './store';
import { closeModal, isLayerOpen, openModal, qs, qsa, toast } from './ui';

declare global { interface Window { google?: any } }

// ───────────────────────── Google Identity Services ─────────────────────────
let gisPromise: Promise<any> | null = null;
let gisReady = false;

function loadGIS(): Promise<any> {
  if (gisPromise) return gisPromise;
  gisPromise = new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) return resolve(window.google);
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.onload = () => (window.google?.accounts?.id ? resolve(window.google) : reject(new Error('GIS unavailable')));
    s.onerror = () => reject(new Error('Không tải được Google Identity Services'));
    document.head.appendChild(s);
  });
  return gisPromise;
}

function decodeJwt(token: string): Record<string, any> {
  const part = token.split('.')[1] || '';
  const b64 = part.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes)); // giữ đúng tên tiếng Việt (UTF-8)
}

function handleCredential(resp: { credential?: string }) {
  try {
    if (!resp.credential) throw new Error('Không nhận được thông tin từ Google.');
    const p = decodeJwt(resp.credential);
    const validIss = p.iss === 'accounts.google.com' || p.iss === 'https://accounts.google.com';
    if (p.aud !== GOOGLE_CLIENT_ID || !validIss || p.exp * 1000 < Date.now()) throw new Error('Phiên đăng nhập Google không hợp lệ.');
    if (!p.email) throw new Error('Tài khoản Google chưa cung cấp email.');
    const user = loginWithGoogle({ sub: p.sub, email: p.email, name: p.name || p.email.split('@')[0], picture: p.picture });
    afterLogin(user.name, user.avatar);
  } catch (err: any) {
    toast({ type: 'error', title: 'Đăng nhập Google thất bại', message: err?.message || 'Vui lòng thử lại.' });
  }
}

async function initGIS() {
  if (!GOOGLE_CLIENT_ID) return null;
  const g = await loadGIS();
  if (!gisReady) {
    g.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredential,
      auto_select: false,
      cancel_on_tap_outside: true,
      context: 'signin',
      ux_mode: 'popup',
      itp_support: true,
      use_fedcm_for_prompt: true,
    });
    gisReady = true;
  }
  return g;
}

/** Vẽ nút Google chính thức vào mọi ô [data-google-btn] trong root */
async function renderGoogleButtons(root: ParentNode = document) {
  const slots = qsa<HTMLElement>('[data-google-btn]', root).filter((el) => !el.dataset.rendered);
  if (!slots.length) return;
  if (!GOOGLE_CLIENT_ID) {
    slots.forEach((slot) => {
      const tpl = slot.closest('[data-auth-root]')?.querySelector<HTMLTemplateElement>('template[data-google-fallback]');
      if (tpl) slot.replaceChildren(tpl.content.cloneNode(true));
      slot.dataset.rendered = '1';
    });
    return;
  }
  try {
    const g = await initGIS();
    slots.forEach((slot) => {
      const w = Math.max(240, Math.min(400, Math.round(slot.closest('[data-auth-root]')?.getBoundingClientRect().width || 360) - 80));
      g.accounts.id.renderButton(slot, { type: 'standard', theme: 'outline', size: 'large', text: 'continue_with', shape: 'rectangular', logo_alignment: 'center', width: w, locale: 'vi' });
      slot.dataset.rendered = '1';
    });
  } catch {
    slots.forEach((slot) => {
      const tpl = slot.closest('[data-auth-root]')?.querySelector<HTMLTemplateElement>('template[data-google-fallback]');
      if (tpl) slot.replaceChildren(tpl.content.cloneNode(true));
      slot.dataset.rendered = '1';
      slot.dataset.failed = '1';
    });
  }
}

function initOneTap() {
  if (!GOOGLE_CLIENT_ID || getSession()) return;
  try { if (sessionStorage.getItem('solene:onetap')) return; sessionStorage.setItem('solene:onetap', '1'); } catch {}
  window.setTimeout(async () => {
    if (getSession()) return;
    try { (await initGIS())?.accounts.id.prompt(); } catch {}
  }, 4500);
}

// ───────────────────────── forms ─────────────────────────
function setError(form: HTMLFormElement, name: string, msg: string) {
  const el = form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
  if (el) el.textContent = msg;
  form.querySelector(`[name="${name}"]`)?.closest('.field')?.classList.toggle('has-error', !!msg);
}
function clearErrors(form: HTMLFormElement) {
  qsa('[data-error-for]', form).forEach((e) => (e.textContent = ''));
  qsa('.field.has-error', form).forEach((f) => f.classList.remove('has-error'));
  const alert = form.querySelector<HTMLElement>('[data-auth-alert]');
  if (alert) { alert.hidden = true; alert.className = 'form-alert'; }
}
function showAlert(form: HTMLFormElement, msg: string, ok = false) {
  const alert = form.querySelector<HTMLElement>('[data-auth-alert]');
  if (!alert) return;
  alert.className = `form-alert${ok ? ' form-alert--ok' : ''}`;
  alert.textContent = msg;
  alert.hidden = false;
}

function switchTab(root: HTMLElement, tab: string) {
  qsa<HTMLElement>('[data-auth-panel]', root).forEach((p) => (p.hidden = p.dataset.authPanel !== tab));
  qsa<HTMLElement>('.auth__tab', root).forEach((t) => t.setAttribute('aria-selected', String(t.dataset.authTab === tab)));
  const tabs = root.querySelector<HTMLElement>('[data-auth-tabs]');
  if (tabs) tabs.hidden = tab === 'forgot';
  const title = root.querySelector('.auth__brand .serif');
  if (title) title.textContent = tab === 'register' ? 'Gia nhập Solène Circle' : tab === 'forgot' ? 'Khôi phục mật khẩu' : 'Chào mừng quý khách';
  renderGoogleButtons(root);
}

function afterLogin(name: string, avatar?: string) {
  const first = name.trim().split(/\s+/).pop();
  toast({ title: `Xin chào, ${first}!`, message: 'Bạn đã đăng nhập thành công.', image: avatar, icon: 'user' });
  if (isLayerOpen(qs('[data-modal="auth"]'))) closeModal('auth');
  qsa<HTMLFormElement>('[data-auth-form]').forEach((f) => { f.reset(); clearErrors(f); });
  qsa<HTMLElement>('[data-auth-root]').forEach((r) => {
    switchTab(r, 'login');
    const meter = r.querySelector<HTMLElement>('[data-pw-meter]');
    if (meter) meter.dataset.score = '0';
  });
}

function bindRoot(root: HTMLElement) {
  if (root.dataset.bound) return;
  root.dataset.bound = '1';
  root.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-auth-tab]');
    if (t) { e.preventDefault(); switchTab(root, t.dataset.authTab!); return; }
    if ((e.target as HTMLElement).closest('[data-google-fallback-btn]')) {
      const slot = (e.target as HTMLElement).closest<HTMLElement>('[data-google-btn]');
      toast(slot?.dataset.failed
        ? { type: 'error', title: 'Không kết nối được Google', message: 'Vui lòng kiểm tra kết nối mạng hoặc trình chặn quảng cáo rồi thử lại.' }
        : { type: 'error', title: 'Chưa cấu hình Google Sign-In', message: 'Thêm PUBLIC_GOOGLE_CLIENT_ID vào file .env rồi khởi động lại (xem README).', duration: 7000 });
    }
  });

  const meterInput = root.querySelector<HTMLInputElement>('[data-pw-meter-input]');
  const meter = root.querySelector<HTMLElement>('[data-pw-meter]');
  meterInput?.addEventListener('input', () => { if (meter) meter.dataset.score = String(passwordScore(meterInput.value)); });

  qsa<HTMLFormElement>('[data-auth-form]', root).forEach((form) => {
    form.addEventListener('input', (e) => {
      const n = (e.target as HTMLInputElement).name;
      if (n) setError(form, n, '');
    });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearErrors(form);
      const kind = form.dataset.authForm;
      const fd = new FormData(form);
      const v = (k: string) => String(fd.get(k) || '').trim();
      const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
      let bad = false;
      const err = (k: string, m: string) => { if (!bad) (form.querySelector(`[name="${k}"]`) as HTMLElement)?.focus(); setError(form, k, m); bad = true; };

      if (kind === 'login') {
        if (!isEmail(v('email'))) err('email', 'Email không hợp lệ.');
        if (!v('password')) err('password', 'Vui lòng nhập mật khẩu.');
        if (bad) return;
        btn?.classList.add('is-loading');
        try {
          const user = await login(v('email'), String(fd.get('password')), fd.get('remember') === 'on');
          afterLogin(user.name, user.avatar);
        } catch (ex: any) { showAlert(form, ex.message); }
        finally { btn?.classList.remove('is-loading'); }
      }

      if (kind === 'register') {
        const pw = String(fd.get('password') || '');
        if (v('name').length < 2) err('name', 'Vui lòng nhập họ tên.');
        if (!isEmail(v('email'))) err('email', 'Email không hợp lệ.');
        if (v('phone') && !isPhoneVN(v('phone'))) err('phone', 'Số điện thoại chưa đúng định dạng.');
        if (pw.length < 8) err('password', 'Mật khẩu cần tối thiểu 8 ký tự.');
        else if (passwordScore(pw) < 2) err('password', 'Nên kết hợp chữ hoa, chữ thường và số.');
        if (pw !== String(fd.get('password2') || '')) err('password2', 'Mật khẩu nhập lại không khớp.');
        if (fd.get('terms') !== 'on') err('terms', 'Vui lòng đồng ý với chính sách bảo mật.');
        if (bad) return;
        btn?.classList.add('is-loading');
        try {
          const user = await register({ name: v('name'), email: v('email'), phone: v('phone'), password: pw, newsletter: fd.get('news') === 'on' });
          afterLogin(user.name);
        } catch (ex: any) { showAlert(form, ex.message); }
        finally { btn?.classList.remove('is-loading'); }
      }

      if (kind === 'forgot') {
        if (!isEmail(v('email'))) { err('email', 'Email không hợp lệ.'); return; }
        btn?.classList.add('is-loading');
        await new Promise((r) => setTimeout(r, 700));
        btn?.classList.remove('is-loading');
        const exists = getUsers().find((u) => u.email === normEmail(v('email')));
        showAlert(form, exists?.provider === 'google' && !exists.hash
          ? 'Email này đăng nhập bằng Google — vui lòng chọn “Tiếp tục với Google”.'
          : `Nếu ${v('email')} đã đăng ký, chúng tôi vừa gửi liên kết đặt lại mật khẩu (mô phỏng). Vui lòng kiểm tra hộp thư.`, true);
      }
    });
  });
}

// ───────────────────────── header state ─────────────────────────
const initials = (name: string) => name.trim().split(/\s+/).map((w) => w[0]).slice(-2).join('').toUpperCase();

function renderAccount() {
  const s = getSession();
  qsa('[data-account-icon]').forEach((el) => {
    el.innerHTML = s
      ? s.avatar
        ? `<img class="avatar" src="${escapeHTML(s.avatar)}" alt="" width="28" height="28" referrerpolicy="no-referrer">`
        : `<span class="avatar-initial">${escapeHTML(initials(s.name))}</span>`
      : icon('user');
  });
  qsa('[data-account-link]').forEach((a) => a.setAttribute('aria-label', s ? `Tài khoản của ${s.name}` : 'Đăng nhập hoặc tạo tài khoản'));
  qsa('[data-account-text] span').forEach((el) => (el.textContent = s ? `Xin chào, ${s.name.split(/\s+/).pop()}` : 'Đăng nhập / Đăng ký'));
}

/** Mở modal đăng nhập (có thể kèm thông điệp) */
export function requireAuth(tab: 'login' | 'register' = 'login') {
  const root = qs<HTMLElement>('[data-modal="auth"] [data-auth-root]');
  if (root) switchTab(root, tab);
  openModal('auth');
  renderGoogleButtons(qs('[data-modal="auth"]')!);
}

export function signOut() {
  try { window.google?.accounts?.id?.disableAutoSelect(); } catch {}
  logout();
  toast({ message: 'Bạn đã đăng xuất. Hẹn gặp lại!', icon: 'logout' });
}

export function initAuthUI() {
  qsa<HTMLElement>('[data-auth-root]').forEach(bindRoot);
  renderAccount();
  on('auth:change', renderAccount);

  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('[data-account-link], [data-account-text], [data-auth-open]');
    if (!a) return;
    if (getSession() && !a.hasAttribute('data-auth-open')) return; // đã đăng nhập → vào trang tài khoản
    if (location.pathname.startsWith('/tai-khoan')) return;
    e.preventDefault();
    requireAuth((a.dataset.authOpen as 'login' | 'register') || 'login');
  });
  document.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('[data-logout]')) { e.preventDefault(); signOut(); }
  });

  // Trang có form đăng nhập hiển thị sẵn (Tài khoản) → vẽ nút Google ngay
  const inline = qsa<HTMLElement>('[data-auth-root]').filter((r) => !r.closest('[data-modal]'));
  if (inline.length) inline.forEach((r) => renderGoogleButtons(r));
  else if (GOOGLE_CLIENT_ID && 'requestIdleCallback' in window) (window as any).requestIdleCallback(() => renderGoogleButtons(qs('[data-modal="auth"]')!), { timeout: 4000 });
  else renderGoogleButtons(qs('[data-modal="auth"]')!);
  initOneTap();
}
