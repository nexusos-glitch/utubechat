import React from "react";
import { Tv, Sparkles, Search, Coins, PlusCircle, Users, Activity, Play, User, Menu } from "lucide-react";

interface HeaderBarProps {
  coins: number;
  onAddCoins: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategory: string;
  onCategorySelect: (category: string) => void;
  onOpenProfile: () => void;
  onToggleNavigation: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  coins,
  onAddCoins,
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategorySelect,
  onOpenProfile,
  onToggleNavigation,
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
          <button
            onClick={onToggleNavigation}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors mr-1 cursor-pointer"
            title="Toggle Navigation Menu"
          >
            <Menu size={20} />
          </button>
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

        {/* Balance & Profile (Visible on Mobile only in this block) */}
        <div className="md:hidden flex items-center gap-3">
          <div className="flex items-center gap-2 bg-zinc-900/90 px-3 py-1.5 rounded-full border border-zinc-800">
            <Coins className="text-yellow-400" size={14} />
            <span className="text-[11px] font-bold text-white font-mono">{coins} 🪙</span>
            <button
              onClick={onAddCoins}
              className="text-zinc-500 hover:text-yellow-400 transition-colors"
            >
              <PlusCircle size={14} />
            </button>
          </div>

          {/* Mobile Profile Trigger (red-ringed avatar matching push2playlive style) */}
          <button
            onClick={onOpenProfile}
            className="w-8 h-8 rounded-full border-2 border-rose-600 bg-red-600 flex items-center justify-center shrink-0 active:scale-90 transition-transform shadow"
            title="My Profile"
          >
            <div className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center">
              <Play size={8} fill="white" className="text-white ml-0.5" />
            </div>
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

        {/* Desktop Profile Trigger (beautiful red-ringed live avatar matching push2playlive style) */}
        <button
          onClick={onOpenProfile}
          className="group flex items-center gap-2.5 bg-zinc-900/90 border border-zinc-800 hover:border-rose-500/60 p-1.5 pr-3.5 rounded-full shadow-sm hover:bg-zinc-900 transition-all duration-300 active:scale-95"
          title="Open Creator Account & Settings"
        >
          <div className="relative w-8 h-8 rounded-full border-2 border-rose-600 bg-red-600 flex items-center justify-center shrink-0">
            <div className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center">
              <Play size={8} fill="white" className="text-white ml-0.5" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black text-white leading-none">push2playlive</p>
            <p className="text-[8px] font-extrabold text-zinc-500 font-mono mt-0.5">@push2playlive</p>
          </div>
        </button>
      </div>
    </header>
  );
};
