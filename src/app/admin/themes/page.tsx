"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/admin-layout";
import { 
  Plus, 
  Eye, 
  MoreHorizontal,
  ChevronDown,
  Monitor,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const DRAFT_THEMES = [
  { id: "t2", name: "Modern Minimalism", lastSaved: "Feb 10 at 2:10 am", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=200&h=150&fit=crop" },
  { id: "t3", name: "Vintage Luxury",   lastSaved: "Jan 15 at 11:45 pm", image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=200&h=150&fit=crop" },
];

export default function ThemeManagement() {
  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Top Breadcrumb style header */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-500">Online Store</h2>
          <button className="p-1 rounded hover:bg-slate-100"><MoreHorizontal className="w-4 h-4" /></button>
        </div>

        {/* Main Title and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg border shadow-sm">
              <Monitor className="w-5 h-5 text-slate-900" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Themes</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-white shadow-sm">
              <Eye className="w-4 h-4" />
              View store
            </Button>
            <Button variant="outline" className="gap-2 bg-white shadow-sm">
              Import theme
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Speed / Performance Card */}
        <Card className="border-none shadow-sm overflow-hidden bg-white">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-x divide-slate-100">
            <div className="p-6 flex flex-col justify-center border-r">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">30 days</span>
              </div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Metrics Period</p>
            </div>
            <Metric title="LCP P75" value="3075 milliseconds" trend="19%" status="moderate" />
            <Metric title="INP P75" value="136 milliseconds" status="good" />
            <Metric title="Cumulative Layout Shift" value="0" status="good" />
          </div>
        </Card>

        {/* Live Theme Section */}
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <div className="p-0">
            {/* Theme Previews (Mocking the overlapping previews in the screenshot) */}
            <div className="relative h-[400px] bg-slate-100 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-200/50 to-slate-100" />
              
              {/* Desktop Preview */}
              <div className="relative z-10 w-[60%] aspect-video bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden transform translate-x-[-10%] translate-y-[5%]">
                <img src="/assets/hero-1.jpg" className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-black/5 flex flex-col">
                  <div className="h-10 bg-white border-b px-4 flex items-center justify-between">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-slate-200" />
                      <div className="w-2 h-2 rounded-full bg-slate-200" />
                    </div>
                    <div className="flex gap-4">
                      <div className="h-2 w-10 bg-slate-100 rounded" />
                      <div className="h-2 w-10 bg-slate-100 rounded" />
                    </div>
                  </div>
                  <div className="flex-1 flex items-center justify-center p-12">
                     <div className="text-center space-y-4">
                        <div className="h-10 w-64 bg-white/80 rounded mx-auto" />
                        <div className="h-4 w-48 bg-white/60 rounded mx-auto" />
                        <div className="h-10 w-32 bg-slate-900 rounded mx-auto" />
                     </div>
                  </div>
                </div>
              </div>

              {/* Mobile Preview */}
              <div className="absolute z-20 right-[15%] bottom-[10%] w-[120px] h-[240px] bg-white rounded-[20px] shadow-2xl border-[6px] border-slate-900 overflow-hidden">
                <img src="/assets/hero-2.jpg" className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-black/5" />
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-slate-800 rounded-full" />
              </div>
            </div>

            {/* Theme Info Footer */}
            <div className="p-6 border-t flex items-center justify-between bg-white">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">Horizon</h3>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold text-[10px] uppercase">Current theme</Badge>
                </div>
                <p className="text-sm text-slate-500">Last saved: Sep 11 at 5:41 pm</p>
                <div className="flex items-center gap-2 text-xs font-medium text-blue-600 cursor-pointer hover:underline pt-1">
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  Version 3.5.1 available
                  <ChevronDown className="w-3 h-3" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-10 w-10"><MoreHorizontal className="w-4 h-4" /></Button>
                <Link href="/admin/themes/customize">
                  <Button className="h-10 px-8 bg-slate-900 text-white hover:bg-slate-800 font-bold">
                    Edit theme
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>

        {/* Draft Themes Section */}
        <div className="space-y-4 pt-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight">Draft themes</h2>
            <p className="text-sm text-slate-500">These themes are only visible to you. Publishing a theme from your library will switch it to your current theme.</p>
          </div>
          
          <Card className="border-none shadow-sm overflow-hidden bg-white">
            <div className="divide-y">
              {DRAFT_THEMES.map(theme => (
                <div key={theme.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-12 rounded bg-slate-100 overflow-hidden border">
                      <img src={theme.image} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{theme.name}</h4>
                      <p className="text-xs text-slate-500">Last saved: {theme.lastSaved}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-9 w-9"><MoreHorizontal className="w-4 h-4" /></Button>
                    <Button variant="outline" className="h-9 font-bold bg-white">Publish</Button>
                    <Link href="/admin/themes/customize"><Button variant="outline" className="h-9 font-bold bg-white">Edit theme</Button></Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

function Metric({ title, value, status, trend }: { title: string; value: string; status: "good" | "moderate" | "poor"; trend?: string }) {
  const statusColors = {
    good: "bg-emerald-500 text-emerald-500",
    moderate: "bg-amber-500 text-amber-500",
    poor: "bg-rose-500 text-rose-500",
  };
  
  return (
    <div className="p-6 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</p>
        {trend && <span className="text-[10px] font-bold text-slate-400">↗ {trend}</span>}
      </div>
      <div className="flex items-center gap-3">
        <p className="text-lg font-bold text-slate-900">{value}</p>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-50 border">
          <div className={cn("w-2 h-2 rounded-full", statusColors[status].split(" ")[0])} />
          <span className={cn("text-[10px] font-bold uppercase tracking-wider", statusColors[status].split(" ")[1])}>{status}</span>
        </div>
      </div>
      <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
         <div className={cn("h-full", statusColors[status].split(" ")[0])} style={{ width: status === "good" ? "80%" : "40%" }} />
      </div>
    </div>
  );
}
