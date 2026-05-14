"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Search, 
  ShoppingCart, 
  User, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  Banknote, 
  ChevronLeft,
  X,
  Check,
  Loader2,
  Receipt,
  Clock,
  Package,
  QrCode,
  Users,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Product = {
  id: string;
  title: string;
  handle: string;
  price: number;
  productType: string | null;
  status: string;
  variants: { id: string; title: string; price: number; inventoryQty: number }[];
  media: { id: string; url: string; alt: string | null }[];
};

type CartItem = {
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
  isDefault: boolean;
};

type Customer = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  addresses: Address[];
  createdAt: string;
};

type Order = {
  id: string;
  items: CartItem[];
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

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [showCustomerSelect, setShowCustomerSelect] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState<Order | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [showOrdersPanel, setShowOrdersPanel] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discountType, setDiscountType] = useState<"percent" | "fixed">("percent");
  const [discountValue, setDiscountValue] = useState(0);
  const [seeding, setSeeding] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [taxPercent, setTaxPercent] = useState(8);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "", email: "", address: "" });
  const [newAddress, setNewAddress] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("pos_customers");
    if (saved) {
      try {
        setCustomers(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("pos_customers", JSON.stringify(customers));
  }, [customers]);

  const handleAddCustomer = () => {
    if (!newCustomer.name.trim() || !newCustomer.phone.trim()) return;
    
    const customer: Customer = {
      id: `cust_${Date.now()}`,
      name: newCustomer.name.trim(),
      phone: newCustomer.phone.trim(),
      email: newCustomer.email.trim() || undefined,
      addresses: newCustomer.address.trim() ? [{
        id: `addr_${Date.now()}`,
        label: "Home",
        full: newCustomer.address.trim(),
        isDefault: true
      }] : [],
      createdAt: new Date().toISOString()
    };
    
    setCustomers(prev => [customer, ...prev]);
    setCustomer(customer);
    setNewCustomer({ name: "", phone: "", email: "", address: "" });
    setShowAddCustomerModal(false);
    setShowCustomerSelect(false);
    toast.success("Customer added successfully");
  };

  const handleAddAddress = (custId: string) => {
    if (!newAddress.trim()) return;
    
    setCustomers(prev => prev.map(c => {
      if (c.id === custId) {
        const addr: Address = {
          id: `addr_${Date.now()}`,
          label: `Address ${c.addresses.length + 1}`,
          full: newAddress.trim(),
          isDefault: false
        };
        return { ...c, addresses: [...c.addresses, addr] };
      }
      return c;
    }));
    setNewAddress("");
  };

  const handleSelectCustomerWithAddress = (cust: Customer) => {
    const defaultAddr = cust.addresses.find(a => a.isDefault) || cust.addresses[0] || null;
    setCustomer(cust);
    setSelectedAddress(defaultAddr);
    setShowCustomerSelect(false);
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/init");
      const data = await res.json();
      toast.success("Store initialized with sample products");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to initialize store");
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    const savedCart = localStorage.getItem("pos_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("pos_cart", JSON.stringify(cart));
  }, [cart]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/v1/products?status=active");
      const data = await res.json();
      const products = data.data || [];
      setProducts(products);
      
      const cats = new Set(["All"]);
      products.forEach((p: Product) => {
        if (p.productType) cats.add(p.productType);
      });
      setCategories(Array.from(cats));
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter(p => 
    (activeCategory === "All" || p.productType === activeCategory) &&
    p.title.toLowerCase().includes(search.toLowerCase()) &&
    p.status === "active"
  );

  const addToCart = (product: Product, variant?: Product["variants"][0]) => {
    const price = variant ? variant.price : Math.min(...product.variants.map(v => v.price)) || 0;
    const itemId = `${product.id}${variant ? `-${variant.id}` : ""}`;
    
    setCart(prev => {
      const existing = prev.find(item => item.id === itemId);
      if (existing) {
        return prev.map(item => item.id === itemId ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, {
        id: itemId,
        productId: product.id,
        variantId: variant?.id,
        name: variant ? `${product.title} - ${variant.title}` : product.title,
        price,
        qty: 1,
        image: product.media[0]?.url,
      }];
    });
    toast.success(`Added ${product.title} to cart`);
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.qty + delta);
        return newQty === 0 ? null : { ...item, qty: newQty };
      }
      return item;
    }).filter(Boolean));
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setCustomer(null);
    setSelectedAddress(null);
    setDiscountValue(0);
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discount = discountType === "percent" 
    ? subtotal * (discountValue / 100) 
    : Math.min(discountValue, subtotal);
  const tax = (subtotal - discount) * (taxPercent / 100);
  const total = subtotal - discount + tax;

  const handleCheckout = async () => {
    if (!paymentMethod) return;
    setProcessingPayment(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const order: Order = {
      id: `ORD-${Date.now()}`,
      items: [...cart],
      total,
      subtotal,
      tax,
      discount,
      paymentMethod,
      customer,
      customerAddress: selectedAddress,
      source: "pos",
      status: "completed",
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage for persistence
    const savedOrders = JSON.parse(localStorage.getItem("pos_orders") || "[]");
    savedOrders.unshift(order);
    localStorage.setItem("pos_orders", JSON.stringify(savedOrders.slice(0, 100)));

    setRecentOrders(prev => [order, ...prev].slice(0, 10));
    setShowPaymentModal(false);
    setShowReceipt(order);
    clearCart();
    setProcessingPayment(false);
  };

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      {/* Left: Product Grid */}
      <div className={cn("flex-1 flex flex-col h-full bg-slate-100 transition-all", showOrdersPanel ? "mr-0" : "")}>
        {/* Header */}
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => window.location.href='/admin'}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Terminal #01</h1>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Open Session</Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search products..." 
                className="pl-10 h-10 border-none bg-slate-100 focus-visible:ring-slate-200"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => setShowOrdersPanel(!showOrdersPanel)}
            >
              <Receipt className="w-4 h-4" />
              Orders ({recentOrders.length})
            </Button>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-600">Online</span>
            </div>
            {products.length === 0 && (
              <Button variant="outline" size="sm" onClick={handleSeed} disabled={seeding} className="gap-2">
                {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4" />}
                {seeding ? "Initializing..." : "Initialize Store"}
              </Button>
            )}
          </div>
        </header>

        {/* Categories Bar */}
        <div className="px-6 py-4 flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap",
                activeCategory === cat ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-200"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-hide">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Package className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-bold">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filtered.map(product => {
                const prices = product.variants?.map(v => v.price).filter(p => p > 0) || [];
                const minPrice = prices.length > 0 ? Math.min(...prices) : 19.99;
                const totalStock = product.variants?.reduce((acc, v) => acc + (v.inventoryQty || 0), 0) || 0;
                
                return (
                  <Card 
                    key={product.id} 
                    className={cn(
                      "border-none shadow-sm cursor-pointer hover:shadow-md transition-all active:scale-95 group relative",
                      totalStock === 0 && "opacity-50 grayscale cursor-not-allowed"
                    )}
                    onClick={() => totalStock > 0 && addToCart(product)}
                  >
                    <CardContent className="p-0">
                      <div className="aspect-square bg-slate-200 flex items-center justify-center overflow-hidden">
                        {product.media[0]?.url ? (
                          <img src={product.media[0].url} alt={product.title} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-8 h-8 text-slate-300" />
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">{product.productType || "Uncategorized"}</p>
                        <p className="text-sm font-bold text-slate-900 truncate mb-1">{product.title}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-black text-slate-900">${minPrice.toFixed(2)}</p>
                          <p className={cn("text-[10px] font-bold", totalStock < 10 ? "text-amber-600" : "text-slate-400")}>
                            {totalStock} in stock
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    {totalStock === 0 && (
                      <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                        <Badge variant="destructive" className="font-bold">Out of Stock</Badge>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Panel */}
      {showOrdersPanel && (
        <div className="w-80 bg-white border-l flex flex-col h-full">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-bold">Recent Orders</h2>
            <Button variant="ghost" size="icon" onClick={() => setShowOrdersPanel(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-center text-slate-400 text-sm">No orders yet</p>
            ) : (
              recentOrders.map(order => (
                <div 
                  key={order.id} 
                  className="p-3 border rounded-lg cursor-pointer hover:bg-slate-50"
                  onClick={() => setShowReceipt(order)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500">{order.id}</span>
                    <Badge variant="outline" className="text-[10px]">{order.paymentMethod}</Badge>
                  </div>
                  <p className="font-bold text-sm">${order.total.toFixed(2)}</p>
                  <p className="text-xs text-slate-500">{order.items.length} items</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Right: Cart Sidebar */}
      <div className="w-[400px] bg-white border-l flex flex-col h-full shadow-2xl z-20">
        {/* Customer Section */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Current Order
            </h2>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500" onClick={clearCart}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <div 
            className="p-3 bg-slate-50 border border-dashed rounded-xl flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-colors"
            onClick={() => setShowCustomerSelect(true)}
          >
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
              {customer ? (
                <span className="text-sm font-bold text-blue-600">{customer.name.charAt(0)}</span>
              ) : (
                <User className="w-5 h-5 text-slate-400" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">
                {customer ? customer.name : "Add Customer"}
              </p>
              <p className="text-xs text-slate-500">
                {selectedAddress 
                  ? selectedAddress.full 
                  : customer 
                    ? (customer.email || customer.phone) 
                    : "Walk-in customer"}
              </p>
            </div>
            {customer ? (
              <button 
                className="p-1 hover:bg-slate-200 rounded"
                onClick={(e) => { e.stopPropagation(); setCustomer(null); }}
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            ) : (
              <Plus className="w-4 h-4 text-slate-400" />
            )}
          </div>
        </div>

        {/* Discount Bar */}
        {discountValue > 0 && (
          <div className="px-6 py-3 bg-amber-50 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-700">Discount applied</span>
              <span className="text-xs text-amber-600">-{discount.toFixed(2)}</span>
            </div>
            <Button variant="ghost" size="sm" className="text-amber-700 h-6 text-xs" onClick={() => setDiscountValue(0)}>
              Remove
            </Button>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300">
              <ShoppingCart className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-bold">Your cart is empty</p>
              <p className="text-sm">Add products to get started</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex items-center gap-3 group">
                <div className="w-12 h-12 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-6 h-6 text-slate-300 m-auto" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
                  <p className="text-xs text-slate-500">${item.price.toFixed(2)} / unit</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="w-7 h-7 rounded-full" onClick={() => updateQty(item.id, -1)}>
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="text-sm font-black w-4 text-center">{item.qty}</span>
                  <Button variant="outline" size="icon" className="w-7 h-7 rounded-full" onClick={() => updateQty(item.id, 1)}>
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900 w-16">
                    ${(item.price * item.qty).toFixed(2)}
                  </p>
                  <button 
                    className="text-[10px] text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-500">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discountValue > 0 && (
              <div className="flex justify-between text-sm text-amber-600">
                <span>Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-slate-500 items-center">
              <button 
                className="hover:text-slate-700 flex items-center gap-1"
                onClick={() => setShowTaxModal(true)}
              >
                <span>Tax ({taxPercent}%)</span>
              </button>
              <span>${tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-baseline">
              <span className="text-lg font-bold">Total</span>
              <span className="text-3xl font-black text-slate-900">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="h-12 flex-1 font-bold gap-2 bg-white"
              onClick={() => setShowDiscountModal(true)}
              disabled={cart.length === 0}
            >
              <DollarSign className="w-4 h-4" />
              Discount
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-14 font-bold gap-2 bg-white"
              onClick={() => { setPaymentMethod("cash"); setShowPaymentModal(true); }}
              disabled={cart.length === 0}
            >
              <Banknote className="w-5 h-5 text-emerald-600" />
              Cash
            </Button>
            <Button 
              className="h-14 font-bold gap-2 bg-slate-900 hover:bg-slate-800 text-white shadow-lg"
              onClick={() => { setPaymentMethod("card"); setShowPaymentModal(true); }}
              disabled={cart.length === 0}
            >
              <CreditCard className="w-5 h-5" />
              Card
            </Button>
          </div>
        </div>
      </div>

      {/* Customer Select Dialog */}
      <Dialog open={showCustomerSelect} onOpenChange={setShowCustomerSelect}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Select Customer</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Walk-in Option */}
            <div 
              className="p-4 border rounded-lg cursor-pointer hover:bg-slate-50 flex items-center gap-3"
              onClick={() => { setCustomer(null); setSelectedAddress(null); setShowCustomerSelect(false); }}
            >
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                <User className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="font-bold">Walk-in Customer</p>
                <p className="text-xs text-slate-500">No customer selected</p>
              </div>
            </div>

            {/* Existing Customers */}
            {customers.length > 0 && (
              <div className="border-t pt-3">
                <p className="text-xs font-semibold text-slate-500 mb-2">Existing Customers</p>
                {customers.map(cust => (
                  <div key={cust.id} className="mb-2">
                    <div 
                      className="p-3 border rounded-lg cursor-pointer hover:bg-blue-50 flex items-start gap-3"
                      onClick={() => handleSelectCustomerWithAddress(cust)}
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">{cust.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm">{cust.name}</p>
                        <p className="text-xs text-slate-500">{cust.phone}</p>
                        {cust.addresses.length > 0 && (
                          <p className="text-xs text-blue-600 mt-1">
                            {cust.addresses.length} address(es)
                          </p>
                        )}
                      </div>
                    </div>
                    
                      {cust.addresses.length > 0 && (
                        <div className="ml-13 pl-13 mt-1 space-y-1">
                          {cust.addresses.map(addr => (
                            <div
                              key={addr.id}
                              className={cn(
                                "ml-13 pl-13 p-2 text-xs border rounded cursor-pointer flex items-center gap-2",
                                selectedAddress?.id === addr.id 
                                  ? "border-blue-500 bg-blue-50" 
                                  : "border-dashed hover:bg-slate-50"
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCustomer(cust);
                                setSelectedAddress(addr);
                                setShowCustomerSelect(false);
                              }}
                            >
                              <div className={cn(
                                "w-4 h-4 rounded-full border flex items-center justify-center",
                                selectedAddress?.id === addr.id ? "bg-blue-500 border-blue-500" : "border-slate-300"
                              )}>
                                {selectedAddress?.id === addr.id && <Check className="w-2 h-2 text-white" />}
                              </div>
                              <span className="font-medium">{addr.label}:</span>
                              <span className="text-slate-600 truncate">{addr.full}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}

            {/* Add New Customer Button */}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowAddCustomerModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Customer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Customer Modal */}
      <Dialog open={showAddCustomerModal} onOpenChange={setShowAddCustomerModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input 
                placeholder="Customer name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
              />
            </div>
            <div>
              <Label>Phone Number *</Label>
              <Input 
                placeholder="Phone number"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
              />
            </div>
            <div>
              <Label>Email (Optional)</Label>
              <Input 
                placeholder="Email address"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
              />
            </div>
            <div>
              <Label>Address (Optional)</Label>
              <Textarea 
                placeholder="Full address"
                value={newCustomer.address}
                onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCustomerModal(false)}>Cancel</Button>
            <Button 
              onClick={handleAddCustomer}
              disabled={!newCustomer.name.trim() || !newCustomer.phone.trim()}
            >
              Add Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-center p-6 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500 mb-1">Total Amount</p>
              <p className="text-4xl font-black text-slate-900">${total.toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className={cn(
                "p-4 border-2 rounded-lg cursor-pointer transition-all",
                paymentMethod === "cash" ? "border-emerald-500 bg-emerald-50" : "border-slate-200"
              )} onClick={() => setPaymentMethod("cash")}>
                <Banknote className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="font-bold text-center">Cash</p>
              </div>
              <div className={cn(
                "p-4 border-2 rounded-lg cursor-pointer transition-all",
                paymentMethod === "card" ? "border-blue-500 bg-blue-50" : "border-slate-200"
              )} onClick={() => setPaymentMethod("card")}>
                <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="font-bold text-center">Card</p>
              </div>
            </div>
            {paymentMethod === "cash" && (
              <div className="space-y-2">
                <Label>Cash Received</Label>
                <Input 
                  type="number" 
                  placeholder="Enter amount" 
                  className="text-lg font-bold"
                  onChange={(e) => {
                    const received = parseFloat(e.target.value) || 0;
                    if (received >= total) {
                      toast.success(`Change: $${(received - total).toFixed(2)}`);
                    }
                  }}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentModal(false)}>Cancel</Button>
            <Button 
              onClick={handleCheckout}
              disabled={!paymentMethod || processingPayment}
              className="gap-2"
            >
              {processingPayment && <Loader2 className="w-4 h-4 animate-spin" />}
              {processingPayment ? "Processing..." : "Complete Sale"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Discount Modal */}
      <Dialog open={showDiscountModal} onOpenChange={setShowDiscountModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Discount</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex gap-2">
              <Button 
                variant={discountType === "percent" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setDiscountType("percent")}
              >
                Percentage
              </Button>
              <Button 
                variant={discountType === "fixed" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setDiscountType("fixed")}
              >
                Fixed Amount
              </Button>
            </div>
            <div>
              <Label>
                {discountType === "percent" ? "Discount %" : "Discount Amount ($)"}
              </Label>
              <Input 
                type="number" 
                value={discountValue}
                onChange={(e) => setDiscountValue(Math.max(0, parseFloat(e.target.value) || 0))}
                className="text-lg font-bold"
              />
            </div>
            {discountType === "percent" && discountValue > 0 && (
              <p className="text-sm text-amber-600">
                You save: ${(subtotal * discountValue / 100).toFixed(2)}
              </p>
            )}
            {discountType === "fixed" && discountValue > 0 && (
              <p className="text-sm text-amber-600">
                You save: ${Math.min(discountValue, subtotal).toFixed(2)}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDiscountModal(false)}>Cancel</Button>
            <Button onClick={() => setShowDiscountModal(false)}>Apply Discount</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tax Settings Modal */}
      <Dialog open={showTaxModal} onOpenChange={setShowTaxModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tax Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Tax Rate (%)</Label>
              <Input 
                type="number" 
                value={taxPercent}
                onChange={(e) => setTaxPercent(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                className="text-lg font-bold"
                min={0}
                max={100}
              />
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500 mb-2">Quick presets:</p>
              <div className="flex gap-2">
                {[0, 5, 8, 10, 15, 20].map(rate => (
                  <Button
                    key={rate}
                    variant={taxPercent === rate ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTaxPercent(rate)}
                  >
                    {rate}%
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTaxModal(false)}>Cancel</Button>
            <Button onClick={() => setShowTaxModal(false)}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receipt Modal */}
      <Dialog open={!!showReceipt} onOpenChange={() => setShowReceipt(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-500" />
              Sale Complete
            </DialogTitle>
          </DialogHeader>
          {showReceipt && (
            <div className="space-y-4">
              <div className="text-center p-6 bg-slate-50 rounded-lg">
                <p className="text-3xl font-black text-slate-900">${showReceipt.total.toFixed(2)}</p>
                <p className="text-sm text-slate-500 mt-1">Paid via {showReceipt.paymentMethod}</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Order ID</span>
                  <span className="font-bold">{showReceipt.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Items</span>
                  <span className="font-bold">{showReceipt.items.length}</span>
                </div>
                {showReceipt.customer && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Customer</span>
                    <span className="font-bold">{showReceipt.customer.name}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Time</span>
                  <span className="font-bold">{new Date(showReceipt.createdAt).toLocaleTimeString()}</span>
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="text-xs text-slate-400 text-center">Thank you for your purchase!</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button className="w-full" onClick={() => setShowReceipt(null)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}