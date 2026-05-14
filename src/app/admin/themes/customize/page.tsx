"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Palette, Type, Image as ImageIcon, Home, Footprints,
  Monitor, Smartphone, Tablet, Save, RotateCcw, Check,
  ChevronLeft, Settings, Layers, X, Plus, Trash2,
  ChevronDown, ChevronUp, Globe, LayoutTemplate, Eye,
  Sliders, Store, Package, Truck, RefreshCw, ShieldCheck, Headphones, Search, User, Heart, ShoppingBag, Video, Megaphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ThemeConfig, DEFAULT_CONFIG, ThemeProvider } from "@/contexts/ThemeContext";
import { MediaManager } from "@/components/admin/MediaManager";
import { CollectionPageContent } from "@/components/preview/CollectionPageContent";
import { ProductPageContent } from "@/components/preview/ProductPageContent";
import { HomePageContent } from "@/components/preview/HomePageContent";
import { StaticPageContent } from "@/components/preview/StaticPageContent";
import { SiteFooter } from "@/components/layout/SiteFooter";

const ICON_MAP: Record<string, any> = { Truck, RefreshCw, ShieldCheck, Headphones };

const PAGES = [
  { id: "home", label: "Homepage", path: "/" },
  { id: "collections", label: "Collection", path: "/collections" },
  { id: "products", label: "Product", path: "/products" },
  { id: "about", label: "About", path: "/pages/about" },
  { id: "contact", label: "Contact", path: "/pages/contact" },
  { id: "tracking", label: "Order Tracking", path: "/pages/tracking" },
  { id: "terms", label: "Terms & Conditions", path: "/pages/terms" },
  { id: "privacy", label: "Privacy Policy", path: "/pages/privacy" },
];

type Device = "desktop" | "tablet" | "mobile";

const SITE_SECTIONS = [
  { id: "topBanner", label: "Announcement Bar", icon: Home },
  { id: "hero", label: "Hero Banner", icon: LayoutTemplate },
  { id: "trustStrip", label: "Trust Strip", icon: ShieldCheck },
  { id: "categories", label: "Category Grid", icon: Layers },
  { id: "sale", label: "Featured Sale", icon: Package },
  { id: "bestSellers", label: "Best Sellers", icon: Package },
  { id: "newArrivals", label: "New Arrivals", icon: Package },
  { id: "videoReviews", label: "Video Reviews", icon: Eye },
  { id: "newsletter", label: "Newsletter", icon: Sliders },
  { id: "footer", label: "Footer", icon: Footprints },
];

const ELEMENT_LIBRARY = [
  { id: "customHtml", label: "Custom HTML", icon: Layers },
  { id: "featuredCollection", label: "Featured Collection", icon: Package },
  { id: "richText", label: "Rich Text", icon: Type },
  { id: "imageBanner", label: "Image Banner", icon: ImageIcon },
  { id: "quote", label: "Quote / Testimonial", icon: Layers },
];

const BASIC_SETTINGS = [
  { id: "logo", label: "Logo & Identity", icon: ImageIcon },
  { id: "header", label: "Header & Navigation", icon: Home },
  { id: "colors", label: "Colors", icon: Palette },
  { id: "typography", label: "Typography", icon: Type },
  { id: "buttons", label: "Buttons & Style", icon: Layers },
  { id: "meta", label: "Site Meta", icon: Globe },
];

