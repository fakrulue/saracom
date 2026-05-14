import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { listProducts, listCategories } from "@/lib/products.functions";
import { ProductCard } from "@/components/shop/ProductCard";

const searchSchema = z.object({
  flag: z.enum(["new", "best_seller", "sale"]).optional(),
  sort: z.enum(["newest", "price-asc", "price-desc", "rating"]).optional(),
});

export const Route = createFileRoute("/collections/$handle")({
  validateSearch: searchSchema,
  component: CollectionPage,
  head: ({ params }) => ({
    meta: [
      { title: `${titleize(params.handle)} — ChildrenGoods` },
      { name: "description", content: `Shop ${titleize(params.handle)} clothing for little ones at ChildrenGoods.` },
    ],
  }),
});

function titleize(h: string) { return h === "all" ? "All products" : h.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" "); }

function CollectionPage() {
  const { handle } = Route.useParams();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const fetchProducts = useServerFn(listProducts);
  const fetchCats = useServerFn(listCategories);
  const cats = useQuery({ queryKey: ["cats"], queryFn: () => fetchCats() });
  const products = useQuery({
    queryKey: ["products", handle, search],
    queryFn: () => fetchProducts({ data: { category: handle, flag: search.flag, sort: search.sort } }),
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav className="mb-3 text-xs text-muted-foreground">
        <Link to="/" className="hover:underline">Home</Link> / <span className="text-foreground">{titleize(handle)}</span>
      </nav>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">{titleize(handle)}</h1>
        <select
          className="rounded-full border-2 px-4 py-2 text-sm font-semibold"
          value={search.sort ?? "newest"}
          onChange={(e) => navigate({ search: (s: typeof search) => ({ ...s, sort: e.target.value as typeof search.sort }) })}
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="rating">Top rated</option>
        </select>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <FilterChip to="/collections/all" active={handle === "all"} label="All" />
        {(cats.data ?? []).map((c) => (
          <FilterChip key={c.id} to={`/collections/${c.handle}` as const} active={c.handle === handle} label={c.name} />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {products.isLoading
          ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-square animate-pulse rounded-2xl bg-muted" />)
          : (products.data ?? []).map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      {!products.isLoading && (products.data?.length ?? 0) === 0 && (
        <p className="py-16 text-center text-muted-foreground">No products found.</p>
      )}
    </div>
  );
}

function FilterChip({ to, active, label }: { to: string; active: boolean; label: string }) {
  return (
    <Link
      to={to}
      className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
        active ? "bg-brand-pink text-white" : "bg-muted hover:bg-brand-mint"
      }`}
    >
      {label}
    </Link>
  );
}
