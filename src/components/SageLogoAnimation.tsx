import React from "react";
import { motion } from "motion/react";

interface SageLogoAnimationProps {
  animated?: boolean;
  scale?: number;
  interactive?: boolean;
  minimal?: boolean;
}

export default function SageLogoAnimation({ 
  animated = true, 
  scale = 1,
  interactive = true,
  minimal = false
}: SageLogoAnimationProps) {
  
  // High-fidelity animation transition configurations
  const drawTransition = {
    duration: 2.2,
    ease: [0.16, 1, 0.3, 1],
    delay: 0.1
  };

  const leafTransition = (delay: number) => ({
    scale: {
      type: "spring",
      stiffness: 120,
      damping: 10,
      delay: delay
    },
    opacity: {
      duration: 0.5,
      delay: delay
    }
  });

  // Base layout parameter overrides
  const viewBox = minimal ? "0 0 350 100" : "0 0 540 380";
  const iconTranslate = minimal ? "translate(55, 50)" : "translate(270, 130)";

  return (
    <motion.div 
      whileHover={interactive ? { scale: 1.02, y: -2 } : undefined}
      whileTap={interactive ? { scale: 0.98 } : undefined}
      className={`relative flex items-center justify-center transition-all duration-300 ${
        minimal ? "w-full h-auto p-0 bg-transparent border-none" : "w-full max-w-xl mx-auto"
      }`}
      style={{ scale }}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox={viewBox}
        width="100%" 
        height="100%" 
        className={`max-w-full relative overflow-visible ${
          minimal 
            ? "p-0 bg-transparent border-none"
            : "drop-shadow-[0_20px_50px_rgba(0,242,254,0.12)] rounded-3xl p-6 bg-[#090b11]/50 border border-slate-900/40"
        }`}
      >
        <defs>
          {/* Tech Gradient Core 1: Blue to Cyan */}
          <linearGradient id="blueCyanGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0066ff" />
            <stop offset="60%" stopColor="#00f2fe" />
            <stop offset="100%" stopColor="#a8fffc" />
          </linearGradient>

          {/* Tech Gradient Core 2: Cyan to Violet-Lavender */}
          <linearGradient id="cyanPurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="60%" stopColor="#7f00ff" />
            <stop offset="100%" stopColor="#cf64ff" />
          </linearGradient>

          {/* Multi-gradient covering full color arc */}
          <linearGradient id="fullSpectrumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0066ff" />
            <stop offset="40%" stopColor="#00f2fe" />
            <stop offset="80%" stopColor="#7f00ff" />
            <stop offset="100%" stopColor="#cf64ff" />
          </linearGradient>

          {/* Radial Core Sphere Gradient */}
          <radialGradient id="sphereGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#00ffcc" />
            <stop offset="70%" stopColor="#0066ff" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Super soft neon drop/blur glow */}
          <filter id="neonOrganicGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient background atmosphere pulse */}
        {!minimal && animated && (
          <motion.circle
            cx="270"
            cy="130"
            r="110"
            fill="url(#cyanPurpleGrad)"
            opacity="0.06"
            animate={{
              scale: [0.93, 1.1, 0.93],
              opacity: [0.04, 0.08, 0.04]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="blur-3xl pointer-events-none"
          />
        )}

        {/* THE INTEGRATED ORGANIC S NEURAL SYMBOL */}
        <g transform={iconTranslate}>
          
          {/* Subtle Backglow trace */}
          {animated && (
            <motion.g filter="url(#neonOrganicGlow)" opacity="0.3" className="pointer-events-none">
              <path d="M 0,0 C -45,-5 -50,-50 0,-65 C 38,-65 42,-35 15,-15" fill="none" stroke="#00f2fe" strokeWidth="8" />
              <path d="M 0,0 C 45,5 50,50 0,65 C -38,65 -42,35 -15,15" fill="none" stroke="#7f00ff" strokeWidth="8" />
              <path d="M 15,-45 C 25,-65 40,-75 30,-90" fill="none" stroke="#cf64ff" strokeWidth="4" />
              <path d="M 35,-30 C 65,-55 85,-65 105,-75" fill="none" stroke="#cf64ff" strokeWidth="4" />
              <path d="M 30,-15 C 65,-20 95,-25 115,-35" fill="none" stroke="#cf64ff" strokeWidth="4" />
              <path d="M -30,25 C -60,35 -75,30 -95,40" fill="none" stroke="#0066ff" strokeWidth="4" />
            </motion.g>
          )}

          {/* S-Shape Ribbons Left/Upper (Cyan to Purple-deep) */}
          <motion.path 
            d="M 0,0 C -45,-5 -48,-48 0,-63 C 35,-65 40,-35 15,-15" 
            fill="none" 
            stroke="url(#blueCyanGrad)" 
            strokeWidth="5" 
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={drawTransition}
          />

          {/* S-Shape Ribbons Right/Lower */}
          <motion.path 
            d="M 0,0 C 45,5 48,48 0,63 C -35,65 -40,35 -15,15" 
            fill="none" 
            stroke="url(#cyanPurpleGrad)" 
            strokeWidth="5" 
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={drawTransition}
          />

          {/* Cell structures (Neural subdivision lines inside S-body) */}
          <motion.path 
            d="M -25,-32 C -15,-48 5,-45 0,-63" 
            fill="none" 
            stroke="#00f2fe" 
            strokeWidth="2.5" 
            opacity="0.65"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5, duration: 1.5 }}
          />
          <motion.path 
            d="M -8,-12 C -2,-28 17,-28 35,-38" 
            fill="none" 
            stroke="#00ffcc" 
            strokeWidth="2.5" 
            opacity="0.65"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.7, duration: 1.5 }}
          />

          <motion.path 
            d="M 25,32 C 15,48 -5,45 0,63" 
            fill="none" 
            stroke="#7f00ff" 
            strokeWidth="2.5" 
            opacity="0.65"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.6, duration: 1.5 }}
          />
          <motion.path 
            d="M 8,12 C 2,28 -17,28 -35,38" 
            fill="none" 
            stroke="#0066ff" 
            strokeWidth="2.5" 
            opacity="0.65"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.8, duration: 1.5 }}
          />

          {/* UPPER RIGHT BRANCH 1 */}
          <motion.path 
            d="M 15,-45 C 25,-65 40,-75 30,-90" 
            fill="none" 
            stroke="url(#cyanPurpleGrad)" 
            strokeWidth="3" 
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.8, duration: 1.2 }}
          />
          {/* Leaf node 1 */}
          <motion.path 
            d="M 30,-90 C 18,-98 33,-108 43,-98 C 43,-86 35,-86 30,-90 Z" 
            fill="url(#cyanPurpleGrad)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.95 }}
            transition={leafTransition(1.3)}
            style={{ originX: "30%", originY: "-90%" }}
            className="drop-shadow-[0_0_6px_#cf64ff]"
          />

          {/* UPPER RIGHT BRANCH 2 */}
          <motion.path 
            d="M 30,-30 C 55,-50 75,-62 95,-70" 
            fill="none" 
            stroke="url(#cyanPurpleGrad)" 
            strokeWidth="3" 
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.0, duration: 1.2 }}
          />
          {/* Leaf node 2 */}
          <motion.path 
            d="M 95,-70 C 102,-80 115,-83 112,-68 C 105,-57 95,-63 95,-70 Z" 
            fill="url(#cyanPurpleGrad)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.95 }}
            transition={leafTransition(1.5)}
            style={{ originX: "95%", originY: "-70%" }}
            className="drop-shadow-[0_0_6px_#7f00ff]"
          />

          {/* UPPER RIGHT BRANCH 3 */}
          <motion.path 
            d="M 28,-12 C 58,-15 85,-20 102,-28" 
            fill="none" 
            stroke="url(#cyanPurpleGrad)" 
            strokeWidth="3" 
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.1, duration: 1.2 }}
          />
          {/* Leaf node 3 */}
          <motion.path 
            d="M 102,-28 C 112,-33 122,-28 117,-18 C 109,-11 102,-21 102,-28 Z" 
            fill="url(#cyanPurpleGrad)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.95 }}
            transition={leafTransition(1.6)}
            style={{ originX: "102%", originY: "-28%" }}
            className="drop-shadow-[0_0_6px_#cf64ff]"
          />

          {/* LOWER LEFT BRANCH 4 */}
          <motion.path 
            d="M -28,20 C -52,30 -65,25 -82,33" 
            fill="none" 
            stroke="url(#blueCyanGrad)" 
            strokeWidth="3" 
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.9, duration: 1.2 }}
          />
          {/* Leaf node 4 */}
          <motion.path 
            d="M -82,33 C -92,28 -97,41 -89,48 C -79,53 -75,41 -82,33 Z" 
            fill="url(#blueCyanGrad)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.95 }}
            transition={leafTransition(1.4)}
            style={{ originX: "-82%", originY: "33%" }}
            className="drop-shadow-[0_0_6px_#00f2fe]"
          />

          {/* CENTRAL CORE HIGH-VOLTAGE SPHERE */}
          <motion.circle 
            cx="0" 
            cy="0" 
            r="16" 
            fill="url(#sphereGrad)"
            initial={{ scale: 0 }}
            animate={animated ? { 
              scale: 1,
              opacity: [1, 0.75, 1]
            } : { scale: 1 }}
            transition={{ 
              scale: { delay: 1.3, duration: 1.0, type: "spring", stiffness: 150, damping: 10 },
              opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            className="drop-shadow-[0_0_12px_#00ffcc]"
          />
        </g>

        {/* TYPOGRAPHY MODE CONTROLLER */}
        {minimal ? (
          /* HORIZONTAL LAYOUT - FOR SMALL SIDEBARS/HEADERS */
          <g transform="translate(125, 60)">
            <motion.text 
              x="0" 
              y="0" 
              fill="#ffffff" 
              fontFamily="system-ui, -apple-system, sans-serif" 
              fontSize="28" 
              fontWeight="800" 
              letterSpacing="1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              VST
            </motion.text>
            <motion.text 
              x="72" 
              y="0" 
              fill="url(#cyanPurpleGrad)" 
              fontFamily="system-ui, -apple-system, sans-serif" 
              fontSize="28" 
              fontWeight="300" 
              letterSpacing="1"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              GPT
            </motion.text>
            <motion.text 
              x="2" 
              y="18" 
              fill="#5f6982" 
              fontFamily="system-ui, -apple-system, sans-serif" 
              fontSize="7.5" 
              fontWeight="700" 
              letterSpacing="4.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              AUTOMATED ENGINE
            </motion.text>
          </g>
        ) : (
          /* VERTICAL STACKED LAYOUT - HIGH END CINEMATIC HERO STYLE */
          <g>
            <motion.text 
              x="270" 
              y="275" 
              fill="#ffffff" 
              fontFamily="system-ui, -apple-system, sans-serif" 
              fontSize="44" 
              fontWeight="800" 
              letterSpacing="2.5"
              textAnchor="end"
              dx="45"
              initial={{ opacity: 0, y: 295 }}
              animate={{ opacity: 1, y: 275 }}
              transition={{ delay: 0.8, duration: 1.0, type: "spring", stiffness: 100 }}
            >
              VST
            </motion.text>
            
            <motion.text 
              x="270" 
              y="275" 
              fill="url(#cyanPurpleGrad)" 
              fontFamily="system-ui, -apple-system, sans-serif" 
              fontSize="44" 
              fontWeight="300" 
              letterSpacing="2.5"
              textAnchor="start"
              dx="65"
              initial={{ opacity: 0, y: 295 }}
              animate={{ opacity: 1, y: 275 }}
              transition={{ delay: 1.0, duration: 1.0, type: "spring", stiffness: 100 }}
              className="drop-shadow-[0_0_8px_rgba(0,242,254,0.3)]"
            >
              GPT
            </motion.text>

            <motion.text 
              x="270" 
              y="312" 
              fill="#5f6982" 
              fontFamily="system-ui, -apple-system, sans-serif" 
              fontSize="12" 
              fontWeight="700" 
              letterSpacing="7.5"
              textAnchor="middle"
              initial={{ opacity: 0, letterSpacing: "14px" }}
              animate={{ opacity: 0.85, letterSpacing: "7.5px" }}
              transition={{ delay: 1.2, duration: 1.0 }}
            >
              AUTOMATED ENGINE
            </motion.text>
          </g>
        )}
      </svg>
    </motion.div>
  );
}

