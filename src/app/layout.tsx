import type { Metadata } from "next";
import { Inter, Baloo_2 } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const baloo = Baloo_2({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ChildrenGoods | Joyful clothing for little ones",
    template: "%s | ChildrenGoods"
  },
  description: "Shop trendy, comfortable kids clothing from newborn to ten years. Free shipping on orders over ৳2000.",
  keywords: ["eCommerce", "Kids Clothing", "Baby Clothes", "ChildrenGoods"],
  authors: [{ name: "ChildrenGoods" }],
  creator: "ChildrenGoods",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://childrengoods.com",
    siteName: "ChildrenGoods",
    title: "ChildrenGoods - Joyful clothing for little ones",
    description: "Shop trendy, comfortable kids clothing from newborn to ten years.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChildrenGoods - Joyful clothing for little ones",
    description: "Shop trendy, comfortable kids clothing from newborn to ten years.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${baloo.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;600&family=Poppins:wght@400;600&family=Lora:wght@400;600&family=Merriweather:wght@400;700&family=Montserrat:wght@400;600&family=Nunito:wght@400;600&family=Open+Sans:wght@400;600&family=Roboto:wght@400;500&family=Source+Sans+Pro:wght@400;600&family=Oswald:wght@400;500&family=Raleway:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
