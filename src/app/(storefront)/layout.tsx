"use client";

import { ThemeProvider, injectThemeCSS, useTheme } from "@/contexts/ThemeContext";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { useEffect } from "react";

function ThemeInjector() {
  const { config, isLoaded } = useTheme();
  useEffect(() => {
    if (isLoaded) {
      injectThemeCSS(config);
    }
  }, [config, isLoaded]);
  return null;
}

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <ThemeInjector />
      <div className="flex h-screen flex-col overflow-hidden">
        <SiteHeader />
        <main className="flex-1 overflow-y-auto">{children}</main>
        <SiteFooter noMargin />
        <CartDrawer />
      </div>
    </ThemeProvider>
  );
}
