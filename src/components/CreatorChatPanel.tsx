import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Heart, Share2, Award, Sparkles, Send, CheckCircle2, Volume2, UserCheck, UserPlus, HelpCircle } from "lucide-react";
import { ShortVideo, CreatorChatHistoryItem } from "../types";

interface CreatorChatPanelProps {
  activeVideo: ShortVideo;
  isMuted: boolean;
  onToggleMute: () => void;
  onDoubleTapHeart: () => void;
  onShare: () => void;
  coins: number;
  onOpenGifts: () => void;
}

export const CreatorChatPanel: React.FC<CreatorChatPanelProps> = ({
  activeVideo,
  isMuted,
  onToggleMute,
  onDoubleTapHeart,
  onShare,
  coins,
  onOpenGifts,
}) => {
  const [activeTab, setActiveTab] = useState<"about" | "ai_chat">("ai_chat");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [aiChatLogs, setAiChatLogs] = useState<Record<string, CreatorChatHistoryItem[]>>({});
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message for current video creator if empty
  useEffect(() => {
    const videoId = activeVideo.id;
    if (!aiChatLogs[videoId]) {
      setAiChatLogs((prev) => ({
        ...prev,
        [videoId]: [
          {
            role: "model",
            text: `Hey there! I'm the creator behind ${activeVideo.author}. Thanks for stopping by! Ask me anything about my "${activeVideo.category}" video. 🎬⚡`,
          },
        ],
      }));
    }
  }, [activeVideo, aiChatLogs]);

  // Scroll to bottom of AI chat logs
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [aiChatLogs, activeVideo.id, isAiTyping]);

  const currentChatLogs = aiChatLogs[activeVideo.id] || [];

  const handleSendAiMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const queryText = userQuery.trim();
    if (!queryText || isAiTyping) return;

    const videoId = activeVideo.id;

    // 1. Add user message to history
    const userMessage: CreatorChatHistoryItem = { role: "user", text: queryText };
    setAiChatLogs((prev) => ({
      ...prev,
      [videoId]: [...(prev[videoId] || []), userMessage],
    }));
    setUserQuery("");
    setIsAiTyping(true);

    try {
      // Get conversation context history (excluding current message)
      const currentHistory = aiChatLogs[videoId] || [];
      
      // Call our Gemini API endpoint
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: activeVideo.author,
          description: activeVideo.description,
          message: queryText,
          history: currentHistory,
        }),
      });

      const data = await response.json();
      const aiReply = data.reply || "Thanks for your comment! Keep supporting.";

      // Add AI reply to history
      const modelMessage: CreatorChatHistoryItem = { role: "model", text: aiReply };
      setAiChatLogs((prev) => ({
        ...prev,
        [videoId]: [...(prev[videoId] || []), modelMessage],
      }));
    } catch (error) {
      console.error("Gemini Creator Chat error:", error);
      const modelMessage: CreatorChatHistoryItem = {
        role: "model",
        text: "My connection took a small nap, but thank you for your awesome message! ❤️ Send another one soon!",
      };
      setAiChatLogs((prev) => ({
        ...prev,
        [videoId]: [...(prev[videoId] || []), modelMessage],
      }));
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleSubscribeToggle = () => {
    setIsSubscribed(!isSubscribed);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 border-l border-zinc-900 overflow-hidden w-full">
      {/* Creator Profile Summary */}
      <div className="p-4 border-b border-zinc-900 bg-zinc-950/60 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={activeVideo.avatarUrl}
            alt={activeVideo.author}
            className="w-11 h-11 rounded-full object-cover border-2 border-zinc-800 shadow-md ring-2 ring-emerald-500/20"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-sm hover:underline cursor-pointer">
                {activeVideo.author}
              </span>
              <CheckCircle2 size={13} className="text-blue-400 fill-blue-400" />
            </div>
            <p className="text-xs text-zinc-500 font-medium">1.4M subscribers</p>
          </div>
        </div>

        {/* Subscribe Trigger */}
        <button
          onClick={handleSubscribeToggle}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1 ${
            isSubscribed
              ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              : "bg-red-600 text-white hover:bg-red-700 active:scale-95 shadow-md shadow-red-900/10"
          }`}
        >
          {isSubscribed ? (
            <>
              <UserCheck size={13} />
              Subscribed
            </>
          ) : (
            <>
              <UserPlus size={13} />
              Subscribe
            </>
          )}
        </button>
      </div>

      {/* DM Chat Header Subtitle */}
      <div className="px-4 py-2 bg-emerald-950/10 border-b border-zinc-900 flex items-center gap-1.5">
        <Sparkles size={11} className="text-emerald-400" />
        <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest">
          AI Creator Live Chat & DMs
        </span>
      </div>

      {/* DM Chat Messages View */}
      <div className="flex-1 overflow-hidden flex flex-col relative bg-zinc-950/40">
        <div className="flex-1 flex flex-col overflow-hidden h-full">
          {/* Chat Messages */}
          <div
            ref={chatScrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth no-scrollbar"
          >
            <div className="text-center py-1">
              <span className="bg-zinc-900 text-zinc-500 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-zinc-850 shadow-inner">
                DIRECT CONVERSATION ENCRYPTED
              </span>
            </div>

            {currentChatLogs.map((log, index) => {
              const isModel = log.role === "model";
              return (
                <div
                  key={`${index}_${log.role}`}
                  className={`flex items-start gap-2.5 ${isModel ? "justify-start" : "justify-end"}`}
                >
                  {isModel && (
                    <img
                      src={activeVideo.avatarUrl}
                      alt="author"
                      className="w-7 h-7 rounded-full object-cover mt-0.5 border border-zinc-800"
                    />
                  )}
                  <div
                    className={`p-3 rounded-2xl text-xs max-w-[80%] leading-relaxed ${
                      isModel
                        ? "bg-zinc-900 text-zinc-100 rounded-tl-sm border border-zinc-850"
                        : "bg-emerald-600 text-white rounded-tr-sm"
                    }`}
                  >
                    <p>{log.text}</p>
                  </div>
                </div>
              );
            })}

            {/* Typing state */}
            <AnimatePresence>
              {isAiTyping && (
                <div className="flex items-start gap-2.5 justify-start">
                  <img
                    src={activeVideo.avatarUrl}
                    alt="author"
                    className="w-7 h-7 rounded-full object-cover mt-0.5 border border-zinc-800"
                  />
                  <div className="bg-zinc-900 text-zinc-400 px-4 py-3 rounded-2xl rounded-tl-sm border border-zinc-850 flex items-center gap-1">
                    <span className="text-xs italic font-medium">{activeVideo.author} is typing</span>
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                      className="font-bold"
                    >
                      .
                    </motion.span>
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                      className="font-bold"
                    >
                      .
                    </motion.span>
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                      className="font-bold"
                    >
                      .
                    </motion.span>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* User typing box */}
          <form
            onSubmit={handleSendAiMessage}
            className="p-3 border-t border-zinc-900 bg-zinc-950/80 flex gap-2 items-center"
          >
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder={`Ask ${activeVideo.author} anything...`}
              className="flex-1 bg-zinc-900 border border-zinc-800/85 text-white placeholder-zinc-500 rounded-full py-2.5 px-4 text-xs focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!userQuery.trim() || isAiTyping}
              className={`p-2.5 rounded-full transition-all flex items-center justify-center border ${
                userQuery.trim() && !isAiTyping
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white border-transparent active:scale-95"
                  : "bg-zinc-900 text-zinc-600 border-zinc-850 cursor-not-allowed"
              }`}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
