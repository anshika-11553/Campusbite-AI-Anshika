"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ROLES } from "@/lib/api";
import {
  MessageSquare,
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Zap,
  ChevronDown,
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
}

export const AIChatbot: React.FC = () => {
  const { activeRole, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-1",
      sender: "bot",
      text: getInitialGreeting(activeRole, user?.full_name || "there"),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  function getInitialGreeting(roleId: string, name: string) {
    switch (roleId) {
      case ROLES.VENDOR:
        return `Hello ${name}! I'm your AI Vendor Assistant. I can analyze your daily revenue, predict peak hour inventory needs, or check active order queue status.`;
      case ROLES.CHEF:
        return `Chef ${name}! AI Kitchen Assistant online. Ask me about preparation order priorities, delayed tokens, or recipe prep times.`;
      case ROLES.ADMIN:
        return `System Admin! AI Operations Copilot ready. I can summarize total campus sales volume, platform health, and order distribution across canteens.`;
      default:
        return `Hey ${name}! I'm CampusBite AI Foodie. Looking for food recommendations, calorie counts, or live order token updates?`;
    }
  }

  function getSuggestedPrompts(roleId: string) {
    switch (roleId) {
      case ROLES.VENDOR:
        return [
          "📊 What is today's revenue forecast?",
          "🔥 Which item is selling fastest right now?",
          "⏰ When is the next peak rush hour?",
        ];
      case ROLES.CHEF:
        return [
          "🍳 What token should I prepare first?",
          "⏱️ Show prep time for Chole Bhature",
          "🔔 Any orders waiting at counter?",
        ];
      case ROLES.ADMIN:
        return [
          "🛡️ System health status report",
          "📈 Active orders across campus",
          "👑 Most active user roles today",
        ];
      default:
        return [
          "🚀 What should I order for lunch?",
          "💪 High protein meal under ₹100",
          "👥 How do I create a group order token?",
        ];
    }
  }

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: "msg-" + Date.now(),
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponseText = generateAIResponse(query, activeRole);
      const botMsg: Message = {
        id: "bot-" + Date.now(),
        sender: "bot",
        text: botResponseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  function generateAIResponse(query: string, roleId: string) {
    const q = query.toLowerCase();

    if (roleId === ROLES.VENDOR) {
      if (q.includes("revenue") || q.includes("sales")) {
        return "💰 Total gross revenue today is ₹14,850 (+14.2% higher than yesterday). Top revenue contributor: Crispy Paneer Butter Masala Roll!";
      }
      if (q.includes("fastest") || q.includes("popular")) {
        return "🔥 Cheese Samosa (890 orders) and Cold Coffee (654 orders) are currently trending fastest!";
      }
      if (q.includes("rush") || q.includes("peak")) {
        return "⏰ Peak afternoon rush hour predicted between 3:15 PM - 4:45 PM. Recommend pre-frying 25 samosas and preparing 15 cold coffee bases!";
      }
      return "📊 Vendor AI: All queue systems synced. 5 active orders currently in prep queue.";
    }

    if (roleId === ROLES.CHEF) {
      if (q.includes("prepare first") || q.includes("priority")) {
        return "🍳 Priority 1: Token #24 (Crispy Paneer Roll) - 10 mins prep time. Priority 2: Token #25 (Cheese Samosa) - 5 mins prep time.";
      }
      if (q.includes("time") || q.includes("chole")) {
        return "⏱️ Amritsari Chole Bhature requires ~10 mins prep time (4 mins bhatura fry + 6 mins chole simmer).";
      }
      if (q.includes("counter") || q.includes("ready")) {
        return "🔔 Currently 2 orders placed at counter awaiting student pickup (Token #22 and Token #23).";
      }
      return "👨‍🍳 Kitchen AI: All burners operational. 3 orders in cooking status.";
    }

    if (roleId === ROLES.ADMIN) {
      if (q.includes("health") || q.includes("status")) {
        return "🛡️ All services 100% operational. Latency <24ms. Zero database or API errors logged.";
      }
      if (q.includes("active") || q.includes("orders")) {
        return "📈 Total system volume today: 142 orders completed across 4 campus canteen zones.";
      }
      if (q.includes("user") || q.includes("roles")) {
        return "👑 Active roles online: 340 Students, 3 Vendors, 4 Chefs, 2 System Administrators.";
      }
      return "🌐 Admin AI Overseer: Campus Ecosystem performing at peak 99.9% uptime.";
    }

    // Default Student Responses
    if (q.includes("lunch") || q.includes("order") || q.includes("recommend")) {
      return "😋 Highly recommended today: Crispy Paneer Butter Masala Roll (₹120) paired with Chilled Mango Lassi (₹60)! AI Match Score: 98%";
    }
    if (q.includes("protein") || q.includes("high")) {
      return "💪 Best high-protein option under ₹100: Kadhai Paneer & Butter Naan Combo (18g Protein) or Punjab Aloo Paratha with Curd!";
    }
    if (q.includes("group") || q.includes("token")) {
      return "👥 Click the 'Generate Group Token' button at the top of your menu to create a shareable room code (e.g. HOSTEL-ROOM-302) to pool orders with friends!";
    }
    return "✨ I'm here to help you order delicious food, check calorie counts, or track your token status!";
  }

  const suggestedPrompts = getSuggestedPrompts(activeRole);

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#fc8019] text-white shadow-2xl hover:bg-[#e5700e] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
          <span className="text-xs font-black pr-1 hidden sm:inline">AI Copilot</span>
        </button>
      )}

      {/* Expanded Swiggy Style AI Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[520px] animate-in slide-in-from-bottom-5 duration-200">
          
          {/* Top Bar */}
          <div className="p-4 bg-[#fc8019] text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/20 rounded-xl">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-black tracking-tight">CampusBite AI Assistant</h4>
                <p className="text-[10px] text-orange-100 font-medium">Role Tailored Copilot • Always Online</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Scroll View */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-[#fc8019] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#fc8019] text-white rounded-br-none shadow-sm"
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm"
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`text-[9px] block mt-1 ${
                      msg.sender === "user" ? "text-orange-100 text-right" : "text-slate-400"
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>

                {msg.sender === "user" && (
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Bot className="w-4 h-4 text-[#fc8019] animate-bounce" />
                <span className="font-semibold">AI is thinking...</span>
              </div>
            )}
          </div>

          {/* Quick Prompt Chips */}
          <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto">
            {suggestedPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-orange-50 hover:text-[#fc8019] border border-slate-200 text-[11px] font-bold text-slate-700 whitespace-nowrap transition-colors shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask AI anything about menu, orders..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#fc8019]"
            />

            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="p-2.5 bg-[#fc8019] hover:bg-[#e5700e] text-white rounded-xl disabled:opacity-40 transition-all shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};
