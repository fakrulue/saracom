import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listCategories, listProducts } from "@/lib/products.functions";
import { ProductCard } from "@/components/shop/ProductCard";
import { VideoReviewsSection } from "@/components/shop/VideoReviewsSection";
import { resolveImage } from "@/lib/products-data";
import { Truck, ShieldCheck, RefreshCw, Headphones } from "lucide-react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "ChildrenGoods — Joyful clothing for little ones" },
      { name: "description", content: "Shop new arrivals, best sellers and seasonal favorites for newborns, babies and kids." },
    ],
  }),
});

function Home() {
  const fetchCats = useServerFn(listCategories);
  const fetchProducts = useServerFn(listProducts);
  const cats = useQuery({ queryKey: ["cats"], queryFn: () => fetchCats() });
  const newArrivals = useQuery({ queryKey: ["new"], queryFn: () => fetchProducts({ data: { flag: "new", limit: 8 } }) });
  const best = useQuery({ queryKey: ["best"], queryFn: () => fetchProducts({ data: { flag: "best_seller", limit: 8 } }) });
  const sale = useQuery({ queryKey: ["sale"], queryFn: () => fetchProducts({ data: { flag: "sale", limit: 4 } }) });

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-mint/60 via-background to-brand-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 lg:grid-cols-2 lg:py-20">
          <div className="space-y-5">
            <span className="inline-block rounded-full bg-brand-pink/10 px-3 py-1 text-xs font-bold text-brand-pink">SPRING COLLECTION</span>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] sm:text-6xl">
              Tiny outfits.<br />
              <span className="text-brand-pink">Big personalities.</span>
            </h1>
            <p className="max-w-md text-muted-foreground">
              Comfy, trend-forward clothing for newborns, babies and kids — made to be played in.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/collections/all" className="rounded-full bg-brand-pink px-6 py-3 text-sm font-bold text-white shadow-[var(--shadow-pop)] hover:opacity-95">
                Shop now
              </Link>
              <Link to="/collections/all" search={{ flag: "sale" }} className="rounded-full border-2 border-brand-ink px-6 py-3 text-sm font-bold hover:bg-brand-ink hover:text-background">
                View sale
              </Link>
            </div>
          </div>
          <div className="relative">
            <img src={hero1} alt="Happy kids in colorful clothing" width={1600} height={800} className="rounded-3xl shadow-[var(--shadow-soft)]" />
            <img src={hero2} alt="Smiling baby in soft onesie" width={400} height={400} loading="lazy" className="absolute -bottom-6 -left-6 hidden h-40 w-40 rounded-2xl border-4 border-background object-cover shadow-lg lg:block" />
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-6 sm:grid-cols-4">
          <Trust icon={Truck} title="Free shipping" sub="Orders over ৳2000" />
          <Trust icon={RefreshCw} title="Easy returns" sub="14-day exchange" />
          <Trust icon={ShieldCheck} title="Secure payment" sub="100% protected" />
          <Trust icon={Headphones} title="Friendly support" sub="7 days a week" />
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-center font-display text-3xl font-extrabold sm:text-4xl">Find your favorites</h2>
        <p className="mx-auto mt-2 max-w-md text-center text-sm text-muted-foreground">Shop by age and style.</p>
        <div className="mt-10 grid grid-cols-3 gap-6 sm:grid-cols-6">
          {(cats.data ?? []).map((c) => (
            <Link key={c.id} to="/collections/$handle" params={{ handle: c.handle }} className="group flex flex-col items-center gap-2">
              <div className="aspect-square w-full overflow-hidden rounded-full border-2 border-brand-mint bg-brand-mint/30 transition-transform group-hover:scale-105">
                <img src={resolveImage(`/src/assets/cat-${c.handle}.jpg`)} alt={c.name} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <span className="text-center text-sm font-bold">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Deals */}
      {(sale.data?.length ?? 0) > 0 && (
        <section className="bg-brand-pink/5">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Deals for you</h2>
                <p className="mt-1 text-sm text-muted-foreground">Limited-time savings on favorites.</p>
              </div>
              <Link to="/collections/all" search={{ flag: "sale" }} className="text-sm font-bold underline">View all</Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {sale.data!.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Best sellers</h2>
          <Link to="/collections/all" search={{ flag: "best_seller" }} className="text-sm font-bold underline">View all</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {(best.data ?? []).slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-brand-cream">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">New arrivals</h2>
            <Link to="/collections/all" search={{ flag: "new" }} className="text-sm font-bold underline">View all</Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {(newArrivals.data ?? []).slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      <VideoReviewsSection />

      {/* Newsletter */}
      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Join the family</h2>
        <p className="mt-2 text-sm text-muted-foreground">Get 10% off your first order plus updates on new drops.</p>
        <form className="mx-auto mt-6 flex max-w-md gap-2" onSubmit={(e) => e.preventDefault()}>
          <input type="email" required placeholder="your@email.com" className="flex-1 rounded-full border-2 border-input px-5 py-3 text-sm focus:border-brand-pink focus:outline-none" />
          <button className="rounded-full bg-brand-ink px-6 py-3 text-sm font-bold text-background">Subscribe</button>
        </form>
      </section>
    </div>
  );
}

function Trust({ icon: Icon, title, sub }: { icon: typeof Truck; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-pink/10 text-brand-pink"><Icon size={18} /></div>
      <div>
        <div className="text-sm font-bold">{title}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
    </div>
  );
}
