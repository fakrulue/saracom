"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import {
  Store, CreditCard, Truck, Bell, Users, Globe, Palette,
  Shield, Save, ChevronRight, Upload, Check, Plus, MapPin, DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "general",       label: "General",       icon: Store,     desc: "Store name, timezone, currency" },
  { id: "payments",      label: "Payments",       icon: CreditCard, desc: "Payment gateways and methods" },
  { id: "shipping",      label: "Shipping",       icon: Truck,     desc: "Shipping zones and rates" },
  { id: "notifications", label: "Notifications",  icon: Bell,      desc: "Email and push alerts" },
  { id: "team",          label: "Team & Roles",   icon: Users,     desc: "Staff accounts and permissions" },
  { id: "domains",       label: "Domains",        icon: Globe,     desc: "Custom domains and SSL" },
  { id: "locations",     label: "Locations",      icon: MapPin,    desc: "Manage warehouse and store locations" },
  { id: "languages",     label: "Languages",      icon: Globe,     desc: "Store languages and i18n" },
  { id: "currencies",    label: "Currencies",     icon: DollarSign,desc: "Supported currencies and rates" },
  { id: "appearance",    label: "Appearance",     icon: Palette,   desc: "Theme and branding" },
  { id: "security",      label: "Security",       icon: Shield,    desc: "2FA, sessions, audit log" },
];

