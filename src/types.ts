export interface ShortVideo {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  author: string;
  avatarUrl: string;
  description: string;
  likes: number;
  commentsCount: number;
  shares: number;
  giftsCount: number;
  category: "cyberpunk" | "nature" | "cooking" | "scifi" | "beach";
  tags: string[];
}

export interface LiveMessage {
  id: string;
  username: string;
  message: string;
  badge: "mod" | "sub" | "none" | "creator";
  timestamp: Date;
}

export interface CreatorChatHistoryItem {
  role: "user" | "model";
  text: string;
}

export interface VirtualGift {
  id: string;
  name: string;
  icon: string;
  color: string;
  price: number;
  animationType: "hearts" | "fireworks" | "coins" | "rocket";
}

export interface FloatingGiftAnimation {
  id: string;
  icon: string;
  color: string;
  username: string;
  x: number; // Random horizontal start position
  y: number; // Vertical translation progress
}

export interface Creator {
  id: string;
  name: string;
  avatar: string;
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
}
