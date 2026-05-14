"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { 
  BookOpen, 
  Plus, 
  Search, 
  MessageSquare, 
  Tag, 
  Clock, 
  Calendar,
  MoreHorizontal,
  ChevronRight,
  Eye,
  User
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

const BLOG_POSTS = [
  { id: "b1", title: "10 Style Tips for Summer 2024", author: "Sarah Jenkins", category: "Fashion", status: "published", date: "May 10, 2024", comments: 12, views: "1.5k" },
  { id: "b2", title: "The Art of Selecting Leather", author: "Michael Ross", category: "Craftsmanship", status: "published", date: "May 8, 2024",  comments: 5,  views: "850" },
  { id: "b3", title: "Why Sustainable Fashion Matters", author: "Emma Green", category: "Sustainability", status: "draft",     date: "May 5, 2024",  comments: 0,  views: "0" },
  { id: "b4", title: "Behind the Scenes: Our Factory", author: "David Blue",  category: "Inside Saracom", status: "published", date: "Apr 28, 2024", comments: 24, views: "3.2k" },
];

export default function BlogManagement() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Blog Posts</h1>
            <p className="text-sm text-slate-500">Share stories, updates, and style guides with your customers.</p>
          </div>
          <Button className="shadow-sm gap-2">
            <Plus className="w-4 h-4" />
            Write New Post
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total Posts" value="48" icon={BookOpen} color="text-slate-600 bg-slate-100" />
          <StatCard title="Avg. Read Time" value="4.5m" icon={Clock} color="text-blue-600 bg-blue-50" />
          <StatCard title="Total Comments" value="1,240" icon={MessageSquare} color="text-amber-600 bg-amber-50" />
          <StatCard title="Subscribers" value="8.4k" icon={User} color="text-emerald-600 bg-emerald-50" />
        </div>

        <Card className="border-none shadow-sm">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search articles..." className="pl-10 h-10" />
            </div>
            <div className="flex items-center gap-2 border rounded-lg p-1">
              {["all", "published", "draft", "archived"].map(t => (
                <button key={t} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-slate-50 transition-all text-slate-500">
                  {t}
                </button>
              ))}
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-slate-50/50">
                <TableHead>Article</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {BLOG_POSTS.map((post) => (
                <TableRow key={post.id} className="group hover:bg-slate-50/50 cursor-pointer">
                  <TableCell>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">{post.title}</p>
                        <p className="text-xs text-slate-400 font-medium">by {post.author}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "text-[10px] uppercase font-bold tracking-widest shadow-none",
                      post.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                    )}>
                      {post.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-bold py-0">{post.category}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 font-medium">{post.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4 text-slate-400">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold">{post.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold">{post.comments}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Post</DropdownMenuItem>
                        <DropdownMenuItem>Moderate Comments</DropdownMenuItem>
                        <DropdownMenuItem>Social Share</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete Post</DropdownMenuItem>
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