export default function SettingsPage() {
  const [active, setActive] = useState("general");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Settings</h1>
            <p className="text-sm text-slate-500">Configure your store, payments, shipping and team access.</p>
          </div>
          <Button onClick={handleSave} className={cn("shadow-sm transition-all", saved && "bg-emerald-600 hover:bg-emerald-600")}>
            {saved ? <><Check className="w-4 h-4 mr-2" />Saved!</> : <><Save className="w-4 h-4 mr-2" />Save Changes</>}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Nav */}
          <div className="lg:col-span-1">
            <Card className="border-none shadow-sm">
              <CardContent className="p-2">
                {NAV_ITEMS.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActive(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors group",
                      active === item.id ? "bg-slate-900 text-white" : "hover:bg-slate-50 text-slate-700"
                    )}
                  >
                    <div className={cn("p-1.5 rounded-md", active === item.id ? "bg-white/20" : "bg-slate-100 group-hover:bg-white")}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.label}</p>
                    </div>
                    <ChevronRight className={cn("w-3.5 h-3.5 flex-shrink-0", active === item.id ? "text-white/60" : "text-slate-300")} />
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Panel Content */}
          <div className="lg:col-span-3 space-y-6">
            {active === "general" && <GeneralPanel />}
            {active === "payments" && <PaymentsPanel />}
            {active === "shipping" && <ShippingPanel />}
            {active === "notifications" && <NotificationsPanel />}
            {active === "team" && <TeamPanel />}
            {active === "domains" && <DomainsPanel />}
            {active === "locations" && <LocationsPanel />}
            {active === "languages" && <LanguagesPanel />}
            {active === "currencies" && <CurrenciesPanel />}
            {active === "appearance" && <AppearancePanel />}
            {active === "security" && <SecurityPanel />}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function GeneralPanel() {
  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm">
        <CardHeader><CardTitle>Store Details</CardTitle><CardDescription>Basic information about your store.</CardDescription></CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
              <Upload className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Store Logo</p>
              <p className="text-xs text-slate-500 mt-1">PNG, JPG or SVG · Max 2MB</p>
              <Button variant="outline" size="sm" className="mt-2">Upload Logo</Button>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Store Name" id="store-name" defaultValue="Saracom Store" />
            <Field label="Store Email" id="store-email" defaultValue="admin@saracom.com" type="email" />
            <Field label="Store Phone" id="store-phone" defaultValue="+1 555 000 0000" />
            <Field label="Store Currency" id="currency" defaultValue="USD" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="store-address">Address</Label>
            <Textarea id="store-address" defaultValue="123 Commerce Street, New York, NY 10001, US" className="resize-none" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldSelect label="Timezone" id="timezone" options={["America/New_York","Europe/London","Asia/Dubai"]} defaultValue="America/New_York" />
            <FieldSelect label="Weight Unit" id="weight" options={["kg","lb","g","oz"]} defaultValue="kg" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PaymentsPanel() {
  const gateways = [
    { name: "Stripe", desc: "Credit & debit cards worldwide", enabled: true,  color: "bg-violet-600" },
    { name: "PayPal", desc: "PayPal wallet and Pay Later",    enabled: true,  color: "bg-blue-500" },
    { name: "Tabby",  desc: "Buy now, pay later (MENA)",      enabled: false, color: "bg-teal-500" },
    { name: "Tamara", desc: "Split payments (KSA, UAE, KWT)", enabled: false, color: "bg-orange-500" },
  ];
  return (
    <Card className="border-none shadow-sm">
      <CardHeader><CardTitle>Payment Gateways</CardTitle><CardDescription>Manage how customers can pay for their orders.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        {gateways.map(gw => (
          <div key={gw.name} className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className={cn("w-10 h-10 rounded-lg text-white flex items-center justify-center text-xs font-black", gw.color)}>
                {gw.name[0]}
              </div>
              <div>
                <p className="text-sm font-semibold">{gw.name}</p>
                <p className="text-xs text-slate-500">{gw.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={cn("text-xs shadow-none", gw.enabled ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500")}>
                {gw.enabled ? "Active" : "Inactive"}
              </Badge>
              <Button variant="outline" size="sm">{gw.enabled ? "Configure" : "Activate"}</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ShippingPanel() {
  const zones = [
    { name: "Domestic (US)",   methods: ["Standard (3-5 days) — $4.99", "Express (1-2 days) — $12.99", "Free over $50"] },
    { name: "Middle East",     methods: ["Standard (7-14 days) — $9.99", "Express (3-5 days) — $24.99"] },
    { name: "Rest of World",   methods: ["Standard (10-21 days) — $14.99"] },
  ];
  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div><CardTitle>Shipping Zones</CardTitle><CardDescription>Define rates for different regions.</CardDescription></div>
        <Button size="sm"><Truck className="w-4 h-4 mr-2" />Add Zone</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {zones.map(z => (
          <div key={z.name} className="p-4 border rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">{z.name}</p>
              <Button variant="ghost" size="sm" className="text-slate-500">Edit Zone</Button>
            </div>
            <div className="space-y-2">
              {z.methods.map(m => (
                <div key={m} className="flex items-center justify-between text-sm py-2 px-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-700">{m}</span>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-slate-400">Edit</Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function NotificationsPanel() {
  const notifs = [
    { label: "New Order",          desc: "Alert when a customer places an order" },
    { label: "Order Shipped",       desc: "When you mark an order as shipped" },
    { label: "Order Delivered",     desc: "Delivery confirmation from courier" },
    { label: "Low Stock Alert",     desc: "When a product drops below threshold" },
    { label: "New Customer",        desc: "When a new customer account is created" },
    { label: "Abandoned Cart",      desc: "When a customer abandons their cart" },
  ];
  return (
    <Card className="border-none shadow-sm">
      <CardHeader><CardTitle>Email Notifications</CardTitle><CardDescription>Configure which events trigger store alerts.</CardDescription></CardHeader>
      <CardContent className="divide-y">
        {notifs.map(n => (
          <div key={n.label} className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm font-medium text-slate-900">{n.label}</p>
              <p className="text-xs text-slate-500">{n.desc}</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function TeamPanel() {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div><CardTitle>Team Members</CardTitle><CardDescription>Manage staff access and permissions.</CardDescription></div>
        <Button size="sm" onClick={() => window.location.href = '/admin/settings/staff'}>
          <Users className="w-4 h-4 mr-2" />Manage Staff
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-sm text-slate-600 mb-4">Manage your team members, roles, and permissions.</p>
          <Button variant="outline" onClick={() => window.location.href = '/admin/settings/staff'}>
            Open Staff Management
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function DomainsPanel() {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader><CardTitle>Domains</CardTitle><CardDescription>Connect a custom domain to your store.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 border rounded-xl flex items-center justify-between bg-emerald-50 border-emerald-200">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold text-slate-900">saracom.myshop.com</p>
              <p className="text-xs text-slate-500">Default domain (free)</p>
            </div>
          </div>
          <Badge className="bg-emerald-100 text-emerald-700 shadow-none">Primary</Badge>
        </div>
        <div className="p-4 border-dashed border rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-slate-400" />
            <div className="flex-1">
              <Input placeholder="yourdomain.com" className="border-none bg-transparent p-0 focus-visible:ring-0 text-sm" />
            </div>
          </div>
          <Button size="sm">Connect Domain</Button>
        </div>
        <p className="text-xs text-slate-400">Point your domain's DNS CNAME record to <code className="font-mono bg-slate-100 px-1 rounded">shops.saracom.io</code></p>
      </CardContent>
    </Card>
  );
}

function LocationsPanel() {
  const locations = [
    { name: "Main Warehouse", address: "123 Logistics Way, NJ, US", type: "Warehouse", primary: true },
    { name: "Downtown Store", address: "456 Broadway, NY, US",     type: "Retail",    primary: false },
  ];
  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div><CardTitle>Locations</CardTitle><CardDescription>Manage where you store inventory and fulfill orders.</CardDescription></div>
        <Button size="sm"><Plus className="w-4 h-4 mr-2" />Add Location</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {locations.map(loc => (
          <div key={loc.name} className="p-4 border rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm font-semibold">{loc.name}</p>
                <p className="text-xs text-slate-500">{loc.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-xs font-normal">{loc.type}</Badge>
              {loc.primary && <Badge className="bg-emerald-100 text-emerald-700 shadow-none">Primary</Badge>}
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function AppearancePanel() {
  const themes = [
    { name: "Modern Slate",  active: true,  preview: "bg-slate-900" },
    { name: "Forest Green",  active: false, preview: "bg-emerald-900" },
    { name: "Ocean Blue",    active: false, preview: "bg-blue-900" },
    { name: "Desert Sand",   active: false, preview: "bg-amber-800" },
  ];
  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm">
        <CardHeader><CardTitle>Theme</CardTitle><CardDescription>Choose your storefront's visual theme.</CardDescription></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {themes.map(t => (
              <div key={t.name} className={cn("border-2 rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-all", t.active ? "border-slate-900 ring-2 ring-slate-900 ring-offset-2" : "border-slate-200")}>
                <div className={cn("h-24", t.preview)} />
                <div className="p-2 flex items-center justify-between bg-white">
                  <p className="text-xs font-medium">{t.name}</p>
                  {t.active && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="border-none shadow-sm">
        <CardHeader><CardTitle>Brand Colors</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Primary Color</Label>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-900 border" />
              <Input defaultValue="#0f172a" className="font-mono text-sm" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Accent Color</Label>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500 border" />
              <Input defaultValue="#10b981" className="font-mono text-sm" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SecurityPanel() {
  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm">
        <CardHeader><CardTitle>Two-Factor Authentication</CardTitle><CardDescription>Add an extra layer of security to your admin account.</CardDescription></CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-700">2FA is currently <span className="font-bold text-red-600">disabled</span>.</p>
            <p className="text-xs text-slate-500 mt-1">Enable authenticator app or SMS verification.</p>
          </div>
          <Button>Enable 2FA</Button>
        </CardContent>
      </Card>
      <Card className="border-none shadow-sm">
        <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Current Password" id="curr-pass" type="password" />
          <Field label="New Password" id="new-pass" type="password" />
          <Field label="Confirm New Password" id="conf-pass" type="password" />
          <Button variant="outline">Update Password</Button>
        </CardContent>
      </Card>
      <Card className="border-none shadow-sm">
        <CardHeader><CardTitle>Active Sessions</CardTitle><CardDescription>Devices currently logged into your admin account.</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div>
              <p className="text-sm font-medium">Chrome on Windows · New York, US</p>
              <p className="text-xs text-slate-500">Current session · Active now</p>
            </div>
            <Badge className="bg-emerald-100 text-emerald-700 shadow-none text-xs">Current</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LanguagesPanel() {
  const languages = [
    { name: "English", code: "EN", default: true,  status: "Active" },
    { name: "Arabic",  code: "AR", default: false, status: "Active", rtl: true },
    { name: "French",  code: "FR", default: false, status: "Inactive" },
  ];
  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div><CardTitle>Languages</CardTitle><CardDescription>Manage your store's translations and RTL support.</CardDescription></div>
        <Button size="sm"><Plus className="w-4 h-4 mr-2" />Add Language</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {languages.map(lang => (
          <div key={lang.code} className="p-4 border rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs">{lang.code}</div>
              <div>
                <p className="text-sm font-semibold">{lang.name}</p>
                {lang.rtl && <Badge variant="secondary" className="text-[10px] py-0">RTL Support</Badge>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {lang.default && <Badge className="bg-emerald-100 text-emerald-700 shadow-none">Default</Badge>}
              <Badge variant="outline">{lang.status}</Badge>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function CurrenciesPanel() {
  const currencies = [
    { name: "US Dollar",   code: "USD", symbol: "$", rate: "1.00", default: true },
    { name: "Euro",        code: "EUR", symbol: "€", rate: "0.92", default: false },
    { name: "Saudi Riyal", code: "SAR", symbol: "SR", rate: "3.75", default: false },
  ];
  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div><CardTitle>Currencies</CardTitle><CardDescription>Accept payments in multiple currencies.</CardDescription></div>
        <Button size="sm"><Plus className="w-4 h-4 mr-2" />Add Currency</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {currencies.map(curr => (
          <div key={curr.code} className="p-4 border rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs">{curr.symbol}</div>
              <div>
                <p className="text-sm font-semibold">{curr.name} ({curr.code})</p>
                <p className="text-xs text-slate-500">Rate: 1 USD = {curr.rate} {curr.code}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {curr.default && <Badge className="bg-emerald-100 text-emerald-700 shadow-none">Primary</Badge>}
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Helpers
function Field({ label, id, defaultValue, type = "text" }: any) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} defaultValue={defaultValue} />
    </div>
  );
}
function FieldSelect({ label, id, options, defaultValue }: any) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <select id={id} defaultValue={defaultValue}
        className="w-full h-10 border rounded-md px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-200">
        {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
