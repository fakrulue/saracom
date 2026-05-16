"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { 
  Star, 
  Search, 
  Filter, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  CheckCircle2, 
  XCircle,
  MoreHorizontal,
  Clock,
  Video
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

type Review = {
  id: string;
  productName: string;
  reviewerName: string;
  reviewText: string | null;
  rating: number;
  status: string;
  videoUrl: string;
  createdAt: string;
};

function getTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return `${Math.floor(diff / 2592000)}mo ago`;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn("w-3.5 h-3.5", i < rating ? "fill-amber-400 text-amber-400" : "text-slate-300")} />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/v1/reviews")
      .then(r => r.json())
      .then(({ data }) => setReviews(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = reviews.filter(r => 
    (filter === "all" || r.status === filter) &&
    (r.productName?.toLowerCase().includes(search.toLowerCase()) || r.reviewerName?.toLowerCase().includes(search.toLowerCase()))
  );

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews).toFixed(1) : "0";
  const pendingCount = reviews.filter(r => r.status === "pending").length;
  const flaggedCount = reviews.filter(r => r.status === "flagged").length;
  const videoCount = reviews.filter(r => r.videoUrl).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Product Reviews</h1>
            <p className="text-sm text-slate-500">Moderate and manage customer feedback on your products.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <StatCard title="Average Rating" value={loading ? "—" : avgRating} icon={Star} color="text-amber-500 bg-amber-50" />
          <StatCard title="Total Reviews" value={loading ? "—" : String(totalReviews)} icon={MessageSquare} color="text-blue-600 bg-blue-50" />
          <StatCard title="Video Reviews" value={loading ? "—" : String(videoCount)} icon={Video} color="text-violet-600 bg-violet-50" />
          <StatCard title="Pending Review" value={loading ? "—" : String(pendingCount)} icon={Clock} color="text-amber-600 bg-amber-50" />
          <StatCard title="Flagged" value={loading ? "—" : String(flaggedCount)} icon={XCircle} color="text-red-600 bg-red-50" />
        </div>

        {/* Reviews Table */}
        <Card className="border-none shadow-sm">
          <div className="p-4 border-b flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search reviews or products..." 
                className="pl-10"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-1 border rounded-lg p-1">
              {["all", "published", "pending", "flagged"].map(t => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all",
                    filter === t ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-slate-50/50">
                <TableHead>Customer & Product</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-slate-400">
                    Loading reviews...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <div className="flex flex-col items-center">
                      <Star className="w-10 h-10 text-slate-300 mb-2" />
                      <p className="text-slate-500">No reviews found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((review) => (
                  <TableRow key={review.id} className="group hover:bg-slate-50/50">
                    <TableCell>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{review.reviewerName}</p>
                        <p className="text-xs text-slate-500 italic">on {review.productName}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StarRating rating={review.rating || 5} />
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div className="flex flex-col gap-2">
                        <p className="text-sm text-slate-600 line-clamp-2 italic">"{review.reviewText || "No comment"}"</p>
                        {review.videoUrl && (
                          <div className="flex items-center gap-2 text-[10px] font-bold text-violet-600 bg-violet-50 w-fit px-2 py-0.5 rounded uppercase">
                            <Video className="w-3 h-3" />
                            Video Attached
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "text-[10px] uppercase font-bold tracking-widest shadow-none",
                        review.status === "published" ? "bg-emerald-100 text-emerald-700" :
                        review.status === "pending" ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      )}>
                        {review.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500 font-medium">{review.createdAt ? getTimeAgo(review.createdAt) : "—"}</TableCell>
                    <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {review.status === "pending" && (
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-emerald-600 hover:bg-emerald-50">
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Product</DropdownMenuItem>
                          <DropdownMenuItem>View Customer</DropdownMenuItem>
                          <DropdownMenuItem>Reply to Review</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete Review</DropdownMenuItem>
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