export default function ThemeCustomizer() {
  const router = useRouter();
  const [config, setConfig] = useState<ThemeConfig>(DEFAULT_CONFIG);
  const [device, setDevice] = useState<Device>("desktop");
  const [saved, setSaved] = useState(false);
  const [activePage, setActivePage] = useState(PAGES[0].id);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showMedia, setShowMedia] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<string>("");
  const [leftOpen, setLeftOpen] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const res = await fetch("/api/v1/theme");
        const data = await res.json();
        if (data.data) {
          const parsed = data.data;
          // Deep-ish merge to preserve section settings
          const merged = {
            ...DEFAULT_CONFIG,
            ...parsed,
            sections: {
              ...DEFAULT_CONFIG.sections,
              ...(parsed.sections || {})
            }
          };
          setConfig(merged);
          return;
        }
      } catch (err) {
        console.error("Failed to load theme:", err);
      }

      const stored = localStorage.getItem("themeConfig");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const merged = {
            ...DEFAULT_CONFIG,
            ...parsed,
            sections: {
              ...DEFAULT_CONFIG.sections,
              ...(parsed.sections || {})
            }
          };
          setConfig(merged);
        } catch {}
      }
    };

    loadTheme();
  }, []);

  useEffect(() => {
    localStorage.setItem("themeConfig", JSON.stringify(config));
  }, [config]);

  const update = (path: string, value: unknown) => {
    setConfig((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj: any = updated;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const updateSection = (section: string, key: string, value: unknown) => {
    setConfig((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: { ...prev.sections[section as keyof typeof prev.sections] as any, [key]: value },
      },
    }));
  };

  const toggleSection = (id: string) => {
    const sec = id as keyof typeof config.sections;
    updateSection(id, "enabled", !config.sections[sec]?.enabled);
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/v1/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      
      if (!res.ok) throw res;
      
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      console.error("Save error:", err);
      let msg = "Failed to save theme configuration.";
      try {
        const data = await err.json?.();
        if (data?.errors?.[0]) msg += " " + data.errors[0];
      } catch {}
      alert(msg + " Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => setConfig(DEFAULT_CONFIG);

  const openMedia = (target: string) => {
    setMediaTarget(target);
    setShowMedia(true);
  };

  const deviceWidths: Record<Device, string> = { desktop: "100%", tablet: "768px", mobile: "375px" };

  const activeSetting = activeSection && !SITE_SECTIONS.find(s => s.id === activeSection) ? activeSection : null;

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: "#f8fafc" }}>
      {/* Top Toolbar */}
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 flex-shrink-0 border-b bg-white border-slate-200 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <Link href="/admin/themes" className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden md:inline">Store</span>
          </Link>
          <span className="text-slate-200">|</span>
          <span className="text-xs font-bold text-slate-900">Customize</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Page selector */}
          <div className="relative">
            <select
              value={activePage}
              onChange={(e) => { setActivePage(e.target.value); setActiveSection(null); }}
              className="h-8 pl-3 pr-8 border rounded-lg text-xs bg-slate-50 text-slate-900 border-slate-200 cursor-pointer appearance-none focus:outline-none focus:ring-1 focus:ring-pink-400"
            >
              {PAGES.map(p => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          {/* Device toggle */}
          <div className="flex items-center rounded-lg p-0.5 gap-0.5 bg-slate-100 border border-slate-200">
            {([["desktop", Monitor], ["tablet", Tablet], ["mobile", Smartphone]] as const).map(([d, Icon]) => (
              <button key={d} onClick={() => setDevice(d)} className={cn("p-1.5 rounded transition-colors", device === d ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600")}>
                <Icon className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
          {/* Actions */}
          <button onClick={handleReset} className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-xs">Reset</span>
          </button>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className={cn("flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-medium transition-all shadow-sm", 
              saved ? "bg-emerald-500 text-white" : 
              isSaving ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200" :
              "bg-slate-900 text-white hover:bg-slate-800"
            )}
          >
            <Check className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-xs">
              {saved ? "Saved" : isSaving ? "Saving..." : "Save"}
            </span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Section Tree */}
        <div className={cn("flex flex-col flex-shrink-0 transition-all duration-200 overflow-hidden bg-white border-r border-slate-200", leftOpen ? "w-64" : "w-0")}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sections</span>
            <button onClick={() => setLeftOpen(false)} className="p-1 text-slate-300 hover:text-slate-600 rounded"><X className="w-4 h-4" /></button>
          </div>
          <div className="flex-1 overflow-y-auto py-2 bg-slate-50/30">
            <div className="px-3 space-y-0.5">
              {activePage === "home" && SITE_SECTIONS.map((s) => {
                const isEnabled = config.sections[s.id as keyof typeof config.sections]?.enabled !== false;
                return (
                  <div key={s.id} className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveSection(s.id)}
                      className={cn("flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all text-left", activeSection === s.id ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 font-bold" : "text-slate-600 hover:text-slate-900 hover:bg-white/60")}
                    >
                      <s.icon className={cn("w-4 h-4 flex-shrink-0", activeSection === s.id ? "text-pink-500" : "text-slate-400")} />
                      <span className="flex-1 text-[11px] font-medium">{s.label}</span>
                    </button>
                    <button
                      onClick={() => toggleSection(s.id)}
                      className={cn("w-5 h-5 rounded text-[9px] font-bold flex items-center justify-center flex-shrink-0 transition-colors", isEnabled ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-200 text-slate-400")}
                    >
                      {isEnabled ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                    </button>
                  </div>
                );
              })}
              {activePage !== "home" && (
                <button
                  onClick={() => setActiveSection(activePage)}
                  className={cn("w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all text-left", activeSection === activePage ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 font-bold" : "text-slate-600 hover:text-slate-900 hover:bg-white/60")}
                >
                  <LayoutTemplate className={cn("w-4 h-4", activeSection === activePage ? "text-pink-500" : "text-slate-400")} />
                  <span className="text-[11px] font-medium">{PAGES.find(p => p.id === activePage)?.label}</span>
                </button>
              )}
            </div>
            <div className="mt-4 px-3">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Settings</p>
              <div className="space-y-0.5">
                {BASIC_SETTINGS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    className={cn("w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all text-left", activeSection === s.id ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 font-bold" : "text-slate-600 hover:text-slate-900 hover:bg-white/60")}
                  >
                    <s.icon className={cn("w-4 h-4", activeSection === s.id ? "text-pink-500" : "text-slate-400")} />
                    <span className="text-[11px] font-medium">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Toggle left panel button */}
        {!leftOpen && (
          <button onClick={() => setLeftOpen(true)} className="absolute top-14 left-2 z-20 p-1.5 rounded-lg text-slate-400 hover:text-slate-900 bg-white shadow-sm border border-slate-200 transition-colors">
            <Sliders className="w-4 h-4" />
          </button>
        )}

        {/* Preview Area */}
        <div className="flex-1 min-w-0 flex items-start justify-center overflow-auto p-4 z-0" style={{ background: "#e2e8f0" }}>
          <StorefrontPreview key={activePage} config={config} activeSection={activeSection} onSelectSection={(id) => { setActiveSection(id); }} activePage={activePage} device={device} deviceWidths={deviceWidths} />
        </div>

        {/* Right Panel - Section Settings */}
        <div className={cn("flex flex-col flex-shrink-0 transition-all duration-200 overflow-hidden bg-white border-l border-slate-200 shadow-xl", activeSection ? "w-72" : "w-0")}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white">
            <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">{activeSection ? getSectionLabel(activeSection, SITE_SECTIONS, BASIC_SETTINGS) : "Settings"}</h3>
            {activeSection && (
              <button onClick={() => setActiveSection(null)} className="p-1 text-slate-300 hover:text-slate-600 rounded transition-colors"><X className="w-4 h-4" /></button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-white">
            {!activeSection && (
              <div className="text-center py-12 text-slate-300">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <LayoutTemplate className="w-6 h-6 opacity-40" />
                </div>
                <p className="text-xs font-medium">Select a section to edit</p>
              </div>
            )}
            {activeSection === "logo" && <LogoSettings config={config} update={update} openMedia={openMedia} />}
            {activeSection === "header" && <HeaderSettings config={config} updateSection={updateSection} />}
            {activeSection === "colors" && <ColorsSettings config={config} update={update} />}
            {activeSection === "typography" && <TypographySettings config={config} update={update} />}
            {activeSection === "buttons" && <ButtonsSettings config={config} update={update} />}
            {activeSection === "meta" && <MetaSettings config={config} update={update} />}
            {activeSection === "topBanner" && <TopBannerSettings config={config} updateSection={updateSection} />}
            {activeSection === "hero" && <HeroSettings config={config} updateSection={updateSection} />}
            {activeSection === "trustStrip" && <TrustStripSettings config={config} updateSection={updateSection} />}
            {activeSection === "categories" && <CategoriesSettings config={config} updateSection={updateSection} />}
            {activeSection === "sale" && <SectionTitleSettings label="Featured Sale" config={config} section="sale" updateSection={updateSection} />}
            {activeSection === "bestSellers" && <SectionTitleSettings label="Best Sellers" config={config} section="bestSellers" updateSection={updateSection} />}
            {activeSection === "newArrivals" && <SectionTitleSettings label="New Arrivals" config={config} section="newArrivals" updateSection={updateSection} />}
            {activeSection === "videoReviews" && <VideoReviewsSettings config={config} updateSection={updateSection} openMedia={openMedia} />}
            {activeSection === "newsletter" && <NewsletterSettings config={config} updateSection={updateSection} />}
            {activeSection === "footer" && <FooterSettings config={config} updateSection={updateSection} />}
            {activePage !== "home" && activeSection === activePage && (
              <div className="space-y-3">
                <p className="text-xs font-medium text-white/50">Page Layout</p>
                <p className="text-xs text-white/30">Configure from <Link href="/admin/content/pages" className="text-pink-400/60 hover:text-pink-400">Content &gt; Pages</Link>.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showMedia && (
        <MediaManager
          onSelect={(url) => {
            if (mediaTarget === "logo") update("logo.imageUrl", url);
            if (mediaTarget?.startsWith("video_thumb_")) {
              const id = mediaTarget.replace("video_thumb_", "");
              const items = config.sections.videoReviews.items.map(it => it.id === id ? { ...it, thumbnailUrl: url } : it);
              updateSection("videoReviews", "items", items);
            }
            if (mediaTarget?.startsWith("video_url_")) {
              const id = mediaTarget.replace("video_url_", "");
              const items = config.sections.videoReviews.items.map(it => it.id === id ? { ...it, videoUrl: url } : it);
              updateSection("videoReviews", "items", items);
            }
            setShowMedia(false);
          }}
          onClose={() => setShowMedia(false)}
          selectedUrl={mediaTarget === "logo" ? (config.logo.imageUrl ?? undefined) : undefined}
        />
      )}
    </div>
  );
}

function getSectionLabel(id: string, sections: any[], settings: any[]) {
  const page = PAGES.find(p => p.id === id);
  if (page) return page.label + " Layout";
  const found = sections.find(s => s.id === id) || settings.find(s => s.id === id);
  return found ? found.label : id;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] font-medium text-slate-500">{label}</Label>
      {children}
    </div>
  );
}

const inputCls = "w-full h-9 border rounded-lg px-3 text-xs bg-slate-50 text-slate-900 border-slate-200 focus:outline-none focus:border-pink-400 placeholder:text-slate-400 transition-all";
const selectCls = "w-full h-9 border rounded-lg px-3 text-xs bg-slate-50 text-slate-900 border-slate-200 cursor-pointer appearance-none focus:outline-none focus:border-pink-400 transition-all";

function ColorsSettings({ config, update }: { config: ThemeConfig; update: (path: string, v: unknown) => void }) {
  const colors = [
    { key: "primary", label: "Primary" },
    { key: "accent", label: "Accent" },
    { key: "background", label: "Background" },
    { key: "text", label: "Text" },
    { key: "secondaryBg", label: "Section BG" },
  ];
  return (
    <div className="space-y-4">
      {colors.map((c) => (
        <div key={c.key} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg border overflow-hidden flex-shrink-0 border-slate-200 shadow-sm">
            <input type="color" value={config.colors[c.key as keyof typeof config.colors]} onChange={(e) => update(`colors.${c.key}`, e.target.value)} className="w-12 h-12 border-0 cursor-pointer p-0" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-medium text-slate-600">{c.label}</p>
            <input value={config.colors[c.key as keyof typeof config.colors]} onChange={(e) => update(`colors.${c.key}`, e.target.value)} className={cn("font-mono text-[11px] w-full mt-0.5", inputCls)} />
          </div>
        </div>
      ))}
    </div>
  );
}

function TypographySettings({ config, update }: { config: ThemeConfig; update: (path: string, v: unknown) => void }) {
  const FONTS = ["Playfair Display", "Inter", "Poppins", "Lora", "Merriweather", "Montserrat", "Nunito", "Open Sans", "Roboto", "Source Sans Pro", "Oswald", "Raleway"];
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Headings</p>
        <Field label="Font Family">
          <select value={config.typography.headingFont} onChange={(e) => update("typography.headingFont", e.target.value)} className={selectCls}>
            {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </Field>
        <Field label="Size">
          <div className="flex items-center gap-3">
            <input type="range" min="24" max="72" value={config.typography.headingSize} onChange={(e) => update("typography.headingSize", e.target.value)} className="flex-1 accent-pink-400" />
            <span className="text-[11px] font-mono w-10 text-right text-slate-400">{config.typography.headingSize}px</span>
          </div>
        </Field>
        <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50" style={{ fontFamily: `"${config.typography.headingFont}", serif`, fontSize: Math.min(Number(config.typography.headingSize), 36), color: "#334155" }}>
          The quick brown fox
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Body</p>
        <Field label="Font Family">
          <select value={config.typography.bodyFont} onChange={(e) => update("typography.bodyFont", e.target.value)} className={selectCls}>
            {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </Field>
        <Field label="Size">
          <div className="flex items-center gap-3">
            <input type="range" min="12" max="20" value={config.typography.bodySize} onChange={(e) => update("typography.bodySize", e.target.value)} className="flex-1 accent-pink-400" />
            <span className="text-[11px] font-mono w-10 text-right text-white/40">{config.typography.bodySize}px</span>
          </div>
        </Field>
        <div className="p-3 rounded-lg border border-white/5" style={{ fontFamily: config.typography.bodyFont, fontSize: Number(config.typography.bodySize), color: "rgba(255,255,255,0.5)" }}>
          The quick brown fox jumps over the lazy dog.
        </div>
      </div>
    </div>
  );
}

function ButtonsSettings({ config, update }: { config: ThemeConfig; update: (path: string, v: unknown) => void }) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-400">Button styling is derived from your color palette. Configure primary and text colors to customize button appearance.</p>
      <div className="p-4 border rounded-lg space-y-3">
        <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Preview</Label>
        <div className="flex gap-3">
          <button className="rounded-full px-5 py-2.5 text-sm font-bold text-white" style={{ background: config.colors.primary }}>
            Primary Button
          </button>
          <button className="rounded-full px-5 py-2.5 text-sm font-bold border-2" style={{ borderColor: config.colors.text, color: config.colors.text }}>
            Secondary
          </button>
        </div>
      </div>
    </div>
  );
}

function MetaSettings({ config, update }: { config: ThemeConfig; update: (path: string, v: unknown) => void }) {
  return (
    <div className="space-y-4">
      <p className="text-[11px] text-white/30">Store metadata settings.</p>
      <Field label="Store Name">
        <input value={config.logo.text} onChange={(e) => update("logo.text", e.target.value)} className={inputCls} />
      </Field>
      <Field label="Copyright Text">
        <input value={config.sections.footer.copyrightText} onChange={(e) => update("sections.footer.copyrightText", e.target.value)} className={inputCls} />
      </Field>
    </div>
  );
}

function LogoSettings({ config, update, openMedia }: { config: ThemeConfig; update: (path: string, v: unknown) => void; openMedia: (t: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Logo Image</Label>
        <div onClick={() => openMedia("logo")} className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-slate-400 cursor-pointer transition-colors">
          {config.logo.imageUrl ? (
            <img src={config.logo.imageUrl} alt="Logo" className="h-12 mx-auto object-contain" />
          ) : (
            <div>
              <ImageIcon className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-medium">Click to upload</p>
              <p className="text-[10px] text-slate-400">PNG, JPG, SVG</p>
            </div>
          )}
        </div>
        {config.logo.imageUrl && (
          <button onClick={() => update("logo.imageUrl", null)} className="w-full text-xs text-red-500 py-1.5 border border-red-200 rounded-lg hover:bg-red-50">Remove image</button>
        )}
      </div>
      <Field label="Logo Text (fallback)">
        <Input value={config.logo.text} onChange={(e) => update("logo.text", e.target.value)} />
      </Field>
      <Field label="Logo Width">
        <div className="flex items-center gap-3">
          <input type="range" min="60" max="300" value={config.logo.width} onChange={(e) => update("logo.width", Number(e.target.value))} className="flex-1" />
          <span className="text-xs font-mono w-12 text-right">{config.logo.width}px</span>
        </div>
      </Field>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={config.logo.showTagline} onChange={(e) => update("logo.showTagline", e.target.checked)} className="w-4 h-4 rounded" />
        <span className="text-xs font-medium">Show tagline below logo</span>
      </label>
    </div>
  );
}

function HeaderSettings({ config, updateSection }: { config: ThemeConfig; updateSection: (s: string, k: string, v: unknown) => void }) {
  const s = config.sections.header;
  const [storeCollections, setStoreCollections] = useState<{id: string; handle: string; title: string}[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [addType, setAddType] = useState<"custom" | "collection" | "page">("custom");
  const [addLabel, setAddLabel] = useState("");
  const [addUrl, setAddUrl] = useState("");
  const [addCollection, setAddCollection] = useState("");
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState("");

  useEffect(() => {
    fetch("/api/v1/collections")
      .then(r => r.json())
      .then(d => { if (Array.isArray(d.data)) setStoreCollections(d.data); else if (Array.isArray(d)) setStoreCollections(d); })
      .catch(() => {});
  }, []);

  const PAGES_LIST = [
    { label: "Home", url: "/" },
    { label: "About Us", url: "/pages/about-us" },
    { label: "Contact Us", url: "/pages/contact" },
    { label: "Order Tracking", url: "/pages/order-tracking" },
    { label: "Terms & Conditions", url: "/pages/terms-conditions" },
    { label: "Privacy Policy", url: "/pages/privacy-policy" },
    { label: "Wishlist", url: "/wishlist" },
    { label: "Account", url: "/account" },
  ];

  const addLink = () => {
    if (!addLabel.trim()) return;
    let url = addUrl;
    if (addType === "collection" && addCollection) {
      const col = storeCollections.find(c => c.handle === addCollection);
      url = `/collections/${addCollection}`;
      const label = col?.title || addLabel;
      updateSection("header", "menuLinks", [...(s.menuLinks || []), { label, url, type: "collection" }]);
    } else {
      updateSection("header", "menuLinks", [...(s.menuLinks || []), { label: addLabel, url, type: addType }]);
    }
    setAddLabel(""); setAddUrl(""); setAddCollection(""); setShowAdd(false);
  };

  const removeLink = (idx: number) => {
    updateSection("header", "menuLinks", (s.menuLinks || []).filter((_: any, i: number) => i !== idx));
  };

  const moveLink = (idx: number, dir: -1 | 1) => {
    const next = [...(s.menuLinks || [])];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    updateSection("header", "menuLinks", next);
  };

  const saveEdit = (idx: number) => {
    const next = [...(s.menuLinks || [])];
    next[idx] = { ...next[idx], label: editLabel };
    updateSection("header", "menuLinks", next);
    setEditingIdx(null);
  };

  return (
    <div className="space-y-5">
      <p className="text-[11px] text-white/30">Logo, navigation, search and cart icons.</p>
      <label className="flex items-center gap-2 cursor-pointer group">
        <input type="checkbox" checked={s.enabled} onChange={(e) => updateSection("header", "enabled", e.target.checked)} className="w-4 h-4 rounded border-slate-300 accent-pink-500" />
        <span className="text-[11px] font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">Show header</span>
      </label>

      {/* Live Header Preview */}
      <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/30">
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2">Preview</p>
        <div className="flex items-center justify-between gap-4 px-4 py-3 rounded border border-white/5" style={{ background: config.colors.background }}>
          <div className="flex items-center gap-2">
            {config.logo.imageUrl ? (
              <img src={config.logo.imageUrl} alt="Logo" style={{ maxWidth: config.logo.width * 0.5, height: "auto" }} className="object-contain" />
            ) : (
              <span className="font-extrabold tracking-tight" style={{ fontFamily: `"${config.typography.headingFont}", serif`, fontSize: Math.max(config.logo.width / 10, 12), color: config.colors.primary }}>{config.logo.text}</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {s.showSearch && <button className="p-1" style={{ color: config.colors.text }}><Search className="w-4 h-4" /></button>}
            {s.showAccount && <button className="p-1" style={{ color: config.colors.text }}><User className="w-4 h-4" /></button>}
            {s.showWishlist && <button className="p-1" style={{ color: config.colors.text }}><Heart className="w-4 h-4" /></button>}
            <button className="relative p-1" style={{ color: config.colors.text }}>
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full text-[7px] font-bold text-white" style={{ background: config.colors.primary }}>0</span>
            </button>
          </div>
        </div>
        <div className="flex gap-3 px-4 py-2 border border-white/5 border-t-0 rounded-b overflow-x-auto" style={{ background: config.colors.background }}>
          {(s.menuLinks || []).slice(0, 7).map((item: any, i: number) => (
            <span key={i} className="text-[9px] font-bold whitespace-nowrap" style={{ color: config.colors.text }}>{item.label}</span>
          ))}
          {(s.menuLinks?.length || 0) > 7 && <span className="text-[9px] text-white/30">+{s.menuLinks!.length - 7}</span>}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Icons</p>
        {[{ key: "showSearch", label: "Search" }, { key: "showAccount", label: "Account" }, { key: "showWishlist", label: "Wishlist" }].map(item => (
          <label key={item.key} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={s[item.key as keyof typeof s] as boolean} onChange={(e) => updateSection("header", item.key, e.target.checked)} className="w-3.5 h-3.5 rounded accent-pink-400" />
            <span className="text-[11px] text-white/50">{item.label}</span>
          </label>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Menu Links</p>
          <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1 text-[10px] font-medium text-pink-400/60 hover:text-pink-400">
            <Plus className="w-3 h-3" />{showAdd ? "Cancel" : "Add"}
          </button>
        </div>

        {showAdd && (
          <div className="p-3 rounded-lg border border-white/5 space-y-2">
            <div className="flex gap-1 mb-2">
              {(["custom", "collection", "page"] as const).map(t => (
                <button key={t} onClick={() => { setAddType(t); setAddUrl(""); setAddCollection(""); }}
                  className={cn("px-2 py-1 rounded text-[10px] font-bold", addType === t ? "bg-white/10 text-white" : "bg-white/5 text-white/40")}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            {addType === "custom" && (
              <>
                <input placeholder="Label" value={addLabel} onChange={e => setAddLabel(e.target.value)} className={inputCls} />
                <input placeholder="URL" value={addUrl} onChange={e => setAddUrl(e.target.value)} className={inputCls} />
              </>
            )}
            {addType === "collection" && (
              <>
                <input placeholder="Label" value={addLabel} onChange={e => setAddLabel(e.target.value)} className={inputCls} />
                <select value={addCollection} onChange={e => { setAddCollection(e.target.value); setAddLabel(storeCollections.find((c: any) => c.handle === e.target.value)?.title || ""); }} className={selectCls}>
                  <option value="">Select collection</option>
                  {storeCollections.map((c: any) => <option key={c.id} value={c.handle}>{c.title}</option>)}
                </select>
              </>
            )}
            {addType === "page" && (
              <>
                <input placeholder="Label" value={addLabel} onChange={e => setAddLabel(e.target.value)} className={inputCls} />
                <select value={addUrl} onChange={e => { setAddUrl(e.target.value); setAddLabel(PAGES_LIST.find((p: any) => p.url === e.target.value)?.label || ""); }} className={selectCls}>
                  <option value="">Select page</option>
                  {PAGES_LIST.map((p: any) => <option key={p.url} value={p.url}>{p.label}</option>)}
                </select>
              </>
            )}
            <button onClick={addLink} disabled={!addLabel.trim()} className="w-full h-8 rounded-lg bg-white/10 text-white/70 text-[11px] font-medium disabled:opacity-30 hover:bg-white/15 transition-colors">
              Add to Menu
            </button>
          </div>
        )}

        <div className="border border-white/5 rounded-lg divide-y divide-white/5">
          {!(s.menuLinks?.length) && <p className="text-[11px] text-white/20 text-center py-4">No links. Click "Add" to create.</p>}
          {(s.menuLinks || []).map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 group">
              <button onClick={() => moveLink(i, -1)} disabled={i === 0} className="text-white/20 disabled:opacity-10 hover:text-white/50"><ChevronUp className="w-3 h-3" /></button>
              <button onClick={() => moveLink(i, 1)} disabled={i === ((s.menuLinks?.length || 1) - 1)} className="text-white/20 disabled:opacity-10 hover:text-white/50 -mt-0.5"><ChevronDown className="w-3 h-3" /></button>
              <div className="flex-1 min-w-0">
                {editingIdx === i ? (
                  <div className="flex gap-1">
                    <input value={editLabel} onChange={e => setEditLabel(e.target.value)} className="flex-1 h-6 rounded border border-white/10 px-1 text-[11px] bg-white/5 text-white" />
                    <button onClick={() => saveEdit(i)} className="text-[10px] font-bold text-emerald-400">Save</button>
                    <button onClick={() => setEditingIdx(null)} className="text-[10px] font-bold text-white/30">X</button>
                  </div>
                ) : (
                  <button onClick={() => { setEditingIdx(i); setEditLabel(item.label); }} className="text-[11px] font-medium text-slate-600 hover:text-slate-900 truncate block w-full text-left">
                    {item.label}
                  </button>
                )}
                <span className="text-[10px] text-slate-400 truncate block">{item.url}</span>
              </div>
              <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded", item.type === "collection" ? "bg-blue-50 text-blue-600 border border-blue-100" : item.type === "page" ? "bg-purple-50 text-purple-600 border border-purple-100" : "bg-slate-100 text-slate-500 border border-slate-200")}>
                {item.type}
              </span>
              <button onClick={() => removeLink(i)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TopBannerSettings({ config, updateSection }: { config: ThemeConfig; updateSection: (s: string, k: string, v: unknown) => void }) {
  const s = config.sections.topBanner;
  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 cursor-pointer group">
        <input type="checkbox" checked={s.enabled} onChange={(e) => updateSection("topBanner", "enabled", e.target.checked)} className="w-4 h-4 rounded border-slate-300 accent-pink-500" />
        <span className="text-[11px] font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">Show announcement bar</span>
      </label>
      <Field label="Text"><input value={s.text} onChange={(e) => updateSection("topBanner", "text", e.target.value)} className={inputCls} /></Field>
      <Field label="Link"><input value={s.link} onChange={(e) => updateSection("topBanner", "link", e.target.value)} className={inputCls} /></Field>
    </div>
  );
}

function HeroSettings({ config, updateSection }: { config: ThemeConfig; updateSection: (s: string, k: string, v: unknown) => void }) {
  const s = config.sections.hero as any;
  const [showMedia, setShowMedia] = useState(false);
  const [mediaTarget, setMediaTarget] = useState("");

  const openMedia = (target: string) => { setMediaTarget(target); setShowMedia(true); };

  return (
    <>
      <div className="space-y-4">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input type="checkbox" checked={s.enabled} onChange={(e) => updateSection("hero", "enabled", e.target.checked)} className="w-4 h-4 rounded border-slate-300 accent-pink-500" />
          <span className="text-[11px] font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">Show hero</span>
        </label>
        <Field label="Badge"><input value={s.badge} onChange={(e) => updateSection("hero", "badge", e.target.value)} className={inputCls} /></Field>
        <Field label="Title"><input value={s.title} onChange={(e) => updateSection("hero", "title", e.target.value)} className={inputCls} /></Field>
        <Field label="Subtitle"><input value={s.subtitle} onChange={(e) => updateSection("hero", "subtitle", e.target.value)} className={inputCls} /></Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Btn 1 Text"><input value={s.ctaText} onChange={(e) => updateSection("hero", "ctaText", e.target.value)} className={inputCls} /></Field>
          <Field label="Btn 1 Link"><input value={s.ctaLink} onChange={(e) => updateSection("hero", "ctaLink", e.target.value)} className={inputCls} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Btn 2 Text"><input value={s.cta2Text} onChange={(e) => updateSection("hero", "cta2Text", e.target.value)} className={inputCls} /></Field>
          <Field label="Btn 2 Link"><input value={s.cta2Link} onChange={(e) => updateSection("hero", "cta2Link", e.target.value)} className={inputCls} /></Field>
        </div>

        <div className="space-y-1.5">
          <p className="text-[11px] font-medium text-slate-500">Main Image</p>
          <div onClick={() => openMedia("hero_image")} className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-xl p-4 text-center hover:border-pink-200 hover:bg-pink-50/20 cursor-pointer transition-all">
            {s.imageUrl ? (
              <img src={s.imageUrl} alt={s.imageAlt || ""} className="h-16 mx-auto object-contain rounded-lg shadow-sm" />
            ) : (
              <div>
                <ImageIcon className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                <p className="text-[11px] text-slate-400">Click to upload</p>
              </div>
            )}
          </div>
          {s.imageUrl && (
            <button onClick={() => { updateSection("hero", "imageUrl", ""); updateSection("hero", "imageAlt", ""); }} className="text-[10px] text-red-500/70 hover:text-red-600 font-medium">Remove image</button>
          )}
        </div>

        <div className="space-y-1.5">
          <p className="text-[11px] font-medium text-slate-500">Secondary Image (float)</p>
          <div onClick={() => openMedia("hero_secondary_image")} className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-xl p-4 text-center hover:border-pink-200 hover:bg-pink-50/20 cursor-pointer transition-all">
            {s.secondaryImageUrl ? (
              <img src={s.secondaryImageUrl} alt={s.secondaryImageAlt || ""} className="h-14 mx-auto object-contain rounded-lg shadow-sm" />
            ) : (
              <div>
                <ImageIcon className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                <p className="text-[11px] text-slate-400">Click to upload</p>
              </div>
            )}
          </div>
          {s.secondaryImageUrl && (
            <button onClick={() => { updateSection("hero", "secondaryImageUrl", ""); updateSection("hero", "secondaryImageAlt", ""); }} className="text-[10px] text-red-500/70 hover:text-red-600 font-medium">Remove image</button>
          )}
        </div>
      </div>

      {showMedia && (
        <MediaManager
          onSelect={(url) => {
            if (mediaTarget === "hero_image") { updateSection("hero", "imageUrl", url); updateSection("hero", "imageAlt", "Hero main image"); }
            if (mediaTarget === "hero_secondary_image") { updateSection("hero", "secondaryImageUrl", url); updateSection("hero", "secondaryImageAlt", "Hero secondary image"); }
            setShowMedia(false);
          }}
          onClose={() => setShowMedia(false)}
          selectedUrl={mediaTarget === "hero_image" ? (s.imageUrl || undefined) : (s.secondaryImageUrl || undefined)}
        />
      )}
    </>
  );
}

function TrustStripSettings({ config, updateSection }: { config: ThemeConfig; updateSection: (s: string, k: string, v: unknown) => void }) {
  const s = config.sections.trustStrip;
  const TRUST_ICONS = ["Truck", "RefreshCw", "ShieldCheck", "Headphones"];
  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 cursor-pointer group">
        <input type="checkbox" checked={s.enabled} onChange={(e) => updateSection("trustStrip", "enabled", e.target.checked)} className="w-4 h-4 rounded border-slate-300 accent-pink-500" />
        <span className="text-[11px] font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">Show trust strip</span>
      </label>
      <div className="space-y-2">
        {s.items.map((item: any, i: number) => (
          <div key={i} className="p-3 rounded-xl border border-slate-200 bg-slate-50/30 space-y-2 shadow-sm">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Trust Point {i + 1}</p>
            <select value={item.icon} onChange={(e) => { const items = [...s.items]; items[i] = { ...items[i], icon: e.target.value }; updateSection("trustStrip", "items", items); }} className={selectCls}>
              {TRUST_ICONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
            </select>
            <input placeholder="Title" value={item.title} onChange={(e) => { const items = [...s.items]; items[i] = { ...items[i], title: e.target.value }; updateSection("trustStrip", "items", items); }} className={inputCls} />
            <input placeholder="Subtitle" value={item.subtitle} onChange={(e) => { const items = [...s.items]; items[i] = { ...items[i], subtitle: e.target.value }; updateSection("trustStrip", "items", items); }} className={inputCls} />
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoriesSettings({ config, updateSection }: { config: ThemeConfig; updateSection: (s: string, k: string, v: unknown) => void }) {
  const s = config.sections.categories;
  const [storeCollections, setStoreCollections] = useState<{id: string; handle: string; title: string; imageUrl?: string}[]>([]);

  useEffect(() => {
    fetch("/api/v1/collections")
      .then(r => r.json())
      .then(d => { if (Array.isArray(d.data)) setStoreCollections(d.data); else if (Array.isArray(d)) setStoreCollections(d); })
      .catch(() => {});
  }, []);

  const toggleCollection = (col: any) => {
    const exists = s.collections?.find((c: any) => c.id === col.id);
    if (exists) {
      updateSection("categories", "collections", s.collections.filter((c: any) => c.id !== col.id));
    } else {
      updateSection("categories", "collections", [...(s.collections || []), { 
        id: col.id, 
        handle: col.handle, 
        name: col.title,
        image: col.imageUrl
      }]);
    }
  };

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 cursor-pointer group">
        <input type="checkbox" checked={s.enabled} onChange={(e) => updateSection("categories", "enabled", e.target.checked)} className="w-4 h-4 rounded border-slate-300 accent-pink-500" />
        <span className="text-[11px] font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">Show categories</span>
      </label>
      <Field label="Title"><input value={s.title} onChange={(e) => updateSection("categories", "title", e.target.value)} className={inputCls} /></Field>
      <Field label="Subtitle"><input value={s.subtitle} onChange={(e) => updateSection("categories", "subtitle", e.target.value)} className={inputCls} /></Field>
      <Field label="Columns">
        <select value={s.columns} onChange={(e) => updateSection("categories", "columns", Number(e.target.value))} className={selectCls}>
          <option value="3">3 columns</option>
          <option value="4">4 columns</option>
          <option value="6">6 columns</option>
        </select>
      </Field>
      <div className="space-y-1.5">
        <p className="text-[11px] font-medium text-slate-500">Select Collections</p>
        <div className="max-h-48 overflow-y-auto border border-slate-100 rounded-xl p-2 space-y-1 bg-slate-50/50">
          {storeCollections.length === 0 && (
            <p className="text-[11px] text-slate-400 text-center py-4">No collections found</p>
          )}
          {storeCollections.map((col) => {
            const selected = s.collections?.find((c: any) => c.id === col.id);
            return (
              <button
                key={col.id}
                onClick={() => toggleCollection(col)}
                className={cn("w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-all text-left", selected ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-100" : "hover:bg-white text-slate-400 hover:text-slate-600")}
              >
                <div className={cn("w-3.5 h-3.5 rounded flex items-center justify-center flex-shrink-0 border", selected ? "bg-pink-500 border-pink-500" : "border-slate-200 bg-white")}>
                  {selected && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                <span className="flex-1 text-[11px] font-medium">{col.title}</span>
              </button>
            );
          })}
        </div>
        {s.collections?.length > 0 && (
          <button onClick={() => updateSection("categories", "collections", [])} className="text-[10px] text-slate-400 hover:text-red-500 font-medium transition-colors">Clear selections</button>
        )}
      </div>
    </div>
  );
}

function SectionTitleSettings({ label, config, section, updateSection }: { label: string; config: ThemeConfig; section: string; updateSection: (s: string, k: string, v: unknown) => void }) {
  const s = config.sections[section as keyof typeof config.sections] as any;
  const [storeCollections, setStoreCollections] = useState<{id: string; handle: string; title: string}[]>([]);

  useEffect(() => {
    fetch("/api/v1/collections")
      .then(r => r.json())
      .then(d => { if (Array.isArray(d.data)) setStoreCollections(d.data); else if (Array.isArray(d)) setStoreCollections(d); })
      .catch(() => {});
  }, []);

  const selectable = section === "sale" || section === "bestSellers" || section === "newArrivals";

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 cursor-pointer group">
        <input type="checkbox" checked={s?.enabled !== false} onChange={(e) => updateSection(section, "enabled", e.target.checked)} className="w-4 h-4 rounded border-slate-300 accent-pink-500" />
        <span className="text-[11px] font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">Show {label.toLowerCase()}</span>
      </label>
      <Field label="Title"><input value={s?.title || ""} onChange={(e) => updateSection(section, "title", e.target.value)} className={inputCls} /></Field>
      <Field label="Subtitle"><input value={s?.subtitle || ""} onChange={(e) => updateSection(section, "subtitle", e.target.value)} className={inputCls} /></Field>
      {selectable && (
        <div className="space-y-1.5">
          <p className="text-[11px] font-medium text-slate-500">Collection source</p>
          <select value={s?.collectionHandle || ""} onChange={(e) => { const col = storeCollections.find(c => c.handle === e.target.value); updateSection(section, "collectionHandle", e.target.value); updateSection(section, "collectionTitle", col?.title || ""); }} className={selectCls}>
            <option value="">— None —</option>
            {storeCollections.map((col) => <option key={col.id} value={col.handle}>{col.title}</option>)}
          </select>
          {s?.collectionHandle && (
            <button onClick={() => { updateSection(section, "collectionHandle", ""); updateSection(section, "collectionTitle", ""); }} className="text-[10px] text-slate-400 hover:text-red-500 font-medium transition-colors">Clear selection</button>
          )}
        </div>
      )}
    </div>
  );
}

function VideoReviewsSettings({ config, updateSection, openMedia }: { config: ThemeConfig; updateSection: (s: string, k: string, v: unknown) => void; openMedia: (target: string) => void }) {
  const s = config.sections.videoReviews;
  
  const addItem = () => {
    const newItem = {
      id: Math.random().toString(36).substring(7),
      videoUrl: "",
      thumbnailUrl: "",
      reviewerName: "New Reviewer",
      reviewText: "Amazing product! Highly recommend.",
      rating: 5
    };
    updateSection("videoReviews", "items", [...s.items, newItem]);
  };

  const updateItem = (id: string, key: string, val: any) => {
    updateSection("videoReviews", "items", s.items.map(item => item.id === id ? { ...item, [key]: val } : item));
  };

  const removeItem = (id: string) => {
    updateSection("videoReviews", "items", s.items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 cursor-pointer group">
        <input type="checkbox" checked={s.enabled} onChange={(e) => updateSection("videoReviews", "enabled", e.target.checked)} className="w-4 h-4 rounded border-slate-300 accent-pink-500" />
        <span className="text-[11px] font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">Show video reviews section</span>
      </label>
      <Field label="Section Title"><input value={s.title} onChange={(e) => updateSection("videoReviews", "title", e.target.value)} className={inputCls} /></Field>
      <Field label="Section Subtitle"><input value={s.subtitle} onChange={(e) => updateSection("videoReviews", "subtitle", e.target.value)} className={inputCls} /></Field>
      
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
        <p className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
          <Megaphone className="w-3.5 h-3.5 text-pink-500" />
          Dynamic Content
        </p>
        <p className="text-[10px] text-slate-500 leading-relaxed">
          Individual video reviews are now managed in a dedicated section. Changes made there will reflect automatically.
        </p>
        <Link href="/admin/marketing/video-reviews" className="text-[10px] font-bold text-pink-600 hover:text-pink-700 underline block pt-1">
          Go to Video Reviews Manager →
        </Link>
      </div>

      <div className="space-y-3 opacity-50 grayscale pointer-events-none">
        <div className="flex items-center justify-between">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Video Items</p>
          <button onClick={addItem} className="text-[10px] text-pink-500 font-bold hover:text-pink-600 flex items-center gap-1 transition-colors">
            <Plus className="w-3 h-3" /> Add Video Review
          </button>
        </div>
        
        <div className="space-y-3">
          {s.items.map((item, idx) => (
            <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/30 space-y-3 relative group/item shadow-sm hover:shadow-md transition-all">
              <button onClick={() => removeItem(item.id)} className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 transition-colors">
                <X className="w-4 h-4" />
              </button>
              
              <div className="grid grid-cols-2 gap-2">
                <Field label="Reviewer Name">
                  <input value={item.reviewerName} onChange={(e) => updateItem(item.id, "reviewerName", e.target.value)} className={inputCls} />
                </Field>
                <Field label="Rating">
                  <select value={item.rating} onChange={(e) => updateItem(item.id, "rating", Number(e.target.value))} className={selectCls}>
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </Field>
              </div>
              
              <Field label="Review Text">
                <textarea value={item.reviewText} onChange={(e) => updateItem(item.id, "reviewText", e.target.value)} className={cn(inputCls, "h-16 py-2 resize-none")} />
              </Field>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-medium text-slate-500">Thumbnail</p>
                  <div 
                    onClick={() => openMedia(`video_thumb_${item.id}`)}
                    className="h-20 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center cursor-pointer hover:border-pink-300 hover:bg-pink-50/10 transition-all bg-white overflow-hidden shadow-inner"
                  >
                    {item.thumbnailUrl ? (
                      <img src={item.thumbnailUrl} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="w-5 h-5 text-slate-300 mx-auto" />
                        <span className="text-[9px] text-slate-400 mt-1 block">Upload</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-medium text-slate-500">Video File</p>
                  <div 
                    onClick={() => openMedia(`video_url_${item.id}`)}
                    className="h-20 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center cursor-pointer hover:border-pink-300 hover:bg-pink-50/10 transition-all bg-white shadow-inner"
                  >
                    {item.videoUrl ? (
                      <div className="text-[10px] text-slate-600 truncate px-2 text-center flex flex-col items-center gap-1">
                        <Video className="w-4 h-4 text-pink-500" />
                        <span className="w-24 truncate">{item.videoUrl.split('/').pop()}</span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Video className="w-5 h-5 text-slate-300 mx-auto" />
                        <span className="text-[9px] text-slate-400 mt-1 block">Select Video</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {s.items.length === 0 && (
            <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <Video className="w-8 h-8 text-slate-300 mx-auto mb-2 opacity-50" />
              <p className="text-xs text-slate-500 font-medium">No video reviews added yet</p>
              <p className="text-[10px] text-slate-400 mt-1">Share customer stories and testimonials</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionToggleSettings({ label, config, section, updateSection }: { label: string; config: ThemeConfig; section: string; updateSection: (s: string, k: string, v: unknown) => void }) {
  const s = config.sections[section as keyof typeof config.sections] as any;
  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 cursor-pointer group">
        <input type="checkbox" checked={s?.enabled !== false} onChange={(e) => updateSection(section, "enabled", e.target.checked)} className="w-4 h-4 rounded border-slate-300 accent-pink-500" />
        <span className="text-[11px] font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">Show {label.toLowerCase()}</span>
      </label>
    </div>
  );
}

function NewsletterSettings({ config, updateSection }: { config: ThemeConfig; updateSection: (s: string, k: string, v: unknown) => void }) {
  const s = config.sections.newsletter;
  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 cursor-pointer group">
        <input type="checkbox" checked={s.enabled} onChange={(e) => updateSection("newsletter", "enabled", e.target.checked)} className="w-4 h-4 rounded border-slate-300 accent-pink-500" />
        <span className="text-[11px] font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">Show newsletter section</span>
      </label>
      <Field label="Title"><input value={s.title} onChange={(e) => updateSection("newsletter", "title", e.target.value)} className={inputCls} /></Field>
      <Field label="Subtitle"><input value={s.subtitle} onChange={(e) => updateSection("newsletter", "subtitle", e.target.value)} className={inputCls} /></Field>
    </div>
  );
}

function FooterSettings({ config, updateSection }: { config: ThemeConfig; updateSection: (s: string, k: string, v: unknown) => void }) {
  const s = config.sections.footer;
  return (
    <div className="space-y-4">
      {[{ key: "showSocial", label: "Social links" }, { key: "showNewsletter", label: "Newsletter" }].map(item => (
        <label key={item.key} className="flex items-center gap-2 cursor-pointer group">
          <input type="checkbox" checked={s[item.key as keyof typeof s] as boolean} onChange={(e) => updateSection("footer", item.key, e.target.checked)} className="w-4 h-4 rounded border-slate-300 accent-pink-500" />
          <span className="text-[11px] font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">{item.label}</span>
        </label>
      ))}
      <Field label="Copyright"><input value={s.copyrightText} onChange={(e) => updateSection("footer", "copyrightText", e.target.value)} className={inputCls} /></Field>
      <div className="space-y-2">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Footer Columns</p>
        {s.columns.map((col: any, i: number) => (
          <div key={i} className="p-3 rounded-xl border border-slate-200 bg-slate-50/30 space-y-2">
            <input placeholder="Column Title" value={col.title} onChange={(e) => { const cols = [...s.columns]; cols[i] = { ...cols[i], title: e.target.value }; updateSection("footer", "columns", cols); }} className={inputCls} />
            <div className="flex flex-wrap gap-1">
              {col.links.map((link: string, j: number) => (
                <span key={j} className="text-[10px] bg-white border border-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1 text-slate-600 shadow-sm">
                  {link}
                  <button onClick={() => { const cols = [...s.columns]; cols[i] = { ...cols[i], links: cols[i].links.filter((_: any, k: number) => k !== j) }; updateSection("footer", "columns", cols); }} className="text-slate-300 hover:text-red-500">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
            <input
              placeholder="Add link, press Enter"
              className={inputCls}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value) {
                  const cols = [...s.columns];
                  cols[i] = { ...cols[i], links: [...cols[i].links, e.currentTarget.value] };
                  updateSection("footer", "columns", cols);
                  e.currentTarget.value = "";
                }
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function StorefrontPreview({ config, activeSection, onSelectSection, activePage, device, deviceWidths }: { config: ThemeConfig; activeSection: string | null; onSelectSection: (s: string) => void; activePage: string; device: Device; deviceWidths: Record<Device, string> }) {
  const { colors, typography, sections } = config;
  const p = colors.primary, a = colors.accent, t = colors.text, sb = colors.secondaryBg;
  const hf = `"${typography.headingFont}", serif`;
  const hs = Math.min(Number(typography.headingSize), 60);
  const hsm = Math.min(Number(typography.headingSize) * 0.65, 44);

  const sec = (id: string) => (sections[id as keyof typeof sections] as any) || {};
  const isEnabled = (id: string) => sec(id)?.enabled !== false;

  const Section = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <div
      className={cn("relative group cursor-pointer transition-all", activeSection === id ? "ring-2 ring-pink-500 ring-offset-1" : "hover:ring-2 hover:ring-slate-300")}
      onClick={(e) => { e.stopPropagation(); onSelectSection(id); }}
    >
      {activeSection === id && (
        <div className="absolute -top-7 left-0 z-10 bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-t flex items-center gap-1">
          <span>{getSectionLabel(id, SITE_SECTIONS, BASIC_SETTINGS)}</span>
          <X className="w-2.5 h-2.5" />
        </div>
      )}
      {children}
    </div>
  );

  return (
    <div style={{ background: colors.background, color: colors.text, fontFamily: typography.bodyFont, fontSize: Number(typography.bodySize) }} onClick={() => onSelectSection("")}>
      {/* Page-specific content */}
      {activePage === "home" && (
        <div className="flex-1 min-w-0 overflow-auto">
          <div style={{ width: deviceWidths[device] }} className="flex-shrink-0">
            <ThemeProvider initialConfig={config} editing={{ activeSection, onSelectSection }}>
              <HomePageContent config={config} />
            </ThemeProvider>
          </div>
        </div>
      )}

      {activePage === "collections" && (
        <div className="flex-1 min-w-0 overflow-auto">
          <div style={{ width: deviceWidths[device] }} className="flex-shrink-0">
            <ThemeProvider initialConfig={config} editing={{ activeSection, onSelectSection }}>
              <CollectionPageContent config={config} />
            </ThemeProvider>
          </div>
        </div>
      )}

      {activePage === "products" && (
        <div className="flex-1 min-w-0 overflow-auto">
          <div style={{ width: deviceWidths[device] }} className="flex-shrink-0">
            <ThemeProvider initialConfig={config} editing={{ activeSection, onSelectSection }}>
              <ProductPageContent config={config} />
            </ThemeProvider>
          </div>
        </div>
      )}

      {(activePage === "about" || activePage === "contact" || activePage === "tracking" || activePage === "terms" || activePage === "privacy") && (
        <div className="flex-1 min-w-0 overflow-auto">
          <div style={{ width: deviceWidths[device] }} className="flex-shrink-0">
            <ThemeProvider initialConfig={config} editing={{ activeSection, onSelectSection }}>
              <StaticPageContent pageTitle={PAGES.find(p => p.id === activePage)?.label} config={config} />
            </ThemeProvider>
          </div>
        </div>
      )}
    </div>
  );
}