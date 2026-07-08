import React, { useState, useEffect, useRef } from "react";
import { SHORTS_FEED } from "./data";
import { ShortVideo, LiveMessage, FloatingGiftAnimation, VirtualGift } from "./types";
import { HeaderBar } from "./components/HeaderBar";
import { ShortVideoPlayer } from "./components/ShortVideoPlayer";
import { LiveChatOverlay } from "./components/LiveChatOverlay";
import { CreatorChatPanel } from "./components/CreatorChatPanel";
import { FloatingHearts } from "./components/FloatingHearts";
import { GiftSelector } from "./components/GiftSelector";
import { motion, AnimatePresence } from "motion/react";
import { ChevronUp, ChevronDown, MessageSquare, X, Smartphone, Monitor, Heart, Share2, Gift, Sparkles } from "lucide-react";

export default function App() {
  const [coins, setCoins] = useState(350);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  
  // Set to keep track of liked videos
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());

  // Virtual support gift animations
  const [animations, setAnimations] = useState<FloatingGiftAnimation[]>([]);

  // Open trays
  const [showGiftSelector, setShowGiftSelector] = useState(false);
  const [showCommentsPanel, setShowCommentsPanel] = useState(true);

  // Live Chat Stream History
  const [chatHistory, setChatHistory] = useState<LiveMessage[]>([]);

  // Snap Scroll container ref
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter feed based on category and search query
  const filteredFeed = SHORTS_FEED.filter((video) => {
    if (activeCategory !== "all" && video.category !== activeCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchAuthor = video.author.toLowerCase().includes(q);
      const matchDescription = video.description.toLowerCase().includes(q);
      const matchTags = video.tags.some((t) => t.toLowerCase().includes(q));
      return matchAuthor || matchDescription || matchTags;
    }
    return true;
  });

  // Safe active video
  const activeVideo: ShortVideo | undefined = filteredFeed[currentVideoIndex];

  // Re-observe active slides when filtered feed changes
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            if (!isNaN(index)) {
              setCurrentVideoIndex(index);
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.6, // Trigger when 60% of the slide is visible
      }
    );

    const slides = container.querySelectorAll("[data-slide]");
    slides.forEach((slide) => observer.observe(slide));

    // Reset index to 0 if out of range
    if (currentVideoIndex >= filteredFeed.length) {
      setCurrentVideoIndex(0);
    }

    return () => {
      observer.disconnect();
    };
  }, [filteredFeed, currentVideoIndex]);

  // Navigate feed programmatically
  const navigateFeed = (direction: "up" | "down") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let targetIndex = currentVideoIndex;
    if (direction === "up" && currentVideoIndex > 0) {
      targetIndex = currentVideoIndex - 1;
    } else if (direction === "down" && currentVideoIndex < filteredFeed.length - 1) {
      targetIndex = currentVideoIndex + 1;
    }

    const targetSlide = container.querySelector(`[data-index="${targetIndex}"]`);
    if (targetSlide) {
      targetSlide.scrollIntoView({ behavior: "smooth", block: "center" });
      setCurrentVideoIndex(targetIndex);
    }
  };

  // Like Toggle
  const handleLikeToggle = () => {
    if (!activeVideo) return;
    setLikedVideos((prev) => {
      const next = new Set(prev);
      if (next.has(activeVideo.id)) {
        next.delete(activeVideo.id);
      } else {
        next.add(activeVideo.id);
        // Trigger a tiny burst animation at a default spot
        triggerDoubleTapHeart(150, 200);
      }
      return next;
    });
  };

  // Double tap heart placement
  const triggerDoubleTapHeart = (clientX: number, clientY: number) => {
    if (!activeVideo) return;

    // Auto-like on double tap
    if (!likedVideos.has(activeVideo.id)) {
      setLikedVideos((prev) => {
        const next = new Set(prev);
        next.add(activeVideo.id);
        return next;
      });
    }

    // Add heart animation particle
    const animationId = `dt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    
    // Scale relative coords to percentages inside the standard player frame
    const percentX = Math.min(Math.max((clientX / 360) * 100, 15), 85);
    const percentY = Math.min(Math.max((clientY / 640) * 100, 15), 85);

    const newAnim: FloatingGiftAnimation = {
      id: animationId,
      icon: "❤️",
      color: "from-rose-500 to-pink-500",
      username: "Double Tap Like!",
      x: percentX,
      y: percentY,
    };

    setAnimations((prev) => [...prev, newAnim]);

    // Auto-cleanup particle
    setTimeout(() => {
      setAnimations((prev) => prev.filter((a) => a.id !== animationId));
    }, 3000);
  };

  // Handle support gift trigger
  const handleSendGift = (gift: VirtualGift) => {
    if (!activeVideo) return;
    
    // Deduct coins
    setCoins((prev) => Math.max(0, prev - gift.price));
    setShowGiftSelector(false);

    // 1. Create a floating gift particle overlay
    const animationId = `gift_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const newAnim: FloatingGiftAnimation = {
      id: animationId,
      icon: gift.icon,
      color: gift.color,
      username: `Sent ${gift.name}!`,
      x: 35 + Math.random() * 30, // center float
      y: 90,
    };
    setAnimations((prev) => [...prev, newAnim]);

    // 2. Insert transaction notification in active live chat stream
    const giftNotice: LiveMessage = {
      id: `gift_msg_${Date.now()}`,
      username: "You (Spectator)",
      message: `sent a Support Gift: ${gift.name} ${gift.icon}!`,
      badge: "sub",
      timestamp: new Date(),
    };
    setChatHistory((prev) => [...prev, giftNotice]);

    // 3. Trigger simulated spectator reaction chatter in chat overlay after 1 second
    setTimeout(() => {
      const reactions = [
        `OMG! Huge support! 🚀`,
        `Waaa! Thanks for supporting ${activeVideo.author}!`,
        `Absolute legend 🙌`,
        `Gifting shower is real!`,
        `so generous wow! 🪙`,
      ];
      const chatReaction: LiveMessage = {
        id: `react_msg_${Date.now()}`,
        username: ["gift_fan", "neon_sub", "hype_monster", "viewer_8"][Math.floor(Math.random() * 4)],
        message: reactions[Math.floor(Math.random() * reactions.length)],
        badge: "none",
        timestamp: new Date(),
      };
      setChatHistory((prev) => [...prev, chatReaction]);
    }, 1200);

    // 4. Clean up animation particles
    setTimeout(() => {
      setAnimations((prev) => prev.filter((a) => a.id !== animationId));
    }, 3000);
  };

  // Handle user typing and sending custom messages to active live chat stream overlay
  const handleUserSendMessage = (messageText: string) => {
    if (!activeVideo) return;

    const userMsg: LiveMessage = {
      id: `user_msg_${Date.now()}`,
      username: "You (Spectator)",
      message: messageText,
      badge: "sub",
      timestamp: new Date(),
    };

    setChatHistory((prev) => [...prev, userMsg]);

    // Simulate replies from other chat participants or host
    setTimeout(() => {
      const activeUsernames = ["moderator_bot", "fan_girl99", "retro_king", "pixel_craft"];
      const replies = [
        "agree completely!",
        "Yes! Exactly!",
        `mods are awake, love it`,
        "welcome to the stream! 🙌✨",
        "such a cool live vibe here",
      ];
      
      const replyMsg: LiveMessage = {
        id: `reply_msg_${Date.now()}`,
        username: activeUsernames[Math.floor(Math.random() * activeUsernames.length)],
        message: replies[Math.floor(Math.random() * replies.length)],
        badge: Math.random() > 0.6 ? "mod" : "none",
        timestamp: new Date(),
      };

      setChatHistory((prev) => [...prev, replyMsg]);
    }, 1500);
  };

  // Quick helper to simulated top up
  const handleAddCoins = () => {
    setCoins((prev) => prev + 250);
  };

  const handleShareVideo = () => {
    if (!activeVideo) return;
    navigator.clipboard.writeText(window.location.href);
    alert(`Link for ${activeVideo.author}'s stream copied to clipboard! Share the ASMR content! 🔗`);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-zinc-950 overflow-hidden font-sans">
      {/* Premium Header Bar */}
      <HeaderBar
        coins={coins}
        onAddCoins={handleAddCoins}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategorySelect={(cat) => {
          setActiveCategory(cat);
          setCurrentVideoIndex(0);
        }}
      />

      {/* Main Container Layout */}
      <div className="flex-1 flex overflow-hidden relative justify-center items-center bg-zinc-950 p-2 md:p-6">
        {filteredFeed.length === 0 ? (
          /* Empty Search Vibe */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-zinc-500">
            <Smartphone size={48} className="text-zinc-700 mb-4 animate-bounce" />
            <p className="text-zinc-300 font-bold mb-1 text-sm">No streaming feeds active</p>
            <p className="text-xs text-zinc-600 max-w-xs">
              We couldn't find any creator live streams matching your search. Try resetting the category or tags filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="mt-4 px-4 py-2 bg-zinc-900 border border-zinc-800 text-white hover:text-emerald-400 font-bold text-xs rounded-full transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="relative flex items-center justify-center max-h-[82vh] h-full max-w-7xl w-full">
            
            {/* Wrapper for video player and toolbar to keep them perfectly centered */}
            <div className="flex items-center gap-4 md:gap-6">
              {/* 1. Centered Video Player Frame */}
              <div className="relative w-full max-w-[390px] h-[82vh] rounded-[42px] border-[10px] border-zinc-900 bg-black overflow-hidden shadow-2xl shadow-emerald-500/5 ring-1 ring-white/10 flex flex-col shrink-0">
              {/* Physical Notch/Camera Bar */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-zinc-900 rounded-b-2xl z-30 flex items-center justify-center gap-1.5 px-3 pointer-events-none">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-950 border border-zinc-850" />
                <div className="w-10 h-1 bg-zinc-950 rounded-full" />
              </div>

              {/* Vertical Snap Scrolling Reel */}
              <div
                ref={scrollContainerRef}
                className="flex-1 h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
                style={{ scrollBehavior: "smooth" }}
              >
                {filteredFeed.map((video, index) => {
                  const isCurrent = index === currentVideoIndex;
                  return (
                    <div
                      key={video.id}
                      data-slide
                      data-index={index}
                      className="h-full w-full snap-start snap-always shrink-0 relative"
                    >
                      {/* Render active players or thumbnail placeholders */}
                      <ShortVideoPlayer
                        video={video}
                        isActive={isCurrent}
                        isMuted={isMuted}
                        onToggleMute={() => setIsMuted(!isMuted)}
                        onLikeToggle={handleLikeToggle}
                        isLiked={likedVideos.has(video.id)}
                        onOpenGifts={() => setShowGiftSelector(true)}
                        onShare={handleShareVideo}
                        onDoubleTapHeart={triggerDoubleTapHeart}
                        onOpenMobileCommentsDrawer={() => setShowCommentsPanel(true)}
                      />

                      {/* Interactive Simulated Live Chat overlay inside device screen */}
                      {isCurrent && (
                        <LiveChatOverlay
                          activeVideo={video}
                          onUserMessageSent={handleUserSendMessage}
                          chatHistory={chatHistory}
                          setChatHistory={setChatHistory}
                        />
                      )}

                      {/* Particle and support gift shower overlay */}
                      {isCurrent && <FloatingHearts animations={animations} />}
                    </div>
                  );
                })}
              </div>

              {/* Virtual Support Gifting Selector Tray overlay inside device */}
              <GiftSelector
                isOpen={showGiftSelector}
                onClose={() => setShowGiftSelector(false)}
                coins={coins}
                onAddCoins={handleAddCoins}
                onSendGift={handleSendGift}
              />
            </div>

            {/* 2. Sleek Vertical Toolbar (To the Right of Video Display) */}
            <div className="flex flex-col items-center justify-between p-2 w-14 md:w-16 py-5 md:py-6 shrink-0 h-[70vh] md:h-[82vh] z-30">
              
              {/* Arrow Up / Arrow Down for Video Navigation */}
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => navigateFeed("up")}
                  disabled={currentVideoIndex === 0}
                  className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700/60 rounded-xl transition-all disabled:opacity-20 disabled:pointer-events-none active:scale-95 shadow-sm"
                  title="Scroll Up (Previous)"
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  onClick={() => navigateFeed("down")}
                  disabled={currentVideoIndex === filteredFeed.length - 1}
                  className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700/60 rounded-xl transition-all disabled:opacity-20 disabled:pointer-events-none active:scale-95 shadow-sm"
                  title="Scroll Down (Next)"
                >
                  <ChevronDown size={16} />
                </button>
              </div>

              {/* Action Buttons: Like, Comment (vertical comments opening), Share, Gift */}
              <div className="flex flex-col gap-4.5 items-center w-full">
                
                {/* Like / Heart */}
                <div className="flex flex-col items-center gap-0.5 w-full">
                  <button
                    onClick={handleLikeToggle}
                    className={`p-2.5 rounded-full border transition-all active:scale-90 shadow-md ${
                      activeVideo && likedVideos.has(activeVideo.id)
                        ? "bg-rose-600 border-transparent text-white shadow-rose-900/30"
                        : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white"
                    }`}
                    title="Like Video"
                  >
                    <Heart size={16} fill={activeVideo && likedVideos.has(activeVideo.id) ? "currentColor" : "none"} />
                  </button>
                  <span className="text-[9px] font-bold text-zinc-400 font-mono mt-0.5">
                    {activeVideo ? (likedVideos.has(activeVideo.id) ? activeVideo.likes + 1 : activeVideo.likes).toLocaleString() : 0}
                  </span>
                </div>

                {/* Comment Toggle / Vertical Comments Open */}
                <div className="flex flex-col items-center gap-0.5 w-full">
                  <button
                    onClick={() => setShowCommentsPanel(!showCommentsPanel)}
                    className={`p-2.5 rounded-full border transition-all active:scale-90 shadow-md ${
                      showCommentsPanel
                        ? "bg-emerald-600 border-transparent text-white shadow-emerald-950/40"
                        : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white"
                    }`}
                    title="Toggle Vertical Comments"
                  >
                    <MessageSquare size={16} />
                  </button>
                  <span className="text-[9px] font-bold text-zinc-400 font-mono mt-0.5">
                    {activeVideo?.commentsCount || 0}
                  </span>
                </div>

                {/* Share */}
                <div className="flex flex-col items-center gap-0.5 w-full">
                  <button
                    onClick={handleShareVideo}
                    className="p-2.5 bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white rounded-full shadow-md hover:border-zinc-500 transition-colors active:scale-90"
                    title="Share Video"
                  >
                    <Share2 size={16} />
                  </button>
                  <span className="text-[9px] font-bold text-zinc-400 font-mono mt-0.5">
                    {activeVideo?.shares || 0}
                  </span>
                </div>

                {/* Gift Shower */}
                <div className="flex flex-col items-center gap-0.5 w-full">
                  <button
                    onClick={() => setShowGiftSelector(true)}
                    className="p-2.5 bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 text-zinc-950 rounded-full font-black shadow-lg shadow-amber-500/10 active:scale-90 animate-pulse"
                    title="Send Support Gift"
                  >
                    <Gift size={16} />
                  </button>
                  <span className="text-[9px] font-bold text-zinc-400 font-mono mt-0.5">
                    {activeVideo?.giftsCount || 0}
                  </span>
                </div>

              </div>
            </div>
          </div>

            {/* 3. Expandable Vertical Comments & Creator Chat Panel */}
            <AnimatePresence>
              {showCommentsPanel && activeVideo && (
                <motion.div
                  initial={{ opacity: 0, x: 40, y: "-50%" }}
                  animate={{ opacity: 1, x: 0, y: "-50%" }}
                  exit={{ opacity: 0, x: 40, y: "-50%" }}
                  transition={{ type: "spring", damping: 26, stiffness: 200 }}
                  className="hidden lg:flex flex-col bg-zinc-950 border border-zinc-900 rounded-[28px] overflow-hidden h-[82vh] w-[360px] shadow-2xl absolute right-2 xl:right-10 top-1/2 z-40"
                >
                  <div className="absolute top-4 right-4 z-30">
                    <button
                      onClick={() => setShowCommentsPanel(false)}
                      className="p-1.5 text-zinc-400 hover:text-white bg-zinc-900/80 hover:bg-zinc-850 rounded-full border border-zinc-800 transition-colors"
                      title="Close Panel"
                    >
                      <X size={12} />
                    </button>
                  </div>
                  
                  <CreatorChatPanel
                    activeVideo={activeVideo}
                    isMuted={isMuted}
                    onToggleMute={() => setIsMuted(!isMuted)}
                    onDoubleTapHeart={() => triggerDoubleTapHeart(150, 200)}
                    onShare={handleShareVideo}
                    coins={coins}
                    onOpenGifts={() => setShowGiftSelector(true)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Mobile drawer sheet for Comments and Video Details (Unified with showCommentsPanel) */}
      <AnimatePresence>
        {showCommentsPanel && activeVideo && (
          <>
            {/* Mobile sheet backdrop */}
            <div
              className="absolute inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setShowCommentsPanel(false)}
            />
            {/* Slide up sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute bottom-0 left-0 right-0 h-[75vh] bg-zinc-950 rounded-t-3xl border-t border-zinc-900 z-50 overflow-hidden lg:hidden flex flex-col"
            >
              <div className="p-3.5 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/80">
                <span className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-1">
                  <Sparkles size={12} className="text-emerald-400 animate-pulse" />
                  AI Creator Live Chat & DMs
                </span>
                <button
                  onClick={() => setShowCommentsPanel(false)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-full bg-zinc-900"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <CreatorChatPanel
                  activeVideo={activeVideo}
                  isMuted={isMuted}
                  onToggleMute={() => setIsMuted(!isMuted)}
                  onDoubleTapHeart={() => triggerDoubleTapHeart(150, 200)}
                  onShare={handleShareVideo}
                  coins={coins}
                  onOpenGifts={() => setShowGiftSelector(true)}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
