import React, { useState } from 'react';
import { X, Award, Gift, Sparkles, Check, ArrowRight, Coffee, Croissant, ShieldCheck, Copy, ShoppingBag } from 'lucide-react';
import { RewardItem, PastOrder } from '../types/pastry';

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  points: number;
  onRedeemReward: (reward: RewardItem) => void;
  orders: PastOrder[];
  onNavigateToMenu: () => void;
}

const REWARDS: RewardItem[] = [
  {
    id: 'reward-coffee',
    title: 'Complimentary Single-Origin Espresso',
    description: 'Freshly pulled Ethiopian Yirgacheffe espresso or flat white with your morning pastry.',
    pointsCost: 150,
    icon: 'coffee',
    code: 'REWARD-CAFE',
    benefitType: 'free_item',
  },
  {
    id: 'reward-croissant',
    title: 'Free Classic Butter Croissant',
    description: 'Warm, 27-layer flaky Normandy butter croissant added complimentary to your box.',
    pointsCost: 250,
    icon: 'croissant',
    code: 'REWARD-CROISSANT',
    benefitType: 'free_item',
  },
  {
    id: 'reward-discount-5',
    title: '€5 Off Seasonal Tart Order',
    description: 'Save €5 on any raspberry pistachio, lemon meringue, or blood orange tart.',
    pointsCost: 400,
    icon: 'sparkles',
    code: 'REWARD-TART5',
    benefitType: 'discount',
  },
  {
    id: 'reward-tote-upgrade',
    title: 'Luxury Box & Organic Linen Tote Upgrade',
    description: 'Gold-embossed keepsake ribbon box plus artisanal bread tote on your next order.',
    pointsCost: 600,
    icon: 'gift',
    code: 'REWARD-LUXURY',
    benefitType: 'packaging',
  },
];

