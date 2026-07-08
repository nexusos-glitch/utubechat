import React, { useState, useEffect } from "react";
import { X, Check, Users, Heart, Play, MessageSquare, Sparkles, Award, Video as VideoIcon, Send, Share2, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

interface CreatorProfileSideSheetProps {
  isOpen: boolean;
  onClose: () => void;
  author: string;
  avatarUrl: string;
  category: string;
}

const creatorBios: Record<string, string> = {
  "@neon_pulse": "Cyber-artist wandering the streets of Neo-Tokyo. Capturing high-contrast moments, neon signs, and retro synthwave aesthetics.",
  "@meadow_wander": "Nature filmmaker & field recordist. Finding quiet places, spring acacia blossoms, and mindful paths in nature.",
  "@chef_satisfaction": "ASMR culinary creator. Perfectly cut radish, crisp ratatouille, and satisfying kitchen rhythms.",
  "@sci_vortex": "Theoretical physicist & cosmos simulator. Rendering wormhole trajectories and dark matter structures.",
  "@coast_drone": "Aerial oceanographer & wave meditator. Sharing the sea's shifting colors and sandy shorelines from above."
};

const creatorStats: Record<string, { followers: string; likes: string; views: string; isVerified: boolean; cover: string }> = {
  "@neon_pulse": { 
    followers: "24.5K", 
    likes: "142K", 
    views: "1.2M",
    isVerified: true,
    cover: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop"
  },
  "@meadow_wander": { 
    followers: "12.8K", 
    likes: "89K", 
    views: "520K",
    isVerified: false,
    cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop"
  },
  "@chef_satisfaction": { 
    followers: "85.2K", 
    likes: "612K", 
    views: "4.8M",
    isVerified: true,
    cover: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&auto=format&fit=crop"
  },
  "@sci_vortex": { 
    followers: "19.1K", 
    likes: "76K", 
    views: "890K",
    isVerified: false,
    cover: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop"
  },
  "@coast_drone": { 
    followers: "43.0K", 
    likes: "289K", 
    views: "2.1M",
    isVerified: true,
    cover: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&auto=format&fit=crop"
  }
};

// Custom mock video list for each creator to display in their tabbed grid
const creatorPosts: Record<string, Array<{ id: string; title: string; views: string; likes: string; thumbnail: string }>> = {
  "@neon_pulse": [
    { id: "neon1", title: "Shibuya Crossing in Rain 🌧️⚡", views: "45K", likes: "5K", thumbnail: "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=300&auto=format&fit=crop" },
    { id: "neon2", title: "Cyberpunk Arcade Night 👾", views: "32K", likes: "3.2K", thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&auto=format&fit=crop" },
    { id: "neon3", title: "Retro Synthwave Drive 🚗💨", views: "56K", likes: "8.1K", thumbnail: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=300&auto=format&fit=crop" },
  ],
  "@meadow_wander": [
    { id: "meadow1", title: "Deep Forest Sounds ASMR 🌲🕊️", views: "12K", likes: "1.2K", thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&auto=format&fit=crop" },
    { id: "meadow2", title: "Golden Hour Grass Fields 🌾🌅", views: "18K", likes: "2.4K", thumbnail: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&auto=format&fit=crop" },
    { id: "meadow3", title: "Morning Dew drops Close-up 💧", views: "24K", likes: "3.5K", thumbnail: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&auto=format&fit=crop" },
  ],
  "@chef_satisfaction": [
    { id: "chef1", title: "Perfect Cucumber Slicing ASMR 🥒", views: "120K", likes: "24K", thumbnail: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=300&auto=format&fit=crop" },
    { id: "chef2", title: "Satisfying Pizza Dough Kneading 🍕", views: "95K", likes: "18K", thumbnail: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop" },
    { id: "chef3", title: "Flawless Egg yolk separation 🍳", views: "140K", likes: "32K", thumbnail: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=300&auto=format&fit=crop" },
  ],
  "@sci_vortex": [
    { id: "sci1", title: "Quantum Entanglement Explained 🌌", views: "15K", likes: "1.8K", thumbnail: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=300&auto=format&fit=crop" },
    { id: "sci2", title: "3D Black Hole Event Horizon Simulation 🕳️", views: "28K", likes: "4.1K", thumbnail: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=300&auto=format&fit=crop" },
    { id: "sci3", title: "Interstellar Space Engine Flight 🚀", views: "34K", likes: "5.5K", thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&auto=format&fit=crop" },
  ],
  "@coast_drone": [
    { id: "coast1", title: "Ultra Blue Coral Reef Drone Flight 🏝️", views: "82K", likes: "14K", thumbnail: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=300&auto=format&fit=crop" },
    { id: "coast2", title: "Crashing Waves at Golden sunset 🌊🌅", views: "91K", likes: "19K", thumbnail: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=300&auto=format&fit=crop" },
    { id: "coast3", title: "Solitary Lighthouse Top View 🚨", views: "44K", likes: "7.8K", thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop" },
  ]
};

export const CreatorProfileSideSheet: React.FC<CreatorProfileSideSheetProps> = ({
  isOpen,
  onClose,
  author,
  avatarUrl,
  category
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "about">("posts");
  const [isCopied, setIsCopied] = useState(false);

  // Sync follow state with LocalStorage
  useEffect(() => {
    if (!author) return;
    try {
      const saved = localStorage.getItem(`followed_creator_${author}`);
      setIsFollowing(saved === "true");
    } catch {
      setIsFollowing(false);
    }
  }, [author, isOpen]);

  const handleFollowToggle = () => {
    const nextState = !isFollowing;
    setIsFollowing(nextState);
    try {
      localStorage.setItem(`followed_creator_${author}`, String(nextState));
    } catch (error) {
      console.error("Failed to save follow status:", error);
    }
  };

  const handleShare = () => {
    setIsCopied(true);
    navigator.clipboard?.writeText(`https://utubechat.com/creator/${author.replace("@", "")}`);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!isOpen) return null;

  const stats = creatorStats[author] || {
    followers: "15.4K",
    likes: "120K",
    views: "980K",
    isVerified: false,
    cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop"
  };

  const bio = creatorBios[author] || "Inspiring creators and viewers one post at a time. Join the community! 🙌✨";
  const posts = creatorPosts[author] || [];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        id="side-sheet-backdrop"
      />

      {/* Side-sheet panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        className="relative w-full sm:w-[440px] h-full bg-[#0d0d11] border-l border-zinc-900 shadow-2xl flex flex-col z-50 text-white"
        id="creator-side-sheet"
      >
        {/* Cover Banner */}
        <div className="relative h-44 w-full bg-zinc-950 overflow-hidden shrink-0">
          <img
            src={stats.cover}
            alt="Creator Cover"
            className="w-full h-full object-cover opacity-60 filter saturate-[0.8]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d11] via-transparent to-black/40" />

          {/* Close & Action Buttons */}
          <div className="absolute top-4 left-4 flex gap-2">
            <button
              onClick={onClose}
              className="p-2 bg-black/60 hover:bg-black/80 text-zinc-300 hover:text-white rounded-full backdrop-blur-md border border-white/10 transition-all active:scale-95"
              title="Close Profile"
              id="close-profile-btn"
            >
              <X size={18} />
            </button>
          </div>

          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleShare}
              className="p-2 bg-black/60 hover:bg-black/80 text-zinc-300 hover:text-white rounded-full backdrop-blur-md border border-white/10 transition-all active:scale-95 text-xs font-bold flex items-center gap-1.5"
              id="share-creator-btn"
            >
              <Share2 size={14} />
              <span>{isCopied ? "Copied!" : "Share"}</span>
            </button>
          </div>
        </div>

        {/* Profile Details Container */}
        <div className="px-5 -mt-14 relative flex-1 overflow-y-auto no-scrollbar flex flex-col pb-8">
          
          {/* Avatar and Info Header */}
          <div className="flex flex-col gap-3 pb-5 border-b border-zinc-900">
            <div className="relative w-24 h-24 rounded-full border-4 border-emerald-500 overflow-hidden bg-zinc-900 shadow-xl">
              <img
                src={avatarUrl}
                alt={author}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-1 right-1/2 translate-x-1/2 bg-emerald-500 text-[7px] font-black tracking-widest text-white uppercase px-1.5 py-0.5 rounded-full shadow border border-black animate-pulse">
                LIVE
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <h2 className="text-xl font-extrabold tracking-tight text-white font-mono">
                  {author.replace("@", "")}
                </h2>
                {stats.isVerified && (
                  <ShieldCheck className="text-blue-500 fill-blue-500/10" size={18} />
                )}
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 uppercase font-bold tracking-wider">
                  {category}
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-bold font-mono mt-0.5">{author}</p>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-3 gap-3 bg-zinc-950/60 p-3 rounded-2xl border border-zinc-900 text-center">
              <div>
                <p className="text-sm font-black text-white font-mono">{stats.followers}</p>
                <p className="text-[9px] text-zinc-500 uppercase tracking-wider font-extrabold mt-0.5">Followers</p>
              </div>
              <div>
                <p className="text-sm font-black text-white font-mono">{stats.likes}</p>
                <p className="text-[9px] text-zinc-500 uppercase tracking-wider font-extrabold mt-0.5">Likes</p>
              </div>
              <div>
                <p className="text-sm font-black text-white font-mono">{stats.views}</p>
                <p className="text-[9px] text-zinc-500 uppercase tracking-wider font-extrabold mt-0.5">Views</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2.5 mt-1">
              <button
                onClick={handleFollowToggle}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 ${
                  isFollowing
                    ? "bg-zinc-900 text-zinc-400 hover:bg-zinc-850 hover:text-white border border-zinc-800"
                    : "bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-950/20"
                }`}
                id="follow-button-side"
              >
                {isFollowing ? (
                  <>
                    <Check size={13} className="stroke-[3]" />
                    <span>Following</span>
                  </>
                ) : (
                  <span>Follow Creator</span>
                )}
              </button>

              <button
                onClick={() => {
                  alert(`Starting live Direct Message simulation with ${author}! Send a message in live chat overlay!`);
                  onClose();
                }}
                className="px-4 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl text-zinc-300 hover:text-white transition-colors flex items-center justify-center"
                title="Send Message"
                id="message-button-side"
              >
                <Send size={14} className="rotate-45" />
              </button>
            </div>
          </div>

          {/* Profile Bio */}
          <div className="py-4 border-b border-zinc-900">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono mb-1.5">About Creator</h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-medium">
              {bio}
            </p>
          </div>

          {/* Tab Selection */}
          <div className="flex border-b border-zinc-900 mt-4 pb-0.5 shrink-0">
            <button
              onClick={() => setActiveTab("posts")}
              className={`pb-2.5 text-xs font-extrabold tracking-wider uppercase flex items-center gap-1.5 relative transition-colors ${
                activeTab === "posts" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <VideoIcon size={12} />
              <span>Recent Streams ({posts.length})</span>
              {activeTab === "posts" && (
                <motion.div
                  layoutId="activeSideSheetTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`pb-2.5 ml-6 text-xs font-extrabold tracking-wider uppercase flex items-center gap-1.5 relative transition-colors ${
                activeTab === "about" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Award size={12} />
              <span>Badges & Medals</span>
              {activeTab === "about" && (
                <motion.div
                  layoutId="activeSideSheetTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full"
                />
              )}
            </button>
          </div>

          {/* Tab content */}
          <div className="pt-4 flex-1">
            {activeTab === "posts" ? (
              <div className="flex flex-col gap-3">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="flex gap-3 bg-zinc-950/40 hover:bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-900/60 transition-all cursor-pointer group"
                    onClick={() => {
                      alert(`Loading selected stream archive: "${post.title}"`);
                    }}
                  >
                    <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-850 flex-shrink-0">
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-1 right-1 bg-black/70 text-[8px] font-black tracking-wider text-white px-1 rounded">
                        REPLAY
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <h4 className="text-xs font-bold text-zinc-200 line-clamp-2 leading-snug group-hover:text-white transition-colors">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold font-mono">
                        <span className="flex items-center gap-0.5 text-zinc-400">
                          <Play size={8} fill="currentColor" /> {post.views}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Heart size={8} fill="currentColor" className="text-rose-500/70" /> {post.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-3 bg-zinc-950/40 p-3 rounded-xl border border-zinc-900/60">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-200">Featured Creator Badge</h4>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Recognized as a leading community voice</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-zinc-950/40 p-3 rounded-xl border border-zinc-900/60">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Award size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-200">ASMR Pioneer Award</h4>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Contributed over 100 hours of high-quality streaming</p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </motion.div>
    </div>
  );
};
