"use client";

import { Heart, Minus, Plus, Truck, RefreshCw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/products-data";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductVideoReviews } from "@/components/shop/ProductVideoReviews";
import { useCart, useWishlist } from "@/store/cart";
import Link from "next/link";
import { useState } from "react";
import { ThemeConfig, ClickableSection, useEditing } from "@/contexts/ThemeContext";

interface ProductPageContentProps {
  config: ThemeConfig;
}

export function ProductPageContent({ config }: ProductPageContentProps) {
  const p = config.colors.primary;
  const t = config.colors.text;
  const [product] = useState(mockProducts[0]);
  const [loading] = useState(false);
  const [size, setSize] = useState<string | undefined>();
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.add);
  const wishlist = useWishlist();
  const toggleWish = wishlist?.toggle;
  const { onSelectSection } = useEditing();

  if (loading) return <div className="mx-auto max-w-7xl p-10">Loading…</div>;
  if (!product) return <div className="mx-auto max-w-7xl p-10 text-center">Product not found</div>;

  const img = product.image_urls?.[0] || "/assets/p-romper.jpg";
  const sizes = Array.from(new Set((product.product_variants ?? []).map((v: any) => v.size).filter(Boolean) as string[]));
  const onSale = product.compare_at_price && Number(product.compare_at_price) > Number(product.price);
  const wished = wishlist?.ids?.includes(product.id) ?? false;

  return (
    <div onClick={() => onSelectSection("")}>
      <ClickableSection id="products">
        <div className="mx-auto max-w-7xl px-4 py-10">
      <nav className="mb-6 text-xs text-muted-foreground">
        <Link href="/" className="hover:underline">Home</Link> /{" "}
        <Link href="/collections/all" className="hover:underline">Shop</Link> /{" "}
        <span className="text-foreground">{product.title}</span>
      </nav>
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-muted">
          <img src={img} alt={product.title} className="aspect-square w-full object-cover" />
        </div>
        <div className="space-y-5">
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">{product.title}</h1>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold" style={{ color: p }}>{formatPrice(Number(product.price))}</span>
            {onSale && <span className="text-lg text-muted-foreground line-through">{formatPrice(Number(product.compare_at_price))}</span>}
          </div>
          <p className="text-muted-foreground">{product.description}</p>

          {sizes.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-bold">Size</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-12 rounded-full border-2 px-4 py-2 text-sm font-bold ${
                      size === s ? "text-white" : "hover:border-current"
                    }`}
                    style={size === s ? { borderColor: p, background: p } : { borderColor: `${t}20` }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center rounded-full border-2">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2"><Minus size={16} /></button>
              <span className="px-4 text-sm font-bold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-3 py-2"><Plus size={16} /></button>
            </div>
            <button
              onClick={() => {
                if (sizes.length > 0 && !size) { toast.error("Please select a size"); return; }
                add({ productId: product.id, handle: product.handle, title: product.title, price: Number(product.price), image: img, size, qty });
                toast.success("Added to cart");
              }}
              className="flex-1 rounded-full py-3 text-sm font-bold text-white shadow-[var(--shadow-pop)] hover:opacity-95"
              style={{ background: p }}
            >
              Add to cart
            </button>
            <button
              onClick={() => toggleWish?.(product.id)}
              className="rounded-full border-2 p-3"
              style={{ borderColor: `${t}20` }}
              aria-label="Wishlist"
            >
              <Heart size={18} className={wished ? "" : ""} style={wished ? { fill: p, color: p } : {}} />
            </button>
          </div>

          <div className="grid gap-3 pt-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground"><Truck size={16} className="shrink-0" style={{ color: p }} /> Free shipping on orders over ৳2000</div>
            <div className="flex items-center gap-2 text-muted-foreground"><RefreshCw size={16} className="shrink-0" style={{ color: p }} /> Easy 14-day exchange</div>
            <div className="flex items-center gap-2 text-muted-foreground"><ShieldCheck size={16} className="shrink-0" style={{ color: p }} /> Secure checkout</div>
          </div>

          <details className="mt-6 rounded-2xl border p-4">
            <summary className="cursor-pointer font-bold">Product details</summary>
            <p className="mt-3 text-sm text-muted-foreground">100% premium cotton. Machine washable. Designed in Dhaka.</p>
          </details>
          <details className="rounded-2xl border p-4">
            <summary className="cursor-pointer font-bold">Shipping & returns</summary>
            <p className="mt-3 text-sm text-muted-foreground">Standard delivery 3–5 business days. Free returns within 14 days.</p>
          </details>
        </div>
      </div>

      <ProductVideoReviews />

      <section className="mt-20">
        <h2 className="font-display text-2xl font-extrabold">You might also like</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {mockRelated.map((r) => <ProductCard key={r.id} product={r} />)}
        </div>
      </section>
        </div>
      </ClickableSection>
    </div>
  );
}