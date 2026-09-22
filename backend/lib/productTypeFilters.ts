/**
 * Legacy filter: exclude spare parts that were stored in the products collection
 * before the dedicated spareparts collection existed.
 */
const NOT_SPARE_PART = { productType: { $ne: 'spare_part' as const } };

/** New / standard storefront catalog — excludes used equipment and legacy spare parts. */
export const MAIN_CATALOG_FILTER = {
  ...NOT_SPARE_PART,
  $or: [{ isUsed: { $ne: true } }, { isUsed: { $exists: false } }],
};

/** Pre-owned equipment listed on /used-equipment. */
export const USED_EQUIPMENT_FILTER = {
  ...NOT_SPARE_PART,
  isUsed: true,
};

/** @deprecated Spare parts now live in the spareparts collection. */
export const SPARE_PART_FILTER = { productType: 'spare_part' as const };

export function applyProductTypeFilter(
  filter: Record<string, unknown>,
  productType: string,
): void {
  if (productType === 'main') {
    Object.assign(filter, MAIN_CATALOG_FILTER);
  } else if (productType === 'used') {
    Object.assign(filter, USED_EQUIPMENT_FILTER);
  }
}
