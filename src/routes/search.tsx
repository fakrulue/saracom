import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Search as SearchIcon } from "lucide-react";
import { listProducts } from "@/lib/products.functions";
import { ProductCard } from "@/components/shop/ProductCard";

export const Route = createFileRoute("/search")({
  component: Search,
  head: () => ({ meta: [{ title: "Search — ChildrenGoods" }] }),
});

function Search() {
  const [q, setQ] = useState("");
  const fetchProducts = useServerFn(listProducts);
  const { data } = useQuery({ queryKey: ["all-products"], queryFn: () => fetchProducts({ data: {} }) });
  const results = useMemo(() => {
    if (!q.trim()) return data ?? [];
    const t = q.toLowerCase();
    return (data ?? []).filter((p) => p.title.toLowerCase().includes(t) || p.description?.toLowerCase().includes(t));
  }, [q, data]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold">Search</h1>
      <div className="mt-4 flex items-center gap-2 rounded-full border-2 px-4 py-3 focus-within:border-brand-pink">
        <SearchIcon size={18} className="text-muted-foreground" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search for products..."
          className="w-full bg-transparent text-sm focus:outline-none"
        />
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {results.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      {q && results.length === 0 && <p className="py-10 text-center text-muted-foreground">No results.</p>}
    </div>
  );
}
