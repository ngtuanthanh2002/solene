/** Icon SVG nét mảnh (24×24, stroke 1.3) — dùng chung cho Astro & JS client */
const P: Record<string, string> = {
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
  user: '<circle cx="12" cy="8.2" r="3.7"/><path d="M4.5 20.2c.9-3.7 3.9-5.7 7.5-5.7s6.6 2 7.5 5.7"/>',
  heart: '<path class="heart-fill" d="M12 20s-7.5-4.6-7.5-10.1A4.4 4.4 0 0 1 12 7.4a4.4 4.4 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20Z"/>',
  bag: '<path d="M5.5 8.5h13l-1 11.5h-11l-1-11.5Z"/><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5"/>',
  menu: '<path d="M3.5 7.5h17M3.5 12h17M3.5 16.5h11"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  'chevron-down': '<path d="m6.5 9.5 5.5 5.5 5.5-5.5"/>',
  'chevron-right': '<path d="m9.5 6.5 5.5 5.5-5.5 5.5"/>',
  'chevron-left': '<path d="m14.5 6.5-5.5 5.5 5.5 5.5"/>',
  'arrow-right': '<path d="M4 12h15.5M14 6.5l5.5 5.5-5.5 5.5"/>',
  'arrow-left': '<path d="M20 12H4.5M10 6.5 4.5 12l5.5 5.5"/>',
  'arrow-up': '<path d="M12 20V4.5M6.5 10 12 4.5l5.5 5.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  phone: '<path d="M6.6 3.5h2.7l1.4 4.1-2 1.3a11.7 11.7 0 0 0 6.4 6.4l1.3-2 4.1 1.4v2.7a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z"/>',
  mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="1"/><path d="m4 6.5 8 6.3 8-6.3"/>',
  pin: '<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="1"/><path d="M3.5 9.8h17M8 3v4M16 3v4"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  truck: '<path d="M2.5 6.5h11v9.5h-11zM13.5 9.5h4l3 3.2v3.3h-7"/><circle cx="6.5" cy="17.3" r="1.7"/><circle cx="16.8" cy="17.3" r="1.7"/>',
  shield: '<path d="M12 3.2 19 6v5.6c0 4.4-3 7.8-7 9.2-4-1.4-7-4.8-7-9.2V6l7-2.8Z"/><path d="m8.8 12 2.2 2.2 4.2-4.4"/>',
  gem: '<path d="M6.5 4.5h11l3.5 5-9 10.5L3 9.5l3.5-5Z"/><path d="M3 9.5h18M9.5 4.5 8 9.5l4 10.5 4-10.5-1.5-5"/>',
  ring: '<circle cx="12" cy="14.5" r="5.8"/><path d="m9.3 6.2 1.2-2.4h3l1.2 2.4L12 8.7 9.3 6.2Z"/>',
  gift: '<rect x="3.5" y="8.5" width="17" height="4" /><path d="M5 12.5v8h14v-8M12 8.5v12M12 8.5S10.8 4 8.4 4C6.9 4 6.4 6 7.6 7c1.1.9 4.4 1.5 4.4 1.5ZM12 8.5S13.2 4 15.6 4c1.5 0 2 2 .8 3-1.1.9-4.4 1.5-4.4 1.5Z"/>',
  sparkle: '<path d="M12 3c.6 4.6 2.9 7.4 7.5 9-4.6 1.6-6.9 4.4-7.5 9-.6-4.6-2.9-7.4-7.5-9 4.6-1.6 6.9-4.4 7.5-9Z"/>',
  star: '<path d="m12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8L12 3.6Z" fill="currentColor" stroke="none"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',
  'eye-off': '<path d="M3 3l18 18M10.6 5.6A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.9 3.7M6.5 6.9C4 8.6 2.5 12 2.5 12s3.5 6.5 9.5 6.5c1.6 0 3-.4 4.2-1M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  check: '<path d="m4.5 12.5 4.8 4.8L19.5 7"/>',
  trash: '<path d="M4.5 6.5h15M9.5 6.5V4h5v2.5M6.5 6.5l1 13.5h9l1-13.5"/>',
  chat: '<path d="M4 5.5h16v10.5H9l-5 4v-14.5Z"/><path d="M8 10h8M8 13h5"/>',
  logout: '<path d="M14.5 4.5h-9v15h9M10 12h10.5M17 8.5l3.5 3.5-3.5 3.5"/>',
  package: '<path d="m12 3 8.5 4.5v9L12 21l-8.5-4.5v-9L12 3Z"/><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9M7.8 5.3l8.5 4.5"/>',
  edit: '<path d="M4 20h4.2L19.5 8.7l-4.2-4.2L4 15.8V20Z"/><path d="m13.6 6.2 4.2 4.2"/>',
  filter: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
  refresh: '<path d="M19.5 9.5A7.8 7.8 0 0 0 5.6 7.4M4.5 14.5a7.8 7.8 0 0 0 13.9 2.1"/><path d="M5 3.5v4.2h4.2M19 20.5v-4.2h-4.2"/>',
  pen: '<path d="m15.2 4.6 4.2 4.2-10 10-5 1 1-5 9.8-10.2Z"/><path d="m13 6.8 4.2 4.2"/>',
  ruler: '<path d="m3 16.5 13.5-13.5 4.5 4.5L7.5 21 3 16.5Z"/><path d="m7 12.5 2 2M10 9.5l1.5 1.5M13 6.5l2 2"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="1"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.6v.4"/>',
  card: '<rect x="3" y="5.5" width="18" height="13" rx="1.2"/><path d="M3 9.5h18M6.5 15h4"/>',
  bank: '<path d="M3.5 9 12 4l8.5 5h-17ZM5 9.5v7.5M9.5 9.5v7.5M14.5 9.5v7.5M19 9.5v7.5M3.5 19.5h17"/>',
  store: '<path d="M4 9.5 5.5 4h13L20 9.5M4 9.5c0 1.5 1.3 2.5 2.7 2.5s2.6-1 2.6-2.5c0 1.5 1.2 2.5 2.7 2.5s2.7-1 2.7-2.5c0 1.5 1.2 2.5 2.6 2.5S20 11 20 9.5M5 12v8.5h14V12M10 20.5v-5h4v5"/>',
  cash: '<rect x="2.5" y="6.5" width="19" height="11" rx="1"/><circle cx="12" cy="12" r="2.6"/><path d="M6 9.5v5M18 9.5v5"/>',
  diamond: '<path d="M12 21 3 9.5 6.5 4.5h11L21 9.5 12 21Z"/>',
  home: '<path d="m3.5 11 8.5-7 8.5 7M5.5 9.5V20h13V9.5"/>',
  crown: '<path d="m4 8 4 4 4-7 4 7 4-4-1.5 10h-13L4 8Z"/><path d="M5.5 20h13"/>',
  leaf: '<path d="M5 19c0-8 5-13.5 14.5-14-.5 9.5-6 14.5-14 14.5"/><path d="M5 19c3-3 6-5.5 9.5-8"/>',
  instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/>',
  facebook: '<path d="M14 21v-7.5h2.6l.4-3H14V8.7c0-.9.3-1.5 1.6-1.5H17V4.6a20 20 0 0 0-2.3-.1C12.4 4.5 11 5.9 11 8.4v2.1H8.5v3H11V21"/>',
  tiktok: '<path d="M14 3.5v11.2a3.2 3.2 0 1 1-3.2-3.2M14 3.5c.4 2.6 2.1 4.3 4.8 4.6"/>',
  youtube: '<rect x="2.5" y="5.5" width="19" height="13" rx="3.5"/><path d="m10 9 5 3-5 3V9Z" fill="currentColor"/>',
};

export function icon(name: keyof typeof P | string, cls = '', label?: string) {
  const body = P[name] || '';
  const aria = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" class="${cls}" ${aria} focusable="false">${body}</svg>`;
}

/** Logo "G" chính thức của Google (dùng cho nút đăng nhập theo branding guidelines) */
export const GOOGLE_G = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>';
