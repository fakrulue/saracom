"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/shop/ProductCard";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Package } from "lucide-react";

const cats = [
  { id: "all", handle: "all", name: "All" },
  { id: "newborn", handle: "newborn", name: "Newborn" },
  { id: "baby-boys", handle: "baby-boys", name: "Baby Boys" },
  { id: "baby-girls", handle: "baby-girls", name: "Baby Girls" },
  { id: "kids-boys", handle: "kids-boys", name: "Kids Boys" },
  { id: "kids-girls", handle: "kids-girls", name: "Kids Girls" },
];

type Product = {
  id: string;
  handle: string;
  title: string;
  price: number;
  compare_at_price: number | null;
  image_urls: string[];
  is_new?: boolean | null;
  is_sale?: boolean | null;
  is_best_seller?: boolean | null;
  vendor?: string | null;
  productType?: string | null;
};

function titleize(h: string) {
  return h === "all" ? "All Products" : h.split("-").map((w) => w[0] ? w[0].toUpperCase() + w.slice(1) : w).join(" ");
}

export default function CollectionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const handle = params.handle as string;
  const sort = searchParams.get("sort") || "newest";
  const flag = searchParams.get("flag");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/collections/show?handle=${handle}`);
        const json = await res.json();
        let data: Product[] = json.data || [];

        if (flag === "sale") data = data.filter((p) => p.is_sale);
        if (flag === "best_seller") data = data.filter((p) => p.is_best_seller);
        if (flag === "new") data = data.filter((p) => p.is_new);

        if (sort === "price-asc") data.sort((a, b) => a.price - b.price);
        if (sort === "price-desc") data.sort((a, b) => b.price - a.price);
        if (sort === "rating") data.sort((a, b) => (b as any).rating - (a as any).rating);

        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [handle, flag, sort]);

  const updateSort = (newSort: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("sort", newSort);
    router.push(`/collections/${handle}?${current.toString()}`);
  };

  const getCollectionTitle = () => {
    if (handle === "all") return "All Products";
    if (flag === "sale") return "Sale";
    if (flag === "best_seller") return "Best Sellers";
    if (flag === "new") return "New Arrivals";
    return titleize(handle);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav className="mb-3 text-xs text-muted-foreground">
        <Link href="/" className="hover:underline">Home</Link> / <span className="text-foreground">{getCollectionTitle()}</span>
      </nav>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">{getCollectionTitle()}</h1>
        <select
          className="rounded-full border-2 border-input bg-background px-4 py-2 text-sm font-semibold"
          value={sort}
          onChange={(e) => updateSort(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="rating">Top rated</option>
        </select>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {cats.map((c) => (
          <Link
            key={c.id}
            href={`/collections/${c.handle}`}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              c.handle === handle ? "bg-brand-pink text-white" : "bg-muted hover:bg-brand-mint"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-square animate-pulse rounded-2xl bg-muted" />)
          : products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      {!loading && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
            <Package className="w-8 h-8" />
          </div>
          <p className="text-lg font-semibold text-foreground">No products found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {flag ? `No ${flag.replace("_", " ")} products in this collection yet.` : "Check back soon for new arrivals."}
          </p>
        </div>
      )}
    </div>
  );
}