"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { 
  Menu, 
  Plus, 
  GripVertical, 
  ExternalLink, 
  Trash2, 
  Settings2, 
  ChevronRight,
  Link2,
  Save
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const NAV_MENUS = [
  { id: "m1", name: "Main Menu", items: 6, status: "active", location: "Header" },
  { id: "m2", name: "Footer Link List 1", items: 4, status: "active", location: "Footer" },
  { id: "m3", name: "Sidebar Categories", items: 12, status: "active", location: "Sidebar" },
  { id: "m4", name: "Mobile Overlay", items: 5, status: "draft", location: "Mobile" },
];

export default function NavigationPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Navigation</h1>
            <p className="text-sm text-slate-500">Manage your store's menus, header links, and footer structures.</p>
          </div>
          <Button className="shadow-sm gap-2">
            <Plus className="w-4 h-4" />
            Create Menu
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu List */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Menus</h3>
            <div className="space-y-3">
              {NAV_MENUS.map(menu => (
                <Card key={menu.id} className="border-none shadow-sm cursor-pointer hover:ring-1 hover:ring-slate-200 transition-all group">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                        <Menu className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{menu.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{menu.location} • {menu.items} Items</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-colors" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Menu Editor (Mock) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="border-b px-6 py-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Main Menu</CardTitle>
                  <CardDescription>Drag and drop to reorder items.</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2 font-bold">
                  <Save className="w-4 h-4" />
                  Save Menu
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-2">
                  {[
                    { label: "Home", link: "/" },
                    { label: "Shop All", link: "/collections/all" },
                    { label: "New Arrivals", link: "/collections/new" },
                    { label: "About Us", link: "/pages/about" },
                    { label: "Contact", link: "/pages/contact" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-transparent hover:border-slate-200 transition-all group">
                      <GripVertical className="w-4 h-4 text-slate-300 cursor-grab" />
                      <div className="flex-1 flex items-center gap-4">
                        <Input value={item.label} className="h-9 border-none bg-transparent font-bold focus-visible:ring-0 px-0 shadow-none" readOnly />
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-white px-2 py-1 rounded-lg border">
                          <Link2 className="w-3 h-3" />
                          {item.link}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="w-8 h-8">
                          <Settings2 className="w-4 h-4 text-slate-400" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full border-2 border-dashed border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-400 h-12 gap-2">
                    <Plus className="w-4 h-4" />
                    Add Menu Item
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Menu Locations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 font-medium">Main Header Menu</span>
                  <Badge variant="outline" className="font-bold">Main Menu</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 font-medium">Mobile Navigation</span>
                  <Badge variant="outline" className="font-bold">Main Menu</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 font-medium">Footer Policy Menu</span>
                  <Badge variant="outline" className="font-bold">Footer Link List 1</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
