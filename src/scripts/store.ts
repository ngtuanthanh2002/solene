/**
 * Lớp dữ liệu phía trình duyệt: lưu trong localStorage (tiền tố "solene:").
 * Phát sự kiện window: cart:change · wishlist:change · auth:change · orders:change
 */
import { PROMOS } from '../data/content';

const PREFIX = 'solene:';

// ───────────────────────── storage helpers ─────────────────────────
export function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
export function write(key: string, value: unknown) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn('[solene] Không thể lưu dữ liệu', e);
  }
}
export function remove(key: string) {
  try { localStorage.removeItem(PREFIX + key); sessionStorage.removeItem(PREFIX + key); } catch {}
}
export const emit = (name: string, detail?: unknown) => window.dispatchEvent(new CustomEvent(name, { detail }));
export const on = (name: string, fn: (e: CustomEvent) => void) => window.addEventListener(name, fn as EventListener);

/** Đồng bộ giữa các tab trình duyệt */
export function initCrossTabSync() {
  const map: Record<string, string> = { cart: 'cart:change', wishlist: 'wishlist:change', session: 'auth:change', users: 'auth:change', orders: 'orders:change' };
  window.addEventListener('storage', (e) => {
    if (!e.key || !e.key.startsWith(PREFIX)) return;
    const ev = map[e.key.slice(PREFIX.length)];
    if (ev) emit(ev);
  });
}

export const uid = (p = '') => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

// ───────────────────────── cart ─────────────────────────
export interface CartItem {
  key: string;
  id: string;
  slug: string;
  name: string;
  image: string; // image key, or data:/url for custom designs
  price: number;
  qty: number;
  category: string;
  options: Record<string, string>;
  optionsText: string[];
  custom?: boolean;
}
export interface Cart { items: CartItem[]; promo?: string; giftWrap?: boolean; note?: string }

export const MAX_QTY = 10;
export const getCart = (): Cart => {
  const c = read<Cart>('cart', { items: [] });
  if (!Array.isArray(c.items)) c.items = [];
  return c;
};
function saveCart(c: Cart) { write('cart', c); emit('cart:change', c); }
const itemKey = (id: string, options: Record<string, string>) =>
  id + '|' + Object.keys(options).sort().map((k) => `${k}=${options[k]}`).join('&');

export function addToCart(input: Omit<CartItem, 'key' | 'qty'> & { qty?: number }) {
  const cart = getCart();
  const key = itemKey(input.id, input.options);
  const qty = Math.max(1, input.qty || 1);
  const existing = cart.items.find((i) => i.key === key);
  if (existing) existing.qty = Math.min(MAX_QTY, existing.qty + qty);
  else cart.items.unshift({ ...input, key, qty: Math.min(MAX_QTY, qty) });
  saveCart(cart);
  return cart;
}
export function setQty(key: string, qty: number) {
  const cart = getCart();
  const it = cart.items.find((i) => i.key === key);
  if (!it) return;
  if (qty <= 0) cart.items = cart.items.filter((i) => i.key !== key);
  else it.qty = Math.min(MAX_QTY, Math.round(qty));
  saveCart(cart);
}
export function removeFromCart(key: string) {
  const cart = getCart();
  const it = cart.items.find((i) => i.key === key);
  cart.items = cart.items.filter((i) => i.key !== key);
  saveCart(cart);
  return it;
}
export function updateCart(patch: Partial<Cart>) { saveCart({ ...getCart(), ...patch }); }
export function clearCart() { saveCart({ items: [] }); }
export const cartCount = (c = getCart()) => c.items.reduce((s, i) => s + i.qty, 0);
export const cartSubtotal = (c = getCart()) => c.items.reduce((s, i) => s + i.price * i.qty, 0);

