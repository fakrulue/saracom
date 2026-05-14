"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { 
  ChevronLeft, 
  Save, 
  Tag, 
  Percent, 
  Truck, 
  DollarSign,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function NewDiscountPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discountType, setDiscountType] = useState("percentage");
  const [code, setCode] = useState("");

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCode(result);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/admin/marketing/discounts");
    }, 1000);
  };

  return (
    <AdminLayout>
      <form onSubmit={onSubmit} className="max-w-4xl mx-auto space-y-8 pb-20">
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
              <h1 className="text-2xl font-bold tracking-tight">Create discount</h1>
              <p className="text-sm text-slate-500">Configure codes and rules for your promotions.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Discard</Button>
            <Button type="submit" disabled={isSubmitting} className="shadow-lg">
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Creating..." : "Create Discount"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {/* Code */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Discount Code</CardTitle>
                <CardDescription>Customers will enter this code at checkout.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1 space-y-2">
                    <Input 
                      placeholder="e.g. SUMMER20" 
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      className="font-mono font-bold"
                    />
                  </div>
                  <Button type="button" variant="outline" onClick={generateCode}>Generate</Button>
                </div>
                <p className="text-xs text-slate-500">Customers will see this at checkout.</p>
              </CardContent>
            </Card>

            {/* Value */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Value</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-3">
                  <DiscountTypeCard 
                    active={discountType === "percentage"} 
                    onClick={() => setDiscountType("percentage")}
                    icon={Percent}
                    label="Percentage"
                  />
                  <DiscountTypeCard 
                    active={discountType === "fixed"} 
                    onClick={() => setDiscountType("fixed")}
                    icon={DollarSign}
                    label="Fixed amount"
                  />
                  <DiscountTypeCard 
                    active={discountType === "shipping"} 
                    onClick={() => setDiscountType("shipping")}
                    icon={Truck}
                    label="Free shipping"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Discount Value</Label>
                  <div className="relative max-w-[200px]">
                    {discountType === "percentage" && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>}
                    {discountType === "fixed" && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>}
                    <Input 
                      placeholder="0" 
                      className={cn(discountType === "fixed" && "pl-7", discountType === "percentage" && "pr-7")} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Minimum Requirements */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Minimum Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="radio" id="min-none" name="min-req" defaultChecked />
                    <Label htmlFor="min-none">None</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="radio" id="min-amt" name="min-req" />
                    <Label htmlFor="min-amt">Minimum purchase amount ($)</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="radio" id="min-qty" name="min-req" />
                    <Label htmlFor="min-qty">Minimum quantity of items</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-bold">{code || "No code yet"}</p>
                  <p className="text-xs text-slate-500">
                    {discountType === "percentage" ? "Percentage off" : discountType === "fixed" ? "Fixed amount off" : "Free shipping"}
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active dates</p>
                  <p className="text-sm flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    May 11, 2026 — No end date
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Usage Limits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="limit-total" />
                  <Label htmlFor="limit-total">Limit total number of uses</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="limit-once" />
                  <Label htmlFor="limit-once">Limit to one use per customer</Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}

function DiscountTypeCard({ active, onClick, icon: Icon, label }: any) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "p-4 border rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all",
        active ? "bg-slate-900 text-white border-slate-900 shadow-lg" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="text-[11px] font-bold uppercase tracking-wider text-center">{label}</span>
    </div>
  );
}
