"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Store, 
  Users, 
  TrendingUp, 
  CheckCircle2,
  AlertCircle,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const SELLERS = [
  { id: "s1", name: "Fashion Nova", owner: "Sarah Jenkins", email: "sarah@fashionnova.com", status: "active",   sales: "$45,200", products: 124, joined: "Jan 12, 2024" },
  { id: "s2", name: "Tech Giant",   owner: "John Smith",    email: "john@techgiant.com",   status: "active",   sales: "$12,800", products: 45,  joined: "Feb 05, 2024" },
  { id: "s3", name: "Eco Living",   owner: "Emma Green",    email: "emma@ecoliving.com",   status: "pending",  sales: "$0",      products: 0,   joined: "May 10, 2024" },
  { id: "s4", name: "Modern Home",  owner: "David Blue",    email: "david@modernhome.com", status: "suspended", sales: "$2,400",  products: 12,  joined: "Dec 20, 2023" },
  { id: "s5", name: "Urban Style",  owner: "Lisa Ray",      email: "lisa@urbanstyle.com",  status: "active",   sales: "$8,900",  products: 32,  joined: "Mar 15, 2024" },
];

const STATUS_MAP: Record<string, { label: string; icon: any; className: string }> = {
  active:    { label: "Active",    icon: CheckCircle2, className: "bg-emerald-100 text-emerald-700" },
  pending:   { label: "Pending",   icon: Clock,        className: "bg-amber-100 text-amber-700" },
  suspended: { label: "Suspended", icon: AlertCircle,  className: "bg-red-100 text-red-700" },
};

export default function SellersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = SELLERS.filter(s => 
    (filter === "all" || s.status === filter) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.owner.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sellers</h1>
            <p className="text-sm text-slate-500">Manage your marketplace vendors and their permissions.</p>
          </div>
          <Button className="shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Seller
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total Sellers" value={SELLERS.length.toString()} icon={Store} color="text-slate-700 bg-slate-100" />
          <StatCard title="Active" value="128" icon={CheckCircle2} color="text-emerald-700 bg-emerald-100" />
          <StatCard title="Pending Review" value="5" icon={Clock} color="text-amber-700 bg-amber-100" />
          <StatCard title="Total Commission" value="$4,250" icon={TrendingUp} color="text-blue-700 bg-blue-100" />
        </div>

        {/* Sellers Table */}
        <Card className="border-none shadow-sm">
          <div className="p-4 border-b flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search sellers by name or owner..." 
                className="pl-10"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-1 border rounded-lg p-1">
              {["all", "active", "pending", "suspended"].map(t => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all",
                    filter === t ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-slate-50/50">
                <TableHead>Seller</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Total Sales</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((seller) => (
                <TableRow key={seller.id} className="group hover:bg-slate-50/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{seller.name}</p>
                        <p className="text-xs text-slate-500">{seller.owner} • {seller.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("text-[10px] uppercase font-bold tracking-widest shadow-none", STATUS_MAP[seller.status].className)}>
                      <span className="flex items-center gap-1">
                        {React.createElement(STATUS_MAP[seller.status].icon, { className: "w-3 h-3" })}
                        {STATUS_MAP[seller.status].label}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-600">{seller.products}</TableCell>
                  <TableCell className="text-sm font-bold text-slate-900">{seller.sales}</TableCell>
                  <TableCell className="text-sm text-slate-500">{seller.joined}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Dashboard</DropdownMenuItem>
                        <DropdownMenuItem>Manage Products</DropdownMenuItem>
                        <DropdownMenuItem>Payout Settings</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Suspend Account</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-5 flex items-center gap-4">
        <div className={cn("p-2.5 rounded-xl", color)}>
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
