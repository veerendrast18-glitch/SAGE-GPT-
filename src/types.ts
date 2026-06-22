export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export type EngineMode = 
  | "Autonomous Reasoning"
  | "Heuristics & Coding"
  | "Creative Resonance"
  | "Strict Socratic Analysis";

export type CoreStatus = "IDLE" | "THINKING" | "GENERATING" | "ERROR";

export interface EngineTheme {
  id: string;
  name: string;
  coreGlow: string;    // CSS colors (e.g. #00f2fe)
  outerGlow: string;
  accentGreen: string;
  textGlow: string;
  bgGradient: string;
}
