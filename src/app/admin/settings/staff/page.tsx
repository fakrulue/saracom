"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { 
  Users, Plus, Search, MoreHorizontal, Shield, Edit, Trash2, 
  Mail, Phone, Check, X, ChevronRight, UserCheck, UserX, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isDefault: boolean;
};

type Staff = {
  id: string;
  name: string;
  email: string;
  phone: string;
  roleId: string;
  status: string;
  createdAt: string;
  lastLogin: string | null;
};

const PERMISSIONS = [
  { id: "dashboard", label: "Dashboard", category: "General" },
  { id: "orders", label: "Orders", category: "Sales" },
  { id: "orders_view", label: "View Orders", category: "Sales" },
  { id: "orders_fulfill", label: "Fulfill Orders", category: "Sales" },
  { id: "orders_refund", label: "Refund Orders", category: "Sales" },
  { id: "products", label: "Products", category: "Inventory" },
  { id: "products_create", label: "Create Products", category: "Inventory" },
  { id: "products_edit", label: "Edit Products", category: "Inventory" },
  { id: "products_delete", label: "Delete Products", category: "Inventory" },
  { id: "collections", label: "Collections", category: "Inventory" },
  { id: "pos", label: "POS", category: "Sales" },
  { id: "customers", label: "Customers", category: "Customers" },
  { id: "customers_view", label: "View Customers", category: "Customers" },
  { id: "customers_edit", label: "Edit Customers", category: "Customers" },
  { id: "files", label: "Files & Media", category: "Content" },
  { id: "pages", label: "Pages", category: "Content" },
  { id: "blog", label: "Blog", category: "Content" },
  { id: "settings", label: "Settings", category: "General" },
  { id: "settings_general", label: "General Settings", category: "General" },
  { id: "settings_team", label: "Team Management", category: "General" },
  { id: "reports", label: "Reports", category: "Analytics" },
  { id: "themes", label: "Themes", category: "General" },
];

