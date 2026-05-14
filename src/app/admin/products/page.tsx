"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import {
  Plus,
  Search,
  MoreHorizontal,
  Filter,
  Package,
  Copy,
  Trash2,
  Edit,
  ImageIcon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  draft: "bg-slate-100 text-slate-600",
  archived: "bg-red-100 text-red-600",
};

type Product = {
  id: string;
  handle: string;
  title: string;
  status: string;
  vendor: string | null;
  productType: string | null;
  media: { url: string }[];
  variants: { inventoryQty: number }[];
};

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/v1/products")
      .then((r) => r.json())
      .then(({ data }) => setProducts(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`/api/v1/products/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };

  const filtered = products.filter(
    (p) =>
      (filter === "all" || p.status === filter) &&
      (p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.handle.toLowerCase().includes(search.toLowerCase()) ||
        (p.vendor && p.vendor.toLowerCase().includes(search.toLowerCase())))
  );

  const stats = [
    { label: "Total Products", value: products.length },
    {
      label: "Active",
      value: products.filter((p) => p.status === "active").length,
    },
    { label: "Draft", value: products.filter((p) => p.status === "draft").length },
    {
      label: "Archived",
      value: products.filter((p) => p.status === "archived").length,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Products
            </h1>
            <p className="text-sm text-slate-500">
              Manage your catalog, pricing, and product details.
            </p>
          </div>
          <Link href="/admin/products/new">
            <Button className="shadow-sm shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" />
              Add product
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card key={s.label} className="border-none shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  {s.label}
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {loading ? "—" : s.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-none shadow-sm">
          <div className="flex items-center gap-1 px-4 pt-4 border-b overflow-x-auto">
            {["all", "active", "draft", "archived"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-t-lg capitalize whitespace-nowrap transition-colors border-b-2 -mb-px",
                  filter === tab
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-4 flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-slate-50/50">
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Inventory</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((product) => (
                <TableRow
                  key={product.id}
                  className="cursor-pointer group hover:bg-slate-50/50"
                  onClick={() => router.push(`/admin/products/${product.handle}`)}
                >
                  <TableCell>
                    <div className="w-12 h-12 rounded-lg border bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden">
                      {product.media?.[0]?.url ? (
                        <img
                          src={product.media[0].url}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-5 h-5" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {product.title}
                      </p>
                      {product.variants?.length > 0 && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          {product.variants.length} variant
                          {product.variants.length !== 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "capitalize text-xs shadow-none font-medium",
                        STATUS_CONFIG[product.status] || STATUS_CONFIG.draft
                      )}
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {product.variants?.reduce(
                      (acc, v) => acc + (v.inventoryQty || 0),
                      0
                    ) || 0}{" "}
                    in stock
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {product.productType || "—"}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {product.vendor || "—"}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/admin/products/${product.handle}`)
                          }
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={(e) => handleDelete(product.id, e)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}

              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <Package className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-900">
                          No products found
                        </p>
                        <p className="text-sm text-slate-500">
                          {search
                            ? "Try a different search."
                            : "Start by adding your first product."}
                        </p>
                      </div>
                      {!search && (
                        <Link href="/admin/products/new">
                          <Button size="sm" variant="outline">
                            Add product
                          </Button>
                        </Link>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {loading && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-40 text-center text-slate-400 text-sm"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {filtered.length > 0 && (
            <div className="px-4 py-4 border-t flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Showing {filtered.length} of {products.length} products
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}