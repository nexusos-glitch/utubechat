import React, { useEffect, useRef, useState } from "react";
import { Send, Star, Shield, ArrowDown } from "lucide-react";
import { LiveMessage, ShortVideo } from "../types";

interface LiveChatOverlayProps {
  activeVideo: ShortVideo;
  onUserMessageSent?: (text: string) => void;
  chatHistory: LiveMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<LiveMessage[]>>;
}

export const LiveChatOverlay: React.FC<LiveChatOverlayProps> = ({
  activeVideo,
  onUserMessageSent,
  chatHistory,
  setChatHistory,
}) => {
  const [inputText, setInputText] = useState("");
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-simulate other chat participants periodically
  useEffect(() => {
    // Clear chat on video change
    setChatHistory([]);
    
    // Fetch initial simulated comments from backend
    const fetchSimulatedComments = async () => {
      try {
        const response = await fetch("/api/ai/simulate-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            author: activeVideo.author,
            description: activeVideo.description,
            category: activeVideo.category,
          }),
        });
        const data = await response.json();
        if (data && data.comments) {
          // Map to LiveMessage
          const mapped: LiveMessage[] = data.comments.map((c: any, index: number) => ({
            id: `init_${index}_${Date.now()}`,
            username: c.username || `user_${index}`,
            message: c.message || "awesome vibe",
            badge: c.badge || "none",
            timestamp: new Date(Date.now() - (10 - index) * 1000),
          }));
          setChatHistory(mapped);
        }
      } catch (err) {
        console.error("Error fetching simulated chats:", err);
      }
    };

    fetchSimulatedComments();

    // Set up a periodic ticker to inject live comments every few seconds
    const interval = setInterval(() => {
      const genericUsernames = [
        "retro_kid", "cyber_sam", "soundwave_x", "nature_fan", "chef_vibe", 
        "coastline", "drone_god", "scifi_geek", "physics_nerd", "chill_hop",
        "neon_rider", "star_dust", "pixel_perfect", "hyper_loop", "wave_rider"
      ];
      
      const genericMessages = [
        "this is so clean 🔥", "wow love the camera angles", "so satisfying!", 
        "incredible quality!", "wait, where is this?!", "LIT!", "perfect loop", 
        "sent a gift!", "MODS are active haha", "subbed immediately!", "poggers",
        "beautiful vibe ❤️", "best short feed ever", "Is this real or cgi?"
      ];

      const randomUser = genericUsernames[Math.floor(Math.random() * genericUsernames.length)];
      const randomMsg = genericMessages[Math.floor(Math.random() * genericMessages.length)];
      const badges: ("none" | "sub" | "mod")[] = ["none", "sub", "none", "none", "mod"];
      const randomBadge = badges[Math.floor(Math.random() * badges.length)];

      const newMessage: LiveMessage = {
        id: `tick_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        username: randomUser,
        message: randomMsg,
        badge: randomBadge,
        timestamp: new Date(),
      };

      setChatHistory((prev) => [...prev.slice(-40), newMessage]); // Limit buffer to 40 items
    }, 2800);

    return () => clearInterval(interval);
  }, [activeVideo, setChatHistory]);

  // Scroll logic
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isFar = scrollHeight - scrollTop - clientHeight > 100;
      setShowScrollBottom(isFar);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Call callback to inject user message
    if (onUserMessageSent) {
      onUserMessageSent(inputText.trim());
    }

    setInputText("");
  };

  return (
    <div className="absolute left-3 right-3 bottom-20 max-h-56 z-20 flex flex-col pointer-events-auto">
      {/* Scroll to bottom floating button */}
      {showScrollBottom && (
        <button
          onClick={scrollToBottom}
          className="self-center bg-zinc-900/90 text-white rounded-full p-1.5 border border-zinc-700/50 flex items-center gap-1 text-[10px] font-bold shadow-md animate-bounce mb-1 backdrop-blur-sm"
        >
          <ArrowDown size={10} />
          More Messages
        </button>
      )}

      {/* Messages Feed Box */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto no-scrollbar space-y-1.5 p-2 rounded-t-xl bg-gradient-to-t from-black/60 to-transparent max-h-40"
      >
        {chatHistory.map((chat) => (
          <div
            key={chat.id}
            className="flex items-start gap-1.5 text-xs text-white max-w-[85%] self-start bg-black/35 hover:bg-black/50 transition-colors px-2.5 py-1 rounded-2xl border border-white/5 shadow-sm backdrop-blur-xs"
          >
            {/* Badge Indicator */}
            {chat.badge === "creator" && (
              <span className="bg-red-500 text-white font-black text-[8px] px-1 rounded-sm uppercase tracking-wide flex items-center justify-center self-center scale-90">
                Host
              </span>
            )}
            {chat.badge === "mod" && (
              <Shield className="text-cyan-400 self-center" size={12} fill="currentColor" />
            )}
            {chat.badge === "sub" && (
              <Star className="text-yellow-400 self-center" size={12} fill="currentColor" />
            )}

            <div className="leading-tight">
              <span className="font-bold text-zinc-300 hover:text-white cursor-pointer mr-1.5 select-none">
                {chat.username}
              </span>
              <span className="text-zinc-100 break-words">{chat.message}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Input Overlay */}
      <form onSubmit={handleSend} className="flex gap-1.5 mt-1">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Send comment to live feed...`}
          className="flex-1 bg-black/50 border border-white/10 text-white placeholder-zinc-400 text-xs rounded-full px-4 py-2 focus:outline-none focus:border-white/30 backdrop-blur-md"
        />
        <button
          type="submit"
          className="bg-white/15 hover:bg-white/35 text-white p-2 rounded-full transition-colors flex items-center justify-center border border-white/5 active:scale-95"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};
