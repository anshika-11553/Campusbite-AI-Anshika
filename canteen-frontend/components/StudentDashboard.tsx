"use client";

import React, { useState, useEffect } from "react";
import { MenuItem, Order, MOCK_MENU, api, formatTokenDisplay } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { PaymentModal } from "./PaymentModal";
import { CrowdMap } from "./CrowdMap";
import {
  Search,
  Flame,
  Clock,
  Plus,
  Minus,
  Trash2,
  Sparkles,
  ShoppingBag,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Award,
  Zap,
  ChevronRight,
  RefreshCw,
  Utensils,
  Mic,
  Users,
  Dumbbell,
  HeartPulse,
  Share2,
  Copy,
  Check,
  Calendar,
  MapPin,
  CalendarDays,
} from "lucide-react";

export const StudentDashboard: React.FC = () => {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalAmount,
    totalCalories,
    totalProtein,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  // Instant Preloaded Menu State Initialization
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MOCK_MENU);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"MENU" | "HISTORY">("MENU");
  const [checkoutOrder, setCheckoutOrder] = useState<Order | null>(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [isListeningVoice, setIsListeningVoice] = useState(false);

  // Live Crowding Map Stall State
  const [selectedStallId, setSelectedStallId] = useState<string>("stall-a");

  // Advance Pre-Order System State
  const [orderMode, setOrderMode] = useState<"INSTANT" | "PREORDER">("INSTANT");
  const [preorderDate, setPreorderDate] = useState<string>("Tomorrow (Aug 1)");
  const [preorderMealSlot, setPreorderMealSlot] = useState<string>("Lunch Slot (1:00 PM)");

  // Pickup Slot Timing State
  const slotOptions = [
    "⚡ Instant Pickup (Next 10-15 mins)",
    "🕐 Lunch Slot (12:30 PM - 1:00 PM)",
    "🕝 Afternoon Break (1:30 PM - 2:00 PM)",
    "🕒 Teatime Slot (3:30 PM - 4:00 PM)",
    "🕔 Evening Slot (5:00 PM - 5:30 PM)",
  ];
  const [selectedSlot, setSelectedSlot] = useState<string>(slotOptions[0]);

  // Group Order State
  const [groupToken, setGroupToken] = useState<string | null>(null);
  const [copiedGroupToken, setCopiedGroupToken] = useState(false);

  const categories = ["All", "Breakfast", "Main Course", "Snacks", "Beverages", "Desserts"];

  useEffect(() => {
    loadMenu();
    loadOrders();
  }, [selectedCategory]);

  const loadMenu = () => {
    const items = api.getMenu(selectedCategory, searchQuery);
    setMenuItems(items);
  };

  const loadOrders = async () => {
    try {
      const history = await api.getStudentOrders();
      setOrders(history || []);
    } catch (e) {
      console.error("Failed to load orders", e);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadMenu();
  };

  const handleVoiceSearch = () => {
    setIsListeningVoice(true);
    setTimeout(() => {
      setSearchQuery("Samosa");
      setIsListeningVoice(false);
      loadMenu();
    }, 1200);
  };

  const createGroupOrderToken = () => {
    const randomCode = "HOSTEL-ROOM-" + Math.floor(100 + Math.random() * 900);
    setGroupToken(randomCode);
  };

  const copyGroupToken = () => {
    if (groupToken) {
      navigator.clipboard.writeText(`Join my CampusBite Group Order Token: ${groupToken}`);
      setCopiedGroupToken(true);
      setTimeout(() => setCopiedGroupToken(false), 2000);
    }
  };

  const handleCheckoutSubmit = async () => {
    if (!cart || cart.length === 0) return;
    setIsSubmittingOrder(true);
    try {
      const itemsPayload = cart
        .filter((ci) => ci && ci.item && ci.item.id)
        .map((ci) => ({
          menu_item_id: ci.item.id,
          quantity: ci.quantity || 1,
        }));

      const res = await api.placeOrder(itemsPayload);
      const newOrder: Order = res.data;

      clearCart();
      setIsCartOpen(false);
      setCheckoutOrder(newOrder);
      loadOrders();
    } catch (e: any) {
      alert(e.message || "Failed to place order");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING_PAYMENT":
        return { label: "Pending Payment", color: "bg-amber-50 text-amber-700 border-amber-300" };
      case "PAID":
        return { label: "Paid • Awaiting Vendor", color: "bg-blue-50 text-blue-700 border-blue-300" };
      case "ACCEPTED":
        return { label: "Accepted by Vendor", color: "bg-indigo-50 text-indigo-700 border-indigo-300" };
      case "PREPARING":
        return { label: "Cooking in Kitchen 🔥", color: "bg-orange-50 text-orange-700 border-orange-300 font-bold" };
      case "READY":
        return { label: "Ready at Counter! 🔔", color: "bg-emerald-100 text-emerald-800 border-emerald-400 font-black" };
      case "COMPLETED":
        return { label: "Completed", color: "bg-slate-100 text-slate-600 border-slate-300" };
      case "CANCELLED":
        return { label: "Cancelled", color: "bg-red-50 text-red-700 border-red-300" };
      default:
        return { label: status, color: "bg-slate-100 text-slate-700 border-slate-300" };
    }
  };

  const trendingItems = (menuItems || []).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 bg-[#f8fafc]">
      
      {/* Live Campus Canteen Crowding Map & Smart Rerouter */}
      <CrowdMap
        selectedStallId={selectedStallId}
        onSelectStall={(stallId) => setSelectedStallId(stallId)}
      />

      {/* Advance Pre-Ordering Mode Selector */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-50 text-[#fc8019] rounded-2xl border border-orange-200">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-black text-slate-900">Campus Pre-Ordering Hub 📅</h4>
              <span className="px-2 py-0.5 text-[10px] font-black bg-[#fc8019] text-white rounded-md">
                System Feature
              </span>
            </div>
            <p className="text-xs text-slate-500">Order ahead for tomorrow or future meal slots to skip peak canteen lines</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-full md:w-auto">
          <button
            onClick={() => setOrderMode("INSTANT")}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              orderMode === "INSTANT"
                ? "bg-[#fc8019] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            ⚡ Same-Day Instant Order
          </button>
          <button
            onClick={() => setOrderMode("PREORDER")}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              orderMode === "PREORDER"
                ? "bg-[#fc8019] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            📅 Advance Pre-Order
          </button>
        </div>
      </div>

      {/* Pre-Order Date & Meal Selector Options */}
      {orderMode === "PREORDER" && (
        <div className="p-5 rounded-3xl bg-orange-50 border border-orange-200 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black text-[#fc8019] uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              <span>Configure Advance Pre-Order Schedule</span>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-600 text-white rounded">
              Priority Kitchen Slot Reserved
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Pre-Order Date</label>
              <select
                value={preorderDate}
                onChange={(e) => setPreorderDate(e.target.value)}
                className="w-full bg-white border border-orange-300 rounded-xl py-2.5 px-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#fc8019] shadow-sm"
              >
                <option value="Tomorrow (Aug 1)">Tomorrow (Aug 1, 2026)</option>
                <option value="Day After (Aug 2)">Day After (Aug 2, 2026)</option>
                <option value="Monday (Aug 3)">Monday (Aug 3, 2026)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Scheduled Meal Slot</label>
              <select
                value={preorderMealSlot}
                onChange={(e) => setPreorderMealSlot(e.target.value)}
                className="w-full bg-white border border-orange-300 rounded-xl py-2.5 px-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#fc8019] shadow-sm"
              >
                <option value="Breakfast Slot (8:30 AM)">Morning Breakfast Slot (8:30 AM - 9:00 AM)</option>
                <option value="Lunch Slot (1:00 PM)">Peak Lunch Slot (1:00 PM - 1:30 PM)</option>
                <option value="Snack Slot (4:30 PM)">Evening Snack Slot (4:30 PM - 5:00 PM)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Swiggy Style Campus AI Demand Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-white border border-orange-200 p-6 md:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fc8019] text-white text-xs font-extrabold shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Campus AI Demand Forecast
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Live Queue: 4 mins wait
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              What's Trending on Campus Right Now 🚀
            </h2>
            <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
              Based on real-time order volume and historical peak trends. Cheese Samosas & Cold Coffee are predicted to spike <strong className="text-[#fc8019]">92% higher</strong> in the next 30 minutes!
            </p>
          </div>

          {/* Trending Hot Items */}
          <div className="flex items-center gap-3 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0">
            {trendingItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => addToCart(item)}
                className="shrink-0 p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-orange-400 hover:shadow-md cursor-pointer w-44 space-y-2 group transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 text-[9px] font-extrabold bg-[#fc8019] text-white rounded-md uppercase">
                    #{idx + 1} Hot Match
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> +{94 - idx * 8}%
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#fc8019] truncate">
                  {item.name}
                </h4>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-black text-slate-900">₹{item.price}</span>
                  <button className="px-2.5 py-1 rounded-lg bg-orange-50 text-[#fc8019] font-bold text-xs group-hover:bg-[#fc8019] group-hover:text-white transition-colors">
                    + ADD
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Group Order & Room Token Generator */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-50 text-purple-700 rounded-xl border border-purple-100">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">Group Order & Room Token Generator 👥</h4>
            <p className="text-xs text-slate-500">Pool items with your hostel room or study group under 1 daily token</p>
          </div>
        </div>

        {groupToken ? (
          <div className="flex items-center gap-2 bg-slate-50 border border-purple-300 p-2 rounded-xl">
            <span className="text-xs font-black text-purple-700 px-2">{groupToken}</span>
            <button
              onClick={copyGroupToken}
              className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1 transition-colors"
            >
              {copiedGroupToken ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedGroupToken ? "Copied!" : "Share Token"}</span>
            </button>
          </div>
        ) : (
          <button
            onClick={createGroupOrderToken}
            className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-bold text-xs flex items-center gap-2 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Generate Group Token</span>
          </button>
        )}
      </div>

      {/* Navigation Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
        
        <div className="flex items-center gap-2 p-1 bg-slate-200/60 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("MENU")}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "MENU"
                ? "bg-[#fc8019] text-white shadow-md"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Canteen Menu</span>
          </button>

          <button
            onClick={() => { setActiveTab("HISTORY"); loadOrders(); }}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 relative ${
              activeTab === "HISTORY"
                ? "bg-[#fc8019] text-white shadow-md"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>My Orders & Tokens</span>
            {orders.some((o: Order) => ["PENDING_PAYMENT", "PAID", "ACCEPTED", "PREPARING", "READY"].includes(o.status)) && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            )}
          </button>
        </div>

        {/* Swiggy Search Input & Voice Assistant */}
        {activeTab === "MENU" && (
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search samosa, coffee, roll..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  const items = api.getMenu(selectedCategory, e.target.value);
                  setMenuItems(items);
                }}
                className="w-full bg-white border border-slate-300 rounded-2xl py-2 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#fc8019] transition-colors shadow-sm"
              />
            </div>
            
            <button
              type="button"
              onClick={handleVoiceSearch}
              title="Voice Search"
              className={`p-2.5 rounded-2xl border transition-all ${
                isListeningVoice
                  ? "bg-red-500 text-white border-red-400 animate-pulse"
                  : "bg-white border-slate-300 text-slate-600 hover:text-[#fc8019]"
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      {/* Tab 1: Instant Swiggy Style Clean Food Menu Grid */}
      {activeTab === "MENU" && (
        <div className="space-y-6">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? "bg-[#fc8019] text-white border-[#fc8019] shadow-sm font-bold"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Instant Menu Grid */}
          {menuItems.length === 0 ? (
            <div className="text-center py-16 space-y-3 bg-white border border-slate-200 rounded-3xl shadow-sm">
              <Utensils className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No food items found</h3>
              <p className="text-xs text-slate-500">Try searching for something else or change category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {menuItems.map((item) => {
                const inCart = (cart || []).find((ci) => ci?.item?.id === item.id);
                return (
                  <div
                    key={item.id}
                    className="swiggy-card bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image Header */}
                      <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            loading="eager"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                            <Utensils className="w-10 h-10" />
                          </div>
                        )}

                        <span className="absolute top-3 right-3 px-2.5 py-1 text-[10px] font-bold bg-white/90 backdrop-blur-md text-slate-800 rounded-full border border-slate-200 shadow-sm">
                          {item.category}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="p-4 space-y-2">
                        <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-[#fc8019] transition-colors line-clamp-1">
                          {item.name}
                        </h3>

                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {item.description || "Freshly prepared in the campus canteen."}
                        </p>

                        <div className="flex items-center gap-3 pt-2 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3 text-[#fc8019]" /> {item.prep_time} mins
                          </span>
                          <span>•</span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white font-black text-[10px]">
                            ★ {item.rating || 4.8}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Swiggy Style Bottom Bar with ADD Button */}
                    <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 mt-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Price</span>
                        <span className="text-lg font-black text-slate-900">₹{item.price}</span>
                      </div>

                      {inCart ? (
                        <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl p-1">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 rounded-lg hover:bg-orange-100 text-[#fc8019]"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-black text-[#fc8019] px-2">{inCart.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 rounded-lg hover:bg-orange-100 text-[#fc8019]"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          className="px-4 py-2 rounded-xl bg-[#fc8019] hover:bg-[#e5700e] text-white font-extrabold text-xs shadow-md shadow-orange-500/20 flex items-center gap-1 transition-all active:scale-95"
                        >
                          <span>+ ADD</span>
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Student Order History & Daily Tokens */}
      {activeTab === "HISTORY" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">My Orders & Daily Tokens</h3>
              <p className="text-xs text-slate-500">Track your order token from kitchen prep to counter pickup</p>
            </div>
            <button
              onClick={loadOrders}
              className="p-2 rounded-xl bg-white border border-slate-300 text-slate-600 hover:text-slate-900 transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-sm">
              <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">No active or past orders</h4>
              <p className="text-xs text-slate-500">Add delicious food items from the menu to place an order.</p>
              <button
                onClick={() => setActiveTab("MENU")}
                className="mt-2 px-5 py-2.5 rounded-xl bg-[#fc8019] text-white font-bold text-xs shadow-md"
              >
                Explore Canteen Menu
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orders.map((ord) => {
                const statusBadge = getStatusBadge(ord.status);
                return (
                  <div
                    key={ord.id}
                    className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase text-slate-400">TOKEN NUMBER</span>
                          <span className="text-2xl font-black text-[#fc8019]">
                            {formatTokenDisplay(ord.token_number, ord.token_code)}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Order ID: {ord.id.slice(0, 8)} • Placed: {new Date(ord.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBadge.color}`}>
                        {statusBadge.label}
                      </span>
                    </div>

                    {/* Live Queue Position & Estimated Wait Time */}
                    {["PAID", "ACCEPTED", "PREPARING", "READY"].includes(ord.status) && (
                      <div className="grid grid-cols-2 gap-2 p-3 bg-orange-50/80 border border-orange-200 rounded-2xl text-xs">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">Queue Position</span>
                          <span className="text-sm font-black text-slate-900">
                            {ord.status === "READY" ? "Ready for Pickup! 🔔" : `#${ord.queue_position || 1} in Queue`}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">Est. Wait Time</span>
                          <span className="text-sm font-black text-[#fc8019]">
                            {ord.status === "READY" ? "0 mins" : `~${ord.estimated_wait_minutes || 15} mins`}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Lifecycle Progress Bar */}
                    <div className="space-y-1">
                      <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Token Lifecycle</div>
                      <div className="flex items-center justify-between gap-1 text-[9px] font-extrabold">
                        <div className={`flex-1 text-center py-1 rounded-lg border ${["PENDING_PAYMENT", "PAID", "ACCEPTED", "PREPARING", "READY", "COMPLETED"].includes(ord.status) ? "bg-emerald-500 text-white border-emerald-500" : "bg-slate-100 text-slate-400 border-slate-200"}`}>Placed</div>
                        <div className={`flex-1 text-center py-1 rounded-lg border ${["ACCEPTED", "PREPARING", "READY", "COMPLETED"].includes(ord.status) ? "bg-indigo-500 text-white border-indigo-500" : "bg-slate-100 text-slate-400 border-slate-200"}`}>Queued</div>
                        <div className={`flex-1 text-center py-1 rounded-lg border ${["PREPARING", "READY", "COMPLETED"].includes(ord.status) ? "bg-orange-500 text-white border-orange-500 animate-pulse" : "bg-slate-100 text-slate-400 border-slate-200"}`}>Preparing</div>
                        <div className={`flex-1 text-center py-1 rounded-lg border ${["READY", "COMPLETED"].includes(ord.status) ? "bg-amber-500 text-white border-amber-500" : "bg-slate-100 text-slate-400 border-slate-200"}`}>Ready</div>
                        <div className={`flex-1 text-center py-1 rounded-lg border ${ord.status === "COMPLETED" ? "bg-blue-600 text-white border-blue-600" : "bg-slate-100 text-slate-400 border-slate-200"}`}>Collected</div>
                      </div>
                    </div>

                    {ord.items && ord.items.length > 0 && (
                      <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        {ord.items.map((it: any, i: number) => (
                          <div key={i} className="flex items-center justify-between text-xs">
                            <span className="text-slate-800 font-semibold">
                              {it.quantity}x {it.menu_name || "Item"}
                            </span>
                            <span className="text-slate-500 font-medium">₹{it.subtotal}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Total Amount</span>
                        <span className="text-base font-black text-slate-900">₹{ord.total_amount}</span>
                      </div>

                      {ord.status === "PENDING_PAYMENT" && (
                        <button
                          onClick={() => setCheckoutOrder(ord)}
                          className="px-4 py-2 rounded-xl bg-[#fc8019] text-white font-bold text-xs shadow-md"
                        >
                          Complete Payment
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Swiggy Style Clean Cart Slide-Over Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md h-full bg-white border-l border-slate-200 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#fc8019]" />
                  <h3 className="text-lg font-black text-slate-900">Your Food Basket</h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900"
                >
                  ✕
                </button>
              </div>

              {/* Slot Timing Selector Feature */}
              <div className="mb-4 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 uppercase">
                    <Calendar className="w-4 h-4 text-[#fc8019]" />
                    <span>Select Pickup Time Slot</span>
                  </div>
                  <span className="px-2 py-0.5 text-[9px] font-bold bg-[#fc8019] text-white rounded">
                    {orderMode === "PREORDER" ? preorderDate : "Today"}
                  </span>
                </div>

                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full bg-white border border-amber-300 rounded-xl py-2 px-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#fc8019] shadow-sm"
                >
                  {slotOptions.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              {/* AI Nutrition Calorie Meter */}
              {cart && cart.length > 0 && (
                <div className="mb-4 p-3 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-[#fc8019]" />
                    <div>
                      <span className="text-slate-900 font-bold block">AI Nutrition Tracker</span>
                      <span className="text-[10px] text-slate-600">{totalCalories} Calories • {totalProtein}g Protein</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-extrabold text-[10px]">
                    Balanced Meal
                  </span>
                </div>
              )}

              {!cart || cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500 font-medium">Your food basket is empty.</p>
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto max-h-[45vh] pr-1">
                  {cart.map((ci) => (
                    <div
                      key={ci?.item?.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                    >
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-slate-900">{ci?.item?.name}</h4>
                        <span className="text-xs font-semibold text-[#fc8019]">
                          ₹{ci?.item?.price} x {ci.quantity} = ₹{(ci?.item?.price || 0) * ci.quantity}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                        <button
                          onClick={() => updateQuantity(ci.item.id, -1)}
                          className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-black text-slate-900">{ci.quantity}</span>
                        <button
                          onClick={() => updateQuantity(ci.item.id, 1)}
                          className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(ci.item.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart && cart.length > 0 && (
              <div className="border-t border-slate-100 pt-4 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 font-semibold">Grand Total</span>
                  <span className="text-xl font-black text-[#fc8019]">₹{totalAmount}</span>
                </div>

                <button
                  onClick={handleCheckoutSubmit}
                  disabled={isSubmittingOrder}
                  className="w-full py-3.5 px-4 bg-[#fc8019] hover:bg-[#e5700e] text-white font-extrabold rounded-xl text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  {isSubmittingOrder ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>
                        {orderMode === "PREORDER" ? `Pre-Order for ${preorderDate}` : "Proceed to Checkout"}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Payment Gateway Modal */}
      {checkoutOrder && (
        <PaymentModal
          order={checkoutOrder}
          onClose={() => setCheckoutOrder(null)}
          onPaymentSuccess={() => {
            setCheckoutOrder(null);
            setActiveTab("HISTORY");
            loadOrders();
          }}
        />
      )}

    </div>
  );
};
