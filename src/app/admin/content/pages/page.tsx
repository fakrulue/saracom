"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { 
  FileText, 
  Plus, 
  Search, 
  Eye, 
  MoreHorizontal, 
  Globe, 
  Clock, 
  Layout, 
  ChevronRight,
  Settings2
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const PAGES = [
  { id: "p1", title: "About Us", handle: "about-us", status: "published", updated: "2d ago", views: "1.2k", type: "Standard" },
  { id: "p2", title: "Summer Collection 2024", handle: "summer-2024", status: "published", updated: "1h ago", views: "4.5k", type: "Landing" },
  { id: "p3", title: "Contact Information", handle: "contact", status: "draft", updated: "5d ago", views: "0", type: "Standard" },
  { id: "p4", title: "Privacy Policy", handle: "privacy", status: "published", updated: "1m ago", views: "124", type: "Policy" },
  { id: "p5", title: "Terms of Service", handle: "terms", status: "published", updated: "1m ago", views: "89", type: "Policy" },
];

export default function ContentPages() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pages</h1>
            <p className="text-sm text-slate-500">Create and manage the custom pages and landing sections for your store.</p>
          </div>
          <Button className="shadow-sm gap-2">
            <Plus className="w-4 h-4" />
            Add New Page
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total Pages" value="24" icon={FileText} color="text-slate-600 bg-slate-100" />
          <StatCard title="Total Views" value="48.5k" icon={Eye} color="text-emerald-600 bg-emerald-50" />
          <StatCard title="Landing Pages" value="6" icon={Layout} color="text-blue-600 bg-blue-50" />
          <StatCard title="Published" value="18" icon={Globe} color="text-violet-600 bg-violet-50" />
        </div>

        <Card className="border-none shadow-sm">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search pages..." className="pl-10 h-10" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-2">
                <Settings2 className="w-3.5 h-3.5" />
                SEO Settings
              </Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-slate-50/50">
                <TableHead>Title & Handle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Views</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PAGES.map((page) => (
                <TableRow key={page.id} className="group hover:bg-slate-50/50 cursor-pointer">
                  <TableCell>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{page.title}</p>
                      <p className="text-xs text-slate-400 font-mono">/{page.handle}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "text-[10px] uppercase font-bold tracking-widest shadow-none",
                      page.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                    )}>
                      {page.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-bold py-0">{page.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {page.updated}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-600">{page.views}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <Eye className="w-4 h-4 text-slate-400" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Content</DropdownMenuItem>
                          <DropdownMenuItem>SEO Editor</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Unpublish</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