const DEFAULT_ROLES: Role[] = [
  { id: "owner", name: "Owner", description: "Full access to all features", permissions: PERMISSIONS.map(p => p.id), isDefault: false },
  { id: "admin", name: "Admin", description: "Manage everything except billing", permissions: ["dashboard", "orders", "orders_view", "orders_fulfill", "products", "products_create", "products_edit", "collections", "pos", "customers", "customers_view", "customers_edit", "files", "pages", "settings_general", "reports"], isDefault: false },
  { id: "manager", name: "Manager", description: "Manage products and orders", permissions: ["dashboard", "orders", "orders_view", "orders_fulfill", "products", "products_create", "products_edit", "collections", "pos", "customers", "customers_view", "files", "reports"], isDefault: false },
  { id: "cashier", name: "Cashier", description: "POS and order processing", permissions: ["dashboard", "pos", "orders_view"], isDefault: false },
  { id: "support", name: "Support", description: "View orders and customers", permissions: ["dashboard", "orders_view", "customers", "customers_view"], isDefault: false },
];

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [showAddRole, setShowAddRole] = useState(false);
  const [showEditRole, setShowEditRole] = useState<Role | null>(null);
  const [newStaff, setNewStaff] = useState({ name: "", email: "", phone: "", roleId: "" });
  const [newRole, setNewRole] = useState<Partial<Role>>({ name: "", description: "", permissions: [] });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedStaff = localStorage.getItem("pos_staff");
    const storedRoles = localStorage.getItem("pos_roles");

    let loadedRoles: Role[] = storedRoles ? JSON.parse(storedRoles) : DEFAULT_ROLES;
    if (!storedRoles) {
      localStorage.setItem("pos_roles", JSON.stringify(DEFAULT_ROLES));
    }

    let loadedStaff: Staff[] = storedStaff ? JSON.parse(storedStaff) : [];
    if (!storedStaff && loadedRoles.length > 0) {
      loadedStaff = [
        { id: "staff_1", name: "Admin User", email: "admin@saracom.com", phone: "+1234567890", roleId: loadedRoles[0].id, status: "active", createdAt: new Date().toISOString(), lastLogin: null },
      ];
      localStorage.setItem("pos_staff", JSON.stringify(loadedStaff));
    }

    setRoles(loadedRoles);
    setStaff(loadedStaff);
    setLoading(false);
  };

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.email || !newStaff.roleId) return;
    
    const staffMember: Staff = {
      id: `staff_${Date.now()}`,
      name: newStaff.name,
      email: newStaff.email,
      phone: newStaff.phone,
      roleId: newStaff.roleId,
      status: "active",
      createdAt: new Date().toISOString(),
      lastLogin: null,
    };

    const updated = [...staff, staffMember];
    setStaff(updated);
    localStorage.setItem("pos_staff", JSON.stringify(updated));
    setNewStaff({ name: "", email: "", phone: "", roleId: "" });
    setShowAddStaff(false);
  };

  const handleDeleteStaff = (id: string) => {
    const updated = staff.filter(s => s.id !== id);
    setStaff(updated);
    localStorage.setItem("pos_staff", JSON.stringify(updated));
  };

  const handleToggleStaffStatus = (id: string) => {
    const updated = staff.map(s => s.id === id ? { ...s, status: s.status === "active" ? "inactive" : "active" } : s);
    setStaff(updated);
    localStorage.setItem("pos_staff", JSON.stringify(updated));
  };

  const handleAddRole = () => {
    if (!newRole.name) return;
    
    const role: Role = {
      id: `role_${Date.now()}`,
      name: newRole.name,
      description: newRole.description || "",
      permissions: newRole.permissions || [],
      isDefault: false,
    };

    const updated = [...roles, role];
    setRoles(updated);
    localStorage.setItem("pos_roles", JSON.stringify(updated));
    setNewRole({ name: "", description: "", permissions: [] });
    setShowAddRole(false);
  };

  const handleUpdateRole = () => {
    if (!showEditRole) return;
    
    const updated = roles.map(r => r.id === showEditRole.id ? showEditRole : r);
    setRoles(updated);
    localStorage.setItem("pos_roles", JSON.stringify(updated));
    setShowEditRole(null);
  };

  const handleDeleteRole = (id: string) => {
    const hasStaff = staff.some(s => s.roleId === id);
    if (hasStaff) {
      alert("Cannot delete role - staff members are assigned to it");
      return;
    }
    const updated = roles.filter(r => r.id !== id);
    setRoles(updated);
    localStorage.setItem("pos_roles", JSON.stringify(updated));
  };

  const getRoleName = (roleId: string) => roles.find(r => r.id === roleId)?.name || "Unknown";

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Staff & Roles</h1>
            <p className="text-sm text-slate-500">Manage team members and their access permissions.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Staff List */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>{staff.length} staff member(s)</CardDescription>
                </div>
                <Button size="sm" onClick={() => setShowAddStaff(true)}>
                  <Plus className="w-4 h-4 mr-2" />Add Member
                </Button>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      placeholder="Search staff..." 
                      className="pl-10"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.map(member => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold">{member.name}</p>
                              <p className="text-xs text-slate-500">{member.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{getRoleName(member.roleId)}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("text-xs", member.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500")}>
                            {member.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-slate-500">
                          {new Date(member.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="w-8 h-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleToggleStaffStatus(member.id)}>
                                {member.status === "active" ? <UserX className="w-4 h-4 mr-2" /> : <UserCheck className="w-4 h-4 mr-2" />}
                                {member.status === "active" ? "Deactivate" : "Activate"}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteStaff(member.id)}>
                                <Trash2 className="w-4 h-4 mr-2" />Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredStaff.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                          No staff members found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Roles List */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Roles</CardTitle>
                  <CardDescription>{roles.length} role(s)</CardDescription>
                </div>
                <Button size="sm" variant="outline" onClick={() => setShowAddRole(true)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {roles.map(role => (
                  <div key={role.id} className="p-4 border rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-slate-400" />
                        <p className="text-sm font-semibold">{role.name}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => setShowEditRole(role)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        {!role.isDefault && (
                          <Button variant="ghost" size="icon" className="w-6 h-6 text-red-400" onClick={() => handleDeleteRole(role.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{role.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map(p => (
                        <Badge key={p} variant="outline" className="text-[10px] py-0">{p}</Badge>
                      ))}
                      {role.permissions.length > 3 && (
                        <Badge variant="outline" className="text-[10px] py-0">+{role.permissions.length - 3}</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-slate-50">
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-slate-700 mb-2">Permission Categories</p>
                <div className="space-y-2 text-xs text-slate-500">
                  <div><span className="font-medium">General:</span> Dashboard, Settings, Reports</div>
                  <div><span className="font-medium">Sales:</span> Orders, POS</div>
                  <div><span className="font-medium">Inventory:</span> Products, Collections</div>
                  <div><span className="font-medium">Customers:</span> View, Edit customers</div>
                  <div><span className="font-medium">Content:</span> Files, Pages, Blog</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Staff Dialog */}
      <Dialog open={showAddStaff} onOpenChange={setShowAddStaff}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input 
                value={newStaff.name}
                onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                placeholder="Full name"
              />
            </div>
            <div>
              <Label>Email *</Label>
              <Input 
                type="email"
                value={newStaff.email}
                onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                placeholder="email@example.com"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input 
                value={newStaff.phone}
                onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                placeholder="+1 234 567 890"
              />
            </div>
            <div>
              <Label>Role *</Label>
              <select 
                className="w-full h-10 border rounded-md px-3 text-sm bg-white"
                value={newStaff.roleId}
                onChange={(e) => setNewStaff({...newStaff, roleId: e.target.value})}
              >
                <option value="">Select role</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddStaff(false)}>Cancel</Button>
            <Button onClick={handleAddStaff} disabled={!newStaff.name || !newStaff.email || !newStaff.roleId}>
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Role Dialog */}
      <Dialog open={showAddRole} onOpenChange={setShowAddRole}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Role Name *</Label>
              <Input 
                value={newRole.name}
                onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                placeholder="e.g., Marketing Manager"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input 
                value={newRole.description}
                onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                placeholder="Brief description of this role"
              />
            </div>
            <div>
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                {PERMISSIONS.map(perm => (
                  <label key={perm.id} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={newRole.permissions?.includes(perm.id)}
                      onChange={(e) => {
                        const perms = newRole.permissions || [];
                        if (e.target.checked) {
                          setNewRole({...newRole, permissions: [...perms, perm.id]});
                        } else {
                          setNewRole({...newRole, permissions: perms.filter(p => p !== perm.id)});
                        }
                      }}
                      className="w-4 h-4 rounded"
                    />
                    {perm.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddRole(false)}>Cancel</Button>
            <Button onClick={handleAddRole} disabled={!newRole.name}>Create Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={!!showEditRole} onOpenChange={() => setShowEditRole(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Role - {showEditRole?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Description</Label>
              <Input 
                value={showEditRole?.description || ""}
                onChange={(e) => setShowEditRole(prev => prev ? {...prev, description: e.target.value} : null)}
                placeholder="Brief description"
              />
            </div>
            <div>
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                {PERMISSIONS.map(perm => (
                  <label key={perm.id} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={showEditRole?.permissions?.includes(perm.id)}
                      onChange={(e) => {
                        const perms = showEditRole?.permissions || [];
                        if (e.target.checked) {
                          setShowEditRole(prev => prev ? {...prev, permissions: [...perms, perm.id]} : null);
                        } else {
                          setShowEditRole(prev => prev ? {...prev, permissions: perms.filter(p => p !== perm.id)} : null);
                        }
                      }}
                      className="w-4 h-4 rounded"
                    />
                    {perm.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditRole(null)}>Cancel</Button>
            <Button onClick={handleUpdateRole}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}