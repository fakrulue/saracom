"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Video, 
  Star, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff,
  Image as ImageIcon,
  CheckCircle2,
  X
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MediaManager } from "@/components/admin/MediaManager";

export default function VideoReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [showMedia, setShowMedia] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<"video" | "thumb" | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/video-reviews");
      const data = await res.json();
      if (data.success) setReviews(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingReview?.id ? "PUT" : "POST";
    const url = editingReview?.id ? `/api/v1/video-reviews/${editingReview.id}` : "/api/v1/video-reviews";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingReview),
      });
      const data = await res.json();
      if (data.success) {
        fetchReviews();
        setShowModal(false);
        setEditingReview(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await fetch(`/api/v1/video-reviews/${id}`, { method: "DELETE" });
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (review: any) => {
    const newStatus = review.status === "active" ? "hidden" : "active";
    try {
      await fetch(`/api/v1/video-reviews/${review.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = reviews.filter(r => 
    r.reviewerName.toLowerCase().includes(search.toLowerCase()) ||
    r.reviewText?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Video Reviews</h1>
            <p className="text-slate-500 text-sm">Manage your customer video testimonials and social proof.</p>
          </div>
          <Button onClick={() => { setEditingReview({ reviewerName: "", videoUrl: "", rating: 5, status: "active", reviewText: "" }); setShowModal(true); }} className="gap-2 bg-pink-600 hover:bg-pink-700 shadow-lg shadow-pink-100 transition-all h-11 px-6 rounded-xl">
            <Plus className="w-4 h-4" /> Add Review
          </Button>
        </div>

        <Card className="border-none shadow-sm bg-white overflow-hidden rounded-2xl">
          <CardContent className="p-0">
            <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50/30">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Search reviews..." 
                  className="pl-10 bg-white border-slate-200 h-11 rounded-xl shadow-sm focus:ring-2 focus:ring-pink-100 transition-all" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-50 bg-slate-50/50">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Reviewer</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Video Content</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Created At</th>
                    <th className="px-6 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {loading ? (
                    <tr><td colSpan={6} className="px-6 py-20 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                        <p className="font-medium">Loading reviews...</p>
                      </div>
                    </td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-20 text-center">
                      <div className="max-w-xs mx-auto space-y-2">
                         <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Video className="w-6 h-6 text-slate-300" />
                         </div>
                         <p className="text-slate-900 font-bold">No reviews found</p>
                         <p className="text-slate-500 text-xs">Start by adding your first customer testimonial to boost your storefront conversions.</p>
                      </div>
                    </td></tr>
                  ) : filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600 border border-slate-200 shadow-sm">
                            {r.reviewerName[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{r.reviewerName}</p>
                            <p className="text-xs text-slate-500 line-clamp-1 max-w-[200px] leading-relaxed">{r.reviewText || "No text provided"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-10 rounded-lg bg-slate-900 overflow-hidden relative border border-slate-200 shadow-sm">
                            {r.thumbnailUrl ? (
                              <img src={r.thumbnailUrl} className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-500" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-slate-800"><Video className="w-4 h-4 text-white/20" /></div>
                            )}
                          </div>
                          <span className="text-[11px] font-medium text-slate-600 truncate w-32 bg-slate-100 px-2 py-1 rounded-md">{r.videoUrl.split('/').pop()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-0.5 text-yellow-400">
                          {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                          {Array.from({ length: 5 - r.rating }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-slate-200" />)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={r.status === "active" ? "default" : "secondary"} className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight", r.status === "active" ? "bg-green-50 text-green-700 border border-green-100" : "bg-slate-100 text-slate-600 border border-slate-200")}>
                          {r.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                        {new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => toggleStatus(r)} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white transition-all shadow-sm border border-transparent hover:border-slate-100" title={r.status === 'active' ? 'Hide' : 'Show'}>
                              {r.status === 'active' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                           </button>
                           <button onClick={() => { setEditingReview(r); setShowModal(true); }} className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-white transition-all shadow-sm border border-transparent hover:border-slate-100">
                              <Edit3 className="w-4 h-4" />
                           </button>
                           <button onClick={() => handleDelete(r.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-white transition-all shadow-sm border border-transparent hover:border-slate-100">
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-100">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{editingReview?.id ? "Edit Review" : "Add New Review"}</h2>
                <p className="text-xs text-slate-500 mt-0.5">Fill in the details for your social proof.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-full hover:bg-white transition-colors text-slate-400 hover:text-slate-600 shadow-sm border border-transparent hover:border-slate-100"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">Reviewer Name</label>
                  <Input 
                    required 
                    placeholder="e.g. John Doe"
                    value={editingReview?.reviewerName || ""} 
                    onChange={(e) => setEditingReview({ ...editingReview, reviewerName: e.target.value })} 
                    className="bg-slate-50 border-slate-200 h-12 rounded-xl focus:bg-white transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">Rating</label>
                  <select 
                    value={editingReview?.rating || 5} 
                    onChange={(e) => setEditingReview({ ...editingReview, rating: Number(e.target.value) })}
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:bg-white transition-all outline-none shadow-sm cursor-pointer"
                  >
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">Review Text</label>
                <textarea 
                  value={editingReview?.reviewText || ""} 
                  onChange={(e) => setEditingReview({ ...editingReview, reviewText: e.target.value })}
                  className="w-full h-28 px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium focus:bg-white transition-all outline-none resize-none shadow-sm"
                  placeholder="Share the customer's experience..."
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">Video File</label>
                  <div 
                    onClick={() => { setMediaTarget("video"); setShowMedia(true); }}
                    className="h-28 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center cursor-pointer hover:border-pink-300 hover:bg-pink-50/10 transition-all group bg-slate-50 shadow-inner"
                  >
                    {editingReview?.videoUrl ? (
                      <div className="text-center p-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                          <Video className="w-5 h-5 text-pink-500" />
                        </div>
                        <p className="text-[10px] text-slate-700 truncate w-36 font-bold uppercase tracking-tight">{editingReview.videoUrl.split('/').pop()}</p>
                      </div>
                    ) : (
                      <div className="text-center group-hover:scale-105 transition-transform">
                        <Video className="w-8 h-8 text-slate-300 mx-auto mb-2 opacity-50" />
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Select Media</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">Thumbnail</label>
                  <div 
                    onClick={() => { setMediaTarget("thumb"); setShowMedia(true); }}
                    className="h-28 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center cursor-pointer hover:border-pink-300 hover:bg-pink-50/10 transition-all overflow-hidden bg-slate-50 shadow-inner"
                  >
                    {editingReview?.thumbnailUrl ? (
                      <img src={editingReview.thumbnailUrl} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2 opacity-50" />
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Upload Cover</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-6">
                <Button type="submit" className="flex-1 bg-slate-900 text-white hover:bg-black h-13 rounded-2xl shadow-xl shadow-slate-200 font-bold tracking-tight text-base transition-all active:scale-95">Save Review</Button>
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="h-13 rounded-2xl border-slate-200 font-bold px-8 hover:bg-slate-50">Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMedia && (
        <MediaManager 
          onSelect={(url) => {
            if (mediaTarget === "video") setEditingReview({ ...editingReview, videoUrl: url });
            if (mediaTarget === "thumb") setEditingReview({ ...editingReview, thumbnailUrl: url });
            setShowMedia(false);
          }}
          onClose={() => setShowMedia(false)}
        />
      )}
    </AdminLayout>
  );
}
