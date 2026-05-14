"use client";

import React, { useState, useCallback, useRef } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { 
  Upload, 
  Search, 
  MoreHorizontal, 
  Trash2, 
  Download,
  Grid,
  List as ListIcon,
  HardDrive,
  Image,
  Film,
  FileText,
  X,
  Check,
  Loader2,
  Eye,
  Pencil,
  FolderOpen
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type MediaItem = {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  alt: string | null;
  createdAt: string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return Image;
  if (mimeType.startsWith("video/")) return Film;
  return FileText;
}

function getFileColor(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "text-emerald-600 bg-emerald-50";
  if (mimeType.startsWith("video/")) return "text-blue-600 bg-blue-50";
  return "text-violet-600 bg-violet-50";
}

export default function FilesPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, pages: 0 });
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [editAlt, setEditAlt] = useState<MediaItem | null>(null);
  const [altText, setAltText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      if (search) params.set("search", search);
      
      const res = await fetch(`/api/v1/media?${params}`);
      const data = await res.json();
      setMedia(data.media || []);
      setPagination(prev => ({ ...prev, ...data.pagination }));
    } catch (error) {
      console.error("Failed to fetch media:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search]);

  React.useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    const uploaded: MediaItem[] = [];
    
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      
      try {
        const res = await fetch("/api/v1/media", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.media) {
          uploaded.push(data.media);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
    
    setMedia(prev => [...uploaded, ...prev]);
    setPagination(prev => ({ ...prev, total: prev.total + uploaded.length }));
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) {
      handleUpload(e.dataTransfer.files);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/v1/media?id=${id}`, { method: "DELETE" });
      setMedia(prev => prev.filter(m => m.id !== id));
      setPagination(prev => ({ ...prev, total: prev.total - 1 }));
      setSelectedFiles(prev => prev.filter(f => f !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleBulkDelete = async () => {
    for (const id of selectedFiles) {
      await handleDelete(id);
    }
    setSelectedFiles([]);
  };

  const handleUpdateAlt = async () => {
    if (!editAlt) return;
    try {
      await fetch("/api/v1/media", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editAlt.id, alt: altText }),
      });
      setMedia(prev => prev.map(m => m.id === editAlt.id ? { ...m, alt: altText } : m));
      setEditAlt(null);
      setAltText("");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedFiles(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedFiles.length === media.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(media.map(m => m.id));
    }
  };

  const stats = {
    total: pagination.total,
    images: media.filter(m => m.mimeType.startsWith("image/")).length,
    videos: media.filter(m => m.mimeType.startsWith("video/")).length,
    documents: media.filter(m => !m.mimeType.startsWith("image/") && !m.mimeType.startsWith("video/")).length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Files</h1>
            <p className="text-sm text-slate-500">Upload and manage your store's assets, documents, and media.</p>
          </div>
          <div className="flex items-center gap-2">
            {selectedFiles.length > 0 && (
              <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete ({selectedFiles.length})
              </Button>
            )}
            <Button className="shadow-sm gap-2" onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4" />
              Upload Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => e.target.files && handleUpload(e.target.files)}
            />
          </div>
        </div>

        {/* Storage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard 
            title="Total Files" 
            value={`${pagination.total} files`} 
            icon={HardDrive} 
            color="text-slate-600 bg-slate-100" 
          />
          <StatCard 
            title="Images" 
            value={`${stats.images} files`} 
            icon={Image} 
            color="text-emerald-600 bg-emerald-50" 
          />
          <StatCard 
            title="Videos" 
            value={`${stats.videos} files`} 
            icon={Film} 
            color="text-blue-600 bg-blue-50" 
          />
          <StatCard 
            title="Documents" 
            value={`${stats.documents} files`} 
            icon={FileText} 
            color="text-violet-600 bg-violet-50" 
          />
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center transition-all",
            isDragging 
              ? "border-blue-500 bg-blue-50" 
              : "border-slate-200 hover:border-slate-300"
          )}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
              <Upload className="w-6 h-6 text-slate-500" />
            </div>
            <div>
              <p className="font-medium text-slate-700">
                {isDragging ? "Drop files here" : "Drag and drop files here"}
              </p>
              <p className="text-sm text-slate-500">or click the Upload button</p>
            </div>
            {uploading && (
              <div className="flex items-center gap-2 text-blue-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </div>
            )}
          </div>
        </div>

        {/* Browser Tools */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search files..." 
                className="pl-10 h-10 border-slate-200"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border shadow-sm">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("w-8 h-8", view === "grid" ? "bg-slate-100" : "")}
              onClick={() => setView("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("w-8 h-8", view === "list" ? "bg-slate-100" : "")}
              onClick={() => setView("list")}
            >
              <ListIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Selection Bar */}
        {media.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-2 hover:text-slate-900"
            >
              <div className={cn(
                "w-4 h-4 rounded border flex items-center justify-center",
                selectedFiles.length === media.length && selectedFiles.length > 0
                  ? "bg-blue-600 border-blue-600"
                  : "border-slate-300"
              )}>
                {selectedFiles.length === media.length && selectedFiles.length > 0 && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
              Select all
            </button>
            <span className="text-slate-400">|</span>
            <span>{selectedFiles.length} selected</span>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : media.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <FolderOpen className="w-12 h-12 mb-4 text-slate-300" />
            <p className="font-medium">No files found</p>
            <p className="text-sm">Upload some files to get started</p>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {media.map(file => {
              const Icon = getFileIcon(file.mimeType);
              const colorClass = getFileColor(file.mimeType);
              const isSelected = selectedFiles.includes(file.id);
              
              return (
                <Card 
                  key={file.id} 
                  className={cn(
                    "border-none shadow-sm group cursor-pointer transition-all overflow-hidden",
                    isSelected ? "ring-2 ring-blue-600" : "hover:ring-1 hover:ring-slate-200"
                  )}
                  onClick={() => toggleSelect(file.id)}
                >
                  <div className="aspect-square bg-slate-50 flex items-center justify-center relative overflow-hidden">
                    {file.mimeType.startsWith("image/") ? (
                      <img 
                        src={file.url} 
                        alt={file.alt || file.originalName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icon className="w-10 h-10 text-slate-300" />
                    )}
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors" />
                    <div className={cn(
                      "absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                      isSelected 
                        ? "bg-blue-600 border-blue-600" 
                        : "bg-white/80 border-slate-300 opacity-0 group-hover:opacity-100"
                    )}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-7 h-7 bg-white/90 hover:bg-white shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewItem(file);
                        }}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-7 h-7 bg-white/90 hover:bg-white shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditAlt(file);
                          setAltText(file.alt || "");
                        }}
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-7 h-7 bg-white/90 hover:bg-red-50 text-red-500 shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(file.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <p className="text-xs font-bold text-slate-900 truncate" title={file.originalName}>
                      {file.originalName}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-widest">
                      {formatBytes(file.size)}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-none shadow-sm overflow-hidden">
            <div className="divide-y">
              {media.map(file => {
                const Icon = getFileIcon(file.mimeType);
                const colorClass = getFileColor(file.mimeType);
                const isSelected = selectedFiles.includes(file.id);
                
                return (
                  <div 
                    key={file.id} 
                    className={cn(
                      "p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer",
                      isSelected && "bg-blue-50"
                    )}
                    onClick={() => toggleSelect(file.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          colorClass
                        )}
                      >
                        {file.mimeType.startsWith("image/") ? (
                          <img src={file.url} alt="" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{file.originalName}</p>
                        <p className="text-xs text-slate-500">
                          {formatBytes(file.size)} • {new Date(file.createdAt).toLocaleDateString()}
                          {file.alt && <span className="ml-2 text-blue-600">• Alt: {file.alt}</span>}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-8 h-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewItem(file);
                        }}
                      >
                        <Eye className="w-4 h-4 text-slate-400" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-8 h-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditAlt(file);
                          setAltText(file.alt || "");
                        }}
                      >
                        <Pencil className="w-4 h-4 text-slate-400" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-8 h-8 text-red-400 hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(file.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            >
              Previous
            </Button>
            <span className="text-sm text-slate-600">
              Page {pagination.page} of {pagination.pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.pages}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            >
              Next
            </Button>
          </div>
        )}

        {/* Preview Dialog */}
        <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{previewItem?.originalName}</DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-center bg-slate-100 rounded-lg overflow-hidden">
              {previewItem?.mimeType.startsWith("image/") ? (
                <img 
                  src={previewItem.url} 
                  alt={previewItem.alt || previewItem.originalName}
                  className="max-h-[60vh] object-contain"
                />
              ) : previewItem?.mimeType.startsWith("video/") ? (
                <video 
                  src={previewItem.url} 
                  controls 
                  className="max-h-[60vh]"
                />
              ) : (
                <div className="p-12 text-slate-400">Preview not available</div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Size</p>
                <p className="font-medium">{previewItem && formatBytes(previewItem.size)}</p>
              </div>
              <div>
                <p className="text-slate-500">Type</p>
                <p className="font-medium">{previewItem?.mimeType}</p>
              </div>
              <div className="col-span-2">
                <p className="text-slate-500">URL</p>
                <p className="font-medium text-blue-600 truncate">{previewItem?.url}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Alt Dialog */}
        <Dialog open={!!editAlt} onOpenChange={() => setEditAlt(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Alt Text</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Alt Text</Label>
                <Textarea 
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Describe this image for accessibility"
                  rows={3}
                />
              </div>
              {editAlt?.mimeType.startsWith("image/") && (
                <div className="rounded-lg overflow-hidden bg-slate-100">
                  <img src={editAlt.url} alt="" className="w-full h-32 object-contain" />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditAlt(null)}>Cancel</Button>
              <Button onClick={handleUpdateAlt}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string; value: string; icon: React.ElementType; color: string }) {
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