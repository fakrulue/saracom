"use client";

import Link from "next/link";
import { ProductCard } from "@/components/shop/ProductCard";
import { VideoReviewsSection } from "@/components/shop/VideoReviewsSection";
import { Truck, ShieldCheck, RefreshCw, Headphones } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useState, useEffect } from "react";

const cats = [
  { id: "1", handle: "newborn", name: "Newborn" },
  { id: "2", handle: "baby-boys", name: "Baby Boys" },
  { id: "3", handle: "baby-girls", name: "Baby Girls" },
  { id: "4", handle: "kids-boys", name: "Kids Boys" },
  { id: "5", handle: "kids-girls", name: "Kids Girls" },
  { id: "6", handle: "unisex", name: "Unisex" },
];

const mockProducts = [
  { id: "p1", handle: "summer-romper", title: "Organic Cotton Summer Romper", price: 1200, compare_at_price: 1500, image_urls: ["/assets/p-romper.jpg"], is_new: true, is_sale: true, is_best_seller: false },
  { id: "p2", handle: "knit-cardigan", title: "Chunky Knit Cardigan", price: 2500, compare_at_price: null, image_urls: ["/assets/p-cardigan.jpg"], is_new: false, is_sale: false, is_best_seller: true },
  { id: "p3", handle: "denim-overalls", title: "Classic Denim Overalls", price: 1800, compare_at_price: 2200, image_urls: ["/assets/p-overalls.jpg"], is_new: false, is_sale: true, is_best_seller: true },
  { id: "p4", handle: "floral-dress", title: "Spring Floral Dress", price: 1600, compare_at_price: null, image_urls: ["/assets/p-floral-dress.jpg"], is_new: true, is_sale: false, is_best_seller: false },
];

const ICON_MAP: Record<string, any> = { Truck, ShieldCheck, RefreshCw, Headphones };

