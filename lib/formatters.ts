// Persian number and price formatting utilities

export function toPersianDigits(n: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(n).replace(/[0-9]/g, (w) => persianDigits[+w]);
}

export function formatPrice(amount: number): string {
  if (isNaN(amount)) return '۰';
  // format with commas first
  const formattedWithCommas = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return toPersianDigits(formattedWithCommas);
}
