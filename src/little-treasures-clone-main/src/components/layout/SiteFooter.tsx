import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";
import { Facebook, Instagram, Youtube } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t bg-muted/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-muted-foreground">
            Joyful, comfortable everyday clothing for little ones — from newborn to ten years.
          </p>
          <div className="flex gap-2 pt-2">
            <a href="#" className="p-2 rounded-full bg-background hover:bg-brand-mint" aria-label="Facebook"><Facebook size={16} /></a>
            <a href="#" className="p-2 rounded-full bg-background hover:bg-brand-mint" aria-label="Instagram"><Instagram size={16} /></a>
            <a href="#" className="p-2 rounded-full bg-background hover:bg-brand-mint" aria-label="YouTube"><Youtube size={16} /></a>
          </div>
        </div>
        <FooterCol title="Shop">
          <Link to="/collections/all">All products</Link>
          <Link to="/collections/newborn">Newborn</Link>
          <Link to="/collections/baby-boys">Baby Boys</Link>
          <Link to="/collections/baby-girls">Baby Girls</Link>
          <Link to="/collections/kids-boys">Kids Boys</Link>
          <Link to="/collections/kids-girls">Kids Girls</Link>
        </FooterCol>
        <FooterCol title="Help">
          <Link to="/pages/how-to-place-an-order">How to order</Link>
          <Link to="/pages/shipping-returns">Shipping & returns</Link>
          <Link to="/pages/contact">Contact us</Link>
          <Link to="/pages/about">About us</Link>
        </FooterCol>
        <FooterCol title="Legal">
          <Link to="/pages/terms-conditions">Terms & conditions</Link>
          <Link to="/pages/privacy-policy">Privacy policy</Link>
        </FooterCol>
      </div>
      <div className="border-t bg-background">
        <div className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} ChildrenGoods. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-bold uppercase tracking-wide">{title}</h4>
      <div className="flex flex-col gap-2 text-sm text-muted-foreground [&>a:hover]:text-brand-pink">
        {children}
      </div>
    </div>
  );
}
