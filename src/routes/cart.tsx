import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/products-data";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({ meta: [{ title: "Your cart — ChildrenGoods" }] }),
});

function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const subtotal = useCart((s) => s.subtotal());

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Your cart</h1>
      {items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-muted-foreground">Your cart is empty</p>
          <Link to="/collections/all" className="mt-4 inline-block rounded-full bg-brand-pink px-6 py-3 text-sm font-bold text-white">Continue shopping</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.productId + (item.size ?? "")} className="flex gap-4 rounded-2xl border p-4">
                <img src={item.image} alt="" className="h-24 w-24 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <Link to="/products/$handle" params={{ handle: item.handle }} className="font-semibold hover:underline">{item.title}</Link>
                  {item.size && <p className="text-xs text-muted-foreground">Size: {item.size}</p>}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full border">
                      <button onClick={() => setQty(item.productId, item.qty - 1, item.size)} className="px-2 py-1"><Minus size={14} /></button>
                      <span className="px-3 text-sm font-semibold">{item.qty}</span>
                      <button onClick={() => setQty(item.productId, item.qty + 1, item.size)} className="px-2 py-1"><Plus size={14} /></button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold">{formatPrice(item.qty * item.price)}</span>
                      <button onClick={() => remove(item.productId, item.size)} className="text-muted-foreground hover:text-destructive" aria-label="Remove"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <aside className="h-fit rounded-2xl border p-6">
            <h2 className="font-bold">Order summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <Row label="Subtotal" value={formatPrice(subtotal)} />
              <Row label="Shipping" value={subtotal > 2000 ? "Free" : formatPrice(80)} />
              <div className="border-t pt-2">
                <Row label="Total" value={formatPrice(subtotal + (subtotal > 2000 ? 0 : 80))} bold />
              </div>
            </div>
            <Link to="/checkout" className="mt-6 block rounded-full bg-brand-pink py-3 text-center text-sm font-bold text-white">Check out</Link>
          </aside>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={bold ? "font-bold" : "text-muted-foreground"}>{label}</span>
      <span className={bold ? "font-bold" : ""}>{value}</span>
    </div>
  );
}
