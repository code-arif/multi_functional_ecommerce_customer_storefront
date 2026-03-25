/**
 * Format a number as Bengali Taka currency.
 * Matches backend config: currency=BDT, symbol=৳
 */
export function formatPrice(amount, symbol = "৳") {
  if (amount == null || isNaN(amount)) return `${symbol}0`;
  return `${symbol}${Number(amount).toLocaleString("en-BD")}`;
}

export function discountPercent(original, sale) {
  if (!original || !sale || sale >= original) return 0;
  return Math.round(((original - sale) / original) * 100);
}

export function isOnSale(product) {
  return (
    product.sale_price != null &&
    Number(product.sale_price) < Number(product.price)
  );
}

export function currentPrice(product) {
  return product.sale_price ?? product.price;
}
