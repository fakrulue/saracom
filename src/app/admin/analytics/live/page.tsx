"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { 
  Users, 
  MapPin, 
  ShoppingCart, 
  TrendingUp, 
  Globe, 
  Activity,
  ArrowUpRight,
  MousePointer2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function LiveViewPage() {
  const [activeUsers, setActiveUsers] = useState(142);

  // Simulation of live data
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => prev + (Math.floor(Math.random() * 5) - 2));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Live Analytics
            </h1>
            <p className="text-sm text-slate-500">Real-time monitoring of your store's performance and active traffic.</p>
          </div>
          <Badge className="bg-emerald-100 text-emerald-700 uppercase tracking-widest text-[10px] font-bold px-3 py-1 shadow-none">
            Live Streaming
          </Badge>
        </div>

        {/* Real-time Counter */}
        <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden relative">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center relative z-10">
            <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-md mb-6 border border-white/10">
              <Users className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Active Visitors Right Now</p>
            <h2 className="text-8xl font-black tracking-tighter text-white tabular-nums">
              {activeUsers}
            </h2>
            <div className="mt-8 flex gap-3">
              <Button className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-8 rounded-full">
                View Global Map
              </Button>
            </div>
          </CardContent>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Top Locations */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Active Locations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { city: "New York, USA", count: 42, percent: 30 },
                { city: "London, UK", count: 28, percent: 20 },
                { city: "Dubai, UAE", count: 15, percent: 11 },
                { city: "Tokyo, JP", count: 12, percent: 9 },
              ].map(loc => (
                <div key={loc.city} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-900">{loc.city}</span>
                    <span className="text-slate-400">{loc.count} active</span>
                  </div>
                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${loc.percent}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Current Page Activity */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <MousePointer2 className="w-4 h-4" />
                Popular Pages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { page: "/collections/summer-24", count: 56 },
                { page: "/products/leather-boots", count: 32 },
                { page: "/checkout", count: 14 },
                { page: "/pages/about", count: 8 },
              ].map(page => (
                <div key={page.page} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                    <ArrowUpRight className="w-3 h-3 text-slate-300" />
                    {page.page}
                  </div>
                  <Badge variant="secondary" className="text-[10px] font-bold">{page.count}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Real-time Conversions */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Recent Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { event: "Order Completed", time: "Just now", color: "text-emerald-500" },
                { event: "Added to Cart", time: "2m ago", color: "text-blue-500" },
                { event: "Signup Started", time: "5m ago", color: "text-amber-500" },
                { event: "Promo Applied", time: "8m ago", color: "text-violet-500" },
              ].map((ev, i) => (
                <div key={i} className="flex gap-4 relative before:absolute before:left-1.5 before:top-4 before:bottom-0 before:w-px before:bg-slate-100 last:before:hidden">
                  <div className={cn("w-3 h-3 rounded-full bg-slate-200 mt-1 flex-shrink-0", ev.color.replace('text', 'bg'))} />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{ev.event}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{ev.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
