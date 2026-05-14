"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeConfig = {
  colors: {
    primary: string;
    accent: string;
    background: string;
    text: string;
    secondaryBg: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    headingSize: string;
    bodySize: string;
  };
  logo: {
    text: string;
    showTagline: boolean;
    width: number;
    imageUrl: string | null;
  };
  sections: {
    topBanner: {
      enabled: boolean;
      text: string;
      link: string;
    };
    header: {
      enabled: boolean;
      showSearch: boolean;
      showAccount: boolean;
      showWishlist: boolean;
      menuLinks: { label: string; url: string; type: "custom" | "collection" | "page" }[];
    };
    hero: {
      enabled: boolean;
      badge: string;
      title: string;
      subtitle: string;
      ctaText: string;
      ctaLink: string;
      cta2Text: string;
      cta2Link: string;
      imageUrl: string;
      imageAlt: string;
      secondaryImageUrl: string;
      secondaryImageAlt: string;
    };
    trustStrip: {
      enabled: boolean;
      items: { icon: string; title: string; subtitle: string }[];
    };
    categories: {
      enabled: boolean;
      title: string;
      subtitle: string;
      columns: number;
      collections: { id: string; handle: string; name: string }[];
    };
    sale: {
      enabled: boolean;
      title: string;
      subtitle: string;
      collectionHandle: string;
      collectionTitle: string;
    };
    bestSellers: {
      enabled: boolean;
      title: string;
      subtitle: string;
      collectionHandle: string;
      collectionTitle: string;
    };
    newArrivals: {
      enabled: boolean;
      title: string;
      subtitle: string;
      collectionHandle: string;
      collectionTitle: string;
    };
    videoReviews: {
      enabled: boolean;
      title: string;
      subtitle: string;
      items: {
        id: string;
        videoUrl: string;
        thumbnailUrl: string;
        reviewerName: string;
        reviewText: string;
        rating: number;
      }[];
    };
    newsletter: {
      enabled: boolean;
      title: string;
      subtitle: string;
    };
    footer: {
      enabled: boolean;
      showSocial: boolean;
      showNewsletter: boolean;
      copyrightText: string;
      columns: { title: string; links: string[] }[];
    };
  };
};

export const DEFAULT_CONFIG: ThemeConfig = {
  colors: {
    primary: "#ec4899",
    accent: "#10b981",
    background: "#ffffff",
    text: "#0f172a",
    secondaryBg: "#f8fafc",
  },
  typography: {
    headingFont: "Playfair Display",
    bodyFont: "Inter",
    headingSize: "48",
    bodySize: "16",
  },
  logo: {
    text: "Saracom",
    showTagline: true,
    width: 140,
    imageUrl: null,
  },
  sections: {
    topBanner: {
      enabled: true,
      text: "How to Place an Order? Know How",
      link: "/pages/how-to-place-an-order",
    },
    header: {
      enabled: true,
      showSearch: true,
      showAccount: true,
      showWishlist: true,
      menuLinks: [
        { label: "New Arrival", url: "/collections/all?sort=newest", type: "collection" },
        { label: "Best Seller", url: "/collections/all?flag=best_seller", type: "collection" },
        { label: "Baby Boys", url: "/collections/baby-boys", type: "collection" },
        { label: "Baby Girls", url: "/collections/baby-girls", type: "collection" },
        { label: "Kids Boys", url: "/collections/kids-boys", type: "collection" },
        { label: "Kids Girls", url: "/collections/kids-girls", type: "collection" },
        { label: "Sale", url: "/collections/all?flag=sale", type: "collection" },
      ],
    },
    hero: {
      enabled: true,
      badge: "SPRING COLLECTION",
      title: "Tiny outfits. Big personalities.",
      subtitle: "Comfy, trend-forward clothing for newborns, babies and kids.",
      ctaText: "Shop now",
      ctaLink: "/collections/all",
      cta2Text: "View sale",
      cta2Link: "/collections/all?flag=sale",
      imageUrl: "/assets/hero-1.jpg",
      imageAlt: "Happy kids in colorful clothing",
      secondaryImageUrl: "/assets/hero-2.jpg",
      secondaryImageAlt: "Smiling baby",
    },
    trustStrip: {
      enabled: true,
      items: [
        { icon: "Truck", title: "Free shipping", subtitle: "Orders over ৳2000" },
        { icon: "RefreshCw", title: "Easy returns", subtitle: "14-day exchange" },
        { icon: "ShieldCheck", title: "Secure payment", subtitle: "100% protected" },
        { icon: "Headphones", title: "Friendly support", subtitle: "7 days a week" },
      ],
    },
    categories: {
      enabled: true,
      title: "Find your favorites",
      subtitle: "Shop by age and style.",
      columns: 6,
      collections: [],
    },
    sale: {
      enabled: true,
      title: "Deals for you",
      subtitle: "Limited-time savings on favorites.",
      collectionHandle: "",
      collectionTitle: "",
    },
    bestSellers: {
      enabled: true,
      title: "Best sellers",
      subtitle: "Most loved by parents.",
      collectionHandle: "",
      collectionTitle: "",
    },
    newArrivals: {
      enabled: true,
      title: "New arrivals",
      subtitle: "Fresh drops you will love.",
      collectionHandle: "",
      collectionTitle: "",
    },
    videoReviews: {
      enabled: true,
      title: "What our customers say",
      subtitle: "Verified video reviews from our community",
      items: []
    },
    newsletter: {
      enabled: true,
      showSocial: true,
      showNewsletter: true,
      copyrightText: "© 2024 Saracom. All rights reserved.",
      columns: [
        { title: "Shop", links: ["All products", "Newborn", "Baby Boys", "Baby Girls", "Kids Boys", "Kids Girls"] },
        { title: "Help", links: ["How to order", "Shipping & returns", "Contact us", "About us"] },
        { title: "Legal", links: ["Terms & conditions", "Privacy policy"] },
        { title: "Company", links: ["About us", "Careers", "Press"] },
      ],
    },
  },
};

