"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { 
  DollarSign, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowUpRight,
  Wallet
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";

const PAYOUTS = [
  { id: "p1", seller: "Fashion Nova", method: "Stripe", amount: "$1,240.00", status: "completed", date: "May 10, 2024" },
  { id: "p2", seller: "Tech Giant",   method: "Bank Transfer", amount: "$890.50", status: "pending", date: "May 11, 2024" },
  { id: "p3", seller: "Eco Living",   method: "PayPal", amount: "$450.00", status: "failed", date: "May 9, 2024" },
  { id: "p4", seller: "Modern Home",  method: "Stripe", amount: "$2,100.00", status: "completed", date: "May 5, 2024" },
];

export default function PayoutsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Seller Payouts</h1>
            <p className="text-sm text-slate-500">Manage and track payments sent to your marketplace vendors.</p>
          </div>
          <Button className="shadow-sm gap-2">
            <Download className="w-4 h-4" />
            Export Payouts
          </Button>
        </div>

        {/* Highlight Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total Paid Out" value="$45,200" icon={CheckCircle2} color="text-emerald-600 bg-emerald-50" />
          <StatCard title="Pending Payouts" value="$2,450" icon={Clock} color="text-amber-600 bg-amber-50" />
          <StatCard title="Active Wallets" value="124" icon={Wallet} color="text-blue-600 bg-blue-50" />
          <StatCard title="Failed Transfers" value="2" icon={AlertCircle} color="text-red-600 bg-red-50" />
        </div>

        <Card className="border-none shadow-sm">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search by seller..." className="pl-10 h-10" />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-slate-50/50">
                <TableHead>Seller</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PAYOUTS.map((p) => (
                <TableRow key={p.id} className="group hover:bg-slate-50/50">
                  <TableCell className="font-bold text-slate-900">{p.seller}</TableCell>
                  <TableCell className="text-sm text-slate-500">{p.method}</TableCell>
                  <TableCell className="font-black text-slate-900">{p.amount}</TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "text-[10px] uppercase font-bold tracking-widest shadow-none",
                      p.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                      p.status === "pending" ? "bg-amber-100 text-amber-700" :
                      "bg-red-100 text-red-700"
                    )}>
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">{p.date}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 gap-2">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      Receipt
                    </Button>
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
