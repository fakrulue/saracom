"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  title: string;
  vendor: string | null;
  productType: string | null;
  status: string;
}

interface ProductPickerProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export function ProductPicker({ selectedIds, onChange }: ProductPickerProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/products?search=${encodeURIComponent(search)}`);
        const { data } = await res.json();
        setProducts(data || []);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const toggleProduct = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((i) => i !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-2 py-2">
          {selectedIds.map((id) => {
            const product = products.find((p) => p.id === id);
            return (
              <Badge key={id} variant="secondary" className="flex items-center gap-1 pl-2 pr-1 py-1">
                {product?.title || id}
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-4 h-4 rounded-full"
                  onClick={() => toggleProduct(id)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}

      <ScrollArea className="h-[300px] border rounded-lg">
        <div className="p-1">
          {products.map((product) => {
            const isSelected = selectedIds.includes(product.id);
            return (
              <div
                key={product.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors hover:bg-slate-50",
                  isSelected && "bg-slate-50"
                )}
                onClick={() => toggleProduct(product.id)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{product.title}</p>
                  <p className="text-xs text-slate-500">
                    {product.vendor || "No vendor"} • {product.productType || "No type"}
                  </p>
                </div>
                {isSelected && <Check className="w-4 h-4 text-primary" />}
              </div>
            );
          })}
          {products.length === 0 && !loading && (
            <div className="p-8 text-center text-slate-500 text-sm">
              No products found
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="text-xs text-slate-500 text-right">
        {selectedIds.length} products selected
      </div>
    </div>
  );
}
