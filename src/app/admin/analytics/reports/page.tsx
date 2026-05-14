"use client";

import React from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { 
  FileText, 
  Download, 
  Calendar, 
  ChevronRight, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign,
  Search,
  Plus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const REPORTS = [
  { id: "r1", name: "Daily Sales Summary", type: "Sales", frequency: "Daily", lastRun: "2h ago", status: "Ready" },
  { id: "r2", name: "Inventory Valuation", type: "Inventory", frequency: "Weekly", lastRun: "1d ago", status: "Ready" },
  { id: "r3", name: "Customer Acquisition", type: "Marketing", frequency: "Monthly", lastRun: "5d ago", status: "Ready" },
  { id: "r4", name: "Tax Liabilities",      type: "Finance",   frequency: "Quarterly", lastRun: "1m ago", status: "Ready" },
  { id: "r5", name: "Top Products by SKU",  type: "Sales",     frequency: "Manual",   lastRun: "Never", status: "Draft" },
];

export default function ReportsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reports & Exports</h1>
            <p className="text-sm text-slate-500">Generate and schedule detailed business reports in CSV, PDF, or Excel format.</p>
          </div>
          <Button className="shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            Create Custom Report
          </Button>
        </div>

        {/* Quick Export Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ExportCard title="Sales Report" icon={DollarSign} color="text-emerald-600 bg-emerald-50" />
          <ExportCard title="Product Catalog" icon={ShoppingCart} color="text-blue-600 bg-blue-50" />
          <ExportCard title="Customer List" icon={Users} color="text-violet-600 bg-violet-50" />
          <ExportCard title="Inventory Audit" icon={TrendingUp} color="text-amber-600 bg-amber-50" />
        </div>

        {/* Scheduled Reports List */}
        <Card className="border-none shadow-sm">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Generated Reports</CardTitle>
                <CardDescription>Recently generated and scheduled reports.</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input placeholder="Search reports..." className="pl-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {REPORTS.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{report.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="secondary" className="text-[10px] uppercase font-bold py-0">{report.type}</Badge>
                        <span className="text-xs text-slate-400 font-medium">• {report.frequency}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Last Run</p>
                      <p className="text-sm font-medium text-slate-600">{report.lastRun}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-8 gap-2">
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

function ExportCard({ title, icon: Icon, color }: any) {
  return (
    <Card className="border-none shadow-sm cursor-pointer hover:shadow-md transition-all group">
      <CardContent className="p-5 flex items-center gap-4">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", color)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-900">{title}</p>
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase mt-0.5">
            <Download className="w-3 h-3" />
            Quick CSV
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
