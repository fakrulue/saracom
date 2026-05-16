"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Megaphone, Plus, Users, MousePointer, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Campaign = {
  id: string;
  name: string;
  status: string;
  reach: number;
  clicks: number;
  conv: number;
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/campaigns")
      .then(r => r.json())
      .then(({ data }) => setCampaigns(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const activeCount = campaigns.filter(c => c.status === "active").length;
  const totalReach = campaigns.reduce((sum, c) => sum + (c.reach || 0), 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + (c.clicks || 0), 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Campaigns</h1>
            <p className="text-sm text-slate-500">Launch and manage marketing campaigns.</p>
          </div>
          <Link href="/admin/marketing/campaigns/new">
            <Button className="shadow-sm"><Plus className="w-4 h-4 mr-2" />New Campaign</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-none shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Campaigns</p>
                <p className="text-2xl font-bold text-slate-900">{loading ? "—" : activeCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Reach</p>
                <p className="text-2xl font-bold text-slate-900">{loading ? "—" : totalReach}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600">
                <MousePointer className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Clicks</p>
                <p className="text-2xl font-bold text-slate-900">{loading ? "—" : totalClicks}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="py-24 text-center text-slate-400">Loading campaigns...</div>
        ) : campaigns.length === 0 ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Megaphone className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold">No campaigns yet</h2>
            <p className="text-slate-500 max-w-sm mx-auto">Create your first email or SMS campaign to reach your customers at the right time.</p>
            <Link href="/admin/marketing/campaigns/new">
              <Button><Plus className="w-4 h-4 mr-2" />Create Campaign</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaigns.map(campaign => (
              <Card key={campaign.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                        <Megaphone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{campaign.name}</p>
                        <p className="text-xs text-slate-500">Created recently</p>
                      </div>
                    </div>
                    <Badge className={cn(
                      "text-[10px] uppercase font-bold tracking-widest shadow-none",
                      campaign.status === "active" ? "bg-emerald-100 text-emerald-700" :
                      campaign.status === "draft" ? "bg-slate-100 text-slate-600" :
                      "bg-red-100 text-red-600"
                    )}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">Reach</p>
                      <p className="font-bold text-slate-900">{campaign.reach || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">Clicks</p>
                      <p className="font-bold text-slate-900">{campaign.clicks || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">Conv.</p>
                      <p className="font-bold text-slate-900">{campaign.conv || 0}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
