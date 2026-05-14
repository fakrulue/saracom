import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useWishlist, useCart } from "@/store/cart";
import { listProducts } from "@/lib/products.functions";
import { formatPrice, resolveImage } from "@/lib/products-data";

export const Route = createFileRoute("/wishlist")({
  component: Wishlist,
  head: () => ({ meta: [{ title: "Wishlist — ChildrenGoods" }] }),
});

function Wishlist() {
  const ids = useWishlist((s) => s.ids);
  const toggle = useWishlist((s) => s.toggle);
  const add = useCart((s) => s.add);
  const fetchProducts = useServerFn(listProducts);
  const { data } = useQuery({ queryKey: ["all-products"], queryFn: () => fetchProducts({ data: {} }) });
  const items = (data ?? []).filter((p) => ids.includes(p.id));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold">Your wishlist</h1>
      {items.length === 0 ? (
        <div className="py-20 text-center">
          <Heart className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">Your wishlist is empty</p>
          <Link to="/collections/all" className="mt-4 inline-block rounded-full bg-brand-pink px-6 py-3 text-sm font-bold text-white">Continue shopping</Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {items.map((p) => {
            const img = resolveImage(p.image_urls?.[0]);
            return (
              <div key={p.id} className="flex items-center gap-4 rounded-2xl border p-4">
                <img src={img} alt="" className="h-20 w-20 rounded-lg object-cover" />
                <div className="flex-1">
                  <Link to="/products/$handle" params={{ handle: p.handle }} className="font-semibold hover:underline">{p.title}</Link>
                  <p className="font-bold text-brand-pink">{formatPrice(Number(p.price))}</p>
                </div>
                <button
                  onClick={() => add({ productId: p.id, handle: p.handle, title: p.title, price: Number(p.price), image: img, qty: 1 })}
                  className="rounded-full bg-brand-pink px-4 py-2 text-sm font-bold text-white"
                >
                  Add to cart
                </button>
                <button onClick={() => toggle(p.id)} className="text-muted-foreground hover:text-destructive" aria-label="Remove"><Trash2 size={16} /></button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
