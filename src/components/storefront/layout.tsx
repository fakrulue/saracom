"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X,
  ChevronDown,
  Share
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled ? "bg-white/80 backdrop-blur-md py-3 shadow-sm border-slate-100" : "bg-transparent py-5 border-transparent"
      )}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold tracking-tighter text-slate-900">
              SARACOM
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/collections/all" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Shop All</Link>
              <Link href="/collections/summer" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Summer</Link>
              <Link href="/collections/new-arrivals" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">New Arrivals</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-600 hover:text-slate-900 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-600 hover:text-slate-900 transition-colors">
              <User className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-600 hover:text-slate-900 transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-slate-900 text-[10px] text-white rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </button>
            <button 
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden">
          <nav className="flex flex-col gap-6 text-xl font-medium">
            <Link href="/collections/all" onClick={() => setIsMobileMenuOpen(false)}>Shop All</Link>
            <Link href="/collections/summer" onClick={() => setIsMobileMenuOpen(false)}>Summer Collection</Link>
            <Link href="/collections/new-arrivals" onClick={() => setIsMobileMenuOpen(false)}>New Arrivals</Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>Our Story</Link>
          </nav>
        </div>
      )}

      {/* Page Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t py-16 px-6">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-tighter">SARACOM</h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Next-generation commerce operating system for modern brands. Designed for speed, scale, and soul.
            </p>
            <div className="flex gap-4">
              <Share className="w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-900 transition-colors" />
              <Share className="w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-900 transition-colors" />
              <Share className="w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-900 transition-colors" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Shop</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link href="/collections/all" className="hover:text-slate-900 transition-colors">All Products</Link></li>
              <li><Link href="/collections/summer" className="hover:text-slate-900 transition-colors">Summer 2024</Link></li>
              <li><Link href="/collections/new-arrivals" className="hover:text-slate-900 transition-colors">New Arrivals</Link></li>
              <li><Link href="/collections/featured" className="hover:text-slate-900 transition-colors">Featured</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link href="/shipping" className="hover:text-slate-900 transition-colors">Shipping Info</Link></li>
              <li><Link href="/returns" className="hover:text-slate-900 transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/contact" className="hover:text-slate-900 transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-slate-900 transition-colors">FAQs</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Newsletter</h4>
            <p className="text-sm text-slate-500">Sign up to get 10% off your first order.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="email@example.com" 
                className="flex-1 bg-white border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900" 
              />
              <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white uppercase tracking-tighter font-bold px-6">
                Join
              </Button>
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400">© 2026 Saracom. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-slate-400">
            <Link href="/privacy" className="hover:text-slate-900">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-900">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
