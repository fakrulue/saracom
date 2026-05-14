"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { MediaManager } from "@/components/admin/MediaManager";

export default function MediaPage() {
  const [showManager, setShowManager] = useState(true);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Media</h1>
            <p className="text-sm text-slate-500">Upload and manage your store images.</p>
          </div>
          <button
            onClick={() => setShowManager(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
          >
            Open Media Library
          </button>
        </div>
      </div>
      {showManager && (
        <MediaManager
          onSelect={(url) => { setShowManager(false); }}
          onClose={() => setShowManager(false)}
          mode="manage"
        />
      )}
    </AdminLayout>
  );
}