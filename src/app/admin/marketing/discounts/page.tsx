"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Plus, Tag, Percent, TicketCheck, Calendar, MoreHorizontal, Copy, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const DISCOUNTS = [
  { id: "d1", code: "SUMMER20",   type: "Percentage",     value: "20% off",     usage: 84,  limit: 200, expiry: "Jul 31, 2026", status: "active"   },
  { id: "d2", code: "FREESHIP",   type: "Free Shipping",  value: "Free shipping",usage: 201, limit: null, expiry: "Never",       status: "active"   },
  { id: "d3", code: "WELCOME10",  type: "Fixed Amount",   value: "$10 off",     usage: 452, limit: 500, expiry: "Dec 31, 2026", status: "active"   },
  { id: "d4", code: "FLASH50",    type: "Percentage",     value: "50% off",     usage: 50,  limit: 50,  expiry: "May 1, 2026",  status: "expired"  },
  { id: "d5", code: "SARACOM15",  type: "Percentage",     value: "15% off",     usage: 0,   limit: 100, expiry: "Aug 30, 2026", status: "scheduled"},
];

export default function DiscountsPage() {
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
          {[
            { label: "Active Codes", value: "3", icon: TicketCheck, color: "text-emerald-600 bg-emerald-50" },
            { label: "Total Usage",  value: "787", icon: Percent,    color: "text-blue-600 bg-blue-50" },
            { label: "Revenue Saved",value: "$4,230", icon: Tag,    color: "text-purple-600 bg-purple-50" },
          ].map(s => (
            <Card key={s.label} className="border-none shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={cn("p-2.5 rounded-xl", s.color)}>
                  <s.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{s.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
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
              {DISCOUNTS.map(d => (
                <TableRow key={d.id} className="group hover:bg-slate-50/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{d.code}</code>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{d.type}</TableCell>
                  <TableCell className="text-sm font-semibold text-slate-900">{d.value}</TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {d.usage}{d.limit ? ` / ${d.limit}` : ""}
                    {d.limit && (
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${Math.min((d.usage / d.limit) * 100, 100)}%` }}
                        />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />{d.expiry}
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
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AdminLayout>
  );
}
