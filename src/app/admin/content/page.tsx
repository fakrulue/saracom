"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { 
  FileText, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Copy, 
  Trash2,
  Eye,
  Clock,
  Globe,
  Image as ImageIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const PAGES = [
  { id: "p1", title: "About Us", handle: "about", status: "published", type: "information", updatedAt: "May 10, 2026" },
  { id: "p2", title: "Contact Us", handle: "contact", status: "published", type: "information", updatedAt: "May 9, 2026" },
  { id: "p3", title: "Shipping & Returns", handle: "shipping-returns", status: "published", type: "information", updatedAt: "May 8, 2026" },
  { id: "p4", title: "Privacy Policy", handle: "privacy-policy", status: "published", type: "legal", updatedAt: "May 5, 2026" },
  { id: "p5", title: "Terms of Service", handle: "terms-of-service", status: "draft", type: "legal", updatedAt: "May 1, 2026" },
  { id: "p6", title: "How to Place an Order", handle: "how-to-place-an-order", status: "published", type: "information", updatedAt: "Apr 28, 2026" },
];

export default function ContentPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = PAGES.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(search.toLowerCase()) ||
                         page.handle.toLowerCase().includes(search.toLowerCase());
    if (filter === "all") return matchesSearch;
    if (filter === "published") return page.status === "published" && matchesSearch;
    if (filter === "draft") return page.status === "draft" && matchesSearch;
    return matchesSearch;
  });

  const stats = [
    { label: "Total Pages", value: PAGES.length },
    { label: "Published", value: PAGES.filter(p => p.status === "published").length },
    { label: "Draft", value: PAGES.filter(p => p.status === "draft").length },
    { label: "Legal", value: PAGES.filter(p => p.type === "legal").length },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pages</h1>
            <p className="text-sm text-slate-500">Manage your storefront pages and content.</p>
          </div>
          <Button className="shadow-sm gap-2">
            <Plus className="w-4 h-4" />
            Create Page
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(s => (
            <Card key={s.label} className="border-none shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-slate-100">
                  <FileText className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{s.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pages List */}
        <Card className="border-none shadow-sm">
          <div className="p-4 border-b flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search pages..." 
                className="pl-10" 
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-1 border rounded-lg p-1">
              {["all", "published", "draft"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all",
                    filter === tab ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-slate-50/50">
                <TableHead>Title</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(page => (
                <TableRow key={page.id} className="group hover:bg-slate-50/50 cursor-pointer">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                        <FileText className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{page.title}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-xs text-slate-500 font-mono">/pages/{page.handle}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal capitalize">{page.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "shadow-none capitalize",
                      page.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                    )}>
                      {page.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">{page.updatedAt}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8 opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Eye className="w-4 h-4 mr-2" />View</DropdownMenuItem>
                        <DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
                        <DropdownMenuItem><Copy className="w-4 h-4 mr-2" />Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600"><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center text-slate-400 text-sm">
                    No pages found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AdminLayout>
  );
}