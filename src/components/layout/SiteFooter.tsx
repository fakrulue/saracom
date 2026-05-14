"use client";

import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { YoutubeIcon } from "@/components/icons/YoutubeIcon";
import { useTheme } from "@/contexts/ThemeContext";

interface SiteFooterProps {
  noMargin?: boolean;
}

export function SiteFooter({ noMargin }: SiteFooterProps) {
  const { config, isLoaded } = useTheme();

  if (!isLoaded) {
    return (
      <footer className="mt-20 border-t bg-muted/40">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4"><Logo /><p className="text-sm text-muted-foreground">Loading...</p></div>
      </footer>
    );
  }

  const { colors, sections } = config;
  const s = sections.footer || {};

  return (
    <footer className={noMargin ? "border-t" : "mt-20 border-t"} style={{ background: colors.secondaryBg }}>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-4 md:gap-10 md:py-12">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm" style={{ color: `${colors.text}99` }}>Joyful, comfortable everyday clothing for little ones.</p>
          {s.showSocial && (
            <div className="flex gap-2 pt-2">
              <a href="#" className="p-2 rounded-full" style={{ background: `${colors.primary}15` }} aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="p-2 rounded-full" style={{ background: `${colors.primary}15`, color: colors.primary }} aria-label="Instagram"><InstagramIcon size={16} /></a>
              <a href="#" className="p-2 rounded-full" style={{ background: `${colors.primary}15`, color: colors.primary }} aria-label="YouTube"><YoutubeIcon size={16} /></a>
            </div>
          )}
        </div>
        {s.columns?.map((col, i) => (
          <div key={i}>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wide" style={{ color: colors.text }}>{col.title}</h4>
            <div className="flex flex-col gap-2 text-sm" style={{ color: `${colors.text}99` }}>
              {col.links?.map((link, j) => <Link key={j} href="#">{link}</Link>)}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t" style={{ borderColor: `${colors.text}15`, background: colors.background }}>
        <div className="mx-auto max-w-7xl px-4 py-4 text-center text-xs" style={{ color: `${colors.text}99` }}>
          {s.copyrightText || ""}
        </div>
      </div>
    </footer>
  );
}