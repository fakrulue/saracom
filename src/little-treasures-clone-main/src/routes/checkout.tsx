import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/products-data";

export const Route = createFileRoute("/checkout")({
  component: Checkout,
  head: () => ({ meta: [{ title: "Checkout — ChildrenGoods" }] }),
});

function Checkout() {
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const clear = useCart((s) => s.clear);
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const shipping = subtotal > 2000 ? 0 : 80;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md p-10 text-center">
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Link to="/collections/all" className="mt-4 inline-block rounded-full bg-brand-pink px-5 py-2 text-sm font-bold text-white">Shop</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold">Checkout</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          await new Promise((r) => setTimeout(r, 800));
          clear();
          toast.success("Order placed! We'll be in touch.");
          nav({ to: "/account" });
        }}
        className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]"
      >
        <div className="space-y-6">
          <Section title="Contact">
            <Input name="email" type="email" placeholder="Email" required />
            <Input name="phone" placeholder="Phone" required />
          </Section>
          <Section title="Shipping address">
            <Input name="name" placeholder="Full name" required />
            <Input name="line1" placeholder="Address" required />
            <div className="grid grid-cols-2 gap-3">
              <Input name="city" placeholder="City" required />
              <Input name="area" placeholder="Area" />
            </div>
          </Section>
          <Section title="Payment">
            <p className="text-sm text-muted-foreground">Cash on delivery — pay when your order arrives. Card payments coming soon.</p>
          </Section>
        </div>
        <aside className="h-fit space-y-3 rounded-2xl border p-6">
          <h2 className="font-bold">Summary</h2>
          {items.map((i) => (
            <div key={i.productId + (i.size ?? "")} className="flex gap-3 text-sm">
              <img src={i.image} alt="" className="h-14 w-14 rounded-md object-cover" />
              <div className="flex-1">
                <p className="font-semibold line-clamp-1">{i.title}</p>
                <p className="text-xs text-muted-foreground">Qty {i.qty}{i.size ? ` · ${i.size}` : ""}</p>
              </div>
              <span className="font-semibold">{formatPrice(i.qty * i.price)}</span>
            </div>
          ))}
          <div className="border-t pt-3 text-sm space-y-1">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping ? formatPrice(shipping) : "Free"}</span></div>
            <div className="flex justify-between font-bold pt-1"><span>Total</span><span>{formatPrice(subtotal + shipping)}</span></div>
          </div>
          <button disabled={busy} className="w-full rounded-full bg-brand-pink py-3 text-sm font-bold text-white disabled:opacity-60">
            {busy ? "Placing order…" : "Place order"}
          </button>
        </aside>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border p-6">
      <h2 className="mb-4 font-bold">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="w-full rounded-lg border-2 px-4 py-2.5 text-sm focus:border-brand-pink focus:outline-none" />;
}
