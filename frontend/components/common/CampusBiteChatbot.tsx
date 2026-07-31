'use client';

import React, { useState, useRef, useEffect } from 'react';
import { UserRole } from '@/types/auth';
import { getChatbotResponse } from '@/services/chatbot/knowledgeBase';
import { MessageSquare, X, Send, Trash2, Bot, User, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

interface CampusBiteChatbotProps {
  role: UserRole;
}

export const CampusBiteChatbot: React.FC<CampusBiteChatbotProps> = ({ role }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const roleLabel = role === 'student' ? 'Student Assistant' : role === 'vendor' ? 'Vendor Assistant' : role === 'chief' ? 'Chef Assistant' : 'Admin Assistant';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'bot',
      text: `Hello! 👋 Welcome to CampusBite AI ${roleLabel}. How can I assist you with orders, tokens, or canteen operations today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const seqRef = useRef<number>(100);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    seqRef.current += 1;
    const currentSeq = seqRef.current;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `usr-msg-${currentSeq}`,
      sender: 'user',
      text: query,
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    // Simulate natural typing delay (400ms)
    setTimeout(() => {
      seqRef.current += 1;
      const botResponse = getChatbotResponse(query, role);
      const botMsg: ChatMessage = {
        id: `bot-msg-${seqRef.current}`,
        sender: 'bot',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 400);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg-welcome-${Date.now()}`,
        sender: 'bot',
        text: `Chat history cleared. How can I help you next?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Quick Action Chips per Role
  const getQuickChips = () => {
    switch (role) {
      case 'student':
        return [
          { label: '🍔 Place Order', query: 'How to place an order?' },
          { label: '💳 Payment', query: 'How does UPI payment work?' },
          { label: '🎟 Token', query: 'How does the token system work?' },
          { label: '📦 Order Status', query: 'Where is my order status?' },
          { label: '🏆 Rewards', query: 'Tell me about student rewards' },
        ];
      case 'vendor':
        return [
          { label: '📥 Accept Order', query: 'How to accept or reject incoming orders?' },
          { label: '🎟 Verify Token', query: 'How to verify token before delivery?' },
          { label: '📱 Upload QR', query: 'How to upload vendor payment QR?' },
          { label: '🚚 Deliver Order', query: 'How to mark order delivered?' },
        ];
      case 'chief':
        return [
          { label: '🍳 Cooking Queue', query: 'How does kitchen cooking queue work?' },
          { label: '✅ Mark Ready', query: 'How to advance cooking stages?' },
          { label: '⏳ Priority Orders', query: 'What are high priority orders?' },
        ];
      case 'admin':
        return [
          { label: '📊 Analytics', query: 'Where are dashboard analytics?' },
          { label: '👥 Manage Users', query: 'How to manage vendors and chefs?' },
          { label: '💰 Payments', query: 'How to view payment logs?' },
          { label: '📄 Reports', query: 'How to export financial PDF report?' },
        ];
      default:
        return [
          { label: 'CampusBite Features', query: 'What is CampusBite AI?' },
          { label: 'Developer', query: 'Who developed this project?' },
        ];
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Popup Window */}
      {isOpen && (
        <Card className="w-[360px] sm:w-[400px] h-[500px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl flex flex-col overflow-hidden mb-3 animate-in slide-in-from-bottom-4 duration-200 border">
          {/* Header */}
          <div className="bg-[#054A36] text-white p-3.5 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-700/60 rounded-xl">
                <Bot className="h-5 w-5 text-emerald-300" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                  CampusBite AI Assistant
                  <Sparkles className="h-3.5 w-3.5 text-amber-300 fill-amber-300" />
                </h3>
                <span className="text-[10px] text-emerald-200 font-semibold uppercase tracking-wider block">
                  Offline Knowledge Engine • {roleLabel}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearChat}
                className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-800/50 rounded-lg transition-colors"
                title="Clear Chat History"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-800/50 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950/40 text-xs scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-[#054A36] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[78%] p-3 rounded-2xl space-y-1 shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#054A36] text-white rounded-br-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 rounded-bl-none'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <span
                    className={`text-[9px] block text-right font-medium ${
                      msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2 items-center text-slate-400 font-medium text-xs">
                <div className="w-7 h-7 rounded-full bg-[#054A36] text-white flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-white dark:bg-slate-800 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Suggestion Chips */}
          <div className="p-2 bg-slate-100 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
            {getQuickChips().map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => handleSendMessage(chip.query)}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300 shrink-0 transition-colors"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask CampusBite AI assistant..."
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#054A36]"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="p-2 bg-[#054A36] hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl transition-colors shadow-sm"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </Card>
      )}

      {/* Floating Action Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3 bg-gradient-to-r from-[#054A36] to-emerald-700 text-white rounded-full shadow-2xl hover:scale-105 transition-all duration-200 flex items-center gap-2.5 border-2 border-white/20"
      >
        <div className="relative">
          <MessageSquare className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-900 animate-pulse" />
        </div>
        <span className="font-extrabold text-xs hidden sm:inline">Ask CampusBite AI</span>
      </button>
    </div>
  );
};
