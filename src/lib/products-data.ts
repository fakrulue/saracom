export function formatPrice(amount: number): string {
  return `৳${Number(amount).toLocaleString("en-BD", { minimumFractionDigits: 0 })}`;
}

export function resolveImage(path: string | undefined): string {
  if (!path) return "https://placehold.co/600x600?text=Image";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/src/assets/")) {
    return path.replace("/src/assets/", "/assets/");
  }
  return path;
}