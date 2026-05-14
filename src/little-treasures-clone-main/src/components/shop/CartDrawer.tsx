import { Link } from "@tanstack/react-router";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/products-data";

export function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen);
  const close = useCart((s) => s.close);
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const subtotal = useCart((s) => s.subtotal());

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={close} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background shadow-2xl">
        <header className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-bold">Your cart</h2>
          <button onClick={close} className="p-2 rounded-md hover:bg-muted" aria-label="Close"><X size={20} /></button>
        </header>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">Your cart is empty</p>
              <Link to="/collections/all" onClick={close} className="mt-4 inline-block rounded-full bg-brand-pink px-5 py-2 text-sm font-bold text-white">
                Continue shopping
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.productId + (item.size ?? "")} className="flex gap-3">
                <img src={item.image} alt="" className="h-20 w-20 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold line-clamp-2">{item.title}</p>
                  {item.size && <p className="text-xs text-muted-foreground">Size: {item.size}</p>}
                  <div className="mt-2 flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full border">
                      <button onClick={() => setQty(item.productId, item.qty - 1, item.size)} className="px-2 py-1" aria-label="Decrease"><Minus size={14} /></button>
                      <span className="px-3 text-sm font-semibold">{item.qty}</span>
                      <button onClick={() => setQty(item.productId, item.qty + 1, item.size)} className="px-2 py-1" aria-label="Increase"><Plus size={14} /></button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold">{formatPrice(item.qty * item.price)}</span>
                      <button onClick={() => remove(item.productId, item.size)} className="text-muted-foreground hover:text-destructive" aria-label="Remove"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <footer className="border-t p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="text-lg font-bold">{formatPrice(subtotal)}</span>
            </div>
            <Link
              to="/checkout"
              onClick={close}
              className="block rounded-full bg-brand-pink py-3 text-center text-sm font-bold text-white hover:opacity-95"
            >
              Check out
            </Link>
            <Link to="/cart" onClick={close} className="block text-center text-xs underline text-muted-foreground">
              View full cart
            </Link>
          </footer>
        )}
      </aside>
    </div>
  );
}
