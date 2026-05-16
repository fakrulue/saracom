"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  X,
  Loader2,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { generateBarcodeSVG as genBarcodeSVG, svgToPng, downloadPng, printBarcode, printBulkLabels, generateQRCode } from "@/lib/barcode";

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
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<{ barcode: string; productTitle: string; variantTitle: string } | null>(null);
  const [printQty, setPrintQty] = useState(1);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [previewSvg, setPreviewSvg] = useState("");
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showBulkPrintModal, setShowBulkPrintModal] = useState(false);
  const [showAutoGenerateModal, setShowAutoGenerateModal] = useState(false);
  const [showQuickScanModal, setShowQuickScanModal] = useState(false);
  const [showQrCodeModal, setShowQrCodeModal] = useState(false);
  const [bulkPrintItems, setBulkPrintItems] = useState<{ productId: string; variantId: string; productTitle: string; variantTitle: string; barcode: string; quantity: number; selected: boolean }[]>([]);
  const [scanBarcode, setScanBarcode] = useState("");
  const [scannedProduct, setScannedProduct] = useState<any>(null);
  const [generating, setGenerating] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);
  const [printerSettings, setPrinterSettings] = useState({
    labelSize: "medium",
    paperSize: "thermal",
    barcodeWidth: 2,
    barcodeHeight: 50,
    showProductName: true,
    showPrice: true,
    showSku: true,
    columns: 1,
  });

  useEffect(() => {
    fetch("/api/v1/products")
      .then((r) => r.json())
      .then(({ data }) => setProducts(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleScan = () => {
    if (!scanBarcode.trim()) return;
    const found = products.find(p => 
      p.variants.some(v => v.barcode === scanBarcode)
    );
    setScannedProduct(found || null);
  };

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
            <Button variant="outline" className="gap-2" onClick={() => setShowSettingsModal(true)}>
              <Settings2 className="w-4 h-4" />
              Settings
            </Button>
            <Button className="gap-2 shadow-sm" onClick={() => {
              const itemsWithBarcodes = products.flatMap(p => 
                p.variants.filter(v => v.barcode).map(v => ({
                  productId: p.id,
                  variantId: v.id,
                  productTitle: p.title,
                  variantTitle: v.title,
                  barcode: v.barcode!,
                  quantity: 1,
                  selected: false
                }))
              );
              setBulkPrintItems(itemsWithBarcodes);
              setShowBulkPrintModal(true);
            }}>
              <Printer className="w-4 h-4" />
              Bulk Print Labels
            </Button>
          </div>
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card 
            className="border-none shadow-sm group hover:ring-1 hover:ring-primary/20 transition-all cursor-pointer"
            onClick={() => setShowAutoGenerateModal(true)}
          >
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
          <Card 
            className="border-none shadow-sm group hover:ring-1 hover:ring-primary/20 transition-all cursor-pointer"
            onClick={() => { setScannedProduct(null); setScanBarcode(""); setShowQuickScanModal(true); }}
          >
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
          <Card 
            className="border-none shadow-sm group hover:ring-1 hover:ring-primary/20 transition-all cursor-pointer"
            onClick={() => setShowQrCodeModal(true)}
          >
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
                          onClick={async () => {
                            const svg = await genBarcodeSVG(variant.barcode, 2, 50);
                            setPreviewSvg(svg);
                            setSelectedVariant({
                              barcode: variant.barcode,
                              productTitle: product.title,
                              variantTitle: variant.title
                            });
                            setPrintQty(1);
                            setShowPrintModal(true);
                          }}
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Print
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-slate-400"
                          disabled={!variant.barcode || downloading === variant.id}
                          onClick={async () => {
                            if (!variant.barcode) return;
                            setDownloading(variant.id);
                            try {
                              const svg = await genBarcodeSVG(variant.barcode);
                              const png = await svgToPng(svg);
                              downloadPng(png, `${product.title}-${variant.title || 'default'}-barcode.png`);
                            } catch (err) {
                              console.error("Download failed", err);
                            } finally {
                              setDownloading(null);
                            }
                          }}
                        >
                          {downloading === variant.id ? (
                            <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
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

      {showPrintModal && selectedVariant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-bold">Print Barcode Label</h2>
              <button 
                onClick={() => {
                  setShowPrintModal(false);
                  setSelectedVariant(null);
                  setPrintQty(1);
                }}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm font-bold text-slate-900">{selectedVariant.productTitle}</p>
                <p className="text-xs text-slate-500">{selectedVariant.variantTitle !== "Default" ? selectedVariant.variantTitle : "Default Variant"}</p>
                <div className="mt-3 p-3 bg-white rounded-lg border flex justify-center">
                  <div 
                    dangerouslySetInnerHTML={{ __html: previewSvg }} 
                    className="barcode-preview"
                  />
                </div>
                <p className="text-center text-xs font-mono text-slate-500 mt-2">{selectedVariant.barcode}</p>
              </div>

              <div className="space-y-2">
                <Label>Number of Labels</Label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={printQty}
                  onChange={(e) => setPrintQty(Math.max(1, parseInt(e.target.value) || 1))}
                />
                <p className="text-xs text-slate-500">How many labels to print?</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t bg-slate-50/50 rounded-b-2xl">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowPrintModal(false);
                  setSelectedVariant(null);
                  setPrintQty(1);
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  printBarcode(
                    selectedVariant.barcode, 
                    selectedVariant.productTitle, 
                    selectedVariant.variantTitle, 
                    printQty,
                    printerSettings
                  );
                  setShowPrintModal(false);
                  setSelectedVariant(null);
                  setPrintQty(1);
                }}
                className="gap-2"
              >
                <Printer className="w-4 h-4" />
                Print {printQty} Label{printQty > 1 ? 's' : ''}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showBulkPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-bold">Bulk Print Labels</h2>
              <button 
                onClick={() => setShowBulkPrintModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-6">
              {bulkPrintItems.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <Barcode className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>No products with barcodes found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-3 px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider border-b">
                    <div className="col-span-1">
                      <input 
                        type="checkbox"
                        checked={bulkPrintItems.every(i => i.selected)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setBulkPrintItems(prev => prev.map(i => ({ ...i, selected: checked })));
                        }}
                        className="w-4 h-4 rounded border-slate-300"
                      />
                    </div>
                    <div className="col-span-4">Product</div>
                    <div className="col-span-2">Variant</div>
                    <div className="col-span-2">Barcode</div>
                    <div className="col-span-3">Qty</div>
                  </div>
                  {bulkPrintItems.map((item, index) => (
                    <div key={`${item.productId}-${item.variantId}`} className={`grid grid-cols-12 gap-3 px-4 py-3 border rounded-lg items-center ${item.selected ? 'bg-primary/5 border-primary/30' : 'hover:bg-slate-50'}`}>
                      <div className="col-span-1">
                        <input 
                          type="checkbox"
                          checked={item.selected}
                          onChange={(e) => {
                            setBulkPrintItems(prev => prev.map((i, idx) => 
                              idx === index ? { ...i, selected: e.target.checked } : i
                            ));
                          }}
                          className="w-4 h-4 rounded border-slate-300"
                        />
                      </div>
                      <div className="col-span-4">
                        <p className="text-sm font-bold text-slate-900 truncate">{item.productTitle}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-slate-500">{item.variantTitle !== "Default" ? item.variantTitle : "—"}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs font-mono text-slate-600 truncate">{item.barcode}</p>
                      </div>
                      <div className="col-span-3">
                        <Input 
                          type="number"
                          min="0"
                          value={item.quantity}
                          disabled={!item.selected}
                          onChange={(e) => {
                            const qty = Math.max(0, parseInt(e.target.value) || 0);
                            setBulkPrintItems(prev => prev.map((i, idx) => 
                              idx === index ? { ...i, quantity: qty } : i
                            ));
                          }}
                          className="h-8 text-center"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 flex items-center justify-between px-4 py-3 bg-slate-50 rounded-lg">
                <div className="text-sm">
                  <span className="text-slate-500">Selected: </span>
                  <span className="font-bold text-slate-900">
                    {bulkPrintItems.filter(i => i.selected).length} items
                  </span>
                  <span className="text-slate-400 mx-2">|</span>
                  <span className="text-slate-500">Total Labels: </span>
                  <span className="font-bold text-slate-900">
                    {bulkPrintItems.filter(i => i.selected).reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setBulkPrintItems(prev => prev.map(i => ({ ...i, selected: false })))}
                  >
                    Deselect All
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setBulkPrintItems(prev => prev.map(i => ({ ...i, quantity: 1 })))}
                  >
                    Reset Qty
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-between px-6 py-4 border-t bg-slate-50/50 rounded-b-2xl">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Paper: {printerSettings.paperSize.toUpperCase()}</span>
                <span>|</span>
                <span>Label: {printerSettings.labelSize}</span>
                <span>|</span>
                <span>Cols: {printerSettings.columns}</span>
                <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => setShowSettingsModal(true)}>
                  Change
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowBulkPrintModal(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={async () => {
                    const selectedItems = bulkPrintItems.filter(item => item.selected && item.quantity > 0);
                    if (selectedItems.length === 0) return;
                    
                    const allLabels: { barcode: string; productTitle: string; variantTitle: string }[] = [];
                    for (const item of selectedItems) {
                      for (let i = 0; i < item.quantity; i++) {
                        allLabels.push({
                          barcode: item.barcode,
                          productTitle: item.productTitle,
                          variantTitle: item.variantTitle
                        });
                      }
                    }
                    
                    await printBulkLabels(allLabels, printerSettings);
                    setShowBulkPrintModal(false);
                  }}
                  className="gap-2"
                  disabled={bulkPrintItems.filter(i => i.selected).length === 0}
                >
                  <Printer className="w-4 h-4" />
                  Print Selected Labels
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAutoGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-bold">Auto-Generate Barcodes</h2>
              <button 
                onClick={() => setShowAutoGenerateModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Barcode className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Missing Barcodes</p>
                    <p className="text-2xl font-bold text-slate-900">{totalMissing}</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-500">
                This will generate unique barcodes for all products that don't have one yet.
              </p>
              {generatedCount > 0 && (
                <div className="p-3 bg-emerald-50 rounded-lg flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm text-emerald-700 font-medium">Generated {generatedCount} barcodes!</span>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t bg-slate-50/50 rounded-b-2xl">
              <Button variant="outline" onClick={() => { setGeneratedCount(0); setShowAutoGenerateModal(false); }}>
                Close
              </Button>
              <Button 
                disabled={generating || totalMissing === 0}
                onClick={async () => {
                  setGenerating(true);
                  let count = 0;
                  for (const product of products) {
                    for (const variant of product.variants) {
                      if (!variant.barcode) {
                        const newBarcode = variant.sku || `${product.id.slice(0, 8)}${variant.id.slice(0, 4)}`;
                        try {
                          await fetch(`/api/v1/variants/${variant.id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ barcode: newBarcode })
                          });
                          count++;
                        } catch (e) {
                          console.error("Failed to update barcode", e);
                        }
                      }
                    }
                  }
                  setGeneratedCount(count);
                  setGenerating(false);
                  const res = await fetch("/api/v1/products");
                  const { data } = await res.json();
                  setProducts(data || []);
                }}
              >
                {generating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Generate {totalMissing} Barcodes
              </Button>
            </div>
          </div>
        </div>
      )}

      {showQuickScanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-bold">Quick Scan</h2>
              <button 
                onClick={() => setShowQuickScanModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Scan or Enter Barcode</Label>
                <div className="flex gap-2">
                  <Input 
                    value={scanBarcode}
                    onChange={(e) => setScanBarcode(e.target.value)}
                    placeholder="Enter barcode..."
                    onKeyDown={(e) => e.key === "Enter" && handleScan()}
                  />
                  <Button onClick={handleScan}>
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {scannedProduct && (
                <div className="p-4 border rounded-lg bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg bg-slate-200 overflow-hidden">
                      {scannedProduct.media?.[0]?.url ? (
                        <img src={scannedProduct.media[0].url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-6 h-6 m-auto text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900">{scannedProduct.title}</p>
                      <p className="text-xs text-slate-500">{scannedProduct.variants?.length} variants</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => router.push(`/admin/products/${scannedProduct.handle}`)}>
                      Edit Product
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => { setScannedProduct(null); setScanBarcode(""); }}>
                      Clear
                    </Button>
                  </div>
                </div>
              )}

              {scanBarcode && !scannedProduct && (
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-600">No product found with this barcode</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showQrCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-bold">QR Codes</h2>
              <button 
                onClick={() => setShowQrCodeModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex-1 overflow-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.slice(0, 20).map(product => (
                  <div key={product.id} className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex justify-center mb-3">
                      <div 
                        className="w-24 h-24 bg-white flex items-center justify-center"
                        dangerouslySetInnerHTML={{ __html: generateQRCode(product.handle) }}
                      />
                    </div>
                    <p className="text-xs font-bold text-center truncate">{product.title}</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full mt-2"
                      onClick={async () => {
                        const svg = generateQRCode(product.handle);
                        const png = await svgToPng(svg);
                        downloadPng(png, `${product.title}-qrcode.png`);
                      }}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end px-6 py-4 border-t bg-slate-50/50 rounded-b-2xl">
              <Button onClick={() => setShowQrCodeModal(false)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-bold">Printer Settings</h2>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <Label>Label Size</Label>
                <Select 
                  value={printerSettings.labelSize}
                  onValueChange={(v) => setPrinterSettings({...printerSettings, labelSize: v})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (25mm x 12mm)</SelectItem>
                    <SelectItem value="medium">Medium (38mm x 25mm)</SelectItem>
                    <SelectItem value="large">Large (50mm x 25mm)</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Paper Size</Label>
                <Select 
                  value={printerSettings.paperSize}
                  onValueChange={(v) => setPrinterSettings({...printerSettings, paperSize: v})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="thermal">Thermal (4" x 6")</SelectItem>
                    <SelectItem value="a4">A4 Sheet</SelectItem>
                    <SelectItem value="letter">Letter (8.5" x 11")</SelectItem>
                    <SelectItem value="50mm">50mm Roll</SelectItem>
                    <SelectItem value="70mm">70mm Roll</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Barcode Width</Label>
                  <Input 
                    type="number" 
                    min="1" 
                    max="5" 
                    value={printerSettings.barcodeWidth}
                    onChange={(e) => setPrinterSettings({...printerSettings, barcodeWidth: parseFloat(e.target.value) || 2})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Barcode Height</Label>
                  <Input 
                    type="number" 
                    min="20" 
                    max="150" 
                    value={printerSettings.barcodeHeight}
                    onChange={(e) => setPrinterSettings({...printerSettings, barcodeHeight: parseInt(e.target.value) || 50})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Columns per Page</Label>
                <Select 
                  value={String(printerSettings.columns)}
                  onValueChange={(v) => setPrinterSettings({...printerSettings, columns: parseInt(v)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Column</SelectItem>
                    <SelectItem value="2">2 Columns</SelectItem>
                    <SelectItem value="3">3 Columns</SelectItem>
                    <SelectItem value="4">4 Columns</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 pt-2">
                <Label className="text-sm font-medium">Display Options</Label>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={printerSettings.showProductName}
                      onChange={(e) => setPrinterSettings({...printerSettings, showProductName: e.target.checked})}
                      className="w-4 h-4 rounded border-slate-300 text-primary"
                    />
                    <span className="text-sm">Show Product Name</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={printerSettings.showPrice}
                      onChange={(e) => setPrinterSettings({...printerSettings, showPrice: e.target.checked})}
                      className="w-4 h-4 rounded border-slate-300 text-primary"
                    />
                    <span className="text-sm">Show Price</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={printerSettings.showSku}
                      onChange={(e) => setPrinterSettings({...printerSettings, showSku: e.target.checked})}
                      className="w-4 h-4 rounded border-slate-300 text-primary"
                    />
                    <span className="text-sm">Show SKU</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t bg-slate-50/50 rounded-b-2xl">
              <Button variant="outline" onClick={() => setShowSettingsModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowSettingsModal(false)}>
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}