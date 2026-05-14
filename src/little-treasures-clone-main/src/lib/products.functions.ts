import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const url = process.env.SUPABASE_URL ?? import.meta.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  return createClient<Database>(url!, key!, { auth: { persistSession: false } });
}

export const listCategories = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const { data, error } = await sb.from("categories").select("*").order("sort_order");
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const listProducts = createServerFn({ method: "GET" })
  .inputValidator((input: { category?: string; flag?: "new" | "best_seller" | "sale"; limit?: number; sort?: string } | undefined) => input ?? {})
  .handler(async ({ data }) => {
    const sb = publicClient();
    let q = sb.from("products").select("*, categories(handle, name)");
    if (data.category && data.category !== "all") {
      const { data: cat } = await sb.from("categories").select("id").eq("handle", data.category).maybeSingle();
      if (cat) q = q.eq("category_id", cat.id);
    }
    if (data.flag === "new") q = q.eq("is_new", true);
    if (data.flag === "best_seller") q = q.eq("is_best_seller", true);
    if (data.flag === "sale") q = q.eq("is_sale", true);
    switch (data.sort) {
      case "price-asc": q = q.order("price", { ascending: true }); break;
      case "price-desc": q = q.order("price", { ascending: false }); break;
      case "rating": q = q.order("rating", { ascending: false }); break;
      default: q = q.order("created_at", { ascending: false });
    }
    if (data.limit) q = q.limit(data.limit);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((input: { handle: string }) => input)
  .handler(async ({ data }) => {
    const sb = publicClient();
    const { data: product, error } = await sb
      .from("products")
      .select("*, categories(handle, name), product_variants(*)")
      .eq("handle", data.handle)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!product) return null;
    const { data: related } = await sb
      .from("products")
      .select("*")
      .neq("id", product.id)
      .eq("category_id", product.category_id ?? "")
      .limit(4);
    return { product, related: related ?? [] };
  });
