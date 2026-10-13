import { sanitizeProductFeatures } from '@/backend/lib/productMarketingFields';
import { PRODUCT_CUSTOMIZATION_FEATURE } from '@/lib/productFeatures';

function positiveNumber(value: unknown): number | undefined {
  if (value === '' || value === null || value === undefined) return undefined;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

export function productPricingFromBody(input: {
  features?: unknown;
  originalPrice?: unknown;
  price?: unknown;
}): { ok: true; originalPrice: number; price?: number } | { ok: false; message: string } {
  const features = sanitizeProductFeatures(input.features);
  const isCustomization = features.includes(PRODUCT_CUSTOMIZATION_FEATURE);
  const list = positiveNumber(input.originalPrice);
  const sale = positiveNumber(input.price);

  if (!isCustomization && !list) {
    return { ok: false, message: 'A valid original price is required.' };
  }

  if (sale && list && sale > list) {
    return { ok: false, message: 'Discounted price cannot exceed original price.' };
  }

  if (isCustomization && !list && !sale) {
    return { ok: true, originalPrice: 0, price: undefined };
  }

  const originalPrice = list ?? sale ?? 0;
  if (!isCustomization && originalPrice <= 0) {
    return { ok: false, message: 'A valid original price is required.' };
  }

  return {
    ok: true,
    originalPrice,
    ...(sale ? { price: sale } : {}),
  };
}
