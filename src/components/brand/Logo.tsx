"use client";

import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";

export function Logo({ className = "" }: { className?: string }) {
  const { config, isLoaded } = useTheme();
  const primary = config.colors.primary;
  const headingFont = config.typography.headingFont;
  const logoWidth = config.logo.width;

  if (!isLoaded) {
    return (
      <Link href="/" className={`inline-flex items-center ${className}`} aria-label="ChildrenGoods home">
        <span className="font-display text-2xl font-extrabold tracking-tight text-brand-pink">CHILDRENG<span className="-mt-1 inline-block h-[0.85em] w-[0.85em] fill-brand-pink align-middle">★</span><span className="-mt-1 inline-block h-[0.85em] w-[0.85em] fill-brand-pink align-middle">★</span>DS</span>
      </Link>
    );
  }

  if (config.logo.imageUrl) {
    return (
      <Link href="/" className={`inline-flex items-center ${className}`} aria-label="ChildrenGoods home">
        <img
          src={config.logo.imageUrl}
          alt={config.logo.text}
          style={{ maxWidth: logoWidth, height: "auto" }}
          className="object-contain"
        />
      </Link>
    );
  }

  return (
    <Link href="/" className={`inline-flex items-center ${className}`} aria-label="ChildrenGoods home">
      <span
        className="font-extrabold tracking-tight"
        style={{
          fontFamily: `"${headingFont}", serif`,
          fontSize: Math.max(18, Math.min(logoWidth / 8, 24)),
          color: primary,
        }}
      >
        {config.logo.text}
      </span>
    </Link>
  );
}