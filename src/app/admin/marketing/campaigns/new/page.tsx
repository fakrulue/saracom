"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { 
  ChevronLeft, 
  Megaphone, 
  Save, 
  Eye, 
  Calendar, 
  Target, 
  Layout, 
  Settings2,
  CheckCircle2,
  X,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function NewCampaignPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    channel: "email",
    segment: "all",
    subject: "",
    message: "",
    sendDate: "",
    sendTime: ""
  });

  const handleSave = async (status: "draft" | "active") => {
    if (!form.name) {
      alert("Please enter a campaign name");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/v1/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          status,
          channel: form.channel,
          segment: form.segment,
          subject: form.subject,
          message: form.message,
          sendDate: form.sendDate,
          sendTime: form.sendTime
        })
      });
      if (res.ok) {
        router.push("/admin/marketing/campaigns");
      } else {
        alert("Failed to save campaign");
      }
    } catch (e) {
      alert("Error saving campaign");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push('/admin/marketing/campaigns')}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create Campaign</h1>
              <p className="text-sm text-slate-500">Launch a new marketing blast to your customers.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" disabled={saving} onClick={() => handleSave("draft")}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Draft
            </Button>
            <Button className="shadow-sm" disabled={saving} onClick={() => handleSave("active")}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Megaphone className="w-4 h-4 mr-2" />}
              Launch Campaign
            </Button>
          </div>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                step === i ? "bg-slate-900 text-white" : step > i ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
              )}>
                {step > i ? <CheckCircle2 className="w-4 h-4" /> : i}
              </div>
              <div className={cn(
                "h-1 w-12 rounded-full",
                step > i ? "bg-emerald-500" : "bg-slate-100"
              )} />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Campaign Details</CardTitle>
                <CardDescription>Basic information about your campaign.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Campaign Name</Label>
                  <Input 
                    placeholder="e.g. Summer Sale 2024" 
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Channel</Label>
                    <Select value={form.channel} onValueChange={v => setForm({...form, channel: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email Blast</SelectItem>
                        <SelectItem value="sms">SMS Alert</SelectItem>
                        <SelectItem value="push">Push Notification</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Target Segment</Label>
                    <Select value={form.segment} onValueChange={v => setForm({...form, segment: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Customers</SelectItem>
                        <SelectItem value="high">High Value</SelectItem>
                        <SelectItem value="new">New Leads</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Subject Line / Headline</Label>
                  <Input 
                    placeholder="Enter a catchy subject line"
                    value={form.subject}
                    onChange={e => setForm({...form, subject: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Message Body</Label>
                  <Textarea 
                    placeholder="Write your message here..." 
                    className="min-h-[150px]"
                    value={form.message}
                    onChange={e => setForm({...form, message: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-2">
                    <Label>Send Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input 
                        type="date" 
                        className="pl-10" 
                        value={form.sendDate}
                        onChange={e => setForm({...form, sendDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>Send Time</Label>
                    <Input 
                      type="time"
                      value={form.sendTime}
                      onChange={e => setForm({...form, sendTime: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview / Sidebar */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">Live Preview</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="aspect-[9/16] bg-white rounded-xl shadow-2xl overflow-hidden border-4 border-slate-800">
                  <div className="h-4 bg-slate-100 flex items-center justify-center">
                    <div className="w-12 h-1 bg-slate-300 rounded-full" />
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="w-8 h-8 rounded-full bg-slate-900 mx-auto mb-4" />
                    <div className="h-4 bg-slate-100 rounded-full w-3/4 mx-auto" />
                    <div className="h-4 bg-slate-100 rounded-full w-1/2 mx-auto" />
                    <div className="aspect-video bg-slate-50 rounded-lg mt-4" />
                    <div className="space-y-2 mt-4">
                      <div className="h-2 bg-slate-50 rounded-full" />
                      <div className="h-2 bg-slate-50 rounded-full" />
                      <div className="h-2 bg-slate-50 rounded-full w-2/3" />
                    </div>
                    <Button className="w-full bg-slate-900 mt-4 rounded-lg text-xs h-8">Shop Now</Button>
                  </div>
                </div>
                <p className="text-[10px] text-center text-slate-500 italic">How it will look on mobile devices.</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">Reach Estimate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-2xl font-black text-slate-900 mb-1">
                  12,450
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">users</span>
                </div>
                <p className="text-xs text-slate-500">Based on your selected segment and channel.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
