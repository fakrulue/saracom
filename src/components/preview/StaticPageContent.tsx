"use client";

import { ThemeConfig, ClickableSection, useEditing } from "@/contexts/ThemeContext";

interface StaticPageContentProps {
  pageTitle?: string;
  config: ThemeConfig;
}

export function StaticPageContent({ pageTitle = "Page Title", config }: StaticPageContentProps) {
  const p = config.colors.primary;
  const t = config.colors.text;
  const sb = config.colors.secondaryBg;
  const hf = `"${config.typography.headingFont}", serif`;
  const { onSelectSection } = useEditing();

  return (
    <div onClick={() => onSelectSection("")}>
      <ClickableSection id={pageTitle?.toLowerCase().replace(/\s+/g, "-") || "static"}>
        <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl mb-4" style={{ fontFamily: hf, color: t }}>{pageTitle}</h1>
      <div className="space-y-4 text-muted-foreground">
        <p>Welcome to our page. This section contains important information about our company, products, and services.</p>
        <p>We are committed to providing the best experience for you and your little ones. Our clothing is designed with comfort, durability, and style in mind.</p>
        <p>If you have any questions, please feel free to contact us at any time. We are here to help!</p>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { title: "Our Mission", desc: "Providing quality clothing for children" },
          { title: "Contact Us", desc: "support@saracom.com" },
          { title: "Shipping", desc: "Free shipping over ৳2000" },
        ].map((item, i) => (
          <div key={i} className="rounded-2xl border p-4" style={{ background: sb }}>
            <h3 className="font-bold mb-1" style={{ color: t }}>{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
        </div>
      </ClickableSection>
    </div>
  );
}