export function computeTotals(items: CartItem[], promoCode?: string, shippingFee = 0) {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  let discount = 0;
  let promo: (typeof PROMOS)[string] & { code: string } | null = null;
  const code = (promoCode || '').trim().toUpperCase();
  const p = code ? PROMOS[code] : undefined;
  if (p) {
    const base = p.category ? items.filter((i) => i.category === p.category).reduce((s, i) => s + i.price * i.qty, 0) : subtotal;
    if (base > 0 && (!p.min || subtotal >= p.min)) {
      discount = p.type === 'percent' ? (base * p.value) / 100 : p.value;
      if (p.max) discount = Math.min(discount, p.max);
      discount = Math.round(Math.min(discount, base));
      promo = { ...p, code };
    }
  }
  return { subtotal, discount, shippingFee, total: Math.max(0, subtotal - discount + shippingFee), promo };
}

export function checkPromo(code: string, items: CartItem[]): { ok: boolean; message: string } {
  const c = code.trim().toUpperCase();
  if (!c) return { ok: false, message: 'Vui lòng nhập mã ưu đãi.' };
  const p = PROMOS[c];
  if (!p) return { ok: false, message: 'Mã ưu đãi không hợp lệ hoặc đã hết hạn.' };
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  if (p.min && subtotal < p.min) return { ok: false, message: `Mã ${c} áp dụng cho đơn từ ${new Intl.NumberFormat('vi-VN').format(p.min)} ₫.` };
  if (p.category && !items.some((i) => i.category === p.category)) return { ok: false, message: `Mã ${c} chỉ áp dụng cho nhẫn cưới.` };
  return { ok: true, message: `Đã áp dụng mã ${c}: ${p.label}.` };
}

// ───────────────────────── wishlist ─────────────────────────
export const getWishlist = (): string[] => read<string[]>('wishlist', []);
export const inWishlist = (id: string) => getWishlist().includes(id);
export function toggleWishlist(id: string): boolean {
  const list = getWishlist();
  const idx = list.indexOf(id);
  if (idx >= 0) list.splice(idx, 1);
  else list.unshift(id);
  write('wishlist', list);
  emit('wishlist:change', list);
  return idx < 0;
}

// ───────────────────────── recently viewed ─────────────────────────
export function pushRecent(id: string) {
  const list = read<string[]>('recent', []).filter((x) => x !== id);
  list.unshift(id);
  write('recent', list.slice(0, 12));
}
export const getRecent = () => read<string[]>('recent', []);

// ───────────────────────── auth ─────────────────────────
export interface Address { id: string; name: string; phone: string; province: string; address: string; isDefault?: boolean }
export interface User {
  id: string;
  provider: 'email' | 'google';
  googleId?: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  salt?: string;
  hash?: string;
  createdAt: number;
  birthday?: string;
  anniversary?: string;
  newsletter?: boolean;
  addresses?: Address[];
}
export interface Session { userId: string; email: string; name: string; avatar?: string; provider: 'email' | 'google'; at: number }

export const getUsers = (): User[] => read<User[]>('users', []);
const saveUsers = (u: User[]) => write('users', u);

export function getSession(): Session | null {
  const s = read<Session | null>('session', null);
  if (s) return s;
  try {
    const raw = sessionStorage.getItem(PREFIX + 'session');
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}
function setSession(s: Session | null, remember = true) {
  remove('session');
  if (s) {
    if (remember) write('session', s);
    else try { sessionStorage.setItem(PREFIX + 'session', JSON.stringify(s)); } catch {}
  }
  emit('auth:change', s);
}
export function getCurrentUser(): User | null {
  const s = getSession();
  if (!s) return null;
  return getUsers().find((u) => u.id === s.userId) || null;
}

const toHex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
function randomSalt() {
  try {
    const a = new Uint8Array(16);
    crypto.getRandomValues(a);
    return toHex(a.buffer);
  } catch {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}
async function hashPassword(password: string, salt: string) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  if (globalThis.crypto?.subtle) {
    // 2 vòng SHA-256 (demo phía client — hệ thống thật phải băm trên server, ví dụ bcrypt/argon2)
    const once = await crypto.subtle.digest('SHA-256', data);
    return toHex(await crypto.subtle.digest('SHA-256', once));
  }
  let h = 0x811c9dc5;
  for (const b of data) { h ^= b; h = Math.imul(h, 0x01000193) >>> 0; }
  return 'fnv' + h.toString(16);
}

export const normEmail = (e: string) => e.trim().toLowerCase();
export const isEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());
export const isPhoneVN = (p: string) => /^(0|\+84)(3|5|7|8|9)\d{8}$/.test(p.replace(/[\s.-]/g, ''));

