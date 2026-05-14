"use client";

import React from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/admin-layout";
import { 
  Megaphone, 
  Tag, 
  TicketCheck, 
  TrendingUp, 
  MousePointerClick, 
  Users,
  ChevronRight,
  Plus
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function MarketingOverviewPage() {
  const campaigns = [
    { name: "Summer Sale 2024", status: "active",  reach: "12.5k", clicks: "1.2k", conv: "3.2%" },
    { name: "New Arrival Blast", status: "draft",   reach: "-",     clicks: "-",    conv: "-" },
    { name: "Flash Friday",     status: "expired", reach: "8.2k",  clicks: "950",  conv: "2.8%" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Marketing</h1>
            <p className="text-sm text-slate-500">Promote your products and grow your customer base.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/marketing/campaigns/new">
              <Button variant="outline">Create Campaign</Button>
            </Link>
            <Link href="/admin/marketing/discounts/new">
              <Button className="shadow-sm">
                <Plus className="w-4 h-4 mr-2" />
                Create Discount
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total Reach" 
            value="45.2k" 
            change="+12%" 
            icon={Users} 
            color="text-blue-600 bg-blue-50" 
          />
          <StatCard 
            title="Campaign Clicks" 
            value="3.8k" 
            change="+8.4%" 
            icon={MousePointerClick} 
            color="text-emerald-600 bg-emerald-50" 
          />
          <StatCard 
            title="Sales from Marketing" 
            value="$12,450" 
            change="+15.2%" 
            icon={TrendingUp} 
            color="text-violet-600 bg-violet-50" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Discounts Shortcut */}
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow group cursor-pointer" onClick={() => window.location.href='/admin/marketing/discounts'}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Tag className="w-5 h-5 text-emerald-600" />
                  Discounts
                </CardTitle>
                <CardDescription>Manage codes and automatic discounts.</CardDescription>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex-1 p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Active</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <div className="flex-1 p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Used Today</p>
                  <p className="text-2xl font-bold">145</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campaigns Shortcut */}
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow group cursor-pointer" onClick={() => window.location.href='/admin/marketing/campaigns'}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-blue-600" />
                  Campaigns
                </CardTitle>
                <CardDescription>Track email and social promotions.</CardDescription>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex-1 p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Active</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <div className="flex-1 p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Scheduled</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Campaigns */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Recent Campaigns</CardTitle>
            <CardDescription>Performance of your latest marketing activities.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.map((camp) => (
                <div key={camp.name} className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                      <Megaphone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{camp.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={cn(
                          "text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded",
                          camp.status === "active" ? "bg-emerald-100 text-emerald-700" :
                          camp.status === "draft" ? "bg-slate-100 text-slate-600" :
                          "bg-red-50 text-red-600"
                        )}>
                          {camp.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Reach</p>
                      <p className="text-sm font-bold">{camp.reach}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Conv.</p>
                      <p className="text-sm font-bold">{camp.conv}</p>
                    </div>
                    <Button variant="ghost" size="sm">View Report</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, value, change, icon: Icon, color }: any) {
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-6 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <span className="text-xs font-medium text-emerald-600">{change}</span>
          </div>
        </div>
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", color)}>
          <Icon className="w-6 h-6" />
        </div>
      </CardContent>
    </Card>
  );
}
