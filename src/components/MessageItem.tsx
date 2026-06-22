import React, { useState } from "react";
import { motion } from "motion/react";
import { Message } from "../types";
import { Terminal, Copy, Check, ThumbsUp, ThumbsDown, Sparkles, RefreshCw, Bookmark } from "lucide-react";
import SageSparkle from "./SageSparkle";

interface MessageItemProps {
  message: Message;
  onRegenerate?: () => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, onRegenerate }) => {
  const isAssistant = message.role === "assistant";
  const isSystemMsg = message.content.includes("```system") || message.id === "initial-system-greeting";
  const [copied, setCopied] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // Safe markdown text block and code block parser
  const renderMessageContent = (content: string) => {
    if (!content) return null;

    // Detect if content contains code block
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith("```")) {
        // Extract language and actual code content
        const match = part.match(/```(\w*)\n([\s\S]*?)```/);
        const language = match ? match[1] : "";
        const code = match ? match[2].trim() : part.replace(/```/g, "").trim();
        const codeBlockId = `${message.id}-code-${index}`;

        return (
          <div 
            key={index} 
            className="my-4 rounded-2xl overflow-hidden border border-slate-800/80 bg-[#1e1e20] font-mono text-sm shadow-md"
          >
            {/* Code Header Bar */}
            <div className="flex items-center justify-between px-5 py-2.5 bg-[#2a2a2c] border-b border-slate-800/60">
              <span className="text-xs text-slate-300 capitalize flex items-center gap-1.5 font-medium">
                <Terminal size={13} className="text-sky-400" />
                {language || "code"}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(code, codeBlockId)}
                className="text-xs text-slate-300 hover:text-white transition-colors duration-200 flex items-center gap-1.5 cursor-pointer"
                title="Copy code block"
              >
                {copied === codeBlockId ? (
                  <>
                    <Check size={12} className="text-emerald-400" />
                    <span className="text-emerald-400 font-semibold text-[11px]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span className="text-[11px]">Copy code</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Code Panel Body */}
            <pre className="p-5 overflow-x-auto text-sky-100/90 whitespace-pre scrollbar-thin scrollbar-thumb-slate-800">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // Handle simple list points and inline formatting backticks
      const lines = part.split("\n");
      return (
        <div key={index} className="space-y-2.5 whitespace-pre-wrap leading-relaxed text-slate-200/95">
          {lines.map((line, lineIdx) => {
            // Unordered list item parser
            const listMatch = line.match(/^(\s*)[-*+•]\s(.*)/);
            if (listMatch) {
              const textLine = listMatch[2];
              return (
                <div key={lineIdx} className="flex gap-2.5 items-start pl-3 text-slate-200">
                  <span className="w-1.5 h-1.5 bg-[#a8c7fa] rounded-full mt-2 flex-shrink-0" />
                  <span className="flex-1 text-[14.5px]">{renderInlineBackticks(textLine)}</span>
                </div>
              );
            }

            // Bold headers parser
            const headerMatch = line.match(/^(\s*)###\s(.*)/);
            if (headerMatch) {
              return (
                <h4 key={lineIdx} className="text-base font-bold text-slate-100 tracking-tight pt-2">
                  {renderInlineBackticks(headerMatch[2])}
                </h4>
              );
            }

            const subHeaderMatch = line.match(/^(\s*)##\s(.*)/);
            if (subHeaderMatch) {
              return (
                <h3 key={lineIdx} className="text-lg font-bold text-slate-100 tracking-tight pt-3 border-b border-slate-900 pb-1">
                  {renderInlineBackticks(subHeaderMatch[2])}
                </h3>
              );
            }

            // Standard line
            return (
              <p key={lineIdx} className="text-[14.5px]">
                {renderInlineBackticks(line)}
              </p>
            );
          })}
        </div>
      );
    });
  };

  // Replace `code` with beautiful inline tags
  const renderInlineBackticks = (text: string) => {
    const segments = text.split(/(`[^`]+`)/);
    return segments.map((seg, idx) => {
      if (seg.startsWith("`") && seg.endsWith("`")) {
        const cleanVal = seg.slice(1, -1);
        return (
          <code 
            key={idx} 
            className="px-1.5 py-0.5 rounded-md font-mono text-xs border border-slate-800 bg-[#1e1e20] text-amber-300 mx-0.5"
          >
            {cleanVal}
          </code>
        );
      }

      // Quick markdown bold converter helper
      const boldSegments = seg.split(/(\*\*[^*]+\*\*)/);
      return boldSegments.map((bSeg, bIdx) => {
        if (bSeg.startsWith("**") && bSeg.endsWith("**")) {
          return (
            <strong key={bIdx} className="font-bold text-slate-100">
              {bSeg.slice(2, -2)}
            </strong>
          );
        }
        return bSeg;
      });
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.215, 0.61, 0.355, 1] }}
      className={`flex gap-5 px-4 md:px-6 py-6 border-b border-transparent transition-all duration-300 ${
        isAssistant 
          ? "bg-transparent" 
          : "bg-[#131314]/45 rounded-2xl border border-slate-900/60 max-w-[85%] ml-auto"
      }`}
    >
      {/* Sender Icon Badge (Only shown for assistant on left, user is simple) */}
      {isAssistant && (
        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-transparent relative top-0.5 select-none">
          {isSystemMsg ? (
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
              <Terminal size={14} className="text-sky-400" />
            </div>
          ) : (
            <SageSparkle size={26} />
          )}
        </div>
      )}

      {/* Message Body Block */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[11px] font-bold uppercase tracking-wider ${
            isAssistant ? "text-[#a8c7fa]" : "text-sky-300"
          }`}>
            {isAssistant ? (isSystemMsg ? "SYSTEM CONSOLE" : "AURA AI CORE") : "YOU"}
          </span>
          <span className="text-[10px] font-mono text-slate-600">{message.timestamp}</span>
        </div>
        
        <div className="text-[14.5px] leading-relaxed text-slate-200 mt-1 font-sans">
          {renderMessageContent(message.content)}
        </div>

        {/* Gemini Style Action Quick Buttons Bar */}
        {isAssistant && !isSystemMsg && message.content.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 mt-4 text-slate-400"
          >
            <button
              onClick={() => copyToClipboard(message.content, message.id)}
              className="p-1.5 hover:bg-slate-900 hover:text-slate-200 rounded-full transition-all cursor-pointer"
              title="Copy response"
            >
              {copied === message.id ? (
                <Check size={14} className="text-emerald-400" />
              ) : (
                <Copy size={14} />
              )}
            </button>
            <button
              onClick={() => setFeedback("up")}
              className={`p-1.5 hover:bg-slate-900 hover:text-slate-200 rounded-full transition-all cursor-pointer ${
                feedback === "up" ? "text-sky-400 bg-slate-900" : ""
              }`}
              title="Good response"
            >
              <ThumbsUp size={14} />
            </button>
            <button
              onClick={() => setFeedback("down")}
              className={`p-1.5 hover:bg-slate-900 hover:text-slate-200 rounded-full transition-all cursor-pointer ${
                feedback === "down" ? "text-red-400 bg-slate-900" : ""
              }`}
              title="Bad response"
            >
              <ThumbsDown size={14} />
            </button>
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="p-1.5 hover:bg-slate-900 hover:text-slate-200 rounded-full transition-all cursor-pointer"
                title="Regenerate dynamic response"
              >
                <RefreshCw size={14} />
              </button>
            )}
            <div className="h-4 w-[1px] bg-slate-800 mx-1"></div>
            <span className="text-[9px] font-mono text-slate-500 uppercase select-none">
              AURA AI DIRECT COGNITIVE LINK STABLE
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MessageItem;
