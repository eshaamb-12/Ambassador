export const PRODUCT_CUSTOMIZATION_FEATURE = 'customization' as const;

export function productHasCustomization(features: unknown): boolean {
  return Array.isArray(features) && features.includes(PRODUCT_CUSTOMIZATION_FEATURE);
}

/** True when a positive list or sale price exists for storefront display. */
export function productHasListedPrice(input: {
  price?: number | null;
  originalPrice?: number | null;
}): boolean {
  const sale = input.price != null ? Number(input.price) : 0;
  const list = input.originalPrice != null ? Number(input.originalPrice) : 0;
  return sale > 0 || list > 0;
}