function sessionFor(u: User): Session {
  return { userId: u.id, email: u.email, name: u.name, avatar: u.avatar, provider: u.provider, at: Date.now() };
}

export async function register(input: { name: string; email: string; phone?: string; password: string; newsletter?: boolean }) {
  const users = getUsers();
  const email = normEmail(input.email);
  if (users.some((u) => u.email === email)) {
    throw new Error('Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác.');
  }
  const salt = randomSalt();
  const user: User = {
    id: uid('u_'), provider: 'email', email, name: input.name.trim(), phone: input.phone?.trim() || undefined,
    salt, hash: await hashPassword(input.password, salt), createdAt: Date.now(), newsletter: !!input.newsletter, addresses: [],
  };
  users.push(user);
  saveUsers(users);
  setSession(sessionFor(user), true);
  return user;
}

export async function login(emailInput: string, password: string, remember = true) {
  const email = normEmail(emailInput);
  const user = getUsers().find((u) => u.email === email);
  if (!user) throw new Error('Không tìm thấy tài khoản với email này.');
  if (!user.hash || !user.salt) throw new Error('Tài khoản này được tạo bằng Google. Vui lòng chọn “Tiếp tục với Google”.');
  const h = await hashPassword(password, user.salt);
  if (h !== user.hash) throw new Error('Mật khẩu không chính xác. Vui lòng thử lại.');
  setSession(sessionFor(user), remember);
  return user;
}

export function loginWithGoogle(profile: { sub: string; email: string; name: string; picture?: string }) {
  const users = getUsers();
  const email = normEmail(profile.email);
  let user = users.find((u) => u.googleId === profile.sub) || users.find((u) => u.email === email);
  if (user) {
    user.googleId = profile.sub;
    user.avatar = profile.picture || user.avatar;
    if (!user.name) user.name = profile.name;
  } else {
    user = { id: uid('u_'), provider: 'google', googleId: profile.sub, email, name: profile.name, avatar: profile.picture, createdAt: Date.now(), addresses: [] };
    users.push(user);
  }
  saveUsers(users);
  setSession(sessionFor(user), true);
  return user;
}

export function logout() { setSession(null); }

export function updateUser(patch: Partial<User>) {
  const s = getSession();
  if (!s) return null;
  const users = getUsers();
  const u = users.find((x) => x.id === s.userId);
  if (!u) return null;
  Object.assign(u, patch);
  saveUsers(users);
  const remember = !!read<Session | null>('session', null);
  setSession({ ...s, name: u.name, avatar: u.avatar, email: u.email }, remember);
  return u;
}

export async function changePassword(current: string, next: string) {
  const u = getCurrentUser();
  if (!u) throw new Error('Bạn cần đăng nhập.');
  if (u.hash && u.salt) {
    if ((await hashPassword(current, u.salt)) !== u.hash) throw new Error('Mật khẩu hiện tại không đúng.');
  }
  const salt = randomSalt();
  updateUser({ salt, hash: await hashPassword(next, salt) });
}

export function passwordScore(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) s++;
  return pw ? Math.max(1, s) : 0;
}

