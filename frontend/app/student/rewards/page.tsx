'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Gift, Award, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';

export default function StudentRewardsPage() {
  const { showToast } = useToast();

  const rewards = [
    { title: 'Free Cold Coffee Voucher', points: 150, code: 'COFFEEFREE' },
    { title: '₹50 Off Next Pre-Order', points: 200, code: 'SAVE50' },
    { title: 'Free Dessert Cup (Brownie / Sundae)', points: 250, code: 'SWEETTREAT' },
  ];

  const handleRedeem = (code: string, pts: number) => {
    showToast(`Voucher ${code} redeemed! ${pts} points used.`, 'success');
  };

  return (
    <DashboardLayout role="student" title="Campus Rewards & Loyalty Points">
      <div className="space-y-6">
        <div className="p-6 bg-gradient-to-r from-amber-500 to-amber-700 text-white rounded-2xl flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <Gift className="h-8 w-8" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-amber-100">Reward Balance</span>
              <h2 className="text-3xl font-extrabold">340 PTS</h2>
            </div>
          </div>
          <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full">
            Silver Tier Member ⭐
          </span>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900">Available Reward Redemptions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rewards.map((r, idx) => (
              <Card key={idx} className="p-5 border-amber-200 bg-white space-y-4">
                <div className="p-2.5 bg-amber-50 rounded-xl w-fit text-amber-700">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{r.title}</h4>
                  <span className="text-xs font-extrabold text-amber-600">{r.points} PTS Required</span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleRedeem(r.code, r.points)}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                  leftIcon={<CheckCircle2 className="h-4 w-4" />}
                >
                  Redeem Voucher
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
