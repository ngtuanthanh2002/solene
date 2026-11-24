/** Form tùy chọn sản phẩm (isomorphic) — trang sản phẩm & xem nhanh dùng chung markup */
import { METALS, RING_SIZES, sizeInfo, type MetalKey } from './catalog';
import { escapeHTML, formatVND } from './format';
import type { CardProduct } from './card';

export interface OptProduct extends CardProduct {
  variants?: { label: string; options: { value: string; label: string; price: number }[] };
  leadTime?: string;
}

export const unitPrice = (base: number, metal?: string) => {
  const f = metal && METALS[metal as MetalKey] ? METALS[metal as MetalKey].factor : 1;
  return Math.round((base * f) / 10000) * 10000;
};

const sizeOptions = () =>
  RING_SIZES.map((n) => { const s = sizeInfo(n); return `<option value="${n}">Ni ${n} · chu vi ${s.circumference} mm</option>`; }).join('');

export function productFormHTML(p: OptProduct, uidPrefix: string) {
  const u = uidPrefix;
  const firstMetal = p.metals[0];
  const base = p.variants ? p.variants.options[0].price : p.price;
  const price = unitPrice(base, firstMetal);
  let h = `<form class="pform" data-product-form data-id="${p.id}" novalidate>`;
  h += `<div class="pform__price"><span class="price price--lg" data-price-display>${formatVND(price)}</span>${p.compareAt ? `<s class="muted" data-compare-display>${formatVND(unitPrice(p.compareAt, firstMetal))}</s>` : ''}<span class="tiny pform__vat">Đã gồm VAT</span></div>`;

  if (p.metals.length) {
    h += `<fieldset class="pform__group"><legend class="pform__label">Chất liệu <b data-metal-label>${METALS[firstMetal].label}</b></legend><div class="metal-picker metal-picker--dots">`;
    h += p.metals.map((m, i) => `<label class="metal-opt"><input type="radio" name="metal" value="${m}" ${i === 0 ? 'checked' : ''}><span title="${METALS[m].label}"><i style="background:${METALS[m].swatch}"></i><b class="sr-only">${METALS[m].label}</b></span></label>`).join('');
    h += `</div></fieldset>`;
  }
  if (p.variants) {
    h += `<div class="pform__group"><label class="pform__label" for="${u}-variant">${escapeHTML(p.variants.label)}</label><select class="select" id="${u}-variant" name="variant">`;
    h += p.variants.options.map((o) => `<option value="${o.value}" data-price="${o.price}">${escapeHTML(o.label)} — ${formatVND(o.price)}</option>`).join('');
    h += `</select></div>`;
  }
  if (p.sizing === 'ring') {
    h += `<div class="pform__group field"><div class="pform__row"><label class="pform__label" for="${u}-size">Ni tay</label><a class="link-inline tiny" href="/huong-dan-do-ni-tay/" target="_blank" rel="noopener">Hướng dẫn đo ni</a></div>`;
    h += `<select class="select" id="${u}-size" name="size" required><option value="">Chọn ni tay của bạn</option>${sizeOptions()}</select><span class="field-error" data-error-for="size"></span></div>`;
  }
  if (p.sizing === 'pair') {
    h += `<div class="pform__group"><div class="pform__row"><span class="pform__label">Ni tay của hai bạn</span><a class="link-inline tiny" href="/huong-dan-do-ni-tay/" target="_blank" rel="noopener">Hướng dẫn đo ni</a></div><div class="form-grid form-grid--2">`;
    h += `<div class="field"><label class="sr-only" for="${u}-size">Ni nhẫn nữ</label><select class="select" id="${u}-size" name="size" required><option value="">Ni nhẫn nữ</option>${sizeOptions()}</select><span class="field-error" data-error-for="size"></span></div>`;
    h += `<div class="field"><label class="sr-only" for="${u}-size2">Ni nhẫn nam</label><select class="select" id="${u}-size2" name="sizeMale" required><option value="">Ni nhẫn nam</option>${sizeOptions()}</select><span class="field-error" data-error-for="sizeMale"></span></div>`;
    h += `</div></div>`;
  }
  if (p.engravable) {
    h += `<div class="pform__group"><label class="check"><input type="checkbox" data-engrave-toggle><span class="box"></span><span>Khắc chữ miễn phí</span></label>`;
    h += `<div class="engrave" data-engrave hidden><label class="sr-only" for="${u}-engrave">Nội dung khắc</label><input class="input" id="${u}-engrave" name="engraving" maxlength="20" placeholder="VD: M & A · 20.10.2026" autocomplete="off">`;
    h += `<div class="engrave__band" data-engrave-band style="--band:${firstMetal ? METALS[firstMetal].swatch : METALS['vang-vang-18k'].swatch}" aria-hidden="true"><span data-engrave-preview>Forever yours</span></div><span class="field-hint"><span data-engrave-count>0</span>/20 ký tự · xem trước nét khắc bên trong nhẫn</span></div></div>`;
  }
  h += `<div class="pform__actions"><button class="btn btn--block" type="submit" data-add>Thêm vào giỏ hàng</button>`;
  h += `<button class="btn btn--outline btn--block" type="button" data-buy-now>Mua ngay</button></div>`;
  if (p.leadTime) h += `<p class="pform__lead">${escapeHTML(p.leadTime)}</p>`;
  h += `</form>`;
  return h;
}
