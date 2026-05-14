"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import {
  TrendingUp, TrendingDown, Users, ShoppingCart,
  DollarSign, Eye, Calendar, ArrowUpRight, ChevronDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const REVENUE_DATA = [
  { month: "Jan", revenue: 18400, orders: 120 },
  { month: "Feb", revenue: 22000, orders: 145 },
  { month: "Mar", revenue: 19500, orders: 130 },
  { month: "Apr", revenue: 28000, orders: 190 },
  { month: "May", revenue: 24500, orders: 162 },
  { month: "Jun", revenue: 32000, orders: 215 },
  { month: "Jul", revenue: 29000, orders: 198 },
  { month: "Aug", revenue: 35000, orders: 240 },
  { month: "Sep", revenue: 31000, orders: 208 },
  { month: "Oct", revenue: 38000, orders: 258 },
  { month: "Nov", revenue: 42000, orders: 290 },
  { month: "Dec", revenue: 48000, orders: 322 },
];

const TRAFFIC_DATA = [
  { day: "Mon", visits: 1200, pageviews: 3400 },
  { day: "Tue", visits: 1900, pageviews: 5200 },
  { day: "Wed", visits: 1600, pageviews: 4100 },
  { day: "Thu", visits: 2100, pageviews: 5800 },
  { day: "Fri", visits: 1800, pageviews: 4900 },
  { day: "Sat", visits: 2400, pageviews: 6700 },
  { day: "Sun", visits: 1400, pageviews: 3800 },
];

const TOP_CHANNELS = [
  { name: "Organic Search", value: 45, color: "#10b981" },
  { name: "Direct",         value: 25, color: "#3b82f6" },
  { name: "Social Media",   value: 20, color: "#8b5cf6" },
  { name: "Email",          value: 10, color: "#f59e0b" },
];

const TOP_PRODUCTS = [
  { name: "Leather Boots",        revenue: "$12,450", units: 84,  growth: "+24%" },
  { name: "Wireless Headphones",  revenue: "$9,800",  units: 62,  growth: "+18%" },
  { name: "Silk Scarf",           revenue: "$7,200",  units: 120, growth: "+5%"  },
  { name: "Denim Jacket",         revenue: "$6,100",  units: 43,  growth: "-3%"  },
  { name: "Classic White Tee",    revenue: "$4,500",  units: 210, growth: "+31%" },
];

const RANGES = ["Today", "Last 7 Days", "Last 30 Days", "Last 90 Days", "Last Year"];

export default function AnalyticsPage() {
  const [range, setRange] = useState("Last 30 Days");
  const [showRangeMenu, setShowRangeMenu] = useState(false);

  const kpis = [
    { title: "Total Revenue",     value: "$128,430",  change: "+12.5%", positive: true,  icon: DollarSign },
    { title: "Total Orders",      value: "1,240",     change: "+8.2%",  positive: true,  icon: ShoppingCart },
    { title: "Unique Visitors",   value: "24,840",    change: "+18.7%", positive: true,  icon: Eye },
    { title: "Conversion Rate",   value: "4.99%",     change: "-0.3%",  positive: false, icon: TrendingUp },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Analytics</h1>
            <p className="text-sm text-slate-500">Monitor your store performance and customer behavior.</p>
          </div>
          <div className="relative">
            <Button variant="outline" className="bg-white" onClick={() => setShowRangeMenu(!showRangeMenu)}>
              <Calendar className="w-4 h-4 mr-2" />
              {range}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
            {showRangeMenu && (
              <div className="absolute right-0 mt-2 bg-white border rounded-xl shadow-xl py-2 z-20 w-44">
                {RANGES.map(r => (
                  <button key={r} onClick={() => { setRange(r); setShowRangeMenu(false); }}
                    className={cn("w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors",
                      range === r && "font-semibold text-slate-900")}>
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map(({ title, value, change, positive, icon: Icon }) => (
            <Card key={title} className="border-none shadow-sm group hover:ring-1 hover:ring-primary/20 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className={cn("flex items-center gap-1 text-xs font-bold", positive ? "text-emerald-600" : "text-rose-500")}>
                    {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {change}
                  </div>
                </div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">{title}</p>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Revenue Chart */}
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Revenue & Orders</CardTitle>
              <CardDescription>Monthly revenue compared to number of orders.</CardDescription>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />Revenue</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-400 inline-block" />Orders</span>
            </div>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#revGrad)" dot={false} />
                <Line type="monotone" dataKey="orders" stroke="#60a5fa" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Traffic + Channels + Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Traffic */}
          <Card className="lg:col-span-2 border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Weekly Traffic</CardTitle>
              <CardDescription>Sessions and pageviews over the last 7 days.</CardDescription>
            </CardHeader>
            <CardContent className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TRAFFIC_DATA} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                  <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                  <Bar dataKey="visits" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={32} />
                  <Bar dataKey="pageviews" fill="#e2e8f0" radius={[4, 4, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Traffic Channels */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Traffic Sources</CardTitle>
              <CardDescription>Breakdown by acquisition channel.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-6">
                <PieChart width={160} height={160}>
                  <Pie data={TOP_CHANNELS} cx={75} cy={75} innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                    {TOP_CHANNELS.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </div>
              <div className="space-y-3">
                {TOP_CHANNELS.map(ch => (
                  <div key={ch.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ch.color }} />
                      <span className="text-slate-600">{ch.name}</span>
                    </div>
                    <span className="font-bold text-slate-900">{ch.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Products */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Top Performing Products</CardTitle>
            <CardDescription>Ranked by total revenue generated this period.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-y bg-slate-50/70 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-3 text-left">#</th>
                  <th className="px-6 py-3 text-left">Product</th>
                  <th className="px-6 py-3 text-right">Revenue</th>
                  <th className="px-6 py-3 text-right">Units Sold</th>
                  <th className="px-6 py-3 text-right">Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {TOP_PRODUCTS.map((p, i) => (
                  <tr key={p.name} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-slate-400">#{i + 1}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{p.name}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">{p.revenue}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 text-right">{p.units} units</td>
                    <td className="px-6 py-4 text-right">
                      <span className={cn("text-xs font-bold", p.growth.startsWith("+") ? "text-emerald-600" : "text-rose-500")}>
                        {p.growth}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
