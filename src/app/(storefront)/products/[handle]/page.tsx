"use client";

import { useState, useEffect } from "react";
import { Heart, Minus, Plus, Truck, RefreshCw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { formatPrice, resolveImage } from "@/lib/products-data";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductVideoReviews } from "@/components/shop/ProductVideoReviews";
import { useCart, useWishlist } from "@/store/cart";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock data fetching for now
const mockProducts = [
  {
    id: "p1",
    handle: "summer-romper",
    title: "Organic Cotton Summer Romper",
    price: 1200,
    compare_at_price: 1500,
    description: "Keep your little one cool and comfortable in this organic cotton summer romper. Features easy-snap buttons for quick changes and a breathable fabric perfect for sunny days.",
    image_urls: ["/assets/p-romper.jpg"],
    is_new: true,
    is_sale: true,
    is_best_seller: false,
    product_variants: [
      { size: "0-3M" },
      { size: "3-6M" },
      { size: "6-12M" },
    ]
  },
  {
    id: "p2",
    handle: "knit-cardigan",
    title: "Chunky Knit Cardigan",
    price: 2500,
    compare_at_price: null,
    description: "Our best-selling chunky knit cardigan is back! Hand-knit from soft, non-itchy wool blend, it's the perfect layering piece for chilly mornings.",
    image_urls: ["/assets/p-cardigan.jpg"],
    is_new: false,
    is_sale: false,
    is_best_seller: true,
    product_variants: [
      { size: "1Y" },
      { size: "2Y" },
      { size: "3Y" },
    ]
  }
];

export default function ProductPage() {
  const params = useParams();
  const handle = params.handle as string;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState<string | undefined>();
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.add);
  const wishlist = useWishlist();
  const toggleWish = wishlist?.toggle;

  useEffect(() => {
    // Simulate API fetch
    const p = mockProducts.find(x => x.handle === handle) || mockProducts[0];
    setProduct(p);
    setLoading(false);
  }, [handle]);

  if (loading) return <div className="mx-auto max-w-7xl p-10">Loading…</div>;
  if (!product) return <div className="mx-auto max-w-7xl p-10 text-center">Product not found</div>;

  const p = product;
  const img = resolveImage(p.image_urls?.[0]);
  const sizes = Array.from(new Set((p.product_variants ?? []).map((v: any) => v.size).filter(Boolean) as string[]));
  const onSale = p.compare_at_price && Number(p.compare_at_price) > Number(p.price);
  const wished = wishlist?.ids?.includes(p.id) ?? false;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav className="mb-6 text-xs text-muted-foreground">
        <Link href="/" className="hover:underline">Home</Link> /{" "}
        <Link href="/collections/all" className="hover:underline">Shop</Link> /{" "}
        <span className="text-foreground">{p.title}</span>
      </nav>
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-muted">
          <img src={img} alt={p.title} className="aspect-square w-full object-cover" />
        </div>
        <div className="space-y-5">
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">{p.title}</h1>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-brand-pink">{formatPrice(Number(p.price))}</span>
            {onSale && <span className="text-lg text-muted-foreground line-through">{formatPrice(Number(p.compare_at_price))}</span>}
          </div>
          <p className="text-muted-foreground">{p.description}</p>

          {sizes.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-bold">Size</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-12 rounded-full border-2 px-4 py-2 text-sm font-bold ${
                      size === s ? "border-brand-pink bg-brand-pink text-white" : "border-input hover:border-brand-ink"
                    }`}
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
                add({ productId: p.id, handle: p.handle, title: p.title, price: Number(p.price), image: img, size, qty });
                toast.success("Added to cart");
              }}
              className="flex-1 rounded-full bg-brand-pink py-3 text-sm font-bold text-white shadow-[var(--shadow-pop)] hover:opacity-95"
            >
              Add to cart
            </button>
            <button
              onClick={() => toggleWish?.(p.id)}
              className="rounded-full border-2 p-3 hover:border-brand-pink"
              aria-label="Wishlist"
            >
              <Heart size={18} className={wished ? "fill-brand-pink text-brand-pink" : ""} />
            </button>
          </div>

          <div className="grid gap-3 pt-4 text-sm">
            <Bullet icon={Truck} text="Free shipping on orders over ৳2000" />
            <Bullet icon={RefreshCw} text="Easy 14-day exchange" />
            <Bullet icon={ShieldCheck} text="Secure checkout" />
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
          {mockProducts.filter(x => x.id !== p.id).map((r) => <ProductCard key={r.id} product={r} />)}
        </div>
      </section>
    </div>
  );
}

function Bullet({ icon: Icon, text }: { icon: any; text: string }) {
  return <div className="flex items-center gap-2 text-muted-foreground"><Icon size={16} className="text-brand-pink" /> {text}</div>;
}