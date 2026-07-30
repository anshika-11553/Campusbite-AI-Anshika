'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Store, MapPin, Clock, Phone, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export default function VendorProfilePage() {
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [outletName, setOutletName] = useState('Main Campus Canteen Outlet');
  const [location, setLocation] = useState('Student Activity Center, Ground Floor');
  const [hours, setHours] = useState('08:00 AM – 09:30 PM Daily');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [capacity, setCapacity] = useState('150 Orders / Hour');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!outletName.trim()) return showToast('Outlet name cannot be empty.', 'error');
    if (!location.trim()) return showToast('Location details are required.', 'error');

    setIsEditing(false);
    showToast('Outlet profile details updated successfully!', 'success');
  };

  return (
    <DashboardLayout role="vendor" title="Vendor Outlet Profile">
      <div className="max-w-3xl space-y-6">
        <Card className="p-6 space-y-6 border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-[#054A36] rounded-2xl text-white shadow-md">
                <Store className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">{outletName}</h2>
                <p className="text-xs text-slate-500 font-medium">Licensed Vendor ID: #VND-88214</p>
              </div>
            </div>

            <Button
              variant={isEditing ? 'outline' : 'primary'}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel Edit' : 'Edit Outlet Details'}
            </Button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Outlet Name *</label>
                <Input
                  value={outletName}
                  onChange={(e) => setOutletName(e.target.value)}
                  placeholder="Outlet Name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Campus Location *</label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    leftIcon={<MapPin className="h-4 w-4" />}
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Operating Hours</label>
                  <Input
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    leftIcon={<Clock className="h-4 w-4" />}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contact Phone</label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    leftIcon={<Phone className="h-4 w-4" />}
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kitchen Order Throughput</label>
                  <Input
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                leftIcon={<CheckCircle2 className="h-4 w-4" />}
                className="w-full bg-[#054A36] text-white font-extrabold py-3 rounded-xl"
              >
                Save Outlet Changes
              </Button>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-semibold uppercase">Location</span>
                <p className="font-semibold text-slate-800 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#054A36]" /> {location}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-semibold uppercase">Operating Hours</span>
                <p className="font-semibold text-slate-800 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#054A36]" /> {hours}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-semibold uppercase">Contact Helpline</span>
                <p className="font-semibold text-slate-800 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#054A36]" /> {phone}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-semibold uppercase">Order Capacity SLA</span>
                <p className="font-semibold text-slate-800 flex items-center gap-2">
                  <Store className="h-4 w-4 text-[#054A36]" /> {capacity}
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
