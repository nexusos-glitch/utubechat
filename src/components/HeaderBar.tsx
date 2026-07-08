import React from "react";
import { Tv, Sparkles, Search, Coins, PlusCircle, Users, Activity } from "lucide-react";

interface HeaderBarProps {
  coins: number;
  onAddCoins: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategory: string;
  onCategorySelect: (category: string) => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  coins,
  onAddCoins,
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategorySelect,
}) => {
  const categories = [
    { id: "all", name: "All Feed" },
    { id: "cyberpunk", name: "Cyberpunk" },
    { id: "nature", name: "Nature 🌸" },
    { id: "cooking", name: "Cooking ASMR" },
    { id: "scifi", name: "Sci-Fi" },
    { id: "beach", name: "Ocean beach 🌊" },
  ];

  return (
    <header className="bg-zinc-950 border-b border-zinc-900 px-6 py-4 flex flex-col md:flex-row gap-4 items-center justify-between shrink-0 z-40 relative">
      {/* Branding and Spectator Meter */}
      <div className="flex items-center justify-between w-full md:w-auto gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <Tv className="text-zinc-950 stroke-[2.5]" size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-white text-base">
                UtubeChat
              </span>
              <span className="bg-emerald-500/15 text-emerald-400 font-extrabold text-[9px] px-2 py-0.5 rounded border border-emerald-500/30 uppercase tracking-widest flex items-center gap-0.5 animate-pulse">
                <Activity size={8} /> LIVE
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-bold flex items-center gap-1 mt-0.5">
              <Users size={11} className="text-zinc-500" />
              <span>48,520 watching simulated streams</span>
            </p>
          </div>
        </div>

        {/* Balance (Visible on Mobile only in this block) */}
        <div className="md:hidden flex items-center gap-2 bg-zinc-900/90 px-3 py-1.5 rounded-full border border-zinc-800">
          <Coins className="text-yellow-400" size={14} />
          <span className="text-[11px] font-bold text-white font-mono">{coins} 🪙</span>
          <button
            onClick={onAddCoins}
            className="text-zinc-500 hover:text-yellow-400 transition-colors"
          >
            <PlusCircle size={14} />
          </button>
        </div>
      </div>

      {/* Category Horizontal Filter Tags */}
      <div className="flex gap-2 overflow-x-auto w-full md:w-auto no-scrollbar py-0.5 justify-start">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategorySelect(cat.id)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all whitespace-nowrap border ${
                isActive
                  ? "bg-emerald-500 border-transparent text-zinc-950 font-black shadow-md shadow-emerald-500/10"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Search and Simulated Wallet Balance (Desktop layout) */}
      <div className="hidden md:flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-zinc-500" size={14} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search creators, tags..."
            className="bg-zinc-900 border border-zinc-800/85 text-white placeholder-zinc-500 text-xs rounded-full pl-9 pr-4 py-2 w-52 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Wallet Balance Widget */}
        <div className="flex items-center gap-2 bg-zinc-900/90 px-3.5 py-1.5 rounded-full border border-zinc-800 shadow-sm">
          <Coins className="text-yellow-400" size={15} />
          <div className="text-left">
            <p className="text-[9px] text-zinc-500 font-bold leading-none">Wallet Balance</p>
            <p className="text-xs font-black text-white font-mono mt-0.5">{coins} Coins</p>
          </div>
          <button
            onClick={onAddCoins}
            className="text-zinc-400 hover:text-yellow-400 transition-colors flex items-center justify-center p-0.5 hover:scale-105 active:scale-95"
            title="Get Free Coins (+250)"
          >
            <PlusCircle size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};
