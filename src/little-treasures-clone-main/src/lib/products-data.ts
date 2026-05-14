// Maps DB image_urls (stored as /src/assets/...) to the bundled URL.
const assetUrls = import.meta.glob("/src/assets/*.{jpg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export function resolveImage(path: string | undefined): string {
  if (!path) return "https://placehold.co/600x600?text=Image";
  if (path.startsWith("http")) return path;
  return assetUrls[path] ?? path;
}

export function formatPrice(amount: number): string {
  return `৳${Number(amount).toLocaleString("en-BD", { minimumFractionDigits: 0 })}`;
}
