"use client";

import Link from "next/link";
import { Heart, Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { useCart } from "@/store/cart";
import { useTheme } from "@/contexts/ThemeContext";

const DEFAULT_NAV: { label: string; url: string }[] = [
  { label: "New Arrival", url: "/collections/all?sort=newest" },
  { label: "Best Seller", url: "/collections/all?flag=best_seller" },
  { label: "Baby Boys", url: "/collections/baby-boys" },
  { label: "Baby Girls", url: "/collections/baby-girls" },
  { label: "Kids Boys", url: "/collections/kids-boys" },
  { label: "Kids Girls", url: "/collections/kids-girls" },
  { label: "Sale", url: "/collections/all?flag=sale" },
];

export function SiteHeader() {
  const { config, isLoaded } = useTheme();
  const count = useCart((s) => s.count());
  const open = useCart((s) => s.open);
  const [mobile, setMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!isLoaded) {
    return (
      <header className="sticky top-0 z-40 border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4">
          <Logo />
        </div>
      </header>
    );
  }

  const { colors, sections } = config;
  const p = colors.primary, t = colors.text;
  const topBanner = sections.topBanner || {};
  const headerSection = sections.header || {};
  const menuLinks = (headerSection.menuLinks?.length ? headerSection.menuLinks : DEFAULT_NAV) as { label: string; url: string }[];

  return (
    <header className="sticky top-0 z-40" style={{ background: colors.background, color: t }}>
      {topBanner.enabled && (
        <div className="text-center text-sm font-medium py-2 px-4" style={{ background: p, color: "#fff" }}>
          <Link href={topBanner.link || "#"} className="hover:underline">{topBanner.text} →</Link>
        </div>
      )}
      <div className="border-b" style={{ borderColor: `${t}15` }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobile(!mobile)} className="lg:hidden -ml-2 p-2 rounded-md hover:bg-muted" style={{ color: t }} aria-label="Menu">
              {mobile ? <X size={22} /> : <Menu size={22} />}
            </button>
            <Logo />
          </div>
          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold">
            {menuLinks.map((item) => (
              <Link key={item.url} href={item.url} className="transition-colors hover:opacity-80" style={{ color: t }}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            {headerSection.showSearch && (
              <Link href="/search" className="p-2 rounded-md hover:bg-muted" style={{ color: t }} aria-label="Search">
                <Search size={20} />
              </Link>
            )}
            {headerSection.showAccount && (
              <Link href="/account" className="p-2 rounded-md hover:bg-muted" style={{ color: t }} aria-label="Account">
                <User size={20} />
              </Link>
            )}
            {headerSection.showWishlist && (
              <Link href="/wishlist" className="p-2 rounded-md hover:bg-muted" style={{ color: t }} aria-label="Wishlist">
                <Heart size={20} />
              </Link>
            )}
            <button onClick={open} className="relative p-2 rounded-md hover:bg-muted" style={{ color: t }} aria-label="Cart">
              <ShoppingBag size={20} />
              {mounted && count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full px-1 text-[11px] font-bold text-white" style={{ background: p }}>
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
        {mobile && (
          <nav className="lg:hidden border-t px-4 py-3 flex flex-col gap-3 text-sm font-bold" style={{ background: colors.background, color: t, borderColor: `${t}15` }}>
            {menuLinks.map((item) => (
              <Link key={item.url} href={item.url} onClick={() => setMobile(false)} className="py-1 hover:opacity-80" style={{ color: t }}>
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}