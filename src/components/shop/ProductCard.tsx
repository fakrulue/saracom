"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { formatPrice, resolveImage } from "@/lib/products-data";
import { useCart, useWishlist } from "@/store/cart";

type Props = {
  product: {
    id: string;
    handle: string;
    title: string;
    price: number;
    compare_at_price: number | null;
    image_urls: string[];
    is_new?: boolean | null;
    is_sale?: boolean | null;
    is_best_seller?: boolean | null;
  };
};

export function ProductCard({ product }: Props) {
  const add = useCart((s) => s.add);
  const wishlist = useWishlist();
  const wished = wishlist?.ids?.includes(product.id) ?? false;
  const toggleWish = wishlist?.toggle;
  
  const img = resolveImage(product.image_urls?.[0]);
  const onSale = product.compare_at_price && Number(product.compare_at_price) > Number(product.price);

  return (
    <div className="group flex flex-col">
      <div className="relative overflow-hidden rounded-2xl bg-muted">
        <Link href={`/products/${product.handle}`} className="block">
          <img
            src={img}
            alt={product.title}
            loading="lazy"
            className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="absolute left-3 top-3 flex flex-col gap-1">
          {product.is_new && <Badge color="mint">NEW</Badge>}
          {onSale && <Badge color="pink">SALE</Badge>}
          {product.is_best_seller && <Badge color="cream">BEST</Badge>}
        </div>
        <button
          onClick={(e) => { e.preventDefault(); toggleWish?.(product.id); }}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/90 backdrop-blur hover:bg-background"
          aria-label="Wishlist"
        >
          <Heart size={16} className={wished ? "fill-brand-pink text-brand-pink" : ""} />
        </button>
        <button
          onClick={() => add({
            productId: product.id,
            handle: product.handle,
            title: product.title,
            price: Number(product.price),
            image: img,
            qty: 1,
          })}
          className="absolute inset-x-3 bottom-3 translate-y-3 rounded-full bg-brand-ink py-2 text-xs font-bold uppercase text-background opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"
        >
          Add to cart
        </button>
      </div>
      <Link href={`/products/${product.handle}`} className="mt-3 block">
        <h3 className="text-sm font-semibold leading-snug line-clamp-2">{product.title}</h3>
      </Link>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="font-bold text-brand-pink">{formatPrice(Number(product.price))}</span>
        {onSale && (
          <span className="text-sm text-muted-foreground line-through">
            {formatPrice(Number(product.compare_at_price))}
          </span>
        )}
      </div>
    </div>
  );
}

function Badge({ color, children }: { color: "pink" | "mint" | "cream"; children: React.ReactNode }) {
  const map = {
    pink: "bg-brand-pink text-white",
    mint: "bg-brand-mint text-brand-ink",
    cream: "bg-brand-cream text-brand-ink border border-border",
  } as const;
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${map[color]}`}>{children}</span>;
}

