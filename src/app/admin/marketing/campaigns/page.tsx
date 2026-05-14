import { AdminLayout } from "@/components/admin/admin-layout";
import { Megaphone, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CampaignsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Campaigns</h1>
            <p className="text-sm text-slate-500">Launch and manage marketing campaigns.</p>
          </div>
          <Button className="shadow-sm"><Plus className="w-4 h-4 mr-2" />New Campaign</Button>
        </div>
        <div className="py-24 text-center space-y-4">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Megaphone className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold">No campaigns yet</h2>
          <p className="text-slate-500 max-w-sm mx-auto">Create your first email or SMS campaign to reach your customers at the right time.</p>
          <Button><Plus className="w-4 h-4 mr-2" />Create Campaign</Button>
        </div>
      </div>
    </AdminLayout>
  );
}
