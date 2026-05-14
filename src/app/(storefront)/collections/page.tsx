import React from "react";
import prisma from "@/lib/prisma";
import { StorefrontLayout } from "@/components/storefront/layout";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const COLLECTION_DESCRIPTIONS: Record<string, string> = {
  newborn: "Adorable outfits for your newborn (0-3 months)",
  "baby-boys": "Trendy fashion for baby boys (3-24 months)",
  "baby-girls": "Cute outfits for baby girls (3-24 months)",
  "kids-boys": "Cool styles for boys (2-8 years)",
  "kids-girls": "Pretty dresses and outfits for girls (2-8 years)",
};

const COLLECTION_IMAGES: Record<string, string> = {
  newborn: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80",
  "baby-boys": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80",
  "baby-girls": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80",
  "kids-boys": "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&q=80",
  "kids-girls": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80",
};

export default async function CollectionsListPage() {
  const collections = await prisma.collection.findMany({
    where: { status: "active", storeId: "default-store-id" },
    include: { _count: { select: { products: true } } },
    orderBy: { title: "asc" },
  });

  const displayCollections = collections.length > 0 ? collections : [
    { id: "newborn", title: "Newborn", handle: "newborn", description: COLLECTION_DESCRIPTIONS.newborn, _count: { products: 2 }, imageUrl: COLLECTION_IMAGES.newborn },
    { id: "baby-boys", title: "Baby Boys", handle: "baby-boys", description: COLLECTION_DESCRIPTIONS["baby-boys"], _count: { products: 4 }, imageUrl: COLLECTION_IMAGES["baby-boys"] },
    { id: "baby-girls", title: "Baby Girls", handle: "baby-girls", description: COLLECTION_DESCRIPTIONS["baby-girls"], _count: { products: 3 }, imageUrl: COLLECTION_IMAGES["baby-girls"] },
    { id: "kids-boys", title: "Kids Boys", handle: "kids-boys", description: COLLECTION_DESCRIPTIONS["kids-boys"], _count: { products: 4 }, imageUrl: COLLECTION_IMAGES["kids-boys"] },
    { id: "kids-girls", title: "Kids Girls", handle: "kids-girls", description: COLLECTION_DESCRIPTIONS["kids-girls"], _count: { products: 4 }, imageUrl: COLLECTION_IMAGES["kids-girls"] },
  ];

  return (
    <StorefrontLayout>
      <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
        <div className="container mx-auto px-6 mb-16">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">Our Collections</h1>
            <p className="text-lg text-slate-500 leading-relaxed">
              Explore our curated universes. From seasonal essentials to timeless masterpieces, discover the story behind every piece.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayCollections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.handle}`}
                className="group relative h-[500px] bg-white overflow-hidden"
              >
                <div className="absolute inset-0 bg-slate-200 overflow-hidden">
                  <img
                    src={collection.imageUrl || COLLECTION_IMAGES[collection.handle as keyof typeof COLLECTION_IMAGES] || "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80"}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    alt={collection.title}
                  />
                </div>
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/30 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-10">
                  <Badge className="bg-white/20 backdrop-blur-sm text-white border-none rounded-none text-[10px] uppercase tracking-widest mb-4">
                    {collection._count.products} Items
                  </Badge>
                  <h3 className="text-3xl font-bold tracking-tighter mb-2 group-hover:translate-x-2 transition-transform duration-500 flex items-center gap-4">
                    {collection.title} <ArrowRight className="w-6 h-6 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500" />
                  </h3>
                  <p className="text-sm text-white/70 line-clamp-2 max-w-xs transition-opacity duration-500 group-hover:opacity-100 opacity-0">
                    {collection.description || "Discover the latest trends and timeless classics in this exclusive collection."}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}