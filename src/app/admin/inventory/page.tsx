"use client";

import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import {
  Package,
  Search,
  Filter,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCcw,
  History,
  FileDown,
  X,
  Plus,
  Minus,
  Printer,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { generateBarcodeSVG as genBarcodeSVG, printBarcode } from "@/lib/barcode";

type Variant = {
  id: string;
  title: string;
  sku: string | null;
  barcode: string | null;
  price: number;
  compareAtPrice: number | null;
  inventoryQty: number;
  position: number;
};

type Product = {
  id: string;
  title: string;
  handle: string;
  status: string;
  media: { url: string }[];
  variants: Variant[];
};

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [adjustmentType, setAdjustmentType] = useState<"add" | "remove" | "set">("set");
  const [adjustmentValue, setAdjustmentValue] = useState("");
  const [adjusting, setAdjusting] = useState(false);

  useEffect(() => {
    fetch("/api/v1/products")
      .then((r) => r.json())
      .then(({ data }) => setProducts(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const allVariants = products.flatMap((p) =>
    p.variants.map((v) => ({
      ...v,
      productTitle: p.title,
      productHandle: p.handle,
    }))
  );

  const filtered = allVariants.filter(
    (v) =>
      v.productTitle.toLowerCase().includes(search.toLowerCase()) ||
      (v.sku && v.sku.toLowerCase().includes(search.toLowerCase())) ||
      (v.barcode && v.barcode.toLowerCase().includes(search.toLowerCase()))
  );

  const getVariantStatus = (qty: number) => {
    if (qty === 0) return "out-of-stock";
    if (qty <= 10) return "low-stock";
    return "in-stock";
  };

  const totalUnits = allVariants.reduce((acc, v) => acc + v.inventoryQty, 0);
  const inStock = allVariants.filter((v) => v.inventoryQty > 10).length;
  const lowStock = allVariants.filter((v) => v.inventoryQty > 0 && v.inventoryQty <= 10).length;
  const outOfStock = allVariants.filter((v) => v.inventoryQty === 0).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Inventory Control
            </h1>
            <p className="text-sm text-slate-500">
              Track and manage your stock levels across all locations.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <History className="w-4 h-4" />
              Transfer Log
            </Button>
            <Button 
              className="shadow-sm gap-2"
              onClick={() => {
                if (allVariants.length > 0) {
                  setSelectedVariant(allVariants[0]);
                  setShowAdjustModal(true);
                }
              }}
            >
              <RefreshCcw className="w-4 h-4" />
              Update Stock
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Units"
            value={loading ? "—" : totalUnits.toLocaleString()}
            icon={Package}
            color="text-slate-600 bg-slate-100"
          />
          <StatCard
            title="In Stock"
            value={loading ? "—" : inStock.toString()}
            icon={CheckCircle2}
            color="text-emerald-600 bg-emerald-50"
          />
          <StatCard
            title="Low Stock"
            value={loading ? "—" : lowStock.toString()}
            icon={Clock}
            color="text-amber-600 bg-amber-50"
          />
          <StatCard
            title="Out of Stock"
            value={loading ? "—" : outOfStock.toString()}
            icon={AlertCircle}
            color="text-red-600 bg-red-50"
          />
        </div>

        <Card className="border-none shadow-sm">
          <div className="p-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search product, SKU or barcode..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9 gap-2">
                <FileDown className="w-3.5 h-3.5" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" className="h-9 gap-2">
                <Filter className="w-3.5 h-3.5" />
                Location
              </Button>
            </div>
          </div>

          {filtered.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                <Package className="w-8 h-8" />
              </div>
              <p className="text-lg font-semibold text-slate-900">
                {search ? "No matching variants found" : "No inventory items yet"}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                {search
                  ? "Try a different search term."
                  : "Products with variants will appear here."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-slate-50/50">
                  <TableHead>Product & SKU</TableHead>
                  <TableHead>Variant</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Available</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((v) => {
                  const status = getVariantStatus(v.inventoryQty);
                  return (
                    <TableRow
                      key={v.id}
                      className="group hover:bg-slate-50/50 cursor-pointer"
                    >
                      <TableCell>
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {v.productTitle}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                            {v.sku || "No SKU"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {v.title !== "Default" ? v.title : "—"}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500 font-mono">
                        {v.barcode || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "text-[10px] uppercase font-bold tracking-widest shadow-none",
                            status === "in-stock"
                              ? "bg-emerald-100 text-emerald-700"
                              : status === "low-stock"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-600"
                          )}
                        >
                          {status.replace("-", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-black text-slate-900">
                        {v.inventoryQty}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {v.barcode && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 gap-1"
                              onClick={async () => {
                                await printBarcode(v.barcode!, v.productTitle, v.title !== "Default" ? v.title : "", 1);
                              }}
                            >
                              <Printer className="w-3.5 h-3.5 text-slate-400" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-2"
                            onClick={() => {
                              setSelectedVariant(v);
                              setShowAdjustModal(true);
                            }}
                          >
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                            Adjust
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>

      {showAdjustModal && selectedVariant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-bold">Adjust Stock</h2>
              <button 
                onClick={() => {
                  setShowAdjustModal(false);
                  setAdjustmentValue("");
                }}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm font-bold text-slate-900">{selectedVariant.productTitle}</p>
                <p className="text-xs text-slate-500">{selectedVariant.title !== "Default" ? selectedVariant.title : "Default Variant"}</p>
                <p className="text-xs text-slate-400 mt-1">Current stock: <span className="font-bold text-slate-900">{selectedVariant.inventoryQty}</span></p>
              </div>

              <div className="space-y-2">
                <Label>Adjustment Type</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={adjustmentType === "set" ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => setAdjustmentType("set")}
                  >
                    Set
                  </Button>
                  <Button
                    type="button"
                    variant={adjustmentType === "add" ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => setAdjustmentType("add")}
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add
                  </Button>
                  <Button
                    type="button"
                    variant={adjustmentType === "remove" ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => setAdjustmentType("remove")}
                  >
                    <Minus className="w-3 h-3 mr-1" /> Remove
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min="0"
                  value={adjustmentValue}
                  onChange={(e) => setAdjustmentValue(e.target.value)}
                  placeholder={adjustmentType === "set" ? "New quantity" : "Amount to add/remove"}
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-sm">
                <p className="text-slate-500">New stock level:</p>
                <p className="text-xl font-bold text-slate-900">
                  {adjustmentType === "set" 
                    ? adjustmentValue || "—"
                    : adjustmentType === "add"
                      ? (parseInt(adjustmentValue) || 0) + selectedVariant.inventoryQty
                      : Math.max(0, selectedVariant.inventoryQty - (parseInt(adjustmentValue) || 0))
                  }
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t bg-slate-50/50 rounded-b-2xl">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAdjustModal(false);
                  setAdjustmentValue("");
                }}
              >
                Cancel
              </Button>
              <Button 
                disabled={adjusting || !adjustmentValue}
                onClick={async () => {
                  setAdjusting(true);
                  const value = parseInt(adjustmentValue);
                  let newQty = value;
                  if (adjustmentType === "add") newQty = selectedVariant.inventoryQty + value;
                  if (adjustmentType === "remove") newQty = Math.max(0, selectedVariant.inventoryQty - value);

                  try {
                    const res = await fetch(`/api/v1/variants/${selectedVariant.id}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ inventoryQty: newQty })
                    });
                    if (res.ok) {
                      setProducts(prev => prev.map(p => {
                        if (p.handle === selectedVariant.productHandle) {
                          return {
                            ...p,
                            variants: p.variants.map(v => 
                              v.id === selectedVariant.id 
                                ? { ...v, inventoryQty: newQty }
                                : v
                            )
                          };
                        }
                        return p;
                      }));
                      setShowAdjustModal(false);
                      setAdjustmentValue("");
                    }
                  } catch (err) {
                    console.error(err);
                  } finally {
                    setAdjusting(false);
                  }
                }}
              >
                {adjusting ? "Saving..." : "Save Adjustment"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  icon: any;
  color: string;
}) {
  const [iconColor, bgColor] = color.split(" ");
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-5 flex items-center gap-4">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", bgColor)}>
          <Icon className={cn("w-5 h-5", iconColor)} />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-xl font-bold text-slate-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}