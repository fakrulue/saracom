"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { CollectionForm } from "@/components/admin/collections/collection-form";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EditCollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const [collection, setCollection] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(async ({ id }) => {
      try {
        const res = await fetch(`/api/v1/collections/${id}`);
        const { data } = await res.json();
        setCollection(data);
      } catch (error) {
        console.error("Failed to load collection", error);
      } finally {
        setLoading(false);
      }
    });
  }, [params]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/collections">
              <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
          </div>
          <div className="h-96 bg-slate-100 rounded animate-pulse" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/collections">
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Collection</h1>
        </div>

        {collection && (
          <CollectionForm initialData={collection} isEdit />
        )}
      </div>
    </AdminLayout>
  );
}