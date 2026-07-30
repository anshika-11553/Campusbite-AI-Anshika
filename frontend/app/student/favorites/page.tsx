'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function StudentFavoritesPage() {
  return (
    <DashboardLayout role="student" title="Favorite Items">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500 fill-red-500" />
              Saved Favorites
            </h2>
            <p className="text-xs text-slate-500">Your quick-reorder favorite meals and snacks</p>
          </div>
          <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full border border-red-200">
            4 Saved Dishes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Paneer Butter Masala', category: 'Main Course', price: '₹140', rating: 4.8, prep: '15 min' },
            { name: 'Cheese Grilled Sandwich', category: 'Breakfast', price: '₹70', rating: 4.6, prep: '8 min' },
            { name: 'Cold Coffee with Ice Cream', category: 'Beverages', price: '₹60', rating: 4.9, prep: '5 min' },
            { name: 'Samosa Pav (2 Pcs)', category: 'Snacks', price: '₹40', rating: 4.7, prep: '3 min' },
          ].map((item, idx) => (
            <Card key={idx} className="p-4 hover:shadow-lg transition-all border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
                      {item.category}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 mt-1">{item.name}</h3>
                  </div>
                  <button className="text-red-500 hover:scale-110 transition-transform">
                    <Heart className="h-5 w-5 fill-red-500" />
                  </button>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 mt-3">
                  <span className="flex items-center gap-1 font-semibold text-amber-600">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {item.rating}
                  </span>
                  <span>•</span>
                  <span>Prep: {item.prep}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                <span className="text-lg font-extrabold text-slate-900">{item.price}</span>
                <Button variant="primary" size="sm" leftIcon={<ShoppingBag className="h-4 w-4" />}>
                  Reorder
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
