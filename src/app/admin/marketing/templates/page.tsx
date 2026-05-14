"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { 
  Mail, 
  Plus, 
  Search, 
  Eye, 
  Copy, 
  Settings2, 
  Smartphone, 
  Layout, 
  ChevronRight,
  FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TEMPLATES = [
  { id: "t1", name: "Order Confirmation", type: "Email", status: "active", lastUsed: "2m ago" },
  { id: "t2", name: "Shipping Update",    type: "Email", status: "active", lastUsed: "1h ago" },
  { id: "t3", name: "Welcome Sequence",  type: "Email", status: "draft",  lastUsed: "Never" },
  { id: "t4", name: "Delivery Alert",     type: "SMS",   status: "active", lastUsed: "5m ago" },
  { id: "t5", name: "Abandoned Cart",     type: "Email", status: "active", lastUsed: "1d ago" },
];

export default function MarketingTemplates() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Communication Templates</h1>
            <p className="text-sm text-slate-500">Design and manage your automated Email and SMS notifications.</p>
          </div>
          <Button className="shadow-sm gap-2">
            <Plus className="w-4 h-4" />
            New Template
          </Button>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TemplateCategory title="Transactional" count={12} icon={FileText} />
          <TemplateCategory title="Marketing" count={8} icon={Mail} />
          <TemplateCategory title="Customer Care" count={5} icon={Smartphone} />
        </div>

        {/* Template List */}
        <Card className="border-none shadow-sm">
          <CardHeader className="border-b px-6 py-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">All Templates</CardTitle>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search templates..." className="pl-10 h-10 border-slate-200" />
            </div>
          </CardHeader>
          <div className="divide-y">
            {TEMPLATES.map(template => (
              <div key={template.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    template.type === "Email" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                  )}>
                    {template.type === "Email" ? <Mail className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{template.name}</p>
                    <p className="text-xs text-slate-500">{template.type} • Last used {template.lastUsed}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={cn(
                    "text-[10px] uppercase font-bold tracking-widest shadow-none",
                    template.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                  )}>
                    {template.status}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <Eye className="w-4 h-4 text-slate-400" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Settings2 className="w-4 h-4 text-slate-400" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Copy className="w-4 h-4 text-slate-400" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}

function TemplateCategory({ title, count, icon: Icon }: any) {
  return (
    <Card className="border-none shadow-sm cursor-pointer hover:shadow-md transition-all group">
      <CardContent className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{title}</p>
            <p className="text-xs text-slate-500">{count} Templates</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
      </CardContent>
    </Card>
  );
}
