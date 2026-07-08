import React, { useState } from "react";
import { 
  User, Lock, Bell, Sparkles, Megaphone, Clock, Sliders, ChevronRight, 
  ArrowLeft, Settings, Edit, Share2, Compass, Users, Video, Plus, 
  Search, MessageSquare, Play, Heart, Bookmark, Flame, Check, HelpCircle, Eye, EyeOff
} from "lucide-react";

interface UserProfileAndSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "videos" | "reposts" | "favorites" | "liked";
type SettingsSection = "manage_account" | "privacy" | "push_notifications" | "business_verification" | "ads" | "screen_time" | "content_preferences";

export const UserProfileAndSettings: React.FC<UserProfileAndSettingsProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>("videos");
  const [filterType, setFilterType] = useState<"latest" | "popular" | "oldest">("latest");
  const [showSettings, setShowSettings] = useState(false);
  const [activeSettingsSection, setActiveSettingsSection] = useState<SettingsSection>("manage_account");

  // Settings states
  const [privateAccount, setPrivateAccount] = useState(false);
  const [allowNotifications, setAllowNotifications] = useState(true);
  const [businessVerification, setBusinessVerification] = useState(false);
  const [targetedAds, setTargetedAds] = useState(true);
  const [offTiktokAds, setOffTiktokAds] = useState(true);
  const [weeklyScreenTime, setWeeklyScreenTime] = useState(false);

  if (!isOpen) return null;

  // Mock post items for profile grid (replicating Screenshot 2)
  const posts = [
    {
      id: "post1",
      title: "Thank You God i testify of the Goodness of God !!! God love is with me everyday. I declare the love of God to fill your heart right now in Jesus The Christ Name as you breath in receive God Love deep into your heart Thank You Father God",
      views: "804",
      bgGradient: "bg-gradient-to-b from-rose-950 via-rose-900 to-zinc-950 text-white",
      type: "text",
      badge: "Faith"
    },
    {
      id: "post2",
      title: "God Thought s are Higher God Ways are Higher than your s 3 pound Brain",
      views: "785",
      bgGradient: "bg-gradient-to-b from-purple-950 via-violet-900 to-zinc-950 text-white",
      type: "graphic",
      graphicIcon: "🌈🐦",
      badge: "Wisdom"
    },
    {
      id: "post3",
      title: "GULFPORT MS was 10 TOES DOWN FOR THE LORD",
      views: "322",
      bgGradient: "bg-gradient-to-b from-zinc-900 via-neutral-800 to-zinc-950 text-white",
      type: "text",
      badge: "Testimony"
    },
    {
      id: "post4",
      title: "https://Push2Play.live New Site Launch!",
      views: "747",
      bgGradient: "bg-gradient-to-b from-emerald-950 via-teal-900 to-zinc-950 text-white",
      type: "link",
      badge: "Launch"
    },
    {
      id: "post5",
      title: "YOU ARE ON A MISSION. DO NOT STOP.",
      views: "16.9K",
      bgGradient: "bg-gradient-to-b from-sky-950 via-blue-900 to-zinc-950 text-white",
      type: "text",
      badge: "Motivation"
    },
    {
      id: "post6",
      title: "FOLLOW TRAIN 2024 Road to 10k",
      views: "16.5K",
      bgGradient: "bg-gradient-to-b from-amber-950 via-amber-900 to-zinc-950 text-white",
      type: "text",
      badge: "Hype"
    }
  ];

  const sidebarMenu = [
    { id: "for_you", name: "For You", icon: Play, active: true },
    { id: "explore", name: "Explore", icon: Compass },
    { id: "following", name: "Following", icon: Users },
    { id: "friends", name: "Friends", icon: Users },
    { id: "live", name: "LIVE", icon: Video },
    { id: "messages", name: "Messages", icon: MessageSquare, badge: "6" },
    { id: "activity", name: "Activity", icon: Bell, badge: "9" },
    { id: "profile", name: "Profile", icon: User },
  ];

  const followingAccounts = [
    { name: "Trinity :)", handle: "trintrin788", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop" },
    { name: "user1812397357819", handle: "user1812397357819", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&auto=format&fit=crop" },
    { name: "voice2fire", handle: "voice2fire", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop" },
    { name: "Marco.ssm", handle: "marcomma", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop" },
  ];

  const settingsMenu = [
    { id: "manage_account", name: "Manage account", icon: User },
    { id: "privacy", name: "Privacy", icon: Lock },
    { id: "push_notifications", name: "Push notifications", icon: Bell },
    { id: "business_verification", name: "Business verification", icon: ShieldCheck },
    { id: "ads", name: "Ads", icon: Megaphone },
    { id: "screen_time", name: "Screen time", icon: Clock },
    { id: "content_preferences", name: "Content preferences", icon: Sliders },
  ];

  function ShieldCheck(props: any) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/95 z-50 overflow-hidden flex flex-col md:flex-row font-sans">
      
      {/* LEFT SIDEBAR: Static Navigation (as shown in Screenshot 2) */}
      <div className="w-full md:w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col shrink-0 p-4 md:p-5 h-auto md:h-full justify-between md:overflow-y-auto no-scrollbar">
        <div className="flex flex-col gap-5">
          {/* Header Action Back */}
          <div className="flex items-center justify-between">
            <button 
              onClick={onClose} 
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors py-1.5 px-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80 active:scale-95 text-xs font-bold"
            >
              <ArrowLeft size={14} /> Back to Live
            </button>
            <span className="text-[10px] text-zinc-500 font-bold font-mono uppercase tracking-wider bg-zinc-900 px-2 py-0.5 rounded">
              push2play
            </span>
          </div>

          <div className="w-full h-[1px] bg-zinc-900" />

          {/* Nav Items */}
          <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-1 md:gap-1.5 pb-2 md:pb-0 no-scrollbar">
            {sidebarMenu.map((item) => {
              const Icon = item.icon;
              const isProfileActive = item.id === "profile" && !showSettings;
              const isItemActive = item.id === "for_you" && showSettings; // just highlighting
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === "profile") {
                      setShowSettings(false);
                    } else if (item.id === "for_you") {
                      onClose();
                    }
                  }}
                  className={`flex items-center justify-between px-3 md:px-4 py-2.5 rounded-xl transition-all text-xs font-bold whitespace-nowrap md:w-full ${
                    isProfileActive 
                      ? "bg-rose-600/10 text-rose-500 border border-rose-500/25 shadow-sm shadow-rose-950/20" 
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="ml-2 bg-rose-600 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded-full leading-none">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Following Accounts Section (Hidden on mobile) */}
          <div className="hidden md:flex flex-col gap-3 mt-4">
            <span className="text-[10px] font-extrabold uppercase text-zinc-500 tracking-wider">
              Following accounts
            </span>
            <div className="flex flex-col gap-2.5">
              {followingAccounts.map((acc, idx) => (
                <div key={idx} className="flex items-center gap-2.5 group cursor-pointer">
                  <img 
                    src={acc.avatar} 
                    alt={acc.name} 
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-zinc-800 group-hover:ring-rose-500 transition-all" 
                  />
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-zinc-300 truncate group-hover:text-white transition-colors">{acc.name}</p>
                    <p className="text-[9px] text-zinc-500 truncate">@{acc.handle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info (Desktop only) */}
        <div className="hidden md:flex flex-col gap-1 text-[10px] text-zinc-600 pt-6">
          <p>© 2026 UtubeChat</p>
          <p className="hover:underline cursor-pointer">Help • Safety • Terms</p>
        </div>
      </div>

      {/* MAIN VIEWPORT PANEL */}
      <div className="flex-1 bg-zinc-950 text-white overflow-y-auto no-scrollbar p-4 md:p-8 flex flex-col items-center">
        
        {/* Toggle Panel Mode (Settings Panel vs. Profile Panel) */}
        {!showSettings ? (
          
          /* PROFILE DISPLAY (Screenshot 2 Alignment) */
          <div className="w-full max-w-4xl flex flex-col gap-8">
            
            {/* Top Info Header block */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start text-center md:text-left border-b border-zinc-900 pb-8">
              
              {/* Giant Red Avatar (as in Screenshot 2) */}
              <div className="relative group shrink-0">
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-600 to-pink-600 rounded-full blur opacity-40 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-rose-600 bg-red-600 flex items-center justify-center shadow-xl">
                  {/* Central White Play Button with circles */}
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-white/80 bg-red-600 flex items-center justify-center shadow-inner">
                    <Play size={20} fill="white" className="text-white ml-1" />
                  </div>
                  {/* Absolute live pulse indicator */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-rose-600 text-[8px] font-black tracking-widest text-white uppercase px-2 py-0.5 rounded-full border border-black animate-pulse">
                    LIVE
                  </div>
                </div>
              </div>

              {/* Bio & Actions details */}
              <div className="flex-1 flex flex-col gap-4">
                
                {/* Username Header & Stats */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-center md:justify-start">
                    <h2 className="text-2xl font-black tracking-tight font-mono text-white">
                      push2playlive
                    </h2>
                    <span className="text-xs text-zinc-500 font-bold font-mono self-center">
                      @push2playlive
                    </span>
                  </div>

                  {/* Following/Followers stats row */}
                  <div className="flex gap-5 mt-3 justify-center md:justify-start text-sm">
                    <span className="text-zinc-400">
                      <strong className="text-white font-black font-mono">2810</strong> Following
                    </span>
                    <span className="text-zinc-400">
                      <strong className="text-white font-black font-mono">1990</strong> Followers
                    </span>
                    <span className="text-zinc-400">
                      <strong className="text-white font-black font-mono">1955</strong> Likes
                    </span>
                  </div>
                </div>

                {/* Interactive buttons */}
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <button className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded transition-colors border border-zinc-800">
                    Edit profile
                  </button>
                  <button className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded transition-colors border border-zinc-800">
                    Promote post
                  </button>
                  {/* Gear settings button (toggles "Manage Account" settings panel!) */}
                  <button 
                    onClick={() => setShowSettings(true)}
                    className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded transition-all border border-zinc-800"
                    title="Manage Account Settings"
                  >
                    <Settings size={15} />
                  </button>
                  <button className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded transition-all border border-zinc-800">
                    <Share2 size={15} />
                  </button>
                </div>

                {/* Link/Bio details */}
                <p className="text-xs text-zinc-300 bg-zinc-900/40 p-3 rounded-xl border border-zinc-900/60 leading-relaxed font-medium">
                  <a href="https://Push2Play.live" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline font-bold mr-1">
                    https://Push2Play.live
                  </a>
                  New Website come join let's grow the people's network. 🙌✨
                </p>

              </div>
            </div>

            {/* Profile Content tab views */}
            <div className="flex flex-col gap-6">
              
              {/* Profile tabs header bar */}
              <div className="flex items-center justify-between border-b border-zinc-900 pb-0.5">
                <div className="flex gap-6">
                  {(["videos", "reposts", "favorites", "liked"] as TabType[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 text-xs uppercase tracking-wider font-extrabold transition-all relative ${
                        activeTab === tab 
                          ? "text-white font-black" 
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Display sorting filters (Latest, Popular, Oldest) */}
                <div className="flex bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
                  {(["latest", "popular", "oldest"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setFilterType(filter)}
                      className={`px-2.5 py-1 text-[9px] uppercase tracking-wider font-black rounded transition-colors ${
                        filterType === filter 
                          ? "bg-zinc-800 text-white" 
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Videos/Items grid */}
              {activeTab === "videos" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-5">
                  {posts.map((post) => (
                    <div 
                      key={post.id}
                      className={`relative aspect-[3/4] rounded-2xl overflow-hidden p-4 flex flex-col justify-between shadow-lg border border-zinc-900 group hover:scale-[1.02] transition-transform cursor-pointer ${post.bgGradient}`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="bg-black/40 text-[8px] font-extrabold tracking-widest text-zinc-300 px-2 py-0.5 rounded-full border border-white/5 uppercase">
                          {post.badge}
                        </span>
                        {post.graphicIcon && (
                          <span className="text-xl">{post.graphicIcon}</span>
                        )}
                      </div>

                      {/* Title block */}
                      <p className="text-xs font-bold leading-relaxed line-clamp-5 text-zinc-100 pr-1 select-none font-mono">
                        {post.title}
                      </p>

                      {/* Views count overlay at the bottom left */}
                      <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm py-1 px-2.5 rounded-xl border border-white/5 w-fit">
                        <Play size={10} fill="currentColor" className="text-zinc-400" />
                        <span className="text-[10px] font-black font-mono text-zinc-300">
                          {post.views}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty state for other tabs */
                <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-600">
                  <Bookmark size={36} className="mb-2 text-zinc-700" />
                  <p className="text-xs font-bold uppercase tracking-wider">No {activeTab} yet</p>
                  <p className="text-[11px] max-w-xs mt-1">This creator hasn't published or favorited anything here yet.</p>
                </div>
              )}

            </div>

          </div>
        ) : (
          
          /* SETTINGS VIEW ("Manage Account") (Screenshot 1 Alignment) */
          <div className="w-full max-w-4xl bg-zinc-950 rounded-3xl border border-zinc-900 shadow-2xl overflow-hidden flex flex-col md:flex-row h-[78vh]">
            
            {/* Settings Left Menu List */}
            <div className="w-full md:w-60 bg-zinc-950 border-r border-zinc-900 shrink-0 flex flex-col py-4 md:py-6">
              <div className="px-5 mb-4">
                <button 
                  onClick={() => setShowSettings(false)}
                  className="flex items-center gap-2 text-rose-500 hover:text-rose-400 font-extrabold text-xs transition-colors py-1.5"
                >
                  <ArrowLeft size={13} /> View Profile
                </button>
              </div>

              <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-1 md:gap-0.5 px-2 md:px-3 no-scrollbar">
                {settingsMenu.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeSettingsSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => setActiveSettingsSection(sec.id as SettingsSection)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        isActive 
                          ? "bg-zinc-900 text-rose-500 border-l-[3px] border-rose-500 rounded-l-none" 
                          : "text-zinc-400 hover:text-white hover:bg-zinc-900/40"
                      }`}
                    >
                      <Icon size={15} />
                      <span>{sec.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Settings Details Main Content Area */}
            <div className="flex-1 bg-zinc-950 p-6 md:p-8 overflow-y-auto no-scrollbar flex flex-col gap-6">
              
              {/* Header Title */}
              <div className="border-b border-zinc-900 pb-4">
                <h3 className="text-lg font-black text-white tracking-tight capitalize">
                  {activeSettingsSection.replace("_", " ")}
                </h3>
              </div>

              {/* Render dynamic settings details according to active section (matching Screenshot 1) */}
              
              {activeSettingsSection === "manage_account" && (
                <div className="flex flex-col gap-6 text-sm">
                  {/* Account control block */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-extrabold uppercase text-zinc-500 tracking-wider">Account control</span>
                    <button className="w-full flex items-center justify-between p-4 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-900 rounded-xl transition-all text-left">
                      <div>
                        <p className="font-bold text-white text-xs">Deactivate or delete account</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">Temporarily deactivate or permanently close this creator profile</p>
                      </div>
                      <ChevronRight size={16} className="text-zinc-500" />
                    </button>
                  </div>

                  {/* Account Information block */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-extrabold uppercase text-zinc-500 tracking-wider">Account information</span>
                    <button className="w-full flex items-center justify-between p-4 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-900 rounded-xl transition-all text-left">
                      <div>
                        <p className="font-bold text-white text-xs">Account region</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">Your account region is initially set based on local timezone setup</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-zinc-400 font-bold">New Zealand</span>
                        <ChevronRight size={16} className="text-zinc-500" />
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {activeSettingsSection === "privacy" && (
                <div className="flex flex-col gap-6 text-sm">
                  {/* Discoverability */}
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-extrabold uppercase text-zinc-500 tracking-wider">Discoverability</span>
                    <div className="flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-900 rounded-xl">
                      <div>
                        <p className="font-bold text-white text-xs">Private account</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5 max-w-md">With a private account, only users you approve can follow and watch your videos.</p>
                      </div>
                      {/* Styled Toggle Switch */}
                      <button 
                        onClick={() => setPrivateAccount(!privateAccount)}
                        className={`w-11 h-6 rounded-full p-0.5 transition-colors focus:outline-none ${privateAccount ? "bg-emerald-500" : "bg-zinc-800"}`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${privateAccount ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </div>
                  </div>

                  {/* Interactions */}
                  <div className="flex flex-col gap-2.5">
                    <span className="text-[10px] font-extrabold uppercase text-zinc-500 tracking-wider">Interactions</span>
                    <button className="w-full flex items-center justify-between p-4 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-900 rounded-xl transition-all text-left">
                      <div>
                        <p className="font-bold text-white text-xs">Comments</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">Who can comment on your posts and live streams</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-zinc-400 font-bold">Everyone</span>
                        <ChevronRight size={16} className="text-zinc-500" />
                      </div>
                    </button>

                    <button className="w-full flex items-center justify-between p-4 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-900 rounded-xl transition-all text-left">
                      <div>
                        <p className="font-bold text-white text-xs">Direct messages</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">Who can send you direct private messages</p>
                      </div>
                      <ChevronRight size={16} className="text-zinc-500" />
                    </button>
                  </div>

                  {/* Data */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-extrabold uppercase text-zinc-500 tracking-wider">Data</span>
                    <button className="w-full flex items-center justify-between p-4 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-900 rounded-xl transition-all text-left">
                      <div>
                        <p className="font-bold text-white text-xs">Download your data</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">Get a copy of your UtubeChat statistics and account data</p>
                      </div>
                      <ChevronRight size={16} className="text-zinc-500" />
                    </button>
                  </div>
                </div>
              )}

              {activeSettingsSection === "push_notifications" && (
                <div className="flex flex-col gap-6 text-sm">
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-extrabold uppercase text-zinc-500 tracking-wider">Desktop notifications</span>
                    <div className="flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-900 rounded-xl">
                      <div>
                        <p className="font-bold text-white text-xs">Allow in browser</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5 max-w-md">Stay on top of notifications for likes, comments, and new live streams.</p>
                      </div>
                      <button 
                        onClick={() => setAllowNotifications(!allowNotifications)}
                        className={`w-11 h-6 rounded-full p-0.5 transition-colors focus:outline-none ${allowNotifications ? "bg-emerald-500" : "bg-zinc-800"}`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${allowNotifications ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-extrabold uppercase text-zinc-500 tracking-wider">Your preferences</span>
                    <button className="w-full flex items-center justify-between p-4 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-900 rounded-xl transition-all text-left">
                      <div>
                        <p className="font-bold text-white text-xs">Interactions</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">Likes, comments, new followers, mentions and tags</p>
                      </div>
                      <ChevronRight size={16} className="text-zinc-500" />
                    </button>
                  </div>
                </div>
              )}

              {activeSettingsSection === "business_verification" && (
                <div className="flex flex-col gap-6 text-sm">
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-extrabold uppercase text-zinc-500 tracking-wider">Business verification</span>
                    <div className="flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-900 rounded-xl">
                      <div>
                        <p className="font-bold text-white text-xs">Verify your profile for business</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5 max-w-md">Verify your business to access streaming metrics, marketing tools and exclusive creator features.</p>
                      </div>
                      <button 
                        onClick={() => setBusinessVerification(!businessVerification)}
                        className={`w-11 h-6 rounded-full p-0.5 transition-colors focus:outline-none ${businessVerification ? "bg-emerald-500" : "bg-zinc-800"}`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${businessVerification ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSettingsSection === "ads" && (
                <div className="flex flex-col gap-6 text-sm">
                  {/* Manage the ads you see */}
                  <div className="flex flex-col gap-2.5">
                    <span className="text-[10px] font-extrabold uppercase text-zinc-500 tracking-wider">Manage the ads you see</span>
                    <button className="w-full flex items-center justify-between p-4 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-900 rounded-xl transition-all text-left">
                      <div>
                        <p className="font-bold text-white text-xs">Manage ad topics</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">Change factors used to tailor the ads you see</p>
                      </div>
                      <ChevronRight size={16} className="text-zinc-500" />
                    </button>

                    <button className="w-full flex items-center justify-between p-4 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-900 rounded-xl transition-all text-left">
                      <div>
                        <p className="font-bold text-white text-xs">Mute advertisers</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">Mute ads from specific advertisers who showed you ads recently</p>
                      </div>
                      <ChevronRight size={16} className="text-zinc-500" />
                    </button>
                  </div>

                  {/* Manage your off-UtubeChat data */}
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-extrabold uppercase text-zinc-500 tracking-wider">Manage your data</span>
                    
                    <div className="flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-900 rounded-xl">
                      <div>
                        <p className="font-bold text-white text-xs">Targeted ads outside of UtubeChat</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5 max-w-md">With this setting, ads you see on other websites and apps can be tailored to you.</p>
                      </div>
                      <button 
                        onClick={() => setTargetedAds(!targetedAds)}
                        className={`w-11 h-6 rounded-full p-0.5 transition-colors focus:outline-none ${targetedAds ? "bg-emerald-500" : "bg-zinc-800"}`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${targetedAds ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-900 rounded-xl">
                      <div>
                        <p className="font-bold text-white text-xs">Using Activity for ad targeting</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5 max-w-md font-medium">Use in-app activity like comments and gifts to tailor advertiser suggestions.</p>
                      </div>
                      <button 
                        onClick={() => setOffTiktokAds(!offTiktokAds)}
                        className={`w-11 h-6 rounded-full p-0.5 transition-colors focus:outline-none ${offTiktokAds ? "bg-emerald-500" : "bg-zinc-800"}`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${offTiktokAds ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSettingsSection === "screen_time" && (
                <div className="flex flex-col gap-6 text-sm">
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-extrabold uppercase text-zinc-500 tracking-wider">Screen time controls</span>
                    
                    <button className="w-full flex items-center justify-between p-4 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-900 rounded-xl transition-all text-left">
                      <div>
                        <p className="font-bold text-white text-xs">Daily screen time</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">Get notified if you reach your daily limits watching streams</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-zinc-400 font-bold">Off</span>
                        <ChevronRight size={16} className="text-zinc-500" />
                      </div>
                    </button>

                    <button className="w-full flex items-center justify-between p-4 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-900 rounded-xl transition-all text-left">
                      <div>
                        <p className="font-bold text-white text-xs">Sleep hours</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">Get reminded when you are in your configured sleep hours</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-zinc-400 font-bold">Off</span>
                        <ChevronRight size={16} className="text-zinc-500" />
                      </div>
                    </button>

                    <div className="flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-900 rounded-xl">
                      <div>
                        <p className="font-bold text-white text-xs">Weekly screen time updates</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">Stay updated on your weekly time from your Inbox</p>
                      </div>
                      <button 
                        onClick={() => setWeeklyScreenTime(!weeklyScreenTime)}
                        className={`w-11 h-6 rounded-full p-0.5 transition-colors focus:outline-none ${weeklyScreenTime ? "bg-emerald-500" : "bg-zinc-800"}`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${weeklyScreenTime ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSettingsSection === "content_preferences" && (
                <div className="flex flex-col gap-4 text-sm">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-extrabold uppercase text-zinc-500 tracking-wider">Content filtering</span>
                    <button className="w-full flex items-center justify-between p-4 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-900 rounded-xl transition-all text-left">
                      <div>
                        <p className="font-bold text-white text-xs">Filter keywords</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">When you filter a keyword, you won't see posts containing that word in your feeds</p>
                      </div>
                      <ChevronRight size={16} className="text-zinc-500" />
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

      </div>

    </div>
  );
};
