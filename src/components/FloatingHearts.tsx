import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { FloatingGiftAnimation } from "../types";

interface FloatingHeartsProps {
  animations: FloatingGiftAnimation[];
}

export const FloatingHearts: React.FC<FloatingHeartsProps> = ({ animations }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
      <AnimatePresence>
        {animations.map((anim) => (
          <motion.div
            key={anim.id}
            initial={{ opacity: 0, scale: 0.2, x: `${anim.x}%`, y: "90%" }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.2, 1.4, 1.2, 0.8],
              y: "10%",
              x: `${anim.x + Math.sin(anim.y * 0.1) * 20}%`, // Sine wave float path
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="absolute flex flex-col items-center justify-center pointer-events-none"
            style={{ textShadow: "0 0 10px rgba(0,0,0,0.5)" }}
          >
            {/* Animated Emoji Badge */}
            <div className="text-4xl filter drop-shadow-md">{anim.icon}</div>
            
            {/* Sender tag with custom glow */}
            <span className="text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded-full border border-white/20 whitespace-nowrap mt-1 backdrop-blur-sm shadow-sm scale-75">
              {anim.username}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