// ───────────────────────── orders ─────────────────────────
export interface Order {
  code: string;
  createdAt: number;
  userId?: string;
  email: string;
  customer: { name: string; phone: string; email: string };
  shipping: { province: string; address: string; method: string; methodLabel: string; fee: number };
  payment: { method: string; label: string };
  items: CartItem[];
  subtotal: number;
  discount: number;
  promo?: string;
  shippingFee: number;
  total: number;
  note?: string;
  giftNote?: string;
  invoice?: { company: string; taxCode: string; address: string };
  status?: 'cancelled';
  cancelledAt?: number;
}
export const getAllOrders = (): Order[] => read<Order[]>('orders', []);
export function getMyOrders(): Order[] {
  const s = getSession();
  if (!s) return [];
  return getAllOrders().filter((o) => o.userId === s.userId || o.email === s.email);
}
export const getOrder = (code: string) => getAllOrders().find((o) => o.code === code);

export function createOrder(data: Omit<Order, 'code' | 'createdAt'>) {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  const order: Order = { ...data, code: `SL${ymd}-${rand}`, createdAt: Date.now() };
  const all = getAllOrders();
  all.unshift(order);
  write('orders', all);
  emit('orders:change');
  return order;
}
export function cancelOrder(code: string) {
  const all = getAllOrders();
  const o = all.find((x) => x.code === code);
  if (!o) return;
  o.status = 'cancelled';
  o.cancelledAt = Date.now();
  write('orders', all);
  emit('orders:change');
}

export const ORDER_STEPS = ['Chờ xác nhận', 'Đã xác nhận', 'Đang chế tác', 'Đang giao hàng', 'Đã giao hàng'];
/** Trạng thái mô phỏng theo thời gian kể từ lúc đặt hàng */
export function orderStatus(o: Order): { step: number; label: string; tone: 'gold' | 'green' | 'red' | 'dark' } {
  if (o.status === 'cancelled') return { step: -1, label: 'Đã hủy', tone: 'red' };
  const mins = (Date.now() - o.createdAt) / 60000;
  const step = mins < 3 ? 0 : mins < 60 ? 1 : mins < 60 * 48 ? 2 : mins < 60 * 96 ? 3 : 4;
  return { step, label: ORDER_STEPS[step], tone: step === 4 ? 'green' : step === 0 ? 'gold' : 'dark' };
}
export const canCancel = (o: Order) => o.status !== 'cancelled' && orderStatus(o).step <= 1;

// ───────────────────────── appointments / reviews / newsletter ─────────────────────────
export interface Appointment { id: string; createdAt: number; service: string; boutique: string; date: string; time: string; name: string; phone: string; email: string; note?: string; userId?: string; status?: 'cancelled' }
export const getAppointments = (): Appointment[] => read<Appointment[]>('appointments', []);
export function addAppointment(a: Omit<Appointment, 'id' | 'createdAt'>) {
  const list = getAppointments();
  const appt: Appointment = { ...a, id: 'AP' + Math.random().toString(36).slice(2, 7).toUpperCase(), createdAt: Date.now() };
  list.unshift(appt);
  write('appointments', list);
  return appt;
}
export function cancelAppointment(id: string) {
  const list = getAppointments();
  const a = list.find((x) => x.id === id);
  if (a) a.status = 'cancelled';
  write('appointments', list);
}
export function myAppointments() {
  const s = getSession();
  if (!s) return [];
  return getAppointments().filter((a) => a.userId === s.userId || a.email === s.email);
}

export interface UserReview { id: string; productId: string; name: string; rating: number; title: string; text: string; date: string }
export const getReviews = (productId: string): UserReview[] => (read<Record<string, UserReview[]>>('reviews', {})[productId] || []);
export function addReview(r: Omit<UserReview, 'id' | 'date'>) {
  const all = read<Record<string, UserReview[]>>('reviews', {});
  const review: UserReview = { ...r, id: uid('r_'), date: new Date().toISOString().slice(0, 10) };
  (all[r.productId] ||= []).unshift(review);
  write('reviews', all);
  return review;
}

export function subscribe(email: string) {
  const list = read<string[]>('newsletter', []);
  const e = normEmail(email);
  const isNew = !list.includes(e);
  if (isNew) { list.push(e); write('newsletter', list); }
  return isNew;
}
