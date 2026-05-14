import { Link } from "@tanstack/react-router";
import { Heart, Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { useCart } from "@/store/cart";

const NAV = [
  { to: "/collections/all", label: "New Arrival", search: { sort: "newest" } },
  { to: "/collections/all", label: "Best Seller", search: { flag: "best_seller" } },
  { to: "/collections/baby-boys", label: "Baby Boys" },
  { to: "/collections/baby-girls", label: "Baby Girls" },
  { to: "/collections/kids-boys", label: "Kids Boys" },
  { to: "/collections/kids-girls", label: "Kids Girls" },
  { to: "/collections/all", label: "Sale", search: { flag: "sale" } },
] as const;

export function SiteHeader() {
  const count = useCart((s) => s.count());
  const open = useCart((s) => s.open);
  const [mobile, setMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 bg-background">
      <div className="bg-brand-mint text-center text-sm font-medium py-2 px-4">
        <Link to="/pages/how-to-place-an-order" className="hover:underline">
          How to Place an Order? Know How →
        </Link>
      </div>
      <div className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobile(!mobile)}
              className="lg:hidden -ml-2 p-2 rounded-md hover:bg-muted"
              aria-label="Menu"
            >
              {mobile ? <X size={22} /> : <Menu size={22} />}
            </button>
            <Logo />
          </div>
          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                search={(item as { search?: Record<string, string> }).search}
                className="hover:text-brand-pink transition-colors"
                activeOptions={{ exact: false }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <Link to="/search" className="p-2 rounded-md hover:bg-muted" aria-label="Search">
              <Search size={20} />
            </Link>
            <Link to="/account" className="p-2 rounded-md hover:bg-muted" aria-label="Account">
              <User size={20} />
            </Link>
            <Link to="/wishlist" className="p-2 rounded-md hover:bg-muted" aria-label="Wishlist">
              <Heart size={20} />
            </Link>
            <button
              onClick={open}
              className="relative p-2 rounded-md hover:bg-muted"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {mounted && count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand-pink px-1 text-[11px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
        {mobile && (
          <nav className="lg:hidden border-t bg-background px-4 py-3 flex flex-col gap-3 text-sm font-bold">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                search={(item as { search?: Record<string, string> }).search}
                onClick={() => setMobile(false)}
                className="py-1 hover:text-brand-pink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
