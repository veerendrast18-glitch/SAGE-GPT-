import React from "react";
import { motion } from "motion/react";

interface SageSparkleProps {
  size?: number;
  animated?: boolean;
  glowColor?: string;
}

export default function SageSparkle({ size = 24, animated = true, glowColor = "#00f2fe" }: SageSparkleProps) {
  return (
    <div className="relative inline-flex items-center justify-center font-mono" style={{ width: size, height: size }}>
      
      {/* Behind Ambient Glow backdrop */}
      {animated && (
        <motion.div
          animate={{
            scale: [1, 1.25, 0.9, 1.15, 1],
            opacity: [0.35, 0.65, 0.35],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full blur-md"
          style={{
            background: `radial-gradient(circle, ${glowColor}55 0%, transparent 70%)`,
          }}
        />
      )}

      {/* SAGE Custom Quantum Hex Core SVG */}
      <motion.svg
        animate={animated ? {
          rotate: [0, 90, 180, 270, 360],
          scale: [1, 1.06, 0.94, 1.06, 1],
        } : undefined}
        transition={{
          rotate: { duration: 12, repeat: Infinity, ease: "linear" },
          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_8px_var(--glow)]"
        style={{
          "--glow": glowColor
        } as React.CSSProperties}
      >
        <defs>
          <linearGradient id="sageGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#00f2fe" />
            <stop offset="100%" stopColor="#7f00ff" />
          </linearGradient>
        </defs>
        
        {/* Futuristic quantum mathematical spark */}
        <path 
          d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z" 
          fill="url(#sageGlowGrad)" 
        />
        
        {/* Core highlight dot */}
        <circle cx="12" cy="12" r="2" fill="#ffffff" />
      </motion.svg>
    </div>
  );
}
