"use client";

import { useState, useEffect } from "react";

type Role = {
  id: string;
  name: string;
  permissions: string[];
};

type Staff = {
  id: string;
  name: string;
  email: string;
  roleId: string;
};

const DEFAULT_PERMISSIONS = [
  "dashboard", "orders", "orders_view", "orders_fulfill", "orders_refund",
  "products", "products_create", "products_edit", "products_delete",
  "collections", "pos", "customers", "customers_view", "customers_edit",
  "files", "pages", "blog", "settings", "settings_general", "settings_team",
  "reports", "themes"
];

export function usePermissions() {
  const [permissions, setPermissions] = useState<string[]>(DEFAULT_PERMISSIONS);
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = () => {
    const storedStaff = localStorage.getItem("pos_staff");
    const storedRoles = localStorage.getItem("pos_roles");

    if (storedStaff && storedRoles) {
      try {
        const staff: Staff[] = JSON.parse(storedStaff);
        const roles: Role[] = JSON.parse(storedRoles);

        if (staff.length > 0) {
          const user = staff[0];
          const role = roles.find(r => r.id === user.roleId);
          setCurrentStaff(user);
          setPermissions(role?.permissions || DEFAULT_PERMISSIONS);
        }
      } catch {}
    }
    setLoading(false);
  };

  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (perms: string[]): boolean => {
    return perms.some(p => permissions.includes(p));
  };

  const hasAllPermissions = (perms: string[]): boolean => {
    return perms.every(p => permissions.includes(p));
  };

  const isAdmin = (): boolean => {
    return hasPermission("settings");
  };

  return {
    permissions,
    currentStaff,
    loading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
  };
}

export function checkPermission(permission: string): boolean {
  if (typeof window === "undefined") return false;
  
  const storedRoles = localStorage.getItem("pos_roles");
  const storedStaff = localStorage.getItem("pos_staff");

  if (!storedStaff || !storedRoles) return true;

  try {
    const staff: Staff[] = JSON.parse(storedStaff);
    const roles: Role[] = JSON.parse(storedRoles);

    if (staff.length === 0) return true;

    const user = staff[0];
    const role = roles.find(r => r.id === user.roleId);
    return role?.permissions?.includes(permission) || false;
  } catch {
    return true;
  }
}

export { DEFAULT_PERMISSIONS };