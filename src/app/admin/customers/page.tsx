"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import {
  Search, Filter, MoreHorizontal, UserPlus,
  Mail, MapPin, ShoppingBag, DollarSign, Eye, Ban, Edit, TrendingUp, Users
} from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const CUSTOMERS = [
  { id: "c1", name: "Emma Wilson",   email: "emma@example.com",    phone: "+1 555 001", location: "New York, US",    orders: 12, spent: "$1,245.00", status: "active",   joined: "Jan 2024" },
  { id: "c2", name: "John Doe",      email: "john@example.com",    phone: "+1 555 002", location: "Los Angeles, US", orders: 8,  spent: "$892.50",   status: "active",   joined: "Mar 2024" },
  { id: "c3", name: "Sarah Smith",   email: "sarah@example.com",   phone: "+1 555 003", location: "Chicago, US",    orders: 3,  spent: "$215.00",   status: "active",   joined: "Apr 2024" },
  { id: "c4", name: "Michael Ross",  email: "michael@example.com", phone: "+1 555 004", location: "Houston, US",    orders: 21, spent: "$3,410.00", status: "active",   joined: "Dec 2023" },
  { id: "c5", name: "Linda Brown",   email: "linda@example.com",   phone: "+1 555 005", location: "Phoenix, US",    orders: 1,  spent: "$67.00",    status: "inactive", joined: "May 2024" },
  { id: "c6", name: "Tom Harris",    email: "tom@example.com",     phone: "+1 555 006", location: "Dubai, UAE",     orders: 5,  spent: "$540.00",   status: "active",   joined: "Feb 2024" },
];

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

const AVATAR_COLORS = [
  "from-violet-600 to-indigo-700",
  "from-emerald-600 to-teal-700",
  "from-rose-600 to-pink-700",
  "from-amber-500 to-orange-600",
  "from-sky-600 to-blue-700",
  "from-slate-600 to-slate-800",
];

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = CUSTOMERS.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                        c.email.toLowerCase().includes(search.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    if (filter === "active" || filter === "inactive") return c.status === filter && matchesSearch;
    if (filter === "new") return c.joined.includes("2024") && matchesSearch;
    if (filter === "returning") return c.orders > 5 && matchesSearch;
    if (filter === "abandoned") return c.id === "c5" && matchesSearch; // Mocking one
    return matchesSearch;
  });

  const stats = [
    { label: "Total Customers", value: CUSTOMERS.length.toString(),                                     icon: Users,      color: "text-slate-700 bg-slate-100" },
    { label: "Active",          value: CUSTOMERS.filter(c => c.status === "active").length.toString(),  icon: UserPlus,   color: "text-emerald-700 bg-emerald-100" },
    { label: "Total Revenue",   value: "$6,369",                                                         icon: DollarSign, color: "text-blue-700 bg-blue-100" },
    { label: "Avg. LTV",        value: "$1,061",                                                         icon: TrendingUp, color: "text-purple-700 bg-purple-100" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Customers</h1>
            <p className="text-sm text-slate-500">View and manage your customer base and their order history.</p>
          </div>
          <Button className="shadow-sm"><UserPlus className="w-4 h-4 mr-2" />Add Customer</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className="border-none shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={cn("p-2.5 rounded-xl", color)}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
                  <p className="text-2xl font-bold text-slate-900">{value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-none shadow-sm">
          {/* Filter tabs */}
          <div className="flex items-center gap-1 px-4 pt-4 border-b">
            {["all", "active", "segments", "new", "returning", "abandoned"].map(tab => (
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
                {tab === "all" ? `All Customers (${CUSTOMERS.length})` : 
                 tab === "segments" ? "Segments" :
                 tab}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="p-4 flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by name or email..."
                className="pl-10"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-2" />Filter</Button>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-slate-50/50">
                <TableHead>Customer</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c, i) => (
                <TableRow key={c.id} className="group hover:bg-slate-50/50 cursor-pointer">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9">
                        <AvatarFallback className={cn(
                          "bg-gradient-to-br text-white text-xs font-bold",
                          AVATAR_COLORS[i % AVATAR_COLORS.length]
                        )}>
                          {getInitials(c.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <Mail className="w-3 h-3" />{c.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-slate-600 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />{c.location}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "capitalize text-xs shadow-none font-medium",
                      c.status === "active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    )}>
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-700">{c.orders}</TableCell>
                  <TableCell className="text-sm font-bold text-slate-900">{c.spent}</TableCell>
                  <TableCell className="text-sm text-slate-500">{c.joined}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Eye className="w-4 h-4 mr-2" />View Profile</DropdownMenuItem>
                        <DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
                        <DropdownMenuItem><Mail className="w-4 h-4 mr-2" />Send Email</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Ban className="w-4 h-4 mr-2" />Deactivate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-40 text-center text-slate-400 text-sm">
                    No customers match your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AdminLayout>
  );
}
