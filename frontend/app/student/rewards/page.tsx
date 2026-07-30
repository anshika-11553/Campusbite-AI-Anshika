'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Gift, Award, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function StudentRewardsPage() {
  return (
    <DashboardLayout role="student" title="Rewards & Loyalty Points">
      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#054A36] to-emerald-800 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/30 rounded-full text-xs font-semibold text-emerald-300 border border-emerald-400/30">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Campus Loyalty Tier: Gold Explorer</span>
            </div>
            <h2 className="text-2xl font-extrabold">120 Campus Points</h2>
            <p className="text-xs text-emerald-100/80">Earn 10 points for every ₹100 spent at campus outlets</p>
          </div>
          <Button variant="secondary" size="lg" leftIcon={<Zap className="h-4 w-4" />}>
            Redeem Points
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Free Cold Coffee', points: '100 Points', desc: 'Valid at Main Canteen', icon: Gift },
            { title: '₹50 Off Meal Voucher', points: '150 Points', desc: 'Valid across all vendors', icon: Award },
            { title: 'Express Queue Pass', points: '200 Points', desc: 'Skip peak hour waiting line', icon: Zap },
          ].map((reward, i) => (
            <Card key={i} className="p-5 border-slate-200 space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl text-amber-700 w-fit">
                <reward.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">{reward.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{reward.desc}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="font-extrabold text-sm text-[#054A36]">{reward.points}</span>
                <Button variant="outline" size="sm">Claim</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
