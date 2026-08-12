export function formatInr(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function productHref(slug: string) {
  return `/products/${slug}`;
}

export function collectionHref(slug: string) {
  return `/collections/${slug}`;
}
