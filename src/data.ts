import { ShortVideo, VirtualGift } from "./types";

export const SHORTS_FEED: ShortVideo[] = [
  {
    id: "cyberpunk_neon",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&auto=format&fit=crop",
    author: "@neon_pulse",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    description: "Midnight wanderer in Neo-Tokyo. The rain always highlights the neon. 🌃🔋 #cyberpunk #neonvibes #synthwave #tokyo",
    likes: 12400,
    commentsCount: 342,
    shares: 120,
    giftsCount: 254,
    category: "cyberpunk",
    tags: ["cyberpunk", "neonvibes", "synthwave", "tokyo"]
  },
  {
    id: "nature_spring",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=500&auto=format&fit=crop",
    author: "@meadow_wander",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    description: "Spring breeze blowing through yellow acacia fields. Pure natural healing. 🌸🍃 #naturelovers #relaxing #spring #meadow",
    likes: 8920,
    commentsCount: 156,
    shares: 45,
    giftsCount: 88,
    category: "nature",
    tags: ["naturelovers", "relaxing", "spring", "meadow"]
  },
  {
    id: "satisfying_chef",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-cutting-vegetables-on-a-wooden-board-42171-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&auto=format&fit=crop",
    author: "@chef_satisfaction",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80",
    description: "Perfect paper-thin radish slices. Mindful chopping for the ultimate ratatouille! 🔪🍆 #satisfying #asmrcooking #culinary",
    likes: 18100,
    commentsCount: 521,
    shares: 310,
    giftsCount: 412,
    category: "cooking",
    tags: ["satisfying", "asmrcooking", "culinary"]
  },
  {
    id: "quantum_tunnel",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-tunnel-with-glowing-green-lights-42589-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=500&auto=format&fit=crop",
    author: "@sci_vortex",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    description: "Replicating wormhole trajectories inside a particle accelerator model. Unreal visual! 🚀📡 #scifi #vortex #physics #visualizer",
    likes: 5430,
    commentsCount: 98,
    shares: 112,
    giftsCount: 45,
    category: "scifi",
    tags: ["scifi", "vortex", "physics", "visualizer"]
  },
  {
    id: "beach_aerial",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-top-view-of-waves-crashing-on-a-sandy-beach-42352-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=500&auto=format&fit=crop",
    author: "@coast_drone",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
    description: "Salty morning breeze from above. Looking at waves crash is the ultimate meditation. 🌊☀️ #oceanvibes #dronephotography #relaxing",
    likes: 15200,
    commentsCount: 289,
    shares: 198,
    giftsCount: 167,
    category: "beach",
    tags: ["oceanvibes", "dronephotography", "relaxing"]
  }
];

export const GIFT_CATALOG: VirtualGift[] = [
  {
    id: "heart_spark",
    name: "Love Sparkle",
    icon: "❤️",
    color: "from-pink-500 to-rose-500",
    price: 10,
    animationType: "hearts"
  },
  {
    id: "fire_burst",
    name: "Lit Fire",
    icon: "🔥",
    color: "from-amber-500 to-red-500",
    price: 25,
    animationType: "fireworks"
  },
  {
    id: "gold_coin",
    name: "Scribe Coin",
    icon: "🪙",
    color: "from-yellow-400 to-amber-500",
    price: 50,
    animationType: "coins"
  },
  {
    id: "rocket_hype",
    name: "Hyper Rocket",
    icon: "🚀",
    color: "from-cyan-500 to-purple-600",
    price: 100,
    animationType: "rocket"
  }
];
