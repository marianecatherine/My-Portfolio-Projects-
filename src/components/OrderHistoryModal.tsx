import React, { useState, useEffect } from 'react';
import { X, Clock, ShoppingBag, MapPin, Receipt, ArrowRight, RotateCcw, Trash2, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { PastOrder, CartItem } from '../types/pastry';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReorder: (items: CartItem[]) => void;
  onNavigateToMenu: () => void;
}

interface DynamicOrderStatus {
  status: 'Preparing' | 'Ready for Pickup' | 'Completed';
  step: 1 | 2 | 3;
  progressPercent: number;
  badgeClass: string;
  dotColor: string;
  statusLabel: string;
  statusNote: string;
}

const getDynamicOrderStatus = (createdAt: string, orderType: 'pickup' | 'delivery'): DynamicOrderStatus => {
  const createdTime = new Date(createdAt).getTime();
  const now = Date.now();
  const diffMinutes = Math.max(0, (now - createdTime) / (1000 * 60));

  // If order was placed within the last 3 minutes
  if (diffMinutes < 3) {
    return {
      status: 'Preparing',
      step: 1,
      progressPercent: 35,
      badgeClass: 'bg-[#FEF5E7] text-[#9A5B13] border border-[#FADBB3]',
      dotColor: 'bg-[#D35400]',
      statusLabel: 'Preparing in Oven',
      statusNote: 'Dough proofed & currently baking in the stone hearth',
    };
  }
  // If order was placed within the last 3 to 10 minutes
  if (diffMinutes < 10) {
    const isDelivery = orderType === 'delivery';
    return {
      status: 'Ready for Pickup',
      step: 2,
      progressPercent: 70,
      badgeClass: 'bg-[#EBF5FB] text-[#1B4F72] border border-[#D4E6F1]',
      dotColor: 'bg-[#2980B9]',
      statusLabel: isDelivery ? 'Out for Delivery' : 'Ready for Pickup',
      statusNote: isDelivery
        ? 'Insulated in courier thermal box for transport'
        : 'Boxed warm & waiting at the Soho boutique counter',
    };
  }
  // 10+ minutes ago
  return {
    status: 'Completed',
    step: 3,
    progressPercent: 100,
    badgeClass: 'bg-[#EBF3E2] text-[#08482D] border border-[#DAE7C7]',
    dotColor: 'bg-[#08482D]',
    statusLabel: 'Completed',
    statusNote: 'Order fulfilled and enjoyed',
  };
};

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  onReorder,
  onNavigateToMenu,
}) => {
  const [orders, setOrders] = useState<PastOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<PastOrder | null>(null);
  const [reorderSuccessId, setReorderSuccessId] = useState<string | null>(null);
  const [, setTick] = useState(0);

  // Load from localStorage on open and set up interval for real-time status update
  useEffect(() => {
    if (isOpen) {
      try {
        const stored = localStorage.getItem('reelmark_pastry_orders');
        if (stored) {
          const parsed = JSON.parse(stored);
          setOrders(parsed);
          if (parsed.length > 0) {
            setSelectedOrder(parsed[0]);
          }
        } else {
          setOrders([]);
          setSelectedOrder(null);
        }
      } catch (e) {
        console.error('Failed reading order history', e);
      }

      // Re-render every 15s to update progress bar and status dynamically
      const interval = setInterval(() => {
        setTick((t) => t + 1);
      }, 15000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your local order history?')) {
      localStorage.removeItem('reelmark_pastry_orders');
      setOrders([]);
      setSelectedOrder(null);
    }
  };

  const handleReorderClick = (order: PastOrder) => {
    onReorder(order.items);
    setReorderSuccessId(order.id);
    setTimeout(() => {
      setReorderSuccessId(null);
      onClose();
    }, 900);
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Recently';
    }
  };

  const selectedOrderStatus = selectedOrder
    ? getDynamicOrderStatus(selectedOrder.createdAt, selectedOrder.orderType)
    : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div
        className="relative bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-[#DAE7C7] flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#F5F8EF] border-b border-[#DAE7C7] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#DAE7C7] flex items-center justify-center text-[#08482D]">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider font-bold text-[#08482D]">
                Customer Account & Receipts
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#101410]">
                Past Order History
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {orders.length > 0 && (
              <button
                onClick={handleClearHistory}
                aria-label="Clear order history"
                className="text-xs font-medium text-[#717E6C] hover:text-[#C0392B] p-2 transition-colors flex items-center gap-1"
                title="Clear local order history"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 rounded-full hover:bg-white text-[#101410] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {orders.length === 0 ? (
          /* Empty State */
          <div className="p-12 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-[#F5F8EF] border border-[#DAE7C7] flex items-center justify-center mx-auto text-[#08482D]">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h4 className="font-display font-bold text-2xl text-[#101410]">No orders found yet</h4>
            <p className="text-sm text-[#5E5E61] max-w-md mx-auto leading-relaxed">
              When you complete a pastry reservation or delivery, your past order receipts and reorder shortcuts will be saved here in your browser.
            </p>
            <button
              onClick={() => {
                onClose();
                onNavigateToMenu();
              }}
              className="mt-2 inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-[#08482D] hover:bg-[#053320] rounded-full transition-all shadow-sm"
            >
              <span>Explore Today's Menu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Orders Master-Detail View */
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
            {/* Left Column: Order List */}
            <div className="md:col-span-5 border-r border-[#DAE7C7]/80 overflow-y-auto max-h-[500px] divide-y divide-[#DAE7C7]/60">
              <div className="p-3 bg-[#F5F8EF]/60 text-xs font-bold text-[#5E5E61] uppercase tracking-wider sticky top-0 backdrop-blur-xs">
                {orders.length} Completed {orders.length === 1 ? 'Order' : 'Orders'}
              </div>

              {orders.map((ord) => {
                const isSelected = selectedOrder?.id === ord.id;
                const statusInfo = getDynamicOrderStatus(ord.createdAt, ord.orderType);

                return (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className={`p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#DAE7C7]/40 border-l-4 border-l-[#08482D]'
                        : 'hover:bg-[#F5F8EF]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-[#08482D] bg-white px-2 py-0.5 rounded-md border border-[#DAE7C7]">
                        #{ord.id}
                      </span>
                      <span className="text-[11px] text-[#5E5E61]">
                        {formatDate(ord.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1.5">
                      <div className="text-xs text-[#101410] font-medium line-clamp-1">
                        {ord.items.reduce((s, i) => s + i.quantity, 0)} items · {ord.items.map(i => i.item.name).join(', ')}
                      </div>
                      <ChevronRight className={`w-4 h-4 text-[#5E5E61] shrink-0 ml-1 transition-transform ${isSelected ? 'translate-x-0.5 text-[#08482D]' : ''}`} />
                    </div>

                    {/* Mini progress track on list card */}
                    <div className="w-full bg-[#E5EAE0] h-1 rounded-full overflow-hidden mt-2">
                      <div
                        className={`h-full transition-all duration-300 ${
                          statusInfo.step === 1
                            ? 'bg-[#D35400]'
                            : statusInfo.step === 2
                            ? 'bg-[#2980B9]'
                            : 'bg-[#08482D]'
                        }`}
                        style={{ width: `${statusInfo.progressPercent}%` }}
                      />
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${statusInfo.badgeClass}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotColor} ${statusInfo.step < 3 ? 'animate-pulse' : ''}`} />
                        <span>{statusInfo.statusLabel}</span>
                      </span>
                      <span className="font-mono font-bold text-[#101410] tabular-nums">
                        €{ord.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Order Detail View */}
            <div className="md:col-span-7 p-6 overflow-y-auto max-h-[500px] bg-[#F5F8EF]/20 flex flex-col justify-between">
              {selectedOrder && selectedOrderStatus ? (
                <div className="space-y-4">
                  {/* Status Banner */}
                  <div className="p-4 rounded-2xl bg-white border border-[#DAE7C7] flex items-center justify-between">
                    <div>
                      <div className="text-xs text-[#5E5E61]">Order Reference</div>
                      <div className="font-mono text-lg font-bold text-[#08482D]">
                        #{selectedOrder.id}
                      </div>
                      <div className="text-xs text-[#5E5E61] mt-0.5">
                        Placed {formatDate(selectedOrder.createdAt)}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${selectedOrderStatus.badgeClass}`}>
                        <span className={`w-2 h-2 rounded-full ${selectedOrderStatus.dotColor} ${selectedOrderStatus.step < 3 ? 'animate-pulse' : ''}`} />
                        <span>{selectedOrderStatus.statusLabel}</span>
                      </span>
                      <div className="text-xs text-[#5E5E61] mt-1">
                        {selectedOrder.orderType === 'pickup'
                          ? `Pick-up: ${selectedOrder.pickupTime}`
                          : 'Courier Delivery'}
                      </div>
                    </div>
                  </div>

                  {/* Simple Progress Bar Visual Card */}
                  <div className="p-4 rounded-2xl bg-white border border-[#DAE7C7] space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#101410] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#08482D]" />
                        <span>Hearth Fulfillment Status</span>
                      </span>
                      <span className="text-[#5E5E61] font-mono text-[11px]">
                        {selectedOrderStatus.step === 1
                          ? 'Step 1 of 3 (In Oven)'
                          : selectedOrderStatus.step === 2
                          ? 'Step 2 of 3 (Ready)'
                          : 'Step 3 of 3 (Fulfilled)'}
                      </span>
                    </div>

                    {/* Progress Track */}
                    <div className="relative w-full bg-[#E5EAE0] h-2.5 rounded-full overflow-hidden p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${
                          selectedOrderStatus.step === 1
                            ? 'bg-[#D35400]'
                            : selectedOrderStatus.step === 2
                            ? 'bg-[#2980B9]'
                            : 'bg-[#08482D]'
                        }`}
                        style={{ width: `${selectedOrderStatus.progressPercent}%` }}
                      />
                    </div>

                    {/* 3 Progress Checkpoints */}
                    <div className="grid grid-cols-3 text-[11px] pt-0.5">
                      <div className={`${selectedOrderStatus.step >= 1 ? 'text-[#101410] font-bold' : 'text-[#717E6C]'}`}>
                        <div className="flex items-center gap-1">
                          <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${selectedOrderStatus.step >= 1 ? 'bg-[#08482D] text-white' : 'bg-neutral-200'}`}>1</span>
                          <span>Preparing</span>
                        </div>
                        <span className="text-[10px] text-[#5E5E61] font-normal block pl-4.5">In oven deck</span>
                      </div>

                      <div className={`text-center ${selectedOrderStatus.step >= 2 ? 'text-[#101410] font-bold' : 'text-[#717E6C]'}`}>
                        <div className="flex items-center justify-center gap-1">
                          <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${selectedOrderStatus.step >= 2 ? 'bg-[#08482D] text-white' : 'bg-neutral-200'}`}>2</span>
                          <span>{selectedOrder.orderType === 'delivery' ? 'Out for Delivery' : 'Ready for Pickup'}</span>
                        </div>
                        <span className="text-[10px] text-[#5E5E61] font-normal block">At Soho counter</span>
                      </div>

                      <div className={`text-right ${selectedOrderStatus.step >= 3 ? 'text-[#08482D] font-bold' : 'text-[#717E6C]'}`}>
                        <div className="flex items-center justify-end gap-1">
                          <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${selectedOrderStatus.step >= 3 ? 'bg-[#08482D] text-white' : 'bg-neutral-200'}`}>3</span>
                          <span>Completed</span>
                        </div>
                        <span className="text-[10px] text-[#5E5E61] font-normal block">Fulfilled</span>
                      </div>
                    </div>

                    {/* Real-time Status Note */}
                    <div className="pt-1 text-xs text-[#5E5E61] bg-[#F5F8EF] p-2.5 rounded-xl border border-[#DAE7C7]/60 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#08482D] shrink-0" />
                      <span>{selectedOrderStatus.statusNote}</span>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="p-3.5 rounded-xl bg-white border border-[#DAE7C7]/70 text-xs space-y-1 text-[#101410]">
                    <div><strong>Customer:</strong> {selectedOrder.customerName} ({selectedOrder.customerEmail})</div>
                    <div><strong>Contact:</strong> {selectedOrder.customerPhone}</div>
                    {selectedOrder.deliveryAddress && (
                      <div><strong>Delivery Address:</strong> {selectedOrder.deliveryAddress}</div>
                    )}
                    {selectedOrder.bakerNotes && (
                      <div className="text-[#08482D]"><strong>Baker Note:</strong> {selectedOrder.bakerNotes}</div>
                    )}
                  </div>

                  {/* Itemized List */}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#5E5E61] mb-2">
                      Itemized Box Content
                    </div>
                    <div className="space-y-2">
                      {selectedOrder.items.map((ci, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-white border border-[#DAE7C7]/80 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={ci.item.image}
                              alt={ci.item.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <div className="font-bold text-[#101410]">{ci.item.name}</div>
                              <div className="text-[#5E5E61] text-[11px]">{ci.packaging}</div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-mono font-bold text-[#101410] tabular-nums">
                              {ci.quantity} × €{ci.item.price.toFixed(2)}
                            </div>
                            <div className="font-mono text-xs text-[#08482D] font-bold tabular-nums">
                              €{((ci.item.price + (ci.packaging === 'Luxury Gift Box (+€3.00)' ? 3 : 0)) * ci.quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="p-4 rounded-xl bg-white border border-[#DAE7C7] text-xs space-y-1.5 text-[#5E5E61]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-mono tabular-nums text-[#101410]">€{selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-[#08482D] font-medium">
                        <span>Discount Applied</span>
                        <span className="font-mono tabular-nums">-€{selectedOrder.discount.toFixed(2)}</span>
                      </div>
                    )}
                    {selectedOrder.deliveryFee > 0 && (
                      <div className="flex justify-between">
                        <span>Courier Fee</span>
                        <span className="font-mono tabular-nums text-[#101410]">€{selectedOrder.deliveryFee.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-[#DAE7C7] flex justify-between font-bold text-sm text-[#101410]">
                      <span>Total Paid</span>
                      <span className="font-mono text-[#08482D] text-base tabular-nums">
                        €{selectedOrder.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Actions: Reorder & Print */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleReorderClick(selectedOrder)}
                      className={`flex-1 py-3 px-4 rounded-full text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
                        reorderSuccessId === selectedOrder.id
                          ? 'bg-[#08482D] text-[#DAE7C7]'
                          : 'bg-[#08482D] text-white hover:bg-[#053320]'
                      }`}
                    >
                      {reorderSuccessId === selectedOrder.id ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                          <span>Added to Cart!</span>
                        </>
                      ) : (
                        <>
                          <RotateCcw className="w-4 h-4" />
                          <span>Reorder This Exact Box</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="py-3 px-5 rounded-full border border-[#DAE7C7] bg-white text-xs font-bold text-[#101410] hover:bg-[#F5F8EF] transition-colors"
                    >
                      Print Receipt
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
