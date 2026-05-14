"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { 
  Percent, 
  Search, 
  Settings2, 
  Save, 
  Plus, 
  TrendingUp, 
  ShieldCheck,
  ChevronRight,
  Calculator
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const COMMISSION_RULES = [
  { id: "r1", name: "Standard Fashion", category: "Apparel", rate: "12%", type: "Percentage", status: "active" },
  { id: "r2", name: "Electronics Flat", category: "Electronics", rate: "$15.00", type: "Fixed", status: "active" },
  { id: "r3", name: "High-End Jewelry",  category: "Jewelry", rate: "18%", type: "Percentage", status: "active" },
  { id: "r4", name: "Eco Products",      category: "Home & Garden", rate: "8%", type: "Percentage", status: "draft" },
];

export default function CommissionsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Commission Rules</h1>
            <p className="text-sm text-slate-500">Configure how much you earn from each marketplace transaction.</p>
          </div>
          <Button className="shadow-sm gap-2">
            <Plus className="w-4 h-4" />
            Add Rule
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Avg. Commission Rate" value="11.4%" icon={Percent} color="text-emerald-600 bg-emerald-50" />
          <StatCard title="Revenue Share (MTD)" value="$8,245" icon={TrendingUp} color="text-blue-600 bg-blue-50" />
          <StatCard title="Active Rules" value="8" icon={ShieldCheck} color="text-violet-600 bg-violet-50" />
        </div>

        {/* Global Commission Setting */}
        <Card className="border-none shadow-sm bg-slate-900 text-white">
          <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight">Global Commission Rate</h2>
              <p className="text-slate-400 text-sm max-w-sm">This rate applies to all products and sellers unless a specific category rule is defined below.</p>
            </div>
            <div className="flex items-center gap-4 bg-white/10 p-2 rounded-2xl border border-white/10">
              <div className="px-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Rate</p>
                <p className="text-3xl font-black">10.0%</p>
              </div>
              <Button className="bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl px-6">
                Change
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Rules Table */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold tracking-tight">Category Rules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMMISSION_RULES.map(rule => (
              <Card key={rule.id} className="border-none shadow-sm group hover:ring-1 hover:ring-slate-200 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                        <Calculator className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{rule.name}</p>
                        <p className="text-xs text-slate-500">{rule.category}</p>
                      </div>
                    </div>
                    <Badge className={cn(
                      "text-[10px] uppercase font-bold tracking-widest shadow-none",
                      rule.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                    )}>
                      {rule.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rate Type</p>
                      <p className="text-sm font-bold text-slate-900">{rule.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Commission</p>
                      <p className="text-2xl font-black text-slate-900">{rule.rate}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t flex gap-2">
                    <Button variant="outline" size="sm" className="w-full font-bold h-9">Edit Rule</Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <Settings2 className="w-4 h-4 text-slate-400" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-5 flex items-center gap-4">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", color)}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="text-xl font-bold text-slate-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