export const RewardsModal: React.FC<RewardsModalProps> = ({
  isOpen,
  onClose,
  points,
  onRedeemReward,
  orders,
  onNavigateToMenu,
}) => {
  const [claimedReward, setClaimedReward] = useState<RewardItem | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  // Determine tier
  let tierName = 'Amateur de Viennoiserie';
  let nextTierPoints = 500;
  let tierProgress = Math.min(100, (points / 500) * 100);

  if (points >= 1000) {
    tierName = 'Maître Pâtissier Club';
    nextTierPoints = 1000;
    tierProgress = 100;
  } else if (points >= 500) {
    tierName = 'Artisan Connoisseur';
    nextTierPoints = 1000;
    tierProgress = Math.min(100, ((points - 500) / 500) * 100);
  }

  const handleClaim = (reward: RewardItem) => {
    if (points >= reward.pointsCost) {
      onRedeemReward(reward);
      setClaimedReward(reward);
    }
  };

  const copyVoucher = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div
        className="relative bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-[#DAE7C7] flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#08482D] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#DAE7C7] flex items-center justify-center text-[#08482D]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider font-bold text-[#DAE7C7]">
                Club Pâtisserie & Loyalty
              </div>
              <h3 className="font-display text-2xl font-bold text-white">
                My Rewards
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close rewards"
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Points Balance & Tier Card */}
          <div className="p-6 rounded-3xl bg-[#F5F8EF] border border-[#DAE7C7] relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider font-bold text-[#08482D]">
                Available Balance
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-4xl sm:text-5xl font-extrabold text-[#101410] tabular-nums">
                  {points}
                </span>
                <span className="text-sm font-bold text-[#08482D]">Loyalty Points</span>
              </div>
              <p className="text-xs text-[#5E5E61] pt-1">
                ✦ You earn <strong>10 points for every 1€ spent</strong> on all bakery and tart orders.
              </p>
            </div>

            {/* Tier Progress */}
            <div className="w-full sm:w-60 p-4 rounded-2xl bg-white border border-[#DAE7C7]/80 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#101410]">{tierName}</span>
                <span className="font-mono text-[11px] text-[#08482D] font-bold">
                  {points >= 1000 ? 'Top Tier' : `${points} / ${nextTierPoints} pts`}
                </span>
              </div>

              <div className="w-full bg-[#E5EAE0] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#08482D] h-full rounded-full transition-all duration-500"
                  style={{ width: `${tierProgress}%` }}
                />
              </div>

              <div className="text-[10px] text-[#5E5E61]">
                {points >= 1000
                  ? 'VIP Baker benefits unlocked'
                  : `${nextTierPoints - points} points to next tier unlock`}
              </div>
            </div>
          </div>

          {/* Claimed Reward Modal Banner */}
          {claimedReward && (
            <div className="p-4 rounded-2xl bg-[#EBF3E2] border border-[#DAE7C7] flex items-center justify-between gap-4 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#08482D] text-[#DAE7C7] flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#08482D]">
                    Reward Unlocked: {claimedReward.title}
                  </div>
                  <div className="text-xs text-[#5E5E61]">
                    Use voucher code <strong className="font-mono text-[#101410]">{claimedReward.code}</strong> at checkout.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyVoucher(claimedReward.code)}
                  className="px-3 py-1.5 bg-white border border-[#DAE7C7] rounded-lg text-xs font-bold text-[#101410] flex items-center gap-1 hover:bg-[#F5F8EF]"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                </button>
                <button
                  onClick={() => setClaimedReward(null)}
                  className="text-xs text-[#5E5E61] hover:text-[#101410] px-2 py-1"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Rewards Catalog */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-display font-bold text-lg text-[#101410]">
                Redeem Pastry Rewards
              </h4>
              <span className="text-xs text-[#5E5E61]">Points redeemable on any order</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {REWARDS.map((reward) => {
                const canAfford = points >= reward.pointsCost;

                return (
                  <div
                    key={reward.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      canAfford
                        ? 'bg-white border-[#DAE7C7] hover:border-[#08482D] shadow-2xs hover:shadow-md'
                        : 'bg-neutral-50/80 border-neutral-200 opacity-70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-extrabold text-[#08482D] bg-[#EBF3E2] px-2.5 py-1 rounded-full border border-[#DAE7C7]">
                          {reward.pointsCost} Points
                        </span>
                        {reward.icon === 'coffee' && <Coffee className="w-4 h-4 text-[#08482D]" />}
                        {reward.icon === 'croissant' && <Sparkles className="w-4 h-4 text-[#08482D]" />}
                        {reward.icon === 'sparkles' && <Sparkles className="w-4 h-4 text-[#08482D]" />}
                        {reward.icon === 'gift' && <Gift className="w-4 h-4 text-[#08482D]" />}
                      </div>

                      <h5 className="font-display font-bold text-sm text-[#101410]">
                        {reward.title}
                      </h5>
                      <p className="text-xs text-[#5E5E61] mt-1 leading-relaxed">
                        {reward.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#DAE7C7]/60 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-[#5E5E61]">
                        Code: {reward.code}
                      </span>
                      <button
                        type="button"
                        disabled={!canAfford}
                        onClick={() => handleClaim(reward)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                          canAfford
                            ? 'bg-[#08482D] hover:bg-[#053320] text-white shadow-2xs active:scale-95'
                            : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? 'Redeem Reward' : `Need ${reward.pointsCost - points} pts`}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Points Earning History */}
          <div className="p-4 rounded-2xl bg-[#F5F8EF] border border-[#DAE7C7]">
            <h5 className="font-display font-bold text-sm text-[#101410] mb-2">
              Recent Points Activity
            </h5>
            <div className="space-y-2 divide-y divide-[#DAE7C7]/60 text-xs">
              <div className="pt-1.5 flex items-center justify-between">
                <div>
                  <span className="font-medium text-[#101410]">Welcome Baker Bonus</span>
                  <span className="text-[11px] text-[#5E5E61] block">Atelier club member enrollment</span>
                </div>
                <span className="font-mono font-bold text-[#08482D]">+100 pts</span>
              </div>

              {orders.slice(0, 3).map((ord) => {
                const earned = Math.floor(ord.total * 10);
                return (
                  <div key={ord.id} className="pt-2 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-[#101410]">Order #{ord.id}</span>
                      <span className="text-[11px] text-[#5E5E61] block">€{ord.total.toFixed(2)} spent (10 pts/€)</span>
                    </div>
                    <span className="font-mono font-bold text-[#08482D]">+{earned} pts</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-[#F5F8EF] border-t border-[#DAE7C7] flex items-center justify-between">
          <span className="text-xs text-[#5E5E61]">
            Points never expire for active club members.
          </span>
          <button
            onClick={() => {
              onClose();
              onNavigateToMenu();
            }}
            className="px-5 py-2 text-xs font-bold text-white bg-[#08482D] hover:bg-[#053320] rounded-full transition-colors flex items-center gap-1.5"
          >
            <span>Earn More with Fresh Order</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
