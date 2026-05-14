"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import {
  Search, Filter, MoreHorizontal,
  Package, Truck, CheckCircle2, Clock, XCircle, Eye,
  ShoppingCart, Globe
} from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type Order = {
  id: string;
  items: { name: string; price: number; qty: number }[];
  total: number;
  subtotal: number;
  tax: number;
  discount: number;
  paymentMethod: string;
  customer: { id: string; name: string; phone: string; email?: string } | null;
  customerAddress: { id: string; label: string; full: string } | null;
  source: "pos" | "website";
  status: "completed" | "refunded";
  createdAt: string;
};

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: any }> = {
  completed: { label: "Completed", className: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  refunded:  { label: "Refunded", className: "bg-slate-100 text-slate-600", icon: XCircle },
};

const SOURCE_CONFIG: Record<string, { label: string; className: string; icon: any }> = {
  pos:      { label: "POS",       className: "bg-purple-100 text-purple-700", icon: ShoppingCart },
  website:  { label: "Website",   className: "bg-blue-100 text-blue-700",      icon: Globe },
};

const PAYMENT_CONFIG: Record<string, string> = {
  cash:     "bg-emerald-100 text-emerald-700",
  card:     "bg-blue-100 text-blue-700",
};

export default function OrdersPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    // Load from localStorage
    const stored = localStorage.getItem("pos_orders");
    if (stored) {
      try {
        setOrders(JSON.parse(stored));
      } catch {}
    }
    setLoading(false);
  };

  const filtered = orders.filter(o => {
    const matchesStatus = filter === "all" || o.status === filter;
    const matchesSource = sourceFilter === "all" || o.source === sourceFilter;
    const matchesSearch = !search || 
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.name.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSource && matchesSearch;
  });

  const stats = [
    { label: "Total Orders", value: orders.length, icon: Package, color: "text-slate-900" },
    { label: "POS Orders", value: orders.filter(o => o.source === "pos").length, icon: ShoppingCart, color: "text-purple-600" },
    { label: "Website Orders", value: orders.filter(o => o.source === "website").length, icon: Globe, color: "text-blue-600" },
    { label: "Completed", value: orders.filter(o => o.status === "completed").length, icon: CheckCircle2, color: "text-emerald-600" },
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Orders</h1>
            <p className="text-sm text-slate-500">Manage and fulfill your customer orders.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={loadOrders}>Refresh</Button>
            <Button className="shadow-sm">Export Orders</Button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className="border-none shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-slate-100">
                  <Icon className={cn("w-5 h-5", color)} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
                  <p className="text-2xl font-bold text-slate-900">{value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter Tabs + Table */}
        <Card className="border-none shadow-sm">
          {/* Filter Tabs */}
          <div className="flex items-center justify-between border-b px-4 pt-4">
            <div className="flex items-center gap-1 overflow-x-auto">
              {["all", "completed", "refunded"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-t-lg capitalize whitespace-nowrap transition-colors border-b-2 -mb-px",
                    filter === tab
                      ? "border-slate-900 text-slate-900"
                      : "border-transparent text-slate-500 hover:text-slate-900"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-slate-500 mr-2">Source:</span>
              {["all", "pos", "website"].map(src => (
                <button
                  key={src}
                  onClick={() => setSourceFilter(src)}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-full capitalize transition-colors",
                    sourceFilter === src 
                      ? src === "pos" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {src}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="p-4 flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search orders..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-2" />Filter</Button>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Clock className="w-6 h-6 animate-spin text-slate-400" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Package className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-bold">No orders found</p>
              <p className="text-sm">Orders from POS will appear here</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-slate-50/50">
                  <TableHead>Order</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(order => {
                  const statusCfg = STATUS_CONFIG[order.status];
                  const sourceCfg = SOURCE_CONFIG[order.source];
                  return (
                    <TableRow 
                    key={order.id} 
                    className="group hover:bg-slate-50/50 cursor-pointer"
                    onClick={() => router.push(`/admin/orders/${order.id}`)}
                  >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <statusCfg.icon className={cn("w-4 h-4", statusCfg.className.includes("emerald") ? "text-emerald-600" : "text-slate-400")} />
                          <span className="font-semibold text-sm text-slate-900">#{order.id}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("capitalize text-xs shadow-none font-medium", sourceCfg.className)}>
                          <sourceCfg.icon className="w-3 h-3 mr-1" />
                          {sourceCfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">{formatDate(order.createdAt)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {order.customer?.name || "Walk-in Customer"}
                          </p>
                          {order.customer && (
                            <p className="text-xs text-slate-400">{order.customer.phone}</p>
                          )}
                          {order.customerAddress && (
                            <p className="text-xs text-blue-500 truncate max-w-[150px]">
                              {order.customerAddress.label}: {order.customerAddress.full}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("capitalize text-xs shadow-none font-medium", PAYMENT_CONFIG[order.paymentMethod] || "bg-slate-100")}>
                          {order.paymentMethod}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("capitalize text-xs shadow-none font-medium", statusCfg.className)}>
                          {statusCfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">{order.items.length} items</TableCell>
                      <TableCell className="text-right font-bold text-sm text-slate-900">${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-8 h-8 opacity-0 group-hover:opacity-100">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Eye className="w-4 h-4 mr-2" />View Details</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600"><XCircle className="w-4 h-4 mr-2" />Cancel Order</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}