export default function Home() {
  const { config, isLoaded } = useTheme();
  const [collProducts, setCollProducts] = useState<Record<string, typeof mockProducts>>({});

  const { colors, typography, sections } = config;

  useEffect(() => {
    if (!isLoaded) return;
    
    const handles = [
      sections.sale?.collectionHandle,
      sections.bestSellers?.collectionHandle,
      sections.newArrivals?.collectionHandle,
    ].filter(Boolean) as string[];

    const seen = new Set<string>();
    handles.forEach(h => {
      if (seen.has(h)) return;
      seen.add(h);
      fetch(`/api/v1/collections/by-handle/${h}`)
        .then(r => r.json())
        .then(d => {
          const raw = Array.isArray(d.products) ? d.products : (Array.isArray(d.data?.products) ? d.data.products : []);
          const prods = raw.map((p: any) => ({
            id: p.product?.id || p.id,
            handle: p.product?.handle || p.handle,
            title: p.product?.title || p.title,
            price: p.product?.price || p.price,
            compare_at_price: p.product?.compare_at_price || p.compare_at_price,
            image_urls: p.product?.image_urls || p.image_urls,
            is_new: p.product?.is_new || p.is_new || false,
            is_sale: p.product?.is_sale || p.is_sale || false,
            is_best_seller: p.product?.is_best_seller || p.is_best_seller || false,
          }));
          setCollProducts(prev => ({ ...prev, [h]: prods }));
        })
        .catch(() => {});
    });
  }, [isLoaded, sections.sale?.collectionHandle, sections.bestSellers?.collectionHandle, sections.newArrivals?.collectionHandle]);

  if (!isLoaded) return <div className="min-h-screen" />;

  const p = colors.primary, a = colors.accent, t = colors.text, sb = colors.secondaryBg;
  const hf = `"${typography.headingFont}", serif`;
  const hs = "clamp(2rem, 5vw, 60px)";
  const hsm = "clamp(1.5rem, 4vw, 44px)";

  const newArrivals = mockProducts.filter(p => p.is_new);
  const best = mockProducts.filter(p => p.is_best_seller);
  const sale = mockProducts.filter(p => p.is_sale);

  return (
    <div>
      {sections.hero?.enabled && (
        <section className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${p}15, ${a}15)` }}>
          <div className="mx-auto grid max-w-7xl items-center gap-6 px-4 py-8 sm:py-12 lg:grid-cols-2 lg:gap-8 lg:py-20">
            <div className="space-y-4 sm:space-y-5">
              <span className="inline-block rounded-full px-3 py-1 text-xs font-bold" style={{ background: `${p}15`, color: p }}>
                {sections.hero?.badge}
              </span>
              <h1 className="font-extrabold leading-[1.05] sm:text-5xl md:text-6xl" style={{ fontFamily: hf, fontSize: "clamp(2rem, 8vw, " + hs + "px)", color: t }}>
                {sections.hero?.title}
              </h1>
              <p className="max-w-md text-sm sm:text-base" style={{ color: `${t}99` }}>{sections.hero?.subtitle}</p>
              <div className="flex flex-wrap gap-3 pt-1 sm:pt-2">
                <Link href={sections.hero?.ctaLink} className="rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-pop)] hover:opacity-95 sm:px-6 sm:py-3" style={{ background: p }}>
                  {sections.hero?.ctaText}
                </Link>
                <Link href={sections.hero?.cta2Link} className="rounded-full border-2 px-5 py-2.5 text-sm font-bold hover:opacity-80 sm:px-6 sm:py-3" style={{ borderColor: t, color: t }}>
                  {sections.hero?.cta2Text}
                </Link>
              </div>
            </div>
            <div className="relative">
              {sections.hero?.imageUrl ? (
                <img src={sections.hero.imageUrl} alt={sections.hero.imageAlt || ""} className="rounded-3xl shadow-[var(--shadow-soft)] w-full" />
              ) : (
                <div className="aspect-video rounded-3xl" style={{ background: `linear-gradient(135deg, ${p}20, ${a}20)` }} />
              )}
              {sections.hero?.secondaryImageUrl && (
                <img src={sections.hero.secondaryImageUrl} alt={sections.hero.secondaryImageAlt || ""} loading="lazy" className="absolute -bottom-6 -left-6 h-40 w-40 rounded-2xl border-4 border-background object-cover shadow-lg hidden lg:block" />
              )}
            </div>
          </div>
        </section>
      )}

      {sections.trustStrip?.enabled && (
        <section className="border-y" style={{ background: sb }}>
          <div className="mx-auto flex max-w-7xl gap-4 overflow-x-auto px-4 py-4 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:py-6 md:grid-cols-4">
            {(sections.trustStrip.items || []).map((item, i) => {
              const Icon = ICON_MAP[item.icon] || Truck;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold" style={{ background: `${p}15`, color: p }}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-bold">{item.title}</div>
                    <div className="text-xs" style={{ color: `${p}99` }}>{item.subtitle}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

{sections.categories?.enabled && (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:py-16">
          <h2 className="text-center font-extrabold sm:text-3xl md:text-4xl" style={{ fontFamily: hf, fontSize: hsm }}>
            {sections.categories?.title}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-center text-sm" style={{ color: `${t}99` }}>{sections.categories?.subtitle}</p>
          <div className={`mt-10 grid gap-6 ${
            sections.categories.columns === 3 ? "grid-cols-3" :
            sections.categories.columns === 4 ? "grid-cols-2 sm:grid-cols-4" :
            "grid-cols-3 sm:grid-cols-6"
          }`}>
            {(() => {
              const cols = sections.categories?.collections || [];
              const seenIds = new Set<string>();
              const seenHandles = new Set<string>();
              return cols.filter(c => { 
                if (!c || !c.id || !c.handle) return false;
                if (seenIds.has(c.id) || seenHandles.has(c.handle)) return false; 
                seenIds.add(c.id); 
                seenHandles.add(c.handle);
                return true; 
              });
            })().map((c) => (
              <Link key={c.id} href={`/collections/${c.handle}`} className="group flex flex-col items-center gap-2">
                <div className="aspect-square w-full overflow-hidden rounded-full border-2 transition-transform group-hover:scale-105" style={{ borderColor: a, background: `${a}30` }}>
                  <img 
                    src={c.image || `/assets/cat-${c.handle}.jpg`} 
                    alt={c.name} 
                    loading="lazy" 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=" + encodeURIComponent(c.name);
                    }}
                  />
                </div>
                <span className="text-center text-sm font-bold">{c.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

{sections.sale?.enabled && (
        <section style={{ background: `${p}08` }}>
          <div className="mx-auto max-w-7xl px-4 py-10 sm:py-16">
            <div className="mb-6 flex flex-col gap-1 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-extrabold sm:text-3xl md:text-4xl" style={{ fontFamily: hf, fontSize: hsm, color: t }}>{sections.sale?.title}</h2>
                <p className="mt-1 text-sm" style={{ color: `${t}99` }}>{sections.sale?.subtitle}</p>
              </div>
              {sections.sale?.collectionHandle && (
                <Link href={`/collections/${sections.sale.collectionHandle}`} className="text-sm font-bold underline" style={{ color: p }}>View all →</Link>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {sections.sale?.collectionHandle ? (
                (collProducts[sections.sale.collectionHandle] || []).slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)
              ) : sale.length > 0 ? (
                sale.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)
              ) : null}
            </div>
          </div>
        </section>
      )}

      {sections.bestSellers?.enabled && (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:py-16">
          <div className="mb-6 flex flex-col gap-1 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-extrabold sm:text-3xl md:text-4xl" style={{ fontFamily: hf, fontSize: hsm, color: t }}>{sections.bestSellers?.title}</h2>
              <p className="mt-1 text-sm" style={{ color: `${t}99` }}>{sections.bestSellers?.subtitle}</p>
            </div>
            {sections.bestSellers?.collectionHandle && (
              <Link href={`/collections/${sections.bestSellers.collectionHandle}`} className="text-sm font-bold underline" style={{ color: p }}>View all →</Link>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {sections.bestSellers?.collectionHandle ? (
              (collProducts[sections.bestSellers.collectionHandle] || []).slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)
            ) : (
              best.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)
            )}
          </div>
        </section>
      )}

      {sections.newArrivals?.enabled && (
        <section style={{ background: sb }}>
          <div className="mx-auto max-w-7xl px-4 py-10 sm:py-16">
            <div className="mb-6 flex flex-col gap-1 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-extrabold sm:text-3xl md:text-4xl" style={{ fontFamily: hf, fontSize: hsm, color: t }}>{sections.newArrivals?.title}</h2>
                <p className="mt-1 text-sm" style={{ color: `${t}99` }}>{sections.newArrivals?.subtitle}</p>
              </div>
              {sections.newArrivals?.collectionHandle && (
                <Link href={`/collections/${sections.newArrivals.collectionHandle}`} className="text-sm font-bold underline" style={{ color: p }}>View all →</Link>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {sections.newArrivals?.collectionHandle ? (
                (collProducts[sections.newArrivals.collectionHandle] || []).slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)
              ) : (
                newArrivals.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)
              )}
            </div>
          </div>
        </section>
      )}

      {sections.bestSellers?.enabled && (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:py-16">
          <div className="mb-6 flex flex-col gap-1 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-extrabold sm:text-4xl" style={{ fontFamily: hf, fontSize: hsm, color: t }}>{sections.bestSellers?.title}</h2>
              <p className="mt-1 text-sm" style={{ color: `${t}99` }}>{sections.bestSellers?.subtitle}</p>
            </div>
            <Link href="/collections/all?flag=best_seller" className="text-sm font-bold underline" style={{ color: p }}>View all</Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {best.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {sections.newArrivals?.enabled && (
        <section style={{ background: sb }}>
          <div className="mx-auto max-w-7xl px-4 py-10 sm:py-16">
            <div className="mb-6 flex flex-col gap-1 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-extrabold sm:text-4xl" style={{ fontFamily: hf, fontSize: hsm, color: t }}>{sections.newArrivals?.title}</h2>
                <p className="mt-1 text-sm" style={{ color: `${t}99` }}>{sections.newArrivals?.subtitle}</p>
              </div>
              <Link href="/collections/all?flag=new" className="text-sm font-bold underline" style={{ color: p }}>View all</Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {newArrivals.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {sections.videoReviews?.enabled && <VideoReviewsSection />}

      {sections.newsletter?.enabled && (
        <section className="mx-auto max-w-3xl px-4 py-12 text-center sm:py-20">
          <h2 className="font-extrabold sm:text-3xl md:text-4xl" style={{ fontFamily: hf, fontSize: hsm, color: t }}>{sections.newsletter?.title}</h2>
          <p className="mt-2 text-sm" style={{ color: `${t}99` }}>{sections.newsletter?.subtitle}</p>
          <form className="mx-auto mt-6 flex flex-col gap-2 sm:max-w-md sm:flex-row" onSubmit={(e) => e.preventDefault()}>
            <input type="email" required placeholder="your@email.com" className="flex-1 rounded-full border-2 px-4 py-3 text-sm focus:outline-none sm:px-5" style={{ borderColor: `${t}30`, color: t }} />
            <button className="rounded-full px-6 py-3 text-sm font-bold" style={{ background: t, color: colors.background }}>Subscribe</button>
          </form>
        </section>
      )}
    </div>
  );
}