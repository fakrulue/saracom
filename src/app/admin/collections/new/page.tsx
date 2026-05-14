import React from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { CollectionForm } from "@/components/admin/collections/collection-form";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewCollectionPage() {
  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/collections">
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create Collection</h1>
        </div>

        <CollectionForm />
      </div>
    </AdminLayout>
  );
}