type EditingContextType = {
  activeSection: string | null;
  onSelectSection: (id: string) => void;
};

const EditingContext = createContext<EditingContextType>({
  activeSection: null,
  onSelectSection: () => {},
});

export function useEditing() {
  return useContext(EditingContext);
}

type ThemeContextType = {
  config: ThemeConfig;
  setConfig: (config: ThemeConfig) => void;
  update: (path: string, value: unknown) => void;
  isLoaded: boolean;
  activeSection: string | null;
  onSelectSection: (id: string) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  config: DEFAULT_CONFIG,
  setConfig: () => {},
  update: () => {},
  isLoaded: false,
  activeSection: null,
  onSelectSection: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ClickableSection({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  const { activeSection, onSelectSection } = useEditing();
  const isActive = activeSection === id;
  return (
    <div
      className={`relative group cursor-pointer transition-all ${isActive ? "ring-2 ring-pink-500 ring-offset-1" : "hover:ring-2 hover:ring-slate-300"} ${className}`}
      onClick={(e) => { e.stopPropagation(); onSelectSection(id); }}
    >
      {isActive && (
        <div className="absolute -top-7 left-0 z-50 bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-t flex items-center gap-1 whitespace-nowrap">
          {id}
          <svg onClick={(e) => { e.stopPropagation(); onSelectSection(""); }} className="w-2.5 h-2.5 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </div>
      )}
      {children}
    </div>
  );
}

export function ThemeProvider({ children, initialConfig, editing }: { children: React.ReactNode; initialConfig?: ThemeConfig; editing?: EditingContextType }) {
  const [config, setConfigState] = useState<ThemeConfig>(initialConfig || DEFAULT_CONFIG);
  const [isLoaded, setIsLoaded] = useState(!!initialConfig);

  useEffect(() => {
    if (initialConfig) {
      setConfigState(initialConfig);
      setIsLoaded(true);
      return;
    }

    const loadTheme = async () => {
      try {
        const res = await fetch("/api/v1/theme");
        const data = await res.json();
        if (data.data) {
          const parsed = data.data;
          const merged: ThemeConfig = {
            ...DEFAULT_CONFIG,
            ...parsed,
            sections: {
              ...DEFAULT_CONFIG.sections,
              ...(parsed.sections || {}),
            } as typeof DEFAULT_CONFIG.sections,
          };
          setConfigState(merged);
          setIsLoaded(true);
          return;
        }
      } catch (err) {
        console.error("Failed to fetch theme from DB:", err);
      }

      const stored = localStorage.getItem("themeConfig");
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Partial<ThemeConfig>;
          const merged: ThemeConfig = {
            ...DEFAULT_CONFIG,
            ...parsed,
            sections: {
              ...DEFAULT_CONFIG.sections,
              ...(parsed.sections || {}),
            } as typeof DEFAULT_CONFIG.sections,
          };
          setConfigState(merged);
        } catch {
          setConfigState(DEFAULT_CONFIG);
        }
      }
      setIsLoaded(true);
    };

    loadTheme();
  }, [initialConfig]);

  const setConfig = (newConfig: ThemeConfig) => {
    setConfigState(newConfig);
    localStorage.setItem("themeConfig", JSON.stringify(newConfig));
  };

  const update = (path: string, value: unknown) => {
    setConfigState((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj: any = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  return (
    <EditingContext.Provider value={editing || { activeSection: null, onSelectSection: () => {} }}>
      <ThemeContext.Provider value={{ config, setConfig, update, isLoaded, activeSection: editing?.activeSection || null, onSelectSection: editing?.onSelectSection || (() => {}) }}>
        {children}
      </ThemeContext.Provider>
    </EditingContext.Provider>
  );
}

export function injectThemeCSS(config: ThemeConfig) {
  if (typeof document === "undefined") return;
  let style = document.getElementById("theme-vars") as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = "theme-vars";
    document.head.appendChild(style);
  }
  style.textContent = `
    :root {
      --theme-primary: ${config.colors.primary};
      --theme-accent: ${config.colors.accent};
      --theme-background: ${config.colors.background};
      --theme-text: ${config.colors.text};
      --theme-secondary-bg: ${config.colors.secondaryBg};
      --theme-heading-font: "${config.typography.headingFont}", serif;
      --theme-body-font: "${config.typography.bodyFont}", sans-serif;
      --theme-heading-size: ${config.typography.headingSize}px;
      --theme-body-size: ${config.typography.bodySize}px;
      --theme-logo-width: ${config.logo.width}px;
    }
  `;
}