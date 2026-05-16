"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Plus, Tag, Percent, TicketCheck, Calendar, MoreHorizontal, Copy, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type Discount = {
  id: string;
  code: string;
  type: string;
  value: number;
  usage: number;
  usageLimit: number | null;
  expiry: string | null;
  status: string;
};

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/discounts")
      .then(r => r.json())
      .then(({ data }) => setDiscounts(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const activeCount = discounts.filter(d => d.status === "active").length;
  const totalUsage = discounts.reduce((sum, d) => sum + (d.usage || 0), 0);

  function getDiscountValue(d: Discount): string {
    if (d.type === "Percentage") return `${d.value}% off`;
    if (d.type === "FreeShipping") return "Free shipping";
    return `$${d.value} off`;
  }
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Discounts</h1>
            <p className="text-sm text-slate-500">Create and manage discount codes for your store.</p>
          </div>
          <Link href="/admin/marketing/discounts/new">
            <Button className="shadow-sm"><Plus className="w-4 h-4 mr-2" />Create Discount</Button>
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-none shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-2.5 rounded-xl text-emerald-600 bg-emerald-50">
                <TicketCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Codes</p>
                <p className="text-2xl font-bold text-slate-900">{loading ? "—" : activeCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-2.5 rounded-xl text-blue-600 bg-blue-50">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Usage</p>
                <p className="text-2xl font-bold text-slate-900">{loading ? "—" : totalUsage}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-2.5 rounded-xl text-purple-600 bg-purple-50">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Discounts</p>
                <p className="text-2xl font-bold text-slate-900">{loading ? "—" : discounts.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-transparent">
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-slate-400">
                    Loading discounts...
                  </TableCell>
                </TableRow>
              ) : discounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <div className="flex flex-col items-center">
                      <Tag className="w-10 h-10 text-slate-300 mb-2" />
                      <p className="text-slate-500">No discounts found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                discounts.map(d => (
                  <TableRow key={d.id} className="group hover:bg-slate-50/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{d.code}</code>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{d.type}</TableCell>
                    <TableCell className="text-sm font-semibold text-slate-900">{getDiscountValue(d)}</TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {d.usage}{d.usageLimit ? ` / ${d.usageLimit}` : ""}
                      {d.usageLimit && (
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${Math.min((d.usage / d.usageLimit) * 100, 100)}%` }}
                          />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />{d.expiry || "Never"}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("capitalize text-xs shadow-none font-medium",
                        d.status === "active"    ? "bg-emerald-100 text-emerald-700" :
                        d.status === "expired"   ? "bg-red-100 text-red-600" :
                                                   "bg-amber-100 text-amber-700")}>
                        {d.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-8 h-8 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
<DropdownMenuContent align="end">
                          <DropdownMenuItem><Copy className="w-4 h-4 mr-2" />Duplicate</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600"><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AdminLayout>
  );
}
