"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { 
  ChevronLeft, 
  Package, 
  Truck, 
  CheckCircle2, 
  MapPin, 
  CreditCard, 
  Mail, 
  Phone, 
  ExternalLink,
  Printer,
  User,
  ShoppingCart,
  Globe,
  Clock,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type OrderItem = {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
};

type Address = {
  id: string;
  label: string;
  full: string;
};

type Customer = {
  id: string;
  name: string;
  phone: string;
  email?: string;
};

type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  tax: number;
  discount: number;
  paymentMethod: string;
  customer: Customer | null;
  customerAddress: Address | null;
  source: "pos" | "website";
  status: "completed" | "refunded";
  createdAt: string;
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { 
    month: "short", 
    day: "numeric", 
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function PrintReceipt({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold">Print Receipt</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <XCircle className="w-5 h-5" />
          </Button>
        </div>
        <div className="p-6" id="receipt-content">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black">SARACOM</h1>
            <p className="text-sm text-slate-500">Kids Fashion Store</p>
            <p className="text-xs text-slate-400 mt-1">{formatDate(order.createdAt)}</p>
          </div>
          
          <div className="border-t border-b py-4 mb-4">
            <p className="text-xs font-bold text-slate-500 mb-2">ORDER #{order.id}</p>
            <p className="text-sm">
              {order.customer?.name || "Walk-in Customer"}
              {order.customer?.phone && ` - ${order.customer.phone}`}
            </p>
            {order.customerAddress && (
              <p className="text-xs text-slate-500 mt-1">{order.customerAddress.full}</p>
            )}
          </div>

          <div className="space-y-2 mb-4">
            {order.items.map((item, idx) => (
              <div key={item.id || idx} className="flex justify-between text-sm">
                <div className="flex-1">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-slate-500"> × {item.qty}</span>
                </div>
                <span className="font-bold">${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm text-amber-600">
                <span>Discount</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-black pt-2 border-t">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm font-bold">Payment: {order.paymentMethod.toUpperCase()}</p>
            <p className="text-xs text-slate-500 mt-2">Thank you for your purchase!</p>
          </div>
        </div>
        <div className="p-6 border-t flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1" onClick={() => {
            const content = document.getElementById('receipt-content');
            if (content) {
              const printWindow = window.open('', '_blank');
              if (printWindow) {
                printWindow.document.write(`
                  <html>
                    <head>
                      <title>Receipt - ${order.id}</title>
                      <style>
                        body { font-family: Arial, sans-serif; padding: 20px; max-width: 300px; margin: 0 auto; }
                        .text-center { text-align: center; }
                        .font-black { font-weight: bold; }
                        .text-lg { font-size: 18px; }
                        .text-sm { font-size: 14px; }
                        .text-xs { font-size: 12px; }
                        .border-t { border-top: 1px solid #ddd; }
                        .border-b { border-bottom: 1px solid #ddd; }
                        .pt-4 { padding-top: 16px; }
                        .mt-2 { margin-top: 8px; }
                        .mt-6 { margin-top: 24px; }
                        .mb-2 { margin-bottom: 8px; }
                        .mb-4 { margin-bottom: 16px; }
                        .mb-6 { margin-bottom: 24px; }
                        .space-y-2 > * + * { margin-top: 8px; }
                        .flex { display: flex; }
                        .justify-between { justify-content: space-between; }
                        .text-slate-500 { color: #6b7280; }
                      </style>
                    </head>
                    <body>${content.innerHTML}</body>
                  </html>
                `);
                printWindow.document.close();
                printWindow.print();
              }
            }
          }}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPrintDialog, setShowPrintDialog] = useState(false);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = () => {
    const stored = localStorage.getItem("pos_orders");
    if (stored) {
      try {
        const orders: Order[] = JSON.parse(stored);
        const found = orders.find(o => o.id === orderId);
        if (found) {
          setOrder(found);
        }
      } catch {}
    }
    setLoading(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Clock className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push('/admin/orders')}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">Order Not Found</h1>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Package className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-bold">Order #{orderId} not found</p>
            <p className="text-sm">The order may have been deleted or doesn't exist.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const sourceCfg = order.source === "pos" 
    ? { label: "POS", icon: ShoppingCart, className: "bg-purple-100 text-purple-700" }
    : { label: "Website", icon: Globe, className: "bg-blue-100 text-blue-700" };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push('/admin/orders')}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">#{order.id}</h1>
                <Badge className={cn("shadow-none uppercase text-[10px] font-bold tracking-widest", 
                  order.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                )}>
                  {order.status}
                </Badge>
                <Badge className={cn("shadow-none uppercase text-[10px] font-bold tracking-widest", sourceCfg.className)}>
                  <sourceCfg.icon className="w-3 h-3 mr-1" />
                  {sourceCfg.label}
                </Badge>
              </div>
              <p className="text-sm text-slate-500">{formatDate(order.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2" onClick={() => setShowPrintDialog(true)}>
              <Printer className="w-4 h-4" />
              Print Receipt
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Order Items ({order.items.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {order.items.map((item, idx) => (
                    <div key={item.id || idx} className="p-6 flex gap-4">
                      <div className="w-16 h-16 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-8 h-8 text-slate-300 m-auto" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">
                          ${item.price.toFixed(2)} × {item.qty}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-black text-slate-900">${(item.price * item.qty).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Summary */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-medium text-slate-900">${order.subtotal.toFixed(2)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Discount</span>
                      <span className="font-medium text-amber-600">-${order.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tax</span>
                    <span className="font-medium text-slate-900">${order.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-baseline pt-2">
                    <span className="text-lg font-bold text-slate-900">Total Paid</span>
                    <span className="text-2xl font-black text-slate-900">${order.total.toFixed(2)}</span>
                  </div>
                </div>
                <div className={cn("p-4 rounded-xl flex items-center justify-between", 
                  order.paymentMethod === "cash" ? "bg-emerald-50" : "bg-blue-50"
                )}>
                  <div className="flex items-center gap-3 text-slate-700">
                    {order.paymentMethod === "cash" ? (
                      <CreditCard className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    )}
                    <span className="text-sm font-bold capitalize">{order.paymentMethod} Payment</span>
                  </div>
                  <Badge className={cn("shadow-none", 
                    order.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                  )}>
                    {order.status === "completed" ? "Paid" : "Refunded"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                  <div className="flex gap-4 relative pl-8">
                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">Order Completed</p>
                      <p className="text-xs text-slate-500">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 relative pl-8">
                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-slate-300 border-2 border-white" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">Payment Received</p>
                      <p className="text-xs text-slate-500">Via {order.paymentMethod}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer */}
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Customer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <span className="font-bold text-sm">
                      {order.customer?.name?.charAt(0) || "W"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {order.customer?.name || "Walk-in Customer"}
                    </p>
                    <p className="text-xs text-slate-500">Customer</p>
                  </div>
                </div>
                {order.customer && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      {order.customer.phone && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="w-4 h-4" />
                          {order.customer.phone}
                        </div>
                      )}
                      {order.customer.email && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail className="w-4 h-4" />
                          {order.customer.email}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            {order.customerAddress && (
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Shipping Address</CardTitle>
                  <MapPin className="w-4 h-4 text-slate-300" />
                </CardHeader>
                <CardContent className="text-sm text-slate-600 space-y-1">
                  <p className="font-bold">{order.customer?.name || "Customer"}</p>
                  <p>{order.customerAddress.label}</p>
                  <p>{order.customerAddress.full}</p>
                </CardContent>
              </Card>
            )}

            {/* Order Info */}
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Order Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Order ID</span>
                  <span className="font-bold text-slate-900">{order.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Source</span>
                  <Badge className={cn("text-xs", sourceCfg.className)}>
                    {sourceCfg.label}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Payment</span>
                  <span className="font-bold capitalize text-slate-900">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Status</span>
                  <Badge className={cn("text-xs", 
                    order.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                  )}>
                    {order.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Print Receipt Dialog */}
        {showPrintDialog && order && (
          <PrintReceipt order={order} onClose={() => setShowPrintDialog(false)} />
        )}
      </div>
    </AdminLayout>
  );
}