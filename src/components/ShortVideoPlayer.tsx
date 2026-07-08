import React, { useRef, useState, useEffect } from "react";
import { Heart, MessageSquare, Share2, Gift, Play, Volume2, VolumeX, Loader2 } from "lucide-react";
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
}

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
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWaiting, setIsWaiting] = useState(true);
  const lastTapRef = useRef<number>(0);

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
            className="w-8 h-8 rounded-full object-cover border border-white/20 shadow-sm"
          />
          <h3 className="font-bold text-sm drop-shadow-md tracking-wide">
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

      {/* Immersive overlay gradients */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

      {/* Top Controls: Mute Toggle (Top Right) */}
      <button
        onClick={onToggleMute}
        className="absolute top-4 right-4 p-2.5 bg-black/50 hover:bg-black/75 rounded-full text-white backdrop-blur-md border border-white/15 z-20 transition-colors active:scale-95"
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
    </div>
  );
};
