"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { 
  Plus, 
  Trash2, 
  Eye, 
  Settings2, 
  ListFilter, 
  ImageIcon, 
  Globe, 
  ChevronRight 
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductPicker } from "./product-picker";
import { MediaManager } from "@/components/admin/MediaManager";

const collectionSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  descriptionHtml: z.string().optional(),
  collectionType: z.enum(["manual", "smart"]),
  status: z.enum(["active", "draft", "archived"]),
  sortOrder: z.string().optional(),
  seoTitle: z.string().max(70, "SEO Title must be under 70 chars").optional().or(z.literal("")),
  seoDescription: z.string().max(160, "SEO Description must be under 160 chars").optional().or(z.literal("")),
  rules: z.object({
    matchAll: z.boolean().optional(),
    conditions: z.array(z.object({
      field: z.string(),
      operator: z.string(),
      value: z.string(),
    })).optional(),
  }).optional(),
  products: z.array(z.string()).optional(),
  imageUrl: z.string().optional().or(z.literal("")),
  imageAlt: z.string().optional().or(z.literal("")),
});

type CollectionFormValues = z.infer<typeof collectionSchema>;

export function CollectionForm({ initialData, isEdit }: { initialData?: any; isEdit?: boolean }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conditions, setConditions] = useState([
    { field: "title", operator: "contains", value: "" }
  ]);
  const [matchAll, setMatchAll] = useState(true);
  const [isSeoOpen, setIsSeoOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewProducts, setPreviewProducts] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    initialData?.products?.map((p: any) => p.productId || p.id || p) || []
  );
  const [collectionType, setCollectionType] = useState(initialData?.collectionType || "manual");
  const [status, setStatus] = useState(initialData?.status || "draft");
  const [sortOrder, setSortOrder] = useState(initialData?.sortOrder || "manual");
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(initialData?.seoDescription || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [descriptionHtml, setDescriptionHtml] = useState(initialData?.descriptionHtml || "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [imageAlt, setImageAlt] = useState(initialData?.imageAlt || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [isMediaOpen, setIsMediaOpen] = useState(false);

  const handle = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const addCondition = () => {
    setConditions([...conditions, { field: "title", operator: "contains", value: "" }]);
  };

  const removeCondition = (index: number) => {
    if (conditions.length > 1) {
      setConditions(conditions.filter((_, i) => i !== index));
    }
  };

  const updateCondition = (index: number, key: string, value: string) => {
    const updated = [...conditions];
    (updated[index] as any)[key] = value;
    setConditions(updated);
  };

  const handlePreview = async () => {
    try {
      const res = await fetch("/api/v1/collections/smart/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchAll, conditions }),
      });
      const { data } = await res.json();
      setPreviewProducts(data || []);
      setIsPreviewOpen(true);
    } catch (error) {
      console.error("Failed to preview products", error);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Collection title is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title,
        description,
        descriptionHtml,
        collectionType,
        status,
        sortOrder,
        seoTitle,
        seoDescription,
        rules: collectionType === "smart" ? { matchAll, conditions } : undefined,
        products: selectedProducts,
        imageUrl,
        imageAlt,
      };

      const url = isEdit ? `/api/v1/collections/${initialData.id}` : "/api/v1/collections";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/collections");
        router.refresh();
      } else {
        const error = await res.json();
        alert(error.errors?.[0] || "Failed to save collection");
      }
    } catch (error) {
      console.error("Failed to save collection", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const conditionFields = [
    { value: "title", label: "Product title" },
    { value: "type", label: "Product type" },
    { value: "vendor", label: "Vendor" },
    { value: "tag", label: "Product tag" },
    { value: "price", label: "Price" },
    { value: "compare_at_price", label: "Compare at price" },
    { value: "weight", label: "Weight" },
    { value: "stock", label: "Inventory stock" },
    { value: "variant_title", label: "Variant title" },
  ];

  const getOperators = (field: string) => {
    const textFields = ["title", "type", "vendor", "tag", "variant_title"];
    const numberFields = ["price", "compare_at_price", "weight", "stock"];

    if (textFields.includes(field)) {
      return [
        { value: "equals", label: "is equal to" },
        { value: "not_equals", label: "is not equal to" },
        { value: "contains", label: "contains" },
        { value: "not_contains", label: "does not contain" },
        { value: "starts_with", label: "starts with" },
        { value: "ends_with", label: "ends with" },
      ];
    }
    if (numberFields.includes(field)) {
      return [
        { value: "equals", label: "is equal to" },
        { value: "not_equals", label: "is not equal to" },
        { value: "greater_than", label: "is greater than" },
        { value: "less_than", label: "is less than" },
      ];
    }
    return [];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
      {/* Main Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Title & Description */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">General Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g. Summer Collection"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <span>URL Handle:</span>
                <span className="font-mono bg-slate-100 px-1 rounded">/collections/{handle || "[handle]"}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Add a description for this collection..."
                className="min-h-[120px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Collection Type */}
        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Collection Type</CardTitle>
            <CardDescription>Select how products are added to this collection.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-2 divide-x border-y">
              <button
                type="button"
                className={cn(
                  "p-6 text-left transition-colors hover:bg-slate-50",
                  collectionType === "manual" && "bg-slate-50 ring-2 ring-primary ring-inset"
                )}
                onClick={() => setCollectionType("manual")}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    collectionType === "manual" ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
                  )}>
                    <Settings2 className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-sm">Manual</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  You choose the products for this collection one by one.
                </p>
              </button>
              <button
                type="button"
                className={cn(
                  "p-6 text-left transition-colors hover:bg-slate-50",
                  collectionType === "smart" && "bg-slate-50 ring-2 ring-primary ring-inset"
                )}
                onClick={() => setCollectionType("smart")}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    collectionType === "smart" ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
                  )}>
                    <ListFilter className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-sm">Automated</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Existing and future products that match your conditions will be added automatically.
                </p>
              </button>
            </div>

            <div className="p-6">
              {collectionType === "manual" ? (
                <div className="space-y-4">
                  <Label>Products</Label>
                  <ProductPicker
                    selectedIds={selectedProducts}
                    onChange={(ids) => setSelectedProducts(ids)}
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Conditions</Label>
                      <p className="text-xs text-slate-500">Products must match:</p>
                    </div>
                    <Tabs
                      value={matchAll ? "all" : "any"}
                      onValueChange={(v) => setMatchAll(v === "all")}
                    >
                      <TabsList className="h-8">
                        <TabsTrigger value="all" className="text-xs px-3">All conditions</TabsTrigger>
                        <TabsTrigger value="any" className="text-xs px-3">Any condition</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  <div className="space-y-3">
                    {conditions.map((condition, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Select
                          value={condition.field}
                          onValueChange={(v) => updateCondition(index, "field", v)}
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {conditionFields.map(f => (
                              <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={condition.operator}
                          onValueChange={(v) => updateCondition(index, "operator", v)}
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {getOperators(condition.field).map(op => (
                              <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Input
                          placeholder="Value"
                          className="flex-1"
                          value={condition.value}
                          onChange={(e) => updateCondition(index, "value", e.target.value)}
                        />

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-slate-400 hover:text-red-500"
                          onClick={() => removeCondition(index)}
                          disabled={conditions.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addCondition}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add another condition
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-slate-500"
                      onClick={handlePreview}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview results
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Search Engine Listing */}
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold">Search Engine Listing</CardTitle>
              <CardDescription>Preview how this collection appears in search results.</CardDescription>
            </div>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="text-primary font-medium"
              onClick={() => setIsSeoOpen(!isSeoOpen)}
            >
              {isSeoOpen ? "Cancel" : "Edit SEO"}
            </Button>
          </CardHeader>
          <CardContent className="pt-4 space-y-6">
            <div className="bg-slate-50 p-4 rounded-lg border space-y-1 max-w-2xl">
              <div className="flex items-center gap-1 text-[14px] text-slate-600 truncate">
                <Globe className="w-3 h-3" />
                <span>yourstore.com</span>
                <ChevronRight className="w-3 h-3" />
                <span>collections</span>
                <ChevronRight className="w-3 h-3" />
                <span className="font-medium text-slate-800">{handle || "handle"}</span>
              </div>
              <h3 className="text-[20px] text-[#1a0dab] font-medium leading-tight truncate">
                {seoTitle || title || "Collection Title"}
              </h3>
              <p className="text-[14px] text-[#4d5156] line-clamp-2">
                {seoDescription || (description || "Add a description to see how this collection might appear in a search engine listing.")}
              </p>
            </div>

            {isSeoOpen && (
              <div className="space-y-4 pt-4 border-t animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="seoTitle">Page title</Label>
                    <span className={cn("text-[10px]", (seoTitle?.length || 0) > 60 ? "text-amber-500" : "text-slate-400")}>
                      {(seoTitle?.length || 0)} / 70 characters
                    </span>
                  </div>
                  <Input 
                    id="seoTitle" 
                    placeholder={title || "Collection Title"}
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="seoDescription">Meta description</Label>
                    <span className={cn("text-[10px]", (seoDescription?.length || 0) > 155 ? "text-amber-500" : "text-slate-400")}>
                      {(seoDescription?.length || 0)} / 160 characters
                    </span>
                  </div>
                  <Textarea 
                    id="seoDescription" 
                    placeholder={description || "Collection description"}
                    className="min-h-[100px]"
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500">Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={status} onValueChange={(v: any) => setStatus(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium">Sales Channels</span>
              <Badge variant="secondary" className="font-normal text-[10px]">Online Store</Badge>
            </div>
          </CardContent>
          <Separator />
          <div className="p-4 flex gap-3">
            <Button onClick={handleSubmit} className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : (isEdit ? "Update Collection" : "Save Collection")}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>Discard</Button>
          </div>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500">Collection Image</CardTitle>
          </CardHeader>
          <CardContent>
            {imageUrl ? (
              <div className="relative aspect-square rounded-lg border overflow-hidden group">
                <img src={imageUrl} alt="Collection" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="sm" variant="secondary" type="button" onClick={() => setIsMediaOpen(true)}>Change</Button>
                  <Button size="sm" variant="destructive" type="button" onClick={() => setImageUrl("")}>Remove</Button>
                </div>
              </div>
            ) : (
              <div 
                className="aspect-square rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-6 text-center space-y-2 hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => setIsMediaOpen(true)}
              >
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Click to upload</p>
                  <p className="text-xs text-slate-400">PNG, JPG or WebP (max 20MB)</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {isMediaOpen && (
          <MediaManager 
            onSelect={(url) => {
              setImageUrl(url);
              setIsMediaOpen(false);
            }} 
            onClose={() => setIsMediaOpen(false)}
            selectedUrl={imageUrl}
          />
        )}

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500">Sort Order</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={sortOrder ?? "manual"} onValueChange={(v) => setSortOrder(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="best-selling">Best selling</SelectItem>
                <SelectItem value="title-asc">Title: A-Z</SelectItem>
                <SelectItem value="title-desc">Title: Z-A</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="created-asc">Newest</SelectItem>
                <SelectItem value="created-desc">Oldest</SelectItem>
              </SelectContent>
            </Select>
            <p className="mt-2 text-xs text-slate-500">
              This determines the order of products when customers view this collection.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-lg font-bold">Preview Smart Results</h3>
              <p className="text-sm text-slate-500">These products currently match your conditions.</p>
            </div>
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              {previewProducts.length > 0 ? (
                <div className="space-y-4">
                  {previewProducts.map((p: any) => (
                    <div key={p.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-12 h-12 rounded bg-slate-100 flex-shrink-0 overflow-hidden">
                        {p.media?.[0]?.url && <img src={p.media[0].url} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{p.title}</p>
                        <p className="text-xs text-slate-500">{p.vendor} • {p.productType}</p>
                      </div>
                      <Badge variant="outline" className="capitalize">{p.status}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-slate-500">
                  No products currently match these conditions.
                </div>
              )}
            </div>
            <div className="p-4 border-t flex justify-end">
              <Button onClick={() => setIsPreviewOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}