"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { X, Upload, Search, Image, Trash2, Check, Grid, List, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

type MediaManagerProps = {
  onSelect: (url: string, alt: string | null) => void;
  onClose?: () => void;
  mode?: "select" | "manage";
  selectedUrl?: string;
};

export function MediaManager({ onSelect, onClose, mode = "select", selectedUrl }: MediaManagerProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<MediaItem | null>(null);

  useEffect(() => {
    if (selectedUrl && media.length > 0) {
      const found = media.find(m => m.url === selectedUrl);
      if (found) setSelected(found);
    }
  }, [media, selectedUrl]);

  const [view, setView] = useState<"grid" | "list">("grid");
  const [dragged, setDragged] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const limit = 30;

  const fetchMedia = useCallback(async (searchTerm = "", pageNum = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        page: String(pageNum),
        limit: String(limit),
      });
      const res = await fetch(`/api/v1/media?${params}`);
      const data = await res.json();
      setMedia(Array.isArray(data.media) ? data.media : []);
      setTotal(data.pagination?.total ?? 0);
      setPage(pageNum);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/v1/media", { method: "POST", body: fd });
        const data = await res.json();
        if (res.ok && data.media) {
          setMedia(prev => [data.media, ...prev]);
          setTotal(prev => prev + 1);
        } else {
          alert("Upload failed: " + (data.error || "Unknown error"));
        }
      }
    } catch (err) {
      console.error(err);
      alert("Upload error: " + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragged(false);
    await handleUpload(e.dataTransfer.files);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    try {
      await fetch(`/api/v1/media/${id}?id=${id}`, { method: "DELETE" });
      setMedia(prev => prev.filter(m => m.id !== id));
      setTotal(prev => prev - 1);
      if (selected?.id === id) setSelected(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMedia(search, 1);
  };

  const handleSelect = () => {
    if (selected) {
      onSelect(selected.url, selected.alt);
      onClose?.();
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isImage = (mime: string) => mime.startsWith("image/");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col w-full max-w-5xl max-h-[85vh] mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <FolderOpen className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-bold">Media Library</h2>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{total} files</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setView("grid")}
                className={cn("p-1.5 rounded-md transition-colors", view === "grid" ? "bg-white shadow-sm" : "text-slate-400")}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={cn("p-1.5 rounded-md transition-colors", view === "list" ? "bg-white shadow-sm" : "text-slate-400")}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            {onClose && (
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 px-6 py-3 border-b bg-slate-50/50">
          <div className="flex-1 relative">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search files..."
                  className="pl-9 h-9"
                />
              </div>
              <Button type="submit" variant="outline" size="sm">Search</Button>
            </form>
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={e => handleUpload(e.target.files)}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              size="sm"
              className="gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>

        {/* Drop zone */}
        <div
          className={cn(
            "mx-6 mt-3 border-2 border-dashed rounded-xl transition-colors text-center py-4 text-sm text-slate-400",
            dragged ? "border-brand-pink bg-brand-pink/5" : "border-slate-200"
          )}
          onDragOver={e => { e.preventDefault(); setDragged(true); }}
          onDragLeave={() => setDragged(false)}
          onDrop={handleDrop}
        >
          <Upload className="w-6 h-6 mx-auto mb-1 opacity-50" />
          Drag & drop images here or click Upload
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-6 py-3">
          {loading ? (
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="aspect-square bg-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : media.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Image className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>No media files yet</p>
              <p className="text-xs mt-1">Upload some images to get started</p>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {media.map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className={cn(
                    "group relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                    selected?.id === item.id
                      ? "border-brand-pink ring-2 ring-brand-pink/30"
                      : "border-transparent hover:border-slate-300"
                  )}
                >
                  {isImage(item.mimeType) ? (
                    <img
                      src={item.url}
                      alt={item.alt || item.originalName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100">
                      <Image className="w-8 h-8 text-slate-400" />
                    </div>
                  )}
                  {selected?.id === item.id && (
                    <div className="absolute top-1 right-1 bg-brand-pink rounded-full p-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {mode === "manage" && (
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(item.id); }}
                      className="absolute top-1 left-1 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3 text-white" />
                    </button>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[9px] text-white truncate">{item.originalName}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {media.map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left",
                    selected?.id === item.id ? "bg-brand-pink/10" : "hover:bg-slate-50"
                  )}
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                    {isImage(item.mimeType) ? (
                      <img src={item.url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="w-5 h-5 text-slate-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.originalName}</p>
                    <p className="text-[10px] text-slate-400">{formatSize(item.size)}</p>
                  </div>
                  {mode === "manage" && (
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(item.id); }}
                      className="p-1.5 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  )}
                  {selected?.id === item.id && <Check className="w-4 h-4 text-brand-pink" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {total > limit && (
          <div className="flex items-center justify-center gap-2 py-3 border-t">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => fetchMedia(search, page - 1)}
            >
              Prev
            </Button>
            <span className="text-xs text-slate-500">Page {page} of {Math.ceil(total / limit)}</span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= Math.ceil(total / limit)}
              onClick={() => fetchMedia(search, page + 1)}
            >
              Next
            </Button>
          </div>
        )}

        {/* Footer */}
        {mode === "select" && (
          <div className="flex items-center justify-between px-6 py-4 border-t bg-slate-50/50 rounded-b-2xl">
            {selected ? (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100">
                  <img src={selected.url} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-medium">{selected.originalName}</p>
                  <p className="text-[10px] text-slate-400">{formatSize(selected.size)}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400">Select an image</p>
            )}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
              <Button size="sm" disabled={!selected} onClick={handleSelect} className="gap-1.5">
                <Check className="w-3.5 h-3.5" />
                Select
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}