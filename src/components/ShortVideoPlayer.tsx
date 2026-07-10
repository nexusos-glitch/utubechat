import React, { useRef, useState, useEffect } from "react";
import { Heart, MessageSquare, Share2, Gift, Play, Volume2, VolumeX, Loader2, X, Check } from "lucide-react";
import { ShortVideo } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface ShortVideoPlayerProps {
  video: ShortVideo;
  isActive: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onLikeToggle: () => void;
  isLiked: boolean;
  onOpenGifts: () => void;
  onShare: () => void;
  onDoubleTapHeart: (clientX: number, clientY: number) => void;
  onOpenMobileCommentsDrawer: () => void;
  onOpenCreatorProfile?: (author: string, avatarUrl: string, category: string) => void;
}

const creatorBios: Record<string, string> = {
  "@neon_pulse": "Cyber-artist wandering the streets of Neo-Tokyo. Capturing high-contrast moments, neon signs, and retro synthwave aesthetics.",
  "@meadow_wander": "Nature filmmaker & field recordist. Finding quiet places, spring acacia blossoms, and mindful paths in nature.",
  "@chef_satisfaction": "ASMR culinary creator. Perfectly cut radish, crisp ratatouille, and satisfying kitchen rhythms.",
  "@sci_vortex": "Theoretical physicist & cosmos simulator. Rendering wormhole trajectories and dark matter structures.",
  "@coast_drone": "Aerial oceanographer & wave meditator. Sharing the sea's shifting colors and sandy shorelines from above."
};

const creatorStats: Record<string, { followers: string; likes: string; isVerified: boolean }> = {
  "@neon_pulse": { followers: "24.5K", likes: "142K", isVerified: true },
  "@meadow_wander": { followers: "12.8K", likes: "89K", isVerified: false },
  "@chef_satisfaction": { followers: "85.2K", likes: "612K", isVerified: true },
  "@sci_vortex": { followers: "19.1K", likes: "76K", isVerified: false },
  "@coast_drone": { followers: "43.0K", likes: "289K", isVerified: true }
};

