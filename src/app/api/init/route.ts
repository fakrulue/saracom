import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.collectionProduct.deleteMany({});
    await prisma.collection.deleteMany({});
    await prisma.product.deleteMany({});
    
    const store = await prisma.store.upsert({
      where: { id: "default-store-id" },
      update: {},
      create: {
        id: "default-store-id",
        name: "Saracom Kids Fashion",
      },
    });

    const COLLECTIONS = [
      { title: "Newborn", handle: "newborn", description: "Adorable outfits for your newborn (0-3 months)", imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80" },
      { title: "Baby Boys", handle: "baby-boys", description: "Trendy fashion for baby boys (3-24 months)", imageUrl: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80" },
      { title: "Baby Girls", handle: "baby-girls", description: "Cute outfits for baby girls (3-24 months)", imageUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80" },
      { title: "Kids Boys", handle: "kids-boys", description: "Cool styles for boys (2-8 years)", imageUrl: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&q=80" },
      { title: "Kids Girls", handle: "kids-girls", description: "Pretty dresses and outfits for girls (2-8 years)", imageUrl: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80" },
      { title: "Sale", handle: "sale", description: "Up to 50% off on selected items", imageUrl: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80" },
    ];

    const COLLECTION_MAP: Record<string, string> = {};
    for (const c of COLLECTIONS) {
      const col = await prisma.collection.upsert({
        where: { storeId_handle: { storeId: store.id, handle: c.handle } },
        update: { description: c.description, imageUrl: c.imageUrl, status: "active" },
        create: {
          storeId: store.id,
          title: c.title,
          handle: c.handle,
          description: c.description,
          imageUrl: c.imageUrl,
          collectionType: "manual",
          status: "active",
        },
      });
      COLLECTION_MAP[c.handle] = col.id;
    }

    const PRODUCTS = [
      { title: "Organic Cotton Romper Set", handle: "organic-cotton-romper-set", price: 24.99, compareAtPrice: 34.99, vendor: "LittleComfort", productType: "Romper", tags: ["organic", "cotton", "newborn"], status: "active", collections: ["newborn"], image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80", description: "Soft organic cotton romper set perfect for newborn babies. Snap buttons for easy diaper changes." },
      { title: "Knitted Baby Beanie Set", handle: "knitted-baby-beanie-set", price: 14.99, compareAtPrice: null, vendor: "CozyBaby", productType: "Accessories", tags: ["knitted", "winter", "accessories"], status: "active", collections: ["newborn"], image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=80", description: "Hand-knitted beanie set in soft pastel colors. Includes matching mittens and booties." },
      { title: "Soft Cotton Baby Blanket", handle: "soft-cotton-baby-blanket", price: 29.99, compareAtPrice: null, vendor: "DreamyBaby", productType: "Blanket", tags: ["blanket", "cotton", "swaddle"], status: "active", collections: ["newborn"], image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80", description: "Ultra-soft cotton swaddle blanket. Perfect for swaddling and tummy time." },
      { title: "Striped Cotton Onesie Pack", handle: "striped-cotton-onesie-pack", price: 19.99, compareAtPrice: null, vendor: "BabyBasics", productType: "Onesie", tags: ["cotton", "basics", "pack"], status: "active", collections: ["baby-boys"], image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80", description: "Pack of 3 striped cotton onesies in navy and white. Available in sizes 3M-24M." },
      { title: "Denim Dungaree Set", handle: "denim-dungaree-set", price: 29.99, compareAtPrice: 39.99, vendor: "MiniTrend", productType: "Dungarees", tags: ["denim", "casual", "everyday"], status: "active", collections: ["baby-boys"], image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&q=80", description: "Classic denim dungarees with adjustable straps. Perfect for playtime and outings." },
      { title: "Hooded Towel Set", handle: "hooded-towel-set", price: 22.99, compareAtPrice: null, vendor: "SoftTouch", productType: "Bath", tags: ["towel", "bath", "set"], status: "active", collections: ["baby-boys"], image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=80", description: "Ultra-soft hooded towel set with animal designs. Includes washcloth and mitt." },
      { title: "Boys Plush Slippers", handle: "boys-plush-slippers", price: 16.99, compareAtPrice: null, vendor: "CozyFeet", productType: "Shoes", tags: ["slippers", "plush", "indoor"], status: "active", collections: ["baby-boys"], image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80", description: "Super soft plush slippers with anti-slip soles. Perfect for home wear." },
      { title: "Floral Print Dress Set", handle: "floral-print-dress-set", price: 27.99, compareAtPrice: 35.99, vendor: "LittleGlow", productType: "Dress", tags: ["floral", "cute", "party"], status: "active", collections: ["baby-girls"], image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80", description: "Beautiful floral print dress with ruffled hem. Perfect for special occasions." },
      { title: "Tutu Party Dress", handle: "tutu-party-dress", price: 32.99, compareAtPrice: null, vendor: "PrincessBaby", productType: "Dress", tags: ["tutu", "party", "sparkle"], status: "active", collections: ["baby-girls"], image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80", description: "Stunning tutu dress with sequin details. Makes every baby girl feel like a princess." },
      { title: "Bow Headband Set", handle: "bow-headband-set", price: 12.99, compareAtPrice: null, vendor: "SweetBows", productType: "Accessories", tags: ["bow", "headband", "accessories"], status: "active", collections: ["baby-girls"], image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80", description: "Set of 5 silk bow headbands in various colors. Gentle on delicate hair." },
      { title: "Girls Knit Booties", handle: "girls-knit-booties", price: 14.99, compareAtPrice: null, vendor: "CozyBaby", productType: "Shoes", tags: ["booties", "knit", "winter"], status: "active", collections: ["baby-girls"], image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80", description: "Adorable hand-knitted booties in soft pink. Keeps tiny toes warm." },
      { title: "Fleece Winter Jacket", handle: "fleece-winter-jacket", price: 39.99, compareAtPrice: 49.99, vendor: "WarmKids", productType: "Jacket", tags: ["winter", "fleece", "warm"], status: "active", collections: ["kids-boys"], image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&q=80", description: "Cozy fleece jacket with wind-resistant outer layer. Perfect for cold weather adventures." },
      { title: "Cargo Shorts Set", handle: "cargo-shorts-set", price: 21.99, compareAtPrice: null, vendor: "BoysZone", productType: "Shorts", tags: ["cargo", "casual", "summer"], status: "active", collections: ["kids-boys"], image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80", description: "Set of 2 cargo shorts with plenty of pockets. Durable cotton twill for active kids." },
      { title: "Graphic Tee 3-Pack", handle: "graphic-tee-3-pack", price: 17.99, compareAtPrice: null, vendor: "CoolKids", productType: "T-Shirt", tags: ["graphic", "pack", "basics"], status: "active", collections: ["kids-boys"], image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&q=80", description: "Fun graphic tee 3-pack with superhero and dinosaur designs. 100% organic cotton." },
      { title: "Leather Sandals", handle: "leather-sandals-kids", price: 34.99, compareAtPrice: null, vendor: "TinySteps", productType: "Shoes", tags: ["leather", "summer", "sandal"], status: "active", collections: ["kids-boys"], image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80", description: "Genuine leather sandals with cushioned insole. Adjustable straps for perfect fit." },
      { title: "Ruffle Sleeve Dress", handle: "ruffle-sleeve-dress", price: 28.99, compareAtPrice: 36.99, vendor: "GlamourGirl", productType: "Dress", tags: ["ruffle", "party", "elegant"], status: "active", collections: ["kids-girls"], image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80", description: "Elegant ruffle sleeve dress in soft pink. Perfect for parties and special events." },
      { title: "Denim Skirt with Bows", handle: "denim-skirt-with-bows", price: 24.99, compareAtPrice: null, vendor: "GirlPower", productType: "Skirt", tags: ["denim", "cute", "everyday"], status: "active", collections: ["kids-girls"], image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80", description: "Trendy denim skirt with decorative bow details. Versatile for any occasion." },
      { title: "Rainbow Knit Sweater", handle: "rainbow-knit-sweater", price: 31.99, compareAtPrice: null, vendor: "CozyKnits", productType: "Sweater", tags: ["knit", "rainbow", "cozy"], status: "active", collections: ["kids-girls"], image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80", description: "Hand-knitted rainbow-colored sweater. Soft acrylic blend, gentle on skin." },
      { title: "Butterfly Wing Backpack", handle: "butterfly-wing-backpack", price: 18.99, compareAtPrice: null, vendor: "FunKids", productType: "Accessories", tags: ["backpack", "butterfly", "school"], status: "active", collections: ["kids-girls"], image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80", description: "Adorable butterfly wing-shaped backpack. Perfect size for daycare and short trips." },
      { title: "Tutu Skirt Pack", handle: "tutu-skirt-pack", price: 22.99, compareAtPrice: null, vendor: "PrincessBaby", productType: "Skirt", tags: ["tutu", "sparkle", "party"], status: "active", collections: ["kids-girls"], image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80", description: "Pack of 2 layered tulle tutu skirts in pink and purple. Sparkly and fun!" },
      { title: "Cross-Strap Sandals", handle: "cross-strap-sandals-girls", price: 24.99, compareAtPrice: 32.99, vendor: "TinySteps", productType: "Shoes", tags: ["sandals", "summer", "strappy"], status: "active", collections: ["kids-girls"], image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80", description: "Beautiful cross-strap sandals with cushioned insole. Perfect for summer outings." },
    ];

    const PRODUCT_MAP: Record<string, string> = {};

    for (const p of PRODUCTS) {
      const product = await prisma.product.upsert({
        where: { storeId_handle: { storeId: store.id, handle: p.handle } },
        update: {
          title: p.title,
          description: p.description,
          vendor: p.vendor,
          productType: p.productType,
          tags: JSON.stringify(p.tags),
          status: p.status,
        },
        create: {
          storeId: store.id,
          title: p.title,
          handle: p.handle,
          description: p.description,
          vendor: p.vendor,
          productType: p.productType,
          tags: JSON.stringify(p.tags),
          status: p.status,
          media: {
            create: {
              url: p.image,
              alt: p.title,
              type: "image",
              position: 0,
            },
          },
          variants: {
            create: {
              title: "Default",
              price: p.price,
              compareAtPrice: p.compareAtPrice,
              sku: `SKU-${p.handle.toUpperCase().replace(/-/g, "")}`,
              barcode: `BC${Math.floor(Math.random() * 9000000000000 + 1000000000000)}`,
              inventoryQty: Math.floor(Math.random() * 80) + 10,
              position: 0,
            },
          },
        },
      });
      PRODUCT_MAP[p.handle] = product.id;
    }

    for (const p of PRODUCTS) {
      if (!COLLECTION_MAP[p.collections[0]] || !PRODUCT_MAP[p.handle]) continue;
      await prisma.collectionProduct.upsert({
        where: {
          collectionId_productId: {
            collectionId: COLLECTION_MAP[p.collections[0]],
            productId: PRODUCT_MAP[p.handle],
          },
        },
        update: {},
        create: {
          collectionId: COLLECTION_MAP[p.collections[0]],
          productId: PRODUCT_MAP[p.handle],
          position: 0,
        },
      });
    }

    const allProducts = await prisma.product.findMany({ where: { storeId: store.id } });
    const allCollections = await prisma.collection.findMany({ where: { storeId: store.id } });

    return NextResponse.json({
      message: "Database reset and seeded successfully",
      collections: allCollections.map(c => ({ id: c.id, title: c.title, handle: c.handle })),
      products: allProducts.map(p => ({ id: p.id, title: p.title, handle: p.handle })),
    });
  } catch (error: any) {
    console.error("Database initialization error:", error);
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
      name: error.name,
    }, { status: 500 });
  }
}