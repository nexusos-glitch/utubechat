import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Gift, Coins, PlusCircle, Sparkles } from "lucide-react";
import { GIFT_CATALOG } from "../data";
import { VirtualGift } from "../types";

interface GiftSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  onAddCoins: (amount: number) => void;
  onSendGift: (gift: VirtualGift) => void;
}

export const GiftSelector: React.FC<GiftSelectorProps> = ({
  isOpen,
  onClose,
  coins,
  onAddCoins,
  onSendGift,
}) => {
  const [selectedGift, setSelectedGift] = useState<VirtualGift | null>(null);
  const [showPurchaseFeedback, setShowPurchaseFeedback] = useState(false);

  const handlePurchaseCoins = () => {
    onAddCoins(250);
    setShowPurchaseFeedback(true);
    setTimeout(() => setShowPurchaseFeedback(false), 1200);
  };

  const handleSend = () => {
    if (!selectedGift) return;
    if (coins >= selectedGift.price) {
      onSendGift(selectedGift);
    } else {
      // Trigger a warning or auto prompt coin purchase
      handlePurchaseCoins();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            id="gift-backdrop"
            className="absolute inset-0 bg-black/60 z-40 transition-opacity"
            onClick={onClose}
          />

          {/* Tray container */}
          <motion.div
            id="gift-tray"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 bg-zinc-950/95 border-t border-zinc-800 rounded-t-3xl p-6 z-50 shadow-2xl backdrop-blur-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Gift className="text-amber-500" size={22} />
                <h4 className="text-white font-bold text-base">Send a Support Gift</h4>
              </div>

              {/* Wallet status */}
              <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800 relative overflow-hidden">
                <Coins className="text-yellow-400" size={16} />
                <span className="text-xs font-bold text-white font-mono">{coins} Coins</span>
                <button
                  onClick={handlePurchaseCoins}
                  className="text-zinc-400 hover:text-yellow-400 transition-colors flex items-center justify-center"
                  title="Get +250 Coins"
                >
                  <PlusCircle size={16} />
                </button>

                <AnimatePresence>
                  {showPurchaseFeedback && (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0, y: 10 }}
                      animate={{ scale: 1.2, opacity: 1, y: -20 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-yellow-500 text-black font-black text-xs rounded-full"
                    >
                      +250 COINS!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Grid of Gifts */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {GIFT_CATALOG.map((gift) => {
                const isSelected = selectedGift?.id === gift.id;
                const canAfford = coins >= gift.price;

                return (
                  <button
                    key={gift.id}
                    onClick={() => setSelectedGift(gift)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all relative ${
                      isSelected
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
                    }`}
                  >
                    <div className="text-3xl mb-1 filter drop-shadow-md">{gift.icon}</div>
                    <span className="text-xs font-semibold text-zinc-200 truncate max-w-full text-center">
                      {gift.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-bold mt-1 flex items-center gap-0.5">
                      🪙 {gift.price}
                    </span>

                    {/* Insufficient funds badge */}
                    {!canAfford && (
                      <span className="absolute top-1 right-1 text-[8px] bg-red-900/60 text-red-200 px-1 rounded-full border border-red-500/20">
                        Top-up
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-zinc-900 text-zinc-400 rounded-xl hover:text-white hover:bg-zinc-850 transition-all font-semibold text-sm border border-zinc-800"
              >
                Cancel
              </button>

              <button
                onClick={handleSend}
                disabled={!selectedGift}
                className={`flex-2 py-3 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
                  selectedGift
                    ? "bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 hover:brightness-110 text-zinc-950"
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                }`}
              >
                <Sparkles size={16} />
                Send {selectedGift ? `${selectedGift.name}` : "Selected Gift"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
