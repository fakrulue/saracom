"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { 
  ChevronLeft, 
  Globe, 
  Image as ImageIcon, 
  Plus, 
  Save, 
  Trash2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { VariantMatrixEditor } from "@/components/admin/products/variant-matrix-editor";
import { MediaManager } from "@/components/admin/MediaManager";
import { cn } from "@/lib/utils";

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVariants, setHasVariants] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [media, setMedia] = useState<any[]>([]);
  const [showMediaBrowser, setShowMediaBrowser] = useState(false);

  // Basic Form State (manual for simplicity in this demo)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    vendor: "Saracom",
    productType: "",
    status: "active",
    price: "0.00",
    compareAtPrice: "",
    inventoryQty: "0",
    sku: "",
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      options: hasVariants ? options : [],
      variants: hasVariants ? variants : [{
        title: "Default Variant",
        price: formData.price,
        compareAtPrice: formData.compareAtPrice,
        inventoryQty: formData.inventoryQty,
        sku: formData.sku
      }],
      media
    };

    try {
      const res = await fetch("/api/v1/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/products");
      }
    } catch (error) {
      console.error("Failed to create product", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <form onSubmit={onSubmit} className="max-w-6xl mx-auto space-y-8 pb-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              type="button" 
              variant="outline" 
              size="icon" 
              className="rounded-full w-8 h-8"
              onClick={() => router.back()}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Add product</h1>
              <p className="text-sm text-slate-500">Create a new product with multiple variants and rich media.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Discard</Button>
            <Button type="submit" disabled={isSubmitting} className="shadow-lg shadow-primary/20">
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Saving..." : "Save Product"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Description */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    placeholder="Short Sleeve T-Shirt" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Provide details about the product..." 
                    className="min-h-[200px]"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Media */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Media</CardTitle>
                <CardDescription>Upload images and videos to showcase your product.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {media.map((item, index) => (
                    <div key={index} className="group relative aspect-square rounded-lg overflow-hidden border border-slate-200">
                      <img src={item.url} alt={item.alt || ""} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setMedia(media.filter((_, i) => i !== index))}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <div 
                    onClick={() => setShowMediaBrowser(true)}
                    className="aspect-square rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <Plus className="w-6 h-6 text-slate-400 mb-2" />
                    <span className="text-xs font-medium text-slate-500">Add Image</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing (If no variants) */}
            {!hasVariants && (
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Pricing</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                      <Input 
                        id="price" 
                        placeholder="0.00" 
                        className="pl-7"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="compareAtPrice">Compare at price</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                      <Input 
                        id="compareAtPrice" 
                        placeholder="0.00" 
                        className="pl-7"
                        value={formData.compareAtPrice}
                        onChange={(e) => setFormData({...formData, compareAtPrice: e.target.value})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Variants Matrix */}
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Variants</CardTitle>
                  <CardDescription>Manage multiple versions of this product.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="has-variants" className="text-xs font-bold uppercase tracking-widest text-slate-400 cursor-pointer">Enable Variants</Label>
                  <input 
                    type="checkbox" 
                    id="has-variants"
                    checked={hasVariants}
                    onChange={(e) => setHasVariants(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {hasVariants ? (
                  <VariantMatrixEditor 
                    onChange={(opts, vars) => {
                      setOptions(opts);
                      setVariants(vars);
                    }} 
                  />
                ) : (
                  <div className="py-6 flex items-center gap-4 bg-slate-50 rounded-lg px-6 border border-dashed">
                    <AlertCircle className="w-5 h-5 text-slate-400" />
                    <p className="text-sm text-slate-500">This product has no variants like different sizes or colors.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* SEO */}
            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-lg">Search engine listing</CardTitle>
                  <CardDescription>Preview how this product appears in search results.</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-primary font-medium">Edit SEO</Button>
              </CardHeader>
              <CardContent className="pt-4 border-t bg-slate-50/50">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-1 text-[13px] text-slate-600">
                    <Globe className="w-3 h-3" />
                    <span>yourstore.com</span>
                    <span className="text-slate-400">/products/{formData.title.toLowerCase().replace(/ /g, "-") || "handle"}</span>
                  </div>
                  <h3 className="text-[19px] text-[#1a0dab] font-medium leading-tight">
                    {formData.title || "Product Title"}
                  </h3>
                  <p className="text-[14px] text-[#4d5156] line-clamp-2">
                    {formData.description || "Add a description to see how this product might appear in search results."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select 
                  value={formData.status} 
                  onValueChange={(v) => setFormData({...formData, status: v})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Product Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Vendor</Label>
                  <Input 
                    value={formData.vendor}
                    onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Product Type</Label>
                  <Input 
                    placeholder="e.g. Shoes"
                    value={formData.productType}
                    onChange={(e) => setFormData({...formData, productType: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Collections</Label>
                  <div className="p-3 border rounded-lg bg-slate-50/50 text-xs text-slate-500 flex items-center justify-center border-dashed">
                    No collections selected
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <Input placeholder="summer, basic, organic" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
      {showMediaBrowser && (
        <MediaManager
          mode="select"
          onSelect={(url, alt) => {
            setMedia([...media, { url, alt }]);
            setShowMediaBrowser(false);
          }}
          onClose={() => setShowMediaBrowser(false)}
        />
      )}
    </AdminLayout>
  );
}
