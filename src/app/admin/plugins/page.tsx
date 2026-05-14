"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { 
  Puzzle, 
  Plus, 
  Search, 
  Settings2, 
  ToggleRight, 
  ToggleLeft, 
  Star, 
  Download, 
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const PLUGINS = [
  { id: "p1", name: "Stripe Connect", category: "Payments", status: "active", desc: "Enable marketplace payouts and split payments.", rating: 4.9, icon: "💳" },
  { id: "p2", name: "Google Analytics 4", category: "Analytics", status: "active", desc: "Track conversions and user behavior in real-time.", rating: 4.8, icon: "📈" },
  { id: "p3", name: "Tabby BNPL",      category: "Payments", status: "inactive", desc: "Buy Now Pay Later integration for Middle East.", rating: 4.7, icon: "🗓️" },
  { id: "p4", name: "Cloudflare R2",   category: "Storage", status: "active", desc: "S3-compatible object storage for product media.", rating: 5.0, icon: "☁️" },
  { id: "p5", name: "Mailchimp Sync",   category: "Marketing", status: "active", desc: "Sync customer segments to Mailchimp lists.", rating: 4.5, icon: "📧" },
  { id: "p6", name: "WhatsApp Chat",   category: "Customer Support", status: "inactive", desc: "Floating WhatsApp button for instant support.", rating: 4.6, icon: "💬" },
];

export default function PluginManagement() {
  const [search, setSearch] = useState("");

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Plugins</h1>
            <p className="text-sm text-slate-500">Extend your store's functionality with integrated apps and services.</p>
          </div>
          <Button className="shadow-sm gap-2">
            <Plus className="w-4 h-4" />
            Visit App Store
          </Button>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search installed plugins..." 
              className="pl-10 h-11 border-slate-200 bg-slate-50 focus-visible:ring-slate-200" 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            {["All", "Payments", "Marketing", "Analytics"].map(cat => (
              <Button key={cat} variant="ghost" size="sm" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900">
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Plugin Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLUGINS.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map(plugin => (
            <Card key={plugin.id} className={cn(
              "border-none shadow-sm group hover:ring-1 transition-all",
              plugin.status === "active" ? "hover:ring-emerald-200" : "hover:ring-slate-200"
            )}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl shadow-inner">
                    {plugin.icon}
                  </div>
                  <Switch 
                    checked={plugin.status === "active"}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-900">{plugin.name}</p>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-[10px] font-black">{plugin.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed min-h-[40px]">
                    {plugin.desc}
                  </p>
                </div>
                <Separator className="my-4" />
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500">
                    {plugin.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Settings2 className="w-4 h-4 text-slate-400" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Suggestion / Upsell */}
        <Card className="border-none shadow-sm bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-3xl font-bold tracking-tighter">Extend your potential.</h2>
              <p className="text-blue-100 max-w-md">
                Browse our curated marketplace of over 500+ plugins designed to help you scale your commerce operations.
              </p>
              <Button className="bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-full px-8">
                Explore Marketplace
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl">
                  🚀
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}

import { Separator } from "@/components/ui/separator";
