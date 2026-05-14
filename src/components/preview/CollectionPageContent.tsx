"use client";

import Link from "next/link";
import { ProductCard } from "@/components/shop/ProductCard";
import { Package } from "lucide-react";
import { useState, useEffect } from "react";
import { ThemeConfig, ClickableSection, useEditing } from "@/contexts/ThemeContext";

interface CollectionPageContentProps {
  config: ThemeConfig;
}

export function CollectionPageContent({ config }: CollectionPageContentProps) {
  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("newest");
  const p = config.colors.primary;
  const { onSelectSection } = useEditing();

  useEffect(() => {
    let data = [...mockProducts];
    if (sort === "price-asc") data.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") data.sort((a, b) => b.price - a.price);
    setProducts(data);
    setLoading(false);
  }, [sort]);

  return (
    <div onClick={() => onSelectSection("")}>
      <ClickableSection id="collections">
        <div className="mx-auto max-w-7xl px-4 py-10">
      <nav className="mb-3 text-xs text-muted-foreground">
        <Link href="/" className="hover:underline">Home</Link> / <span className="text-foreground">All Products</span>
      </nav>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">All Products</h1>
        <select
          className="rounded-full border-2 border-input bg-background px-4 py-2 text-sm font-semibold"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
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
              c.handle === "all" ? "text-white" : "bg-muted hover:bg-muted/80"
            }`}
            style={c.handle === "all" ? { background: p } : {}}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-square animate-pulse rounded-2xl bg-muted" />)
          : products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
      {!loading && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Package className="h-8 w-8" />
          </div>
          <p className="text-lg font-semibold text-foreground">No products found</p>
          <p className="mt-1 text-sm text-muted-foreground">Check back soon for new arrivals.</p>
        </div>
      )}
        </div>
      </ClickableSection>
    </div>
  );
}