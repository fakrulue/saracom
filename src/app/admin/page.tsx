"use client";

import React from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Package,
  ArrowUpRight,
  ChevronDown,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const salesData = [
  { name: "Mon", sales: 4000 },
  { name: "Tue", sales: 3000 },
  { name: "Wed", sales: 2000 },
  { name: "Thu", sales: 2780 },
  { name: "Fri", sales: 1890 },
  { name: "Sat", sales: 2390 },
  { name: "Sun", sales: 3490 },
];

const trafficData = [
  { name: "00:00", visits: 400 },
  { name: "04:00", visits: 300 },
  { name: "08:00", visits: 900 },
  { name: "12:00", visits: 1500 },
  { name: "16:00", visits: 1200 },
  { name: "20:00", visits: 800 },
  { name: "23:59", visits: 500 },
];

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Good morning, MMS</h1>
            <p className="text-slate-500">Here's what's happening with your store today.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="bg-white">
              <Calendar className="w-4 h-4 mr-2" />
              Last 7 Days
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
            <Button className="shadow-lg shadow-primary/20">
              Download Report
            </Button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Revenue" 
            value="$128,430.00" 
            change="+12.5%" 
            isPositive 
            icon={DollarSign} 
          />
          <StatCard 
            title="Total Orders" 
            value="1,240" 
            change="+8.2%" 
            isPositive 
            icon={ShoppingCart} 
          />
          <StatCard 
            title="Total Customers" 
            value="8,542" 
            change="-2.4%" 
            isPositive={false} 
            icon={Users} 
          />
          <StatCard 
            title="Avg. Order Value" 
            value="$103.50" 
            change="+5.1%" 
            isPositive 
            icon={TrendingUp} 
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Chart */}
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Sales Overview</CardTitle>
                <CardDescription>Daily revenue trends for the current week.</CardDescription>
              </div>
              <Badge variant="secondary" className="font-normal">Revenue ($)</Badge>
            </CardHeader>
            <CardContent className="h-[350px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: "#94a3b8" }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: "#94a3b8" }} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Traffic Chart */}
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Store Traffic</CardTitle>
                <CardDescription>Live visitor counts across different hours.</CardDescription>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold uppercase tracking-widest">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </div>
            </CardHeader>
            <CardContent className="h-[350px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData}>
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: "#94a3b8" }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: "#94a3b8" }} 
                  />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="visits" 
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#colorVisits)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Grid: Recent Orders & Live Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          {/* Recent Orders */}
          <Card className="lg:col-span-2 border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Orders</CardTitle>
                <CardDescription>Most recent transactions from your customers.</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">View All</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-y">
                      <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Order ID</th>
                      <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Customer</th>
                      <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                      <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <OrderRow id="#ORD-7421" customer="John Doe" status="Delivered" total="$125.00" />
                    <OrderRow id="#ORD-7422" customer="Sarah Smith" status="Processing" total="$89.50" />
                    <OrderRow id="#ORD-7423" customer="Michael Ross" status="Shipped" total="$210.00" />
                    <OrderRow id="#ORD-7424" customer="Emma Wilson" status="Delivered" total="$45.00" />
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Live Activity Feed */}
          <Card className="border-none shadow-sm h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Live Activity</CardTitle>
                <CardDescription>Real-time storefront events.</CardDescription>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </CardHeader>
            <CardContent className="flex-1 space-y-6 overflow-y-auto">
              <ActivityItem 
                type="purchase" 
                user="Someone in New York" 
                action="purchased" 
                target="Leather Boots" 
                time="2m ago" 
              />
              <ActivityItem 
                type="view" 
                user="Guest" 
                action="is viewing" 
                target="Silk Scarf" 
                time="Just now" 
              />
              <ActivityItem 
                type="stock" 
                user="System" 
                action="Low stock alert:" 
                target="Wireless Headphones" 
                time="15m ago" 
                isCritical
              />
              <ActivityItem 
                type="user" 
                user="Sarah Jenkins" 
                action="signed up" 
                target="as a customer" 
                time="1h ago" 
              />
              <ActivityItem 
                type="purchase" 
                user="James Bond" 
                action="purchased" 
                target="Smart Watch" 
                time="2h ago" 
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

function ActivityItem({ type, user, action, target, time, isCritical }: any) {
  const icons: any = {
    purchase: <ShoppingCart className="w-3.5 h-3.5" />,
    view: <ArrowUpRight className="w-3.5 h-3.5" />,
    stock: <Package className="w-3.5 h-3.5" />,
    user: <Users className="w-3.5 h-3.5" />
  };

  return (
    <div className="flex gap-3 relative">
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
        isCritical ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-500"
      )}>
        {icons[type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-900 leading-normal">
          <span className="font-bold">{user}</span> {action} <span className="font-semibold text-primary">{target}</span>
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5">{time}</p>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, isPositive, icon: Icon }: any) {
  return (
    <Card className="border-none shadow-sm group hover:ring-1 hover:ring-primary/20 transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-primary group-hover:text-white transition-colors">
            <Icon className="w-5 h-5" />
          </div>
          <div className={cn(
            "flex items-center gap-1 text-xs font-bold",
            isPositive ? "text-emerald-600" : "text-rose-600"
          )}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-slate-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function OrderRow({ id, customer, status, total }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
      <td className="px-6 py-4 text-sm font-medium text-slate-900">{id}</td>
      <td className="px-6 py-4 text-sm text-slate-600">{customer}</td>
      <td className="px-6 py-4">
        <Badge className={cn(
          "font-medium shadow-none",
          status === "Delivered" ? "bg-emerald-100 text-emerald-700" :
          status === "Processing" ? "bg-amber-100 text-amber-700" :
          "bg-blue-100 text-blue-700"
        )}>
          {status}
        </Badge>
      </td>
      <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">{total}</td>
    </tr>
  );
}

function TopProduct({ name, sales, trend }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
          <Package className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">{name}</p>
          <p className="text-xs text-slate-500">{sales} units sold</p>
        </div>
      </div>
      <div className={cn(
        "text-xs font-bold",
        trend.startsWith("+") ? "text-emerald-600" : "text-rose-600"
      )}>
        {trend}
      </div>
    </div>
  );
}