export const ShortVideoPlayer: React.FC<ShortVideoPlayerProps> = ({
  video,
  isActive,
  isMuted,
  onToggleMute,
  onLikeToggle,
  isLiked,
  onOpenGifts,
  onShare,
  onDoubleTapHeart,
  onOpenMobileCommentsDrawer,
  onOpenCreatorProfile,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWaiting, setIsWaiting] = useState(true);
  const lastTapRef = useRef<number>(0);

  // Account Preview States
  const [showAccountPreview, setShowAccountPreview] = useState(false);
  const [isFollowing, setIsFollowing] = useState(() => {
    try {
      const saved = localStorage.getItem(`followed_creator_${video.author}`);
      return saved === "true";
    } catch {
      return false;
    }
  });

  // Keep following status reactive if author shifts or is changed
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`followed_creator_${video.author}`);
      setIsFollowing(saved === "true");
    } catch {
      setIsFollowing(false);
    }
    setShowAccountPreview(false);
  }, [video.id, video.author, isActive]);

  const handleFollowToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isFollowing;
    setIsFollowing(nextState);
    try {
      localStorage.setItem(`followed_creator_${video.author}`, String(nextState));
    } catch (error) {
      console.error(error);
    }
  };

  // Play/pause based on active status
  useEffect(() => {
    if (!videoRef.current) return;

    if (isActive) {
      setIsWaiting(true);
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsWaiting(false);
          })
          .catch((e) => {
            console.log("Autoplay blocked or interrupted:", e);
            setIsPlaying(false);
            setIsWaiting(false);
          });
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      videoRef.current.currentTime = 0;
    }
  }, [isActive]);

  const [progress, setProgress] = useState(0);
  const [bufferedProgress, setBufferedProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const updateProgressAndBuffer = () => {
    if (!videoRef.current) return;
    const videoEl = videoRef.current;
    const current = videoEl.currentTime;
    const dur = videoEl.duration;
    
    setCurrentTime(current);
    if (dur > 0) {
      setDuration(dur);
      setProgress((current / dur) * 100);
      
      // Calculate buffered progress
      if (videoEl.buffered && videoEl.buffered.length > 0) {
        let maxBufferedEnd = 0;
        for (let i = 0; i < videoEl.buffered.length; i++) {
          const start = videoEl.buffered.start(i);
          const end = videoEl.buffered.end(i);
          // If this buffered range covers or is ahead of current time, track the furthest end
          if (start <= current && end >= current) {
            maxBufferedEnd = Math.max(maxBufferedEnd, end);
          }
        }
        // Fallback to highest buffered end if none contain the current time
        if (maxBufferedEnd === 0) {
          for (let i = 0; i < videoEl.buffered.length; i++) {
            if (videoEl.buffered.end(i) > maxBufferedEnd) {
              maxBufferedEnd = videoEl.buffered.end(i);
            }
          }
        }
        setBufferedProgress((maxBufferedEnd / dur) * 100);
      }
    }
  };

  const handleTimeUpdate = () => {
    updateProgressAndBuffer();
  };

  const handleProgress = () => {
    updateProgressAndBuffer();
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      setBufferedProgress(0);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [isActive, video.id]);

  const handleTogglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Double tap heart gesture
  const handleTapGesture = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double Tap! Find click coordinates relative to video container
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;
        onDoubleTapHeart(clientX, clientY);
      }
    } else {
      // Single Tap: toggles playback after checking delays
      setTimeout(() => {
        const subsequentTap = Date.now();
        if (subsequentTap - lastTapRef.current >= DOUBLE_TAP_DELAY) {
          handleTogglePlay();
        }
      }, DOUBLE_TAP_DELAY);
    }
    lastTapRef.current = now;
  };

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full bg-black flex items-center justify-center overflow-hidden"
    >
      {/* Video Content */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        className="h-full w-full object-cover select-none pointer-events-auto cursor-pointer"
        loop
        playsInline
        muted={isMuted}
        onClick={handleTapGesture}
        onLoadStart={() => setIsWaiting(true)}
        onWaiting={() => setIsWaiting(true)}
        onPlaying={() => setIsWaiting(false)}
        onLoadedData={() => setIsWaiting(false)}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onProgress={handleProgress}
      />

      {/* Loading overlay spinner */}
      {isWaiting && (
        <div className="absolute inset-0 flex flex-col gap-2 items-center justify-center bg-black/60 z-10">
          <Loader2 className="animate-spin text-emerald-400" size={32} />
          <span className="text-zinc-400 text-xs font-semibold">Streaming Live Feed...</span>
        </div>
      )}

      {/* Standard play action overlay indicator */}
      {!isPlaying && !isWaiting && (
        <div
          onClick={handleTogglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/15 cursor-pointer"
        >
          <div className="p-5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 scale-95 hover:scale-105 transition-transform">
            <Play size={28} className="text-white fill-white translate-x-0.5" />
          </div>
        </div>
      )}

      {/* Bottom info panel (Overlay) */}
      <div className="absolute bottom-4 left-4 right-16 z-10 text-white pointer-events-none select-none">
        <div className="flex items-center gap-2 mb-2">
          <img
            src={video.avatarUrl}
            alt={video.author}
            className="w-8 h-8 rounded-full object-cover border border-white/20 shadow-sm pointer-events-auto cursor-pointer hover:scale-105 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              setShowAccountPreview(!showAccountPreview);
            }}
          />
          <h3 
            className="font-bold text-sm drop-shadow-md tracking-wide pointer-events-auto cursor-pointer hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              setShowAccountPreview(!showAccountPreview);
            }}
          >
            {video.author}
          </h3>
          <span className="bg-emerald-500/80 text-[8px] font-bold px-1.5 py-0.5 rounded text-white tracking-wider flex items-center gap-0.5 shadow-sm uppercase">
            LIVE
          </span>
        </div>
        
        <p className="text-xs drop-shadow-md line-clamp-2 max-w-[90%] text-zinc-100 font-medium">
          {video.description}
        </p>

        {/* Category label */}
        <div className="flex items-center gap-2 mt-2.5">
          <span className="text-[10px] bg-white/15 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10 font-bold uppercase tracking-wider">
            🎵 Original Audio
          </span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full backdrop-blur-md border border-emerald-500/20 font-black uppercase tracking-wider">
            📺 {video.category}
          </span>
        </div>
      </div>

      {/* Account Preview Tooltip / Popover */}
      <AnimatePresence>
        {showAccountPreview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 12 }}
            transition={{ type: "spring", damping: 18, stiffness: 200 }}
            className="absolute bottom-28 left-4 right-4 bg-zinc-950/95 border border-zinc-800/80 rounded-2xl p-4 shadow-2xl backdrop-blur-md z-30 flex flex-col gap-3 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className="relative">
                  <img
                    src={video.avatarUrl}
                    alt={video.author}
                    className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
                  />
                  {creatorStats[video.author]?.isVerified && (
                    <span className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-0.5 border border-zinc-950 flex items-center justify-center w-4 h-4">
                      <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L9 10.586l3.293-3.293a1 1 0 111.414 1.414z" />
                      </svg>
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1">
                    {video.author.replace("@", "")}
                  </h4>
                  <p className="text-[10px] text-zinc-500 font-semibold font-mono">
                    {video.author}
                  </p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAccountPreview(false);
                }}
                className="p-1 hover:bg-zinc-900 rounded-full text-zinc-500 hover:text-white transition-colors"
                title="Close"
              >
                <X size={14} />
              </button>
            </div>

            <p className="text-[11px] text-zinc-300 leading-relaxed font-medium">
              {creatorBios[video.author] || "Inspiring creators and viewers one post at a time. Join the community! 🙌✨"}
            </p>

            <div className="flex gap-4 border-t border-zinc-900 pt-2 text-xs">
              <div>
                <span className="font-black text-white font-mono">{creatorStats[video.author]?.followers || "15.4K"}</span>
                <span className="text-[10px] text-zinc-500 font-bold ml-1">Followers</span>
              </div>
              <div>
                <span className="font-black text-white font-mono">{creatorStats[video.author]?.likes || "120K"}</span>
                <span className="text-[10px] text-zinc-500 font-bold ml-1">Likes</span>
              </div>
            </div>

            <div className="flex gap-2 w-full mt-1">
              <button
                onClick={handleFollowToggle}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-black tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 ${
                  isFollowing
                    ? "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800/60"
                    : "bg-emerald-500 text-white hover:bg-emerald-400 shadow-md shadow-emerald-950/20"
                }`}
              >
                {isFollowing ? (
                  <>
                    <Check size={11} className="stroke-[3]" />
                    <span>Following</span>
                  </>
                ) : (
                  <span>Follow</span>
                )}
              </button>
              {onOpenCreatorProfile && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenCreatorProfile(video.author, video.avatarUrl, video.category);
                    setShowAccountPreview(false);
                  }}
                  className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800/60 rounded-lg text-[10px] font-black tracking-wider uppercase transition-all"
                  title="View Full Creator Profile"
                >
                  Profile
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipe Left Hint Overlay */}
      {isActive && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-1.5 pointer-events-none select-none">
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: [0.15, 0.45, 0.15], x: [0, -4, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-1 bg-black/40 backdrop-blur-sm border border-white/5 py-3 px-1.5 rounded-full [writing-mode:vertical-lr] text-[9px] font-black tracking-widest text-emerald-400 uppercase"
          >
            <span>Swipe Left For Profile</span>
            <span className="rotate-90 text-[10px] mt-1">➔</span>
          </motion.div>
        </div>
      )}

      {/* Immersive overlay gradients */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

      {/* Top Controls: Mute Toggle (Top Right) & Timestamp Overlay */}
      <div 
        id="video-timestamp-overlay"
        className="absolute top-4 right-16 px-2.5 py-1.5 bg-black/50 backdrop-blur-md border border-white/15 rounded-lg text-[10px] font-bold font-mono text-zinc-300 z-20 flex items-center justify-center select-none shadow-sm gap-1"
      >
        <span className="text-white">{formatTime(currentTime)}</span>
        <span className="text-zinc-500">/</span>
        <span>{formatTime(duration)}</span>
      </div>

      <button
        onClick={onToggleMute}
        className="absolute top-4 right-4 p-2.5 bg-black/50 hover:bg-black/75 rounded-full text-white backdrop-blur-md border border-white/15 z-20 transition-colors active:scale-95"
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>

      {/* Slim, persistent playback progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-25">
        {/* Buffered Progress segment */}
        <div
          className="absolute top-0 bottom-0 left-0 bg-emerald-500/30 transition-all duration-300 ease-out"
          style={{ width: `${bufferedProgress}%` }}
        />
        {/* Playback Progress segment */}
        <div
          className="absolute top-0 bottom-0 left-0 bg-emerald-500 rounded-r-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
