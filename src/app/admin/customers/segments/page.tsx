"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  Mail, 
  MoreHorizontal, 
  Target, 
  Zap, 
  TrendingUp,
  UserPlus
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

type Segment = {
  id: string;
  name: string;
  query: string;
  count: number;
  growth: string | null;
  color: string;
};

function StatCard({ title, value, icon: Icon, color }: { title: string; value: string; icon: any; color: string }) {
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-5 flex items-center gap-4">
        <div className={cn("p-2.5 rounded-xl", color)}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SegmentsPage() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/v1/segments")
      .then(r => r.json())
      .then(({ data }) => setSegments(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = segments.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.query.toLowerCase().includes(search.toLowerCase())
  );

  const totalCount = segments.reduce((sum, s) => sum + s.count, 0);
  const totalSegments = segments.length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Customer Segments</h1>
            <p className="text-sm text-slate-500">Group your customers into segments for targeted marketing and analysis.</p>
          </div>
          <Button className="shadow-sm gap-2">
            <Plus className="w-4 h-4" />
            Create Segment
          </Button>
        </div>

        {/* Highlight Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total Audience" value={loading ? "—" : totalCount.toLocaleString()} icon={Users} color="text-slate-600 bg-slate-100" />
          <StatCard title="Active Segments" value={loading ? "—" : String(totalSegments)} icon={Target} color="text-emerald-600 bg-emerald-50" />
          <StatCard title="Conversion Rate" value="—" icon={Zap} color="text-amber-600 bg-amber-50" />
          <StatCard title="Avg. Growth" value="—" icon={TrendingUp} color="text-blue-600 bg-blue-50" />
        </div>

        {/* Segments Table */}
        <Card className="border-none shadow-sm">
          <CardHeader className="border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">All Segments</CardTitle>
                <CardDescription>Manage and track your customer groups.</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Search segments..." 
                  className="pl-10 h-10 border-slate-200" 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-slate-50/50">
                <TableHead className="w-[300px]">Segment Name</TableHead>
                <TableHead>Query / Condition</TableHead>
                <TableHead>Customer Count</TableHead>
                <TableHead>30d Growth</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-slate-400">
                    Loading segments...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    <div className="flex flex-col items-center">
                      <Target className="w-10 h-10 text-slate-300 mb-2" />
                      <p className="text-slate-500">No segments found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((segment) => (
                  <TableRow key={segment.id} className="group hover:bg-slate-50/50 cursor-pointer">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", segment.color || "text-slate-600 bg-slate-50")}>
                          <Target className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-slate-900">{segment.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-mono">
                        {segment.query}
                      </code>
                    </TableCell>
                    <TableCell className="font-medium text-slate-600">{(segment.count || 0).toLocaleString()} members</TableCell>
                    <TableCell>
                      <span className={cn(
                        "text-sm font-bold",
                        segment.growth?.startsWith("+") ? "text-emerald-600" : segment.growth?.startsWith("-") ? "text-red-600" : "text-slate-600"
                      )}>
                        {segment.growth || "—"}
                      </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" className="h-8 gap-2">
                        <Mail className="w-4 h-4" />
                        Send Email
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Query</DropdownMenuItem>
                          <DropdownMenuItem>Export CSV</DropdownMenuItem>
                          <DropdownMenuItem>Sync to Meta Ads</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete Segment</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
