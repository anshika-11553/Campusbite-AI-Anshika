import React, { useState } from 'react';
import { StudentOrder } from '@/types/student';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/constants/currency';
import { ORDER_STATUS_LABELS } from '@/constants/menu';
import { EmptyState } from '../common/EmptyState';
import { History, RotateCcw, Calendar, Store, Download, Star } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface OrderHistoryListProps {
  orders: StudentOrder[];
  onReorder: (orderId: string) => void;
}

export const OrderHistoryList: React.FC<OrderHistoryListProps> = ({ orders, onReorder }) => {
  const { showToast } = useToast();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === 'ALL') return true;
    return order.status === filterStatus;
  });

  const handleDownloadReceipt = (orderNumber: string) => {
    showToast(`Receipt for #${orderNumber} downloaded!`, 'success');
  };

  const handleRateOrder = (orderNumber: string, rating: number) => {
    showToast(`Rated ${rating} ★ for #${orderNumber}. Thank you!`, 'success');
  };

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={<History className="h-8 w-8 text-slate-400" />}
        title="No Past Orders"
        description="You have not placed any canteen pre-orders yet."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Status Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-slate-500 shrink-0">Filter Orders:</span>
        {['ALL', 'COMPLETED', 'PREPARING', 'CANCELLED'].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors shrink-0 ${
              filterStatus === st
                ? 'bg-[#054A36] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {st === 'ALL' ? 'All Orders' : st}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={<History className="h-8 w-8 text-slate-400" />}
          title="No Orders Found"
          description="No orders match your selected filter."
        />
      ) : (
        filteredOrders.map((order) => {
          const statusConfig = ORDER_STATUS_LABELS[order.status] || { label: order.status, variant: 'slate' };
          const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });

          return (
            <Card key={order.id} className="p-4 sm:p-5 border-slate-200/80 hover:border-slate-300 transition-all">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-extrabold text-base text-slate-900">Order #{order.orderNumber}</span>
                  <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Store className="h-3.5 w-3.5 text-slate-400" />
                    {order.vendorName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {formattedDate}
                  </span>
                </div>
              </div>

              {/* Items Summary */}
              <div className="space-y-1.5 mb-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs text-slate-700">
                    <span>
                      {item.quantity}x {item.itemName}
                    </span>
                    <span className="font-semibold">{formatCurrency(item.priceInINR * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Rating and Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm font-bold text-slate-900">
                    <span className="text-xs text-slate-500 font-medium">Total Paid:</span>
                    <span className="text-base text-[#054A36]">{formatCurrency(order.totalAmountInINR)}</span>
                  </div>

                  {/* Rating Stars Placeholder */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRateOrder(order.orderNumber, star)}
                        className="text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`h-3.5 w-3.5 ${
                            order.rating && star <= order.rating ? 'fill-amber-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownloadReceipt(order.orderNumber)}
                    leftIcon={<Download className="h-3.5 w-3.5 text-slate-500" />}
                    className="text-xs text-slate-600"
                  >
                    Receipt
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onReorder(order.id)}
                    leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                    className="text-xs font-semibold"
                  >
                    Reorder
                  </Button>
                </div>
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
};
