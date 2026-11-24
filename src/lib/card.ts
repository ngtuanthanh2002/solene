import { BADGES, METALS, TYPES, imageSrcset, imageUrl, type MetalKey } from './catalog';
import { escapeHTML, formatVND } from './format';
import { icon } from './icons';

/** Dữ liệu tối thiểu để vẽ thẻ sản phẩm (cũng là định dạng của /api/products.json) */
export interface CardProduct {
  id: string; slug: string; name: string; subtitle: string; category: string; type: string;
  price: number; compareAt?: number; images: string[]; style?: string; shape?: string; moods: string[];
  collection?: string; metals: MetalKey[]; badges?: string[]; sold: number; createdAt: string;
  rating: number; reviews: number; sizing?: 'ring' | 'pair'; engravable?: boolean; hasVariants?: boolean;
}

export function priceHTML(p: Pick<CardProduct, 'price' | 'compareAt' | 'hasVariants'>) {
  const from = p.hasVariants ? '<span class="muted">Từ </span>' : '';
  const compare = p.compareAt ? ` <s>${formatVND(p.compareAt)}</s>` : '';
  return `${from}${formatVND(p.price)}${compare}`;
}

export function productCardHTML(p: CardProduct, opts: { index?: number; sizes?: string; eager?: boolean } = {}) {
  const { index = 0, sizes = '(min-width: 1200px) 25vw, (min-width: 768px) 33vw, 50vw', eager = false } = opts;
  const name = escapeHTML(p.name);
  const url = `/san-pham/${p.slug}/`;
  const alt = escapeHTML(`${p.name} — ${p.subtitle}`);
  let badge = '';
  if (p.compareAt) badge = `<span class="pcard__badge pcard__badge--sale">−${Math.round((1 - p.price / p.compareAt) * 100)}%</span>`;
  else if (p.badges?.length) badge = `<span class="pcard__badge">${BADGES[p.badges[0]]}</span>`;
  const swatches = p.metals.slice(0, 4).map((m) => `<i style="background:${METALS[m].swatch}" title="${METALS[m].label}"></i>`).join('');
  const alt2 = p.images[1]
    ? `<img class="pcard__img pcard__img--alt" src="${imageUrl(p.images[1], 800)}" srcset="${imageSrcset(p.images[1])}" sizes="${sizes}" width="800" height="1000" alt="" loading="lazy" decoding="async">`
    : '';
  return `<article class="pcard" data-id="${p.id}" data-slug="${p.slug}" data-price="${p.price}" data-category="${p.category}" data-type="${p.type}" data-style="${p.style || ''}" data-shape="${p.shape || ''}" data-moods="${p.moods.join(' ')}" data-metals="${p.metals.join(' ')}" data-collection="${p.collection || ''}" data-sold="${p.sold}" data-created="${p.createdAt}" data-order="${index}">
  <a class="pcard__media" href="${url}" tabindex="-1" aria-hidden="true">
    <img class="pcard__img${eager ? '' : ' img-fade'}" src="${imageUrl(p.images[0], 800)}" srcset="${imageSrcset(p.images[0])}" sizes="${sizes}" width="800" height="1000" alt="${alt}" loading="${eager ? 'eager' : 'lazy'}" decoding="async">
    ${alt2}
  </a>
  ${badge}
  <button class="pcard__wish wish-btn" type="button" data-wish="${p.id}" aria-pressed="false" aria-label="Yêu thích ${name}">${icon('heart')}</button>
  <button class="pcard__quick" type="button" data-quickview="${p.slug}">${icon('eye')}Xem nhanh</button>
  <div class="pcard__body">
    <h3 class="pcard__title"><a href="${url}">${name}</a></h3>
    <p class="pcard__sub">${escapeHTML(p.subtitle || TYPES[p.type] || '')}</p>
    <div class="pcard__foot"><span class="price">${priceHTML(p)}</span>${swatches ? `<span class="swatches" aria-hidden="true">${swatches}</span>` : ''}</div>
  </div>
</article>`;
}

/** Chuyển Product đầy đủ → CardProduct gọn (dùng cho JSON) */
export function toCard(p: any): CardProduct {
  return {
    id: p.id, slug: p.slug, name: p.name, subtitle: p.subtitle, category: p.category, type: p.type, price: p.price,
    compareAt: p.compareAt, images: p.images, style: p.style, shape: p.shape, moods: p.moods, collection: p.collection,
    metals: p.metals, badges: p.badges, sold: p.sold, createdAt: p.createdAt, rating: p.rating, reviews: p.reviews,
    sizing: p.sizing, engravable: p.engravable, hasVariants: !!p.variants,
  };
}
