import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client safely on the server side
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn("GEMINI_API_KEY is not defined in the environment. Server-side AI features will fall back to local simulations.");
}

// Helper to interact with Gemini
async function getAIResponse(systemInstruction: string, prompt: string, history: { role: string; text: string }[] = []) {
  if (!ai) {
    throw new Error("Gemini AI client not initialized. Check your GEMINI_API_KEY.");
  }

  // Format chat contents
  const contents: any[] = [];
  
  // Add history
  for (const h of history) {
    contents.push({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.text }],
    });
  }
  
  // Add current prompt
  contents.push({
    role: "user",
    parts: [{ text: prompt }],
  });

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: contents,
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.8,
    },
  });

  return response.text || "I'm offline right now, but I appreciate your comment!";
}

// API: Chat with the creator of a short video
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { author, description, message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const systemInstruction = `You are a popular short-form content creator whose handle is "${author}". 
The description of your latest video is: "${description}".
You are chatting with one of your viewers in a direct message or chat stream. 
Your tone is energetic, casual, interactive, and fits the vibe of a popular content creator (use occasional internet slang, abbreviations, or emojis, but keep replies concise, under 2-3 sentences max).
Respond in character to the viewer's message.`;

    if (ai) {
      const reply = await getAIResponse(systemInstruction, message, history || []);
      res.json({ reply });
    } else {
      // Offline simulation fallback
      const fallbacks = [
        `Thanks for watching! That was so fun to film. 🎬✨`,
        `Yo! Glad you like the content. Drop a follow! 🙌❤️`,
        `Appreciate the support! Next video drops tomorrow. Stay tuned! 🔥`,
        `Haha thanks! Appreciate you being here in the stream! 🚀`,
      ];
      const randomReply = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      res.json({ reply: `[Offline simulation] ${randomReply}` });
    }
  } catch (error: any) {
    console.error("AI Creator Chat Error:", error);
    res.status(500).json({ error: error.message || "An error occurred with Gemini API." });
  }
});

// API: Generate highly dynamic, realistic live stream comments for a video
app.post("/api/ai/simulate-chat", async (req, res) => {
  try {
    const { author, description, category } = req.body;
    
    const prompt = `Generate a JSON list of 8 realistic, fun, short chat messages from different users watching a video.
Creator: ${author}
Video description: ${description}
Category: ${category}

Each message should be highly specific to what is described in the video.
For example, if the video is about cutting vegetables, comments should be about kitchen skills, chopping sounds, or recipes.
If it's cyberpunk city, comments should be about neon lights, futuristic music, or rain vibes.

Ensure a mix of commentary style: some users ask questions, some use emojis, some react to specific visual details, some express amazement.
Keep them very short (under 8 words each, matching real TikTok/Shorts live stream speeds).

Return EXACTLY a JSON array with this structure:
[
  { "username": "user123", "message": "this is so satisfying...", "badge": "mod" | "sub" | "none" },
  ...
]`;

    const systemInstruction = "You are a master live stream simulator. Return ONLY a valid JSON array of comments. Do not include markdown codeblocks or any text other than the JSON itself.";

    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.9,
        },
      });

      const text = response.text || "[]";
      try {
        const parsed = JSON.parse(text.trim());
        res.json({ comments: parsed });
      } catch (err) {
        console.error("Failed to parse simulated comments JSON:", text);
        res.json({ comments: getLocalFallbackComments(category) });
      }
    } else {
      res.json({ comments: getLocalFallbackComments(category) });
    }
  } catch (error: any) {
    console.error("AI Comment Simulation Error:", error);
    res.json({ comments: getLocalFallbackComments(req.body.category || "general") });
  }
});

// Static fallback comments when AI is offline or fails
function getLocalFallbackComments(category: string) {
  const fallbacks: Record<string, { username: string; message: string; badge: string }[]> = {
    cyberpunk: [
      { username: "neon_rider", message: "Wow, those colors are insane! 🌃", badge: "sub" },
      { username: "glitch_core", message: "What track is playing in the background?", badge: "none" },
      { username: "pixel_samurai", message: "Feels like Blade Runner 2049", badge: "mod" },
      { username: "retro_future", message: "I want to live there so bad!", badge: "none" },
      { username: "synth_wave", message: "LATE NIGHT WALKS ARE THE BEST", badge: "sub" },
      { username: "cyber_girl", message: "so aesthetic! 😍✨", badge: "none" },
    ],
    nature: [
      { username: "green_thumb", message: "Where is this river located? beautiful", badge: "sub" },
      { username: "hiker_dan", message: "I could listen to this stream all day long", badge: "none" },
      { username: "flora_fauna", message: "Springtime blooming is elite! 🌸", badge: "mod" },
      { username: "eco_warrior", message: "So peaceful, pure ASMR right here", badge: "none" },
      { username: "wander_lust", message: "Added to my travel list asap", badge: "sub" },
      { username: "misty_peaks", message: "The water looks so crystal clear", badge: "none" },
    ],
    cooking: [
      { username: "chef_boy", message: "That knife technique is spotless! 🔪🔥", badge: "mod" },
      { username: "foodie_4ever", message: "Drop the recipe immediately please!", badge: "none" },
      { username: "hungry_cat", message: "My mouth is watering looking at this", badge: "sub" },
      { username: "spice_master", message: "More garlic! There is never enough garlic", badge: "none" },
      { username: "kitchen_cozy", message: "satisfying chop chop sound is real ASMR", badge: "sub" },
      { username: "yum_yum", message: "making this tonight! 😋✨", badge: "none" },
    ],
    scifi: [
      { username: "space_cadet", message: "Whoa, that green glowing speed is cool!", badge: "sub" },
      { username: "warp_speed", message: "Is this a CGI render or real light tunnel?", badge: "none" },
      { username: "alien_scout", message: "Engage hyperdrive! 🚀🌌", badge: "mod" },
      { username: "interstellar", message: "reminds me of Star Wars hyperlanes", badge: "none" },
      { username: "nebula_9", message: "Trippy visual loop 😵‍💫💚", badge: "sub" },
    ],
    beach: [
      { username: "surf_coast", message: "The blue gradient on that tide is unreal", badge: "none" },
      { username: "sandy_toes", message: "Miss the beach so much! 🌊🏝️", badge: "sub" },
      { username: "island_breeze", message: "Drone shots like this are so satisfying", badge: "mod" },
      { username: "ocean_blue", message: "Can hear the waves just by looking at this", badge: "none" },
      { username: "sunset_vibe", message: "Ultimate relaxation unlocked.", badge: "sub" },
    ]
  };

  return fallbacks[category] || [
    { username: "viewer_1", message: "Wow, this is amazing! 🙌", badge: "none" },
    { username: "stream_fan", message: "First! Love your videos!", badge: "sub" },
    { username: "react_expert", message: "Buttery smooth vertical scroll here!", badge: "mod" },
    { username: "gift_queen", message: "Sending you some gifts! 🎁💎", badge: "sub" },
  ];
}

// Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[UtubeChat Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
