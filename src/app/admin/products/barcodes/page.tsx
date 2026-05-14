"use client";

import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import {
  Barcode,
  Search,
  Printer,
  Download,
  Settings2,
  Plus,
  Maximize2,
  Package,
  QrCode,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Variant = {
  id: string;
  title: string;
  sku: string | null;
  barcode: string | null;
  price: number;
};

type Product = {
  id: string;
  title: string;
  vendor: string | null;
  productType: string | null;
  media: { url: string }[];
  variants: Variant[];
};

export default function BarcodesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/v1/products")
      .then((r) => r.json())
      .then(({ data }) => setProducts(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    const match = p.title.toLowerCase().includes(search.toLowerCase());
    const variantMatch = p.variants.some(
      (v) =>
        v.sku?.toLowerCase().includes(search.toLowerCase()) ||
        v.barcode?.toLowerCase().includes(search.toLowerCase())
    );
    return match || variantMatch;
  });

  const totalBarcodes = products.reduce(
    (acc, p) => acc + p.variants.filter((v) => v.barcode).length,
    0
  );
  const totalMissing = products.reduce(
    (acc, p) => acc + p.variants.filter((v) => !v.barcode).length,
    0
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Barcode Management
            </h1>
            <p className="text-sm text-slate-500">
              Generate, print, and manage barcodes for your product inventory.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Settings2 className="w-4 h-4" />
              Settings
            </Button>
            <Button className="gap-2 shadow-sm">
              <Printer className="w-4 h-4" />
              Bulk Print Labels
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-none shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                <Barcode className="w-6 h-6 text-slate-700" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Total Barcodes
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {loading ? "—" : totalBarcodes}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                <Package className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Missing Barcodes
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {loading ? "—" : totalMissing}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <QrCode className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Total Variants
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {loading
                    ? "—"
                    : products.reduce((acc, p) => acc + p.variants.length, 0)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tools */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm group hover:ring-1 hover:ring-primary/20 transition-all cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900">
                <Barcode className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold">Auto-Generate</p>
                <p className="text-xs text-slate-500">Assign missing barcodes</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm group hover:ring-1 hover:ring-primary/20 transition-all cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900">
                <Maximize2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold">Quick Scan</p>
                <p className="text-xs text-slate-500">Lookup product by scanning</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm group hover:ring-1 hover:ring-primary/20 transition-all cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold">QR Codes</p>
                <p className="text-xs text-slate-500">Generate for marketing</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Barcodes List */}
        <Card className="border-none shadow-sm">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="text-lg">
                Product Barcodes
                {loading && <span className="ml-2 text-sm font-normal text-slate-400">Loading...</span>}
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by product, SKU or barcode..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filtered.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                  <Barcode className="w-8 h-8" />
                </div>
                <p className="text-lg font-semibold text-slate-900">
                  {search ? "No matching barcodes found" : "No products yet"}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {search
                    ? "Try a different search term."
                    : "Products with variants will appear here."}
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {filtered.map((product) =>
                  product.variants.map((variant) => (
                    <div
                      key={variant.id}
                      className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden">
                          {product.media?.[0]?.url ? (
                            <img
                              src={product.media[0].url}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {product.title}
                          </p>
                          {variant.title !== "Default" && (
                            <p className="text-xs text-slate-500">{variant.title}</p>
                          )}
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                            {variant.sku || "No SKU"}
                          </p>
                        </div>
                      </div>

                      <div className="flex-1 max-w-sm">
                        <div className="bg-white border rounded-xl p-4 flex flex-col items-center gap-2 relative">
                          {variant.barcode ? (
                            <>
                              <Barcode className="w-32 h-12 text-slate-900 opacity-80" />
                              <p className="text-[10px] font-mono tracking-[0.3em] text-slate-500">
                                {variant.barcode}
                              </p>
                            </>
                          ) : (
                            <div className="flex flex-col items-center gap-2 py-4">
                              <div className="w-32 h-12 bg-slate-100 rounded flex items-center justify-center text-slate-400 text-xs font-medium">
                                No barcode
                              </div>
                              <Badge variant="destructive" className="text-[10px]">
                                Missing
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right mr-4">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Price
                          </p>
                          <p className="text-sm font-bold text-slate-900">
                            ${variant.price.toFixed(2)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          disabled={!variant.barcode}
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Print
                        </Button>
                        <Button variant="ghost" size="icon" className="text-slate-400">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}