"use client";

import React from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/admin-layout";
import {
  Globe,
  ExternalLink,
  Store,
  Palette,
  Settings,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function StorePage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Online Store
            </h1>
            <p className="text-sm text-slate-500">
              Manage your storefront, themes, and store preferences.
            </p>
          </div>
          <Link href="/" target="_blank">
            <Button variant="outline" className="gap-2">
              <Eye className="w-4 h-4" />
              View Storefront
            </Button>
          </Link>
        </div>

        {/* Store Status */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center">
                  <Store className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Saracom Kids Fashion</h2>
                  <p className="text-sm text-slate-500">Storefront is live and accepting orders</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-emerald-100 text-emerald-700 gap-1.5 text-sm py-1 px-3">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Online
                </Badge>
                <Link href="/" target="_blank">
                  <Button variant="outline" size="sm" className="gap-2">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Visit Store
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/themes">
            <Card className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer h-full group">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Palette className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-slate-900">Themes</h3>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-sm text-slate-500 mb-3">
                    Customize your storefront appearance with themes and templates.
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      Modern Slate active
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/settings">
            <Card className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer h-full group">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Settings className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-slate-900">Preferences</h3>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-sm text-slate-500 mb-3">
                    Configure store settings, payments, shipping, and notifications.
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-medium">
                      <AlertCircle className="w-3 h-3" />
                      Setup incomplete
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Store Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Store URL</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-400" />
                <a href="http://localhost:3000" target="_blank" className="text-sm text-blue-600 hover:underline font-medium">
                  localhost:3000
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Store Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="bg-emerald-100 text-emerald-700 gap-1.5">
                <CheckCircle2 className="w-3 h-3" />
                Live
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="font-medium">
                Free Trial
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}