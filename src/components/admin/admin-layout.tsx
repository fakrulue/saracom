"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3,
  Settings, Layers, ChevronRight, Bell, Search, Tag, Megaphone,
  ChevronDown, Store, MousePointerClick, Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SIDEBAR_ITEMS = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
    subItems: [
      { name: "All Products",  href: "/admin/products" },
      { name: "Collections",   href: "/admin/collections" },
      { name: "Inventory",     href: "/admin/inventory" },
      { name: "Barcodes",      href: "/admin/products/barcodes" },
    ],
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: Users,
    subItems: [
      { name: "All Customers", href: "/admin/customers" },
      { name: "Segments",      href: "/admin/customers/segments" },
      { name: "Reviews",       href: "/admin/customers/reviews" },
    ],
  },
  {
    name: "Sellers",
    href: "/admin/sellers",
    icon: Store,
    subItems: [
      { name: "All Sellers",   href: "/admin/sellers" },
      { name: "Payouts",       href: "/admin/sellers/payouts" },
      { name: "Commissions",   href: "/admin/sellers/commissions" },
    ],
  },
  {
    name: "Marketing",
    href: "/admin/marketing",
    icon: Megaphone,
    subItems: [
      { name: "Overview",      href: "/admin/marketing" },
      { name: "Discounts",     href: "/admin/marketing/discounts" },
      { name: "Campaigns",     href: "/admin/marketing/campaigns" },
      { name: "Templates",     href: "/admin/marketing/templates" },
      { name: "Video Reviews", href: "/admin/marketing/video-reviews" },
    ],
  },
  {
    name: "Plugins",
    href: "/admin/plugins",
    icon: Layers,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    subItems: [
      { name: "Overview",      href: "/admin/analytics" },
      { name: "Reports",       href: "/admin/analytics/reports" },
      { name: "Live View",      href: "/admin/analytics/live" },
    ],
  },
  {
    name: "POS System",
    href: "/admin/pos",
    icon: MousePointerClick,
  },
  {
    name: "Content",
    href: "/admin/content",
    icon: Layers,
    subItems: [
      { name: "Pages",         href: "/admin/content/pages" },
      { name: "Blog Posts",    href: "/admin/content/blog" },
      { name: "Navigation",    href: "/admin/content/navigation" },
      { name: "Files",          href: "/admin/content/files" },
    ],
  },
  {
    name: "Online Store",
    href: "/admin/store",
    icon: Globe,
    subItems: [
      { name: "Store",       href: "/admin/store" },
      { name: "Themes",      href: "/admin/themes" },
      { name: "Media",       href: "/admin/media" },
      { name: "Preferences", href: "/admin/settings" },
    ],
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    subItems: [
      { name: "General",     href: "/admin/settings" },
      { name: "Staff",       href: "/admin/settings/staff" },
    ],
  },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  React.useEffect(() => {
    const activeGroup = SIDEBAR_ITEMS.find(item =>
      pathname === item.href || item.subItems?.some(sub => pathname.startsWith(sub.href))
    );
    if (activeGroup?.subItems && !expandedItems.includes(activeGroup.name)) {
      setExpandedItems(prev => [...prev, activeGroup.name]);
    }
  }, [pathname, expandedItems]);

  const toggleExpand = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white flex flex-col sticky top-0 h-screen overflow-hidden">
        {/* Logo */}
        <div className="px-5 py-5 border-b flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
            <Store className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 tracking-tight">Saracom</p>
            <p className="text-[10px] text-slate-400 font-medium">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {SIDEBAR_ITEMS.map((item) => {
            const isGroupActive = pathname === item.href || item.subItems?.some(sub => pathname.startsWith(sub.href));
            const isExpanded = expandedItems.includes(item.name);
            const isExact = pathname === item.href && !item.subItems;

            return (
              <div key={item.name}>
                <div className="relative group/nav-item">
                  <Link
                    href={item.href}
                    onClick={() => {
                      if (item.subItems && !isExpanded) {
                        toggleExpand(item.name);
                      }
                    }}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                      isGroupActive
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    )}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1">{item.name}</span>
                  </Link>
                  {item.subItems && (
                    <button
                      onClick={(e) => { 
                        e.preventDefault(); 
                        e.stopPropagation();
                        toggleExpand(item.name); 
                      }}
                      className={cn(
                        "absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded transition-colors z-10",
                        isGroupActive ? "hover:bg-white/20 text-white" : "hover:bg-slate-200 text-slate-500"
                      )}
                    >
                      <ChevronRight className={cn("w-3.5 h-3.5 transition-transform duration-200", isExpanded && "rotate-90")} />
                    </button>
                  )}
                </div>

                {item.subItems && isExpanded && (
                  <div className="ml-4 mt-0.5 border-l border-slate-100 pl-4 space-y-0.5 py-1">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={cn(
                          "block px-3 py-2 rounded-lg text-sm transition-colors",
                          pathname === subItem.href
                            ? "text-slate-900 font-semibold bg-slate-100"
                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                        )}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            <Store className="w-3.5 h-3.5" />
            View Storefront
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search anything..."
                className="pl-10 bg-slate-50 border-none ring-0 focus-visible:ring-1 focus-visible:ring-slate-200"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-slate-500 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </Button>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-xs font-bold">
                M
              </div>
              <span className="text-sm font-medium text-slate-700">MMS</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
