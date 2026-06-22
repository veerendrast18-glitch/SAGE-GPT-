import React from "react";
import { motion } from "motion/react";
import { CoreStatus } from "../types";

interface SageCoreVisualProps {
  status: CoreStatus;
  accentColor: string; // e.g. #00f2fe
  outerColor: string;  // e.g. #7f00ff
  secondaryColor: string; // e.g. #00ffcc
  size?: number;
}

export default function SageCoreVisual({
  status,
  accentColor,
  outerColor,
  secondaryColor,
  size = 220
}: SageCoreVisualProps) {
  
  const getRotationClass = (baseSpeed: number) => {
    switch (status) {
      case "THINKING":
        return baseSpeed / 3.0; // Rotate much faster
      case "GENERATING":
        return baseSpeed / 5.0; // High energy flurry
      case "ERROR":
        return baseSpeed / 0.4; // Sluggish / desynced
      case "IDLE":
      default:
        return baseSpeed;
    }
  };

  const getPulseDuration = () => {
    switch (status) {
      case "THINKING": return 0.7;
      case "GENERATING": return 0.4;
      case "ERROR": return 0.3;
      case "IDLE":
      default:
        return 2.5;
    }
  };

  return (
    <div 
      className="relative flex items-center justify-center select-none"
      style={{ 
        width: size, 
        height: size,
        "--core-glow": accentColor,
        "--outer-glow": outerColor,
        "--secondary-glow": secondaryColor
      } as React.CSSProperties}
    >
      {/* 1. Deep Core Quantum Orb */}
      <motion.div
        animate={{
          scale: status === "ERROR" ? [1, 1.08, 0.94, 1] : [1, 1.15, 1],
          opacity: status === "ERROR" ? [0.6, 1, 0.6] : [0.85, 1, 0.85],
        }}
        transition={{
          duration: getPulseDuration(),
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute rounded-full z-10"
        style={{
          width: size * 0.22,
          height: size * 0.22,
          background: status === "ERROR"
            ? "radial-gradient(circle, #fff 0%, #ef4444 60%, transparent 100%)"
            : `radial-gradient(circle, #ffffff 0%, ${accentColor} 55%, transparent 100%)`,
          boxShadow: status === "ERROR"
            ? "0 0 30px #ef4444, 0 0 60px #ef4444"
            : `0 0 35px ${accentColor}, 0 0 70px ${accentColor}, 0 0 100px ${outerColor}77`,
        }}
      />

      {/* 2. Inner Ingestion Dashed Grid Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: getRotationClass(6),
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute border border-dashed rounded-full opacity-60 pointer-events-none"
        style={{
          width: size * 0.45,
          height: size * 0.45,
          borderColor: status === "ERROR" ? "#ef4444" : accentColor,
          borderWidth: "1.5px"
        }}
      />

      {/* 3. Middle Processing High-Voltage Grid Ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{
          duration: getRotationClass(4.5),
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute border-2 border-transparent rounded-full opacity-50 pointer-events-none"
        style={{
          width: size * 0.72,
          height: size * 0.72,
          borderTopColor: status === "ERROR" ? "#f87171" : secondaryColor,
          borderBottomColor: status === "ERROR" ? "#f87171" : secondaryColor,
        }}
      />

      {/* 4. Outer Autonomous Orchestration Dual-Line Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: getRotationClass(14),
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute rounded-full pointer-events-none border-t border-b"
        style={{
          width: size * 1.0,
          height: size * 1.0,
          borderStyle: "double",
          borderWidth: "1px",
          borderLeftWidth: "4px",
          borderRightWidth: "4px",
          borderColor: status === "ERROR" ? "#dc2626" : outerColor,
          boxShadow: `inset 0 0 20px ${outerColor}10, 0 0 20px ${outerColor}10`,
        }}
      />

      {/* 5. Orbiting Quantum Data Nodes */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: getRotationClass(5),
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute pointer-events-none"
        style={{ width: size * 0.78, height: size * 0.78 }}
      >
        <div 
          className="absolute top-0 left-1/2 -ml-1.5 rounded-full"
          style={{
            width: size * 0.04,
            height: size * 0.04,
            backgroundColor: "#ffffff",
            boxShadow: `0 0 10px #ffffff, 0 0 20px ${accentColor}`,
          }}
        />
      </motion.div>

      <motion.div
        animate={{ rotate: -360 }}
        transition={{
          duration: getRotationClass(7),
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute pointer-events-none"
        style={{ width: size * 0.9, height: size * 0.9 }}
      >
        <div 
          className="absolute bottom-0 left-1/2 -ml-1.5 rounded-full"
          style={{
            width: size * 0.035,
            height: size * 0.035,
            backgroundColor: "#ffffff",
            boxShadow: `0 0 8px #ffffff, 0 0 16px ${secondaryColor}`,
          }}
        />
      </motion.div>

      {/* Kinetic expansion blast on generating output */}
      {status === "GENERATING" && (
        <motion.div
          initial={{ scale: 0.6, opacity: 0.8 }}
          animate={{ scale: 1.4, opacity: 0 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeOut" }}
          className="absolute rounded-full border pointer-events-none"
          style={{
            width: size,
            height: size,
            borderColor: accentColor,
          }}
        />
      )}
    </div>
  );
}
