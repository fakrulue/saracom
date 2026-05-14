"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import {
  Plus,
  Search,
  MoreHorizontal,
  Filter,
  ArrowUpDown,
  Layers,
  CheckCircle2,
  Settings2,
  Edit,
  Copy,
  Archive,
  Trash2,
  ListFilter,
  Package,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const STATUS_CONFIG: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  draft: "bg-slate-100 text-slate-600",
  archived: "bg-red-100 text-red-600",
};

const TYPE_CONFIG: Record<string, { label: string; className: string }> = {
  manual: { label: "Manual", className: "bg-violet-100 text-violet-700" },
  smart: { label: "Smart", className: "bg-blue-100 text-blue-700" },
};

type Collection = {
  id: string;
  title: string;
  handle: string;
  description: string | null;
  imageUrl: string | null;
  collectionType: string;
  status: string;
  updatedAt: string;
  _count?: { products: number };
};

export default function CollectionsPage() {
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch("/api/v1/collections");
        const json = await res.json();
        setCollections(json.data || []);
      } catch (error) {
        console.error("Failed to fetch collections", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  const filtered = collections.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.handle.toLowerCase().includes(search.toLowerCase());
    if (filter === "all") return matchesSearch;
    if (filter === "active" || filter === "draft" || filter === "archived")
      return c.status === filter && matchesSearch;
    if (filter === "smart" || filter === "manual")
      return c.collectionType === filter && matchesSearch;
    return matchesSearch;
  });

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this collection?"))
      return;
    try {
      await fetch(`/api/v1/collections/${id}`, { method: "DELETE" });
      setCollections((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Failed to delete collection", error);
    }
  };

  const handleDuplicate = async (collection: Collection) => {
    try {
      const res = await fetch("/api/v1/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${collection.title} (Copy)`,
          collectionType: collection.collectionType,
          status: "draft",
        }),
      });
      const { data } = await res.json();
      if (data) {
        setCollections((prev) => [data, ...prev]);
      }
    } catch (error) {
      console.error("Failed to duplicate collection", error);
    }
  };

  const handleArchive = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/v1/collections/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "archived" }),
      });
      setCollections((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: "archived" } : c
        )
      );
    } catch (error) {
      console.error("Failed to archive collection", error);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Collections
            </h1>
            <p className="text-sm text-slate-500">
              Manage how your products are grouped and displayed.
            </p>
          </div>
          <Link href="/admin/collections/new">
            <Button className="shadow-sm shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" />
              Create collection
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Collections"
            value={
              loading ? "—" : collections.length.toString()
            }
            icon={Layers}
            color="text-slate-600 bg-slate-100"
          />
          <StatCard
            title="Active"
            value={
              loading
                ? "—"
                : collections.filter((c) => c.status === "active")
                    .length
                    .toString()
            }
            icon={CheckCircle2}
            color="text-emerald-600 bg-emerald-50"
          />
          <StatCard
            title="Smart"
            value={
              loading
                ? "—"
                : collections.filter((c) => c.collectionType === "smart")
                    .length
                    .toString()
            }
            icon={ListFilter}
            color="text-blue-600 bg-blue-50"
          />
          <StatCard
            title="Draft"
            value={
              loading
                ? "—"
                : collections.filter((c) => c.status === "draft")
                    .length
                    .toString()
            }
            icon={Settings2}
            color="text-amber-600 bg-amber-50"
          />
        </div>

        <Card className="border-none shadow-sm">
          {/* Filter tabs */}
          <div className="flex items-center gap-1 px-4 pt-4 border-b overflow-x-auto">
            {["all", "active", "draft", "archived", "smart", "manual"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-t-lg capitalize whitespace-nowrap transition-colors border-b-2 -mb-px",
                    filter === tab
                      ? "border-slate-900 text-slate-900"
                      : "border-transparent text-slate-500 hover:text-slate-900"
                  )}
                >
                  {tab}
                </button>
              )
            )}
          </div>

          {/* Search */}
          <div className="p-4 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search collections..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                Sort
              </Button>
            </div>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-slate-50/50">
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((collection) => {
                const typeCfg =
                  TYPE_CONFIG[collection.collectionType] || TYPE_CONFIG.manual;
                return (
                  <TableRow
                    key={collection.id}
                    className="group hover:bg-slate-50/50 cursor-pointer"
                    onClick={() =>
                      router.push(`/admin/collections/${collection.id}/edit`)
                    }
                  >
                    <TableCell>
                      <div className="w-12 h-12 rounded-lg border bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden">
                        {collection.imageUrl ? (
                          <img
                            src={collection.imageUrl}
                            alt={collection.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {collection.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-400 font-mono">
                            /collections/{collection.handle}
                          </span>
                          <a
                            href={`/collections/${collection.handle}`}
                            target="_blank"
                            className="text-xs text-blue-500 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View
                          </a>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <Package className="w-3.5 h-3.5 text-slate-400" />
                        {collection._count?.products ?? 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "capitalize text-xs shadow-none font-medium",
                          typeCfg.className
                        )}
                      >
                        {typeCfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "capitalize text-xs shadow-none font-medium",
                          STATUS_CONFIG[collection.status] ||
                            STATUS_CONFIG.draft
                        )}
                      >
                        {collection.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {formatDate(collection.updatedAt)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(
                                `/admin/collections/${collection.id}/edit`
                              );
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicate(collection);
                            }}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => handleArchive(collection.id, e)}
                          >
                            <Archive className="w-4 h-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={(e) => handleDelete(collection.id, e)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}

              {collections.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={7} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <Layers className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-900">
                          No collections found
                        </p>
                        <p className="text-sm text-slate-500">
                          Get started by creating your first product collection.
                        </p>
                      </div>
                      <Link href="/admin/collections/new">
                        <Button size="sm" variant="outline">
                          Create collection
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {loading && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-40 text-center text-slate-400 text-sm"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="px-4 py-4 border-t flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Showing {filtered.length} of {collections.length} collections
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  icon: any;
  color: string;
}) {
  const [iconColor, bgColor] = color.split(" ");
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-5 flex items-center gap-4">
        <div className={cn("p-2.5 rounded-xl", bgColor)}>
          <Icon className={cn("w-5 h-5", iconColor)} />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}