import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import MessageItem from "./components/MessageItem";
import SageSparkle from "./components/SageSparkle";
import SageCoreVisual from "./components/SageCoreVisual";
import AuthModal from "./components/AuthModal";
import SageLogoAnimation from "./components/SageLogoAnimation";
import QuestionPaperGenerator from "./components/QuestionPaperGenerator";
import { logOutUser } from "./lib/firebase";
import { Message, CoreStatus } from "./types";
import { 
  Send, 
  RotateCcw, 
  Trash2, 
  Sparkles, 
  Menu, 
  X, 
  Plus, 
  ChevronRight, 
  Settings, 
  HelpCircle, 
  History, 
  Compass, 
  Code,
  Lightbulb,
  MessageSquare,
  Globe,
  Mic,
  Image,
  ArrowUp,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  Key,
  ShieldCheck,
  GraduationCap
} from "lucide-react";

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  created: string;
}

// Concrete design suggestion grid matching real Gemini onboarding layout
const PROMPT_SUGGESTIONS = [
  {
    id: "suggestion-1",
    label: "Explain quantum physics simple",
    subtext: "Help me explain superpositions in brief analogies",
    icon: Compass,
    prompt: "Explain quantum physics in a creative simple way using easy bullet points. Focus on quantum superposition & entanglement.",
    color: "text-blue-400"
  },
  {
    id: "suggestion-2",
    label: "Draft a modern async script",
    subtext: "Create a Node.js concurrent database stream",
    icon: Code,
    prompt: "Provide an elegant Node.js async concurrent processing template to stream, validate, and write a high-volume JSON dataset.",
    color: "text-emerald-400"
  },
  {
    id: "suggestion-3",
    label: "Brainstorm unique tech concepts",
    subtext: "Let me design a smart greenhouse pipeline",
    icon: Lightbulb,
    prompt: "Brainstorm 4 highly futuristic IoT-enabled automated smart greenhouse system concept features. Keep the format clean and direct.",
    color: "text-amber-400"
  },
  {
    id: "suggestion-4",
    label: "Draft email to client",
    subtext: "Construct a polite follow up request",
    icon: MessageSquare,
    prompt: "Draft a concise, polite, and professional email to follow up on a project proposal check-in with a key corporate client.",
    color: "text-purple-400"
  }
];

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  providerId: "google.com" | "apple.com" | "simulated";
}

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("sage_gpt_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Cinematic App Opening Splash State
  const [appLoading, setAppLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [statusText, setStatusText] = useState("Booting cognitive engine...");

  useEffect(() => {
    let start = Date.now();
    const duration = 2200; // 2.2 seconds total boot
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setLoadingProgress(progress);
      
      if (progress < 30) {
        setStatusText("Booting cognitive engine...");
      } else if (progress < 60) {
        setStatusText("Synapse arrays online. Anchoring stable core...");
      } else if (progress < 85) {
        setStatusText("Deploying deep reasoning heuristical grids...");
      } else {
        setStatusText("Aura AI Active. Welcome connection.");
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        setTimeout(() => {
          setAppLoading(false);
        }, 150);
      }
    }, 45);

    return () => clearInterval(interval);
  }, []);

  // Multi-chat local storage sessions
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem("sage_gpt_sessions");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      {
        id: "default-sess-id",
        title: "Welcome to Aura AI",
        messages: [
          {
            id: "initial-system-greeting",
            role: "assistant",
            content: `Welcome, ${user ? user.displayName : "Veerendra"}. I am Aura AI, a responsive cognitive agent engineered for direct heuristic synthesis. Type a directive, select an onboard starter tracker, or adjust custom instruction directives below.`,
            timestamp: new Date().toLocaleTimeString()
          }
        ],
        created: new Date().toLocaleDateString()
      }
    ];
  });

  // Track Firebase dynamic login bindings
  useEffect(() => {
    import("./lib/firebase").then(async ({ getFirebaseAuth }) => {
      const auth = await getFirebaseAuth();
      if (auth) {
        auth.onAuthStateChanged((firebaseUser) => {
          if (firebaseUser) {
            const currentUserProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || "user@gmail.com",
              displayName: firebaseUser.displayName || "User",
              photoURL: firebaseUser.photoURL || undefined,
              providerId: (firebaseUser.providerData[0]?.providerId as any) || "google.com"
            };
            setUser(currentUserProfile);
            localStorage.setItem("sage_gpt_user", JSON.stringify(currentUserProfile));
          }
        });
      }
    });
  }, []);

  const handleSignInSuccess = (newUser: UserProfile) => {
    setUser(newUser);
    localStorage.setItem("sage_gpt_user", JSON.stringify(newUser));

    // Update first greet message dynamically if default-sess-id exists
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === "default-sess-id") {
          return {
            ...s,
            messages: s.messages.map((m) => {
              if (m.id === "initial-system-greeting") {
                return {
                  ...m,
                  content: `Welcome, ${newUser.displayName}. I am Aura AI, a responsive cognitive agent engineered for direct heuristic synthesis. Type a directive, select an onboard starter tracker, or adjust custom instruction directives below.`,
                };
              }
              return m;
            }),
          };
        }
        return s;
      })
    );
  };

  const handleSignOut = async () => {
    try {
      await logOutUser();
    } catch {}
    setUser(null);
    localStorage.removeItem("sage_gpt_user");
    setProfileDropdownOpen(false);
  };

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    const saved = localStorage.getItem("sage_gpt_active_id");
    return saved || "default-sess-id";
  });

  const [inputMessage, setInputMessage] = useState("");
  const [status, setStatus] = useState<CoreStatus>("IDLE");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [customSystemPrompt, setCustomSystemPrompt] = useState("");
  const [activeModel, setActiveModel] = useState<"Aura-Heuristics" | "Aura-Architect">("Aura-Heuristics");
  const [activeTab, setActiveTab] = useState<"chat" | "question_paper">("chat");
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Find current session
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0] || {
    id: "fallback",
    title: "New Thread",
    messages: [] as Message[]
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem("sage_gpt_sessions", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem("sage_gpt_active_id", activeSessionId);
  }, [activeSessionId]);

  // Scroll to bottom on updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession.messages.length, status]);

  const handleStartNewChat = () => {
    const newSessionId = `sess-${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      title: "New chat",
      messages: [
        {
          id: `greet-${Date.now()}`,
          role: "assistant",
          content: `Hello, ${user ? user.displayName : "Veerendra"}. How can Aura AI assist your workflows today?`,
          timestamp: new Date().toLocaleTimeString()
        }
      ],
      created: new Date().toLocaleDateString()
    };

    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSessionId);
    setInputMessage("");
    setStatus("IDLE");
  };

  const handleDeleteSession = (sessId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      // Just clear current session
      setSessions([
        {
          id: "default-sess-id",
          title: "Welcome to Aura AI",
          messages: [
            {
              id: `greet-${Date.now()}`,
              role: "assistant",
              content: `Hello, ${user ? user.displayName : "Veerendra"}. Core buffer cleared. How can Aura AI collaborate with you today?`,
              timestamp: new Date().toLocaleTimeString()
            }
          ],
          created: new Date().toLocaleDateString()
        }
      ]);
      setActiveSessionId("default-sess-id");
      return;
    }

    const filtered = sessions.filter(s => s.id !== sessId);
    setSessions(filtered);
    if (activeSessionId === sessId) {
      setActiveSessionId(filtered[0].id);
    }
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const promptToSend = customPrompt || inputMessage;
    if (!promptToSend.trim() || status !== "IDLE") return;

    if (!customPrompt) {
      setInputMessage("");
    }

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: promptToSend,
      timestamp: new Date().toLocaleTimeString()
    };

    // Update session list and title if it was first message
    const updatedMessages = [...activeSession.messages, userMsg];
    let newTitle = activeSession.title;
    if (activeSession.title === "New chat" || activeSession.title === "Welcome to Aura AI") {
      newTitle = promptToSend.length > 25 ? promptToSend.substring(0, 25) + "..." : promptToSend;
    }

    setSessions(prev => 
      prev.map(s => 
        s.id === activeSessionId 
          ? { ...s, title: newTitle, messages: updatedMessages }
          : s
      )
    );

    setStatus("THINKING");

    const assistantMsgId = `ast-${Date.now()}`;
    const initialAssistantMsg: Message = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString()
    };

    try {
      // Safe context-building by removing system greet message
      const requestPayload = updatedMessages.filter(
        m => m.id !== "initial-system-greeting" && !m.content.includes("Welcome, Veerendra")
      );

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: requestPayload,
          systemInstruction: customSystemPrompt,
          mode: activeModel === "Aura-Architect" ? "Strict Socratic Analysis (Intense Deep思考 mode)" : "Autonomous Reasoning Core Layout"
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || "Unaligned request signals.");
      }

      setStatus("GENERATING");

      // Inject blank model reply block
      setSessions(prev => 
        prev.map(s => 
          s.id === activeSessionId 
            ? { ...s, messages: [...updatedMessages, initialAssistantMsg] }
            : s
        )
      );

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Null reader downlink stream");

      const decoder = new TextDecoder();
      let done = false;
      let accumulatedText = "";
      let partialLine = "";

      while (!done) {
        const { value, done: readingDone } = await reader.read();
        done = readingDone;

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const combined = partialLine + chunk;
          const lines = combined.split("\n");
          partialLine = lines.pop() || "";

          for (const line of lines) {
            const cleanLine = line.trim();
            if (cleanLine.startsWith("data: ")) {
              const dataStr = cleanLine.slice(6).trim();
              if (dataStr === "[DONE]") {
                done = true;
                break;
              }
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.text) {
                  accumulatedText += parsed.text;
                  setSessions(prev => 
                    prev.map(s => {
                      if (s.id === activeSessionId) {
                        return {
                          ...s,
                          messages: s.messages.map(msg => 
                            msg.id === assistantMsgId ? { ...msg, content: accumulatedText } : msg
                          )
                        };
                      }
                      return s;
                    })
                  );
                }
              } catch (e) {
                // Ignore parse errors from chunk anomalies
              }
            }
          }
        }
      }

      setStatus("IDLE");

    } catch (err: any) {
      console.error(err);
      setStatus("ERROR");

      const errSystemMessage: Message = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: `❌ **UNABLE TO TRANSMIT DIRECTION PROTOCOL**\n\nFailed to establish stable handshake. Please verify that your **GEMINI_API_KEY** is active inside AI Studio's **Settings > Secrets** panel.\n\n*Technical info: ${err.message || "HANDSHAKE_DENIED"}*`,
        timestamp: new Date().toLocaleTimeString()
      };

      setSessions(prev => 
        prev.map(s => 
          s.id === activeSessionId 
            ? { ...s, messages: [...updatedMessages, errSystemMessage] }
            : s
        )
      );
    }
  };

  const handleRegenerateLast = () => {
    // Find last user message in thread list
    const reversed = [...activeSession.messages].reverse();
    const lastUser = reversed.find(m => m.role === "user");
    if (lastUser) {
      // Slit off everything from last user message and redo
      const idx = activeSession.messages.findIndex(m => m.id === lastUser.id);
      if (idx !== -1) {
        const trimmed = activeSession.messages.slice(0, idx);
        setSessions(prev => 
          prev.map(s => 
            s.id === activeSessionId ? { ...s, messages: trimmed } : s
          )
        );
        handleSendMessage(lastUser.content);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#131314] text-[#e3e3e3] font-sans flex overflow-hidden antialiased">
      
      {/* Cinematic High-End App-Open Splash Overlay */}
      <AnimatePresence>
        {appLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              y: -100,
              scale: 1.04,
              transition: { 
                duration: 0.85, 
                ease: [0.77, 0, 0.175, 1] 
              } 
            }}
            className="fixed inset-0 bg-[#07080c] z-[9999] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden"
          >
            {/* Elegant deep space radial backdrop glimmers */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(127,0,255,0.09),transparent_60%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,242,254,0.09),transparent_50%)] pointer-events-none" />
            
            {/* Ambient glass grid pattern underlay */}
            <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="relative w-full max-w-xl space-y-12 flex flex-col items-center">
              
              {/* Premium S-network logo symbol stacked hero */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                <SageLogoAnimation scale={1.05} interactive={false} minimal={false} />
              </motion.div>

              {/* Progress and core diagnostic logging channel */}
              <div className="w-80 md:w-96 space-y-4 pt-1">
                
                {/* Micro-meter background line */}
                <div className="w-full h-1 bg-slate-900/80 rounded-full overflow-hidden relative border border-slate-950/40">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: `${loadingProgress}%` }}
                    transition={{ ease: "easeOut" }}
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#0066ff] via-[#00f2fe] to-[#cf64ff] drop-shadow-[0_0_8px_#00f2fe]"
                  />
                </div>

                {/* Cyber diagnostics stream logs */}
                <div className="h-6 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={statusText}
                      initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
                      animate={{ opacity: 0.7, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -10, filter: "blur(2px)" }}
                      transition={{ duration: 0.3 }}
                      className="text-[10px] font-mono tracking-widest text-[#00f2fe] font-bold uppercase flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 bg-[#00f2fe] rounded-full animate-ping" />
                      {statusText}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* SIDEBAR NAVIGATION - authentic Google Gemini layout */}
      <motion.aside
        animate={{ width: sidebarOpen ? 256 : 68 }}
        transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        className="hidden md:flex flex-col bg-[#1e1e20] h-screen border-r border-[#1e1e20]/20 flex-shrink-0 relative select-none"
      >
        {/* Toggle/New chat section */}
        <div className="p-3.5 flex flex-col gap-5">
          <div className="flex items-center gap-3 h-10">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-[#282a2c] rounded-full text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={sidebarOpen ? "Collapse navigation" : "Expand navigation"}
            >
              <Menu size={20} />
            </button>
            {sidebarOpen && (
              <motion.div 
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-28 flex items-center translate-y-0.5"
              >
                <SageLogoAnimation minimal={true} scale={1.0} interactive={true} />
              </motion.div>
            )}
          </div>

          {/* Pill New Chat button */}
          <button
            onClick={() => {
              setActiveTab("chat");
              handleStartNewChat();
            }}
            className={`flex items-center transition-all bg-[#1a1a1c] hover:bg-[#282a2c] text-xs font-semibold tracking-wide border border-transparent hover:border-[#3c4043] rounded-full shadow-sm select-none cursor-pointer ${
              sidebarOpen 
                ? "px-4 py-3 gap-3 w-full justify-start text-[13px] text-slate-300" 
                : "w-10 h-10 justify-center p-0 mx-auto"
            }`}
            title="Start a fresh chat timeline"
          >
            <Plus size={18} className="text-[#a8c7fa]" />
            {sidebarOpen && <span>New chat</span>}
          </button>

          {/* Module Navigation Group */}
          <div className="flex flex-col gap-1 mt-1 border-b border-[#282a2c]/65 pb-4 px-1">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-3.5 transition-all text-xs font-bold tracking-wide rounded-xl select-none cursor-pointer border ${
                activeTab === "chat"
                  ? "bg-[#004a77]/15 text-[#c2e7ff] border-[#00f2fe]/20"
                  : "bg-transparent text-slate-400 hover:text-slate-100 hover:bg-[#282a2c]/50 border-transparent"
              } ${
                sidebarOpen 
                  ? "px-4 py-2.5 w-full justify-start text-[13px]" 
                  : "w-10 h-10 justify-center p-0 mx-auto"
              }`}
              title="Aura Chat Core Portal"
            >
              <MessageSquare size={16} className={activeTab === "chat" ? "text-[#00f2fe]" : "text-slate-500"} />
              {sidebarOpen && <span>Aura Chat Core</span>}
            </button>

            <button
              onClick={() => setActiveTab("question_paper")}
              className={`flex items-center gap-3.5 transition-all text-xs font-bold tracking-wide rounded-xl select-none cursor-pointer border ${
                activeTab === "question_paper"
                  ? "bg-gradient-to-r from-[#7f00ff]/20 to-[#00f2fe]/10 text-white border-[#00f2fe]/20 shadow-[0_0_12px_rgba(0,242,254,0.15)]"
                  : "bg-transparent text-slate-400 hover:text-slate-100 hover:bg-[#282a2c]/50 border-transparent"
              } ${
                sidebarOpen 
                  ? "px-4 py-2.5 w-full justify-start text-[13px]" 
                  : "w-10 h-10 justify-center p-0 mx-auto"
              }`}
              title="Generate Question Paper"
            >
              <GraduationCap size={16} className={activeTab === "question_paper" ? "text-[#00f2fe] animate-pulse" : "text-slate-400"} />
              {sidebarOpen && <span>Question Paper Gen</span>}
            </button>
          </div>
        </div>

        {/* RECENT SESSIONS SECTION */}
        <div className="flex-1 overflow-y-auto px-2 mt-4 space-y-1">
          {sidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="px-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2"
            >
              Recent directives
            </motion.div>
          )}

          <div className="space-y-1">
            {sessions.map((sess) => {
              const isActive = sess.id === activeSessionId;
              return (
                <div
                  key={sess.id}
                  onClick={() => setActiveSessionId(sess.id)}
                  className={`w-full group rounded-full text-left transition-all flex items-center justify-between text-xs font-medium cursor-pointer ${
                    sidebarOpen ? "px-4 py-2.5" : "w-10 h-10 p-0 mx-auto justify-center"
                  } ${
                    isActive 
                      ? "bg-[#004a77]/25 text-[#c2e7ff] font-semibold" 
                      : "text-slate-400 hover:bg-[#282a2c] hover:text-slate-200"
                  }`}
                  title={sess.title}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <MessageSquare size={15} className={`flex-shrink-0 ${isActive ? "text-[#c2e7ff]" : "text-slate-500"}`} />
                    {sidebarOpen && (
                      <span className="truncate pr-1 text-[13px]">{sess.title}</span>
                    )}
                  </div>
                  {sidebarOpen && (
                    <button
                      onClick={(e) => handleDeleteSession(sess.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-800 rounded-full text-slate-500 hover:text-slate-300 transition-all flex-shrink-0 cursor-pointer hidden group-hover:flex items-center"
                      title="Delete thread"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Side Panel Footer section */}
        <div className="p-3.5 border-t border-[#1e1e20]/45 space-y-1">
          <div className={`flex items-center gap-3 text-slate-400 text-xs font-medium rounded-full cursor-not-allowed hover:text-slate-200 ${
            sidebarOpen ? "px-4 py-2.5" : "w-10 h-10 mx-auto justify-center"
          }`}>
            <HelpCircle size={16} />
            {sidebarOpen && <span className="text-[13px]">Help & Support</span>}
          </div>
          <div className={`flex items-center gap-3 text-slate-400 text-xs font-medium rounded-full cursor-not-allowed hover:text-slate-200 ${
            sidebarOpen ? "px-4 py-2.5" : "w-10 h-10 mx-auto justify-center"
          }`}>
            <History size={16} />
            {sidebarOpen && <span className="text-[13px]">Activity manager</span>}
          </div>
          <div className={`flex items-center gap-3 text-slate-400 text-xs font-medium rounded-full cursor-not-allowed hover:text-slate-200 ${
            sidebarOpen ? "px-4 py-2.5" : "w-10 h-10 mx-auto justify-center"
          }`}>
            <Settings size={16} />
            {sidebarOpen && <span className="text-[13px]">Settings panel</span>}
          </div>
        </div>
      </motion.aside>

      {/* MOBILE HUD OVERLAY SIDEBAR */}
      <div className="md:hidden flex bg-[#1e1e20] border-b border-[#131114] px-4 py-3 items-center justify-between z-40 w-full fixed top-0 left-0">
        <div className="w-24">
          <SageLogoAnimation minimal={true} scale={1.0} interactive={true} />
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handleStartNewChat} 
            className="p-1.5 bg-[#131314] rounded-lg text-slate-300 hover:text-white"
            title="New Chat"
          >
            <Plus size={16} />
          </button>
          <select 
            value={activeSessionId} 
            onChange={(e) => setActiveSessionId(e.target.value)}
            className="bg-[#131314] border border-[#2a2a2c] text-xs px-2 py-1 rounded text-slate-300 outline-none max-w-[120px]"
          >
            {sessions.map(s => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* MAIN CHAT CANVAS FIELD */}
      <main className="flex-1 flex flex-col h-screen min-w-0 bg-[#131314] relative pt-14 md:pt-0">
        
        {/* Top Floating Mini Bar info */}
        <div className="hidden md:flex items-center justify-between px-6 py-4 border-b border-transparent">
          <div className="flex items-center gap-4">
            {/* Quick alignment model toggle */}
            <div className="flex bg-[#1e1e20]/80 border border-slate-900 rounded-full p-1 select-none">
              {(["Aura-Heuristics", "Aura-Architect"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setActiveModel(m)}
                  className={`text-[11px] font-mono font-bold tracking-wider rounded-full px-3 py-1 transition-all cursor-pointer ${
                    activeModel === m
                      ? "bg-[#333537] text-white"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {m === "Aura-Heuristics" ? "Aura Heuristics" : "Aura Architect"}
                </button>
              ))}
            </div>

            {/* Quick custom instruction feedback */}
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <input 
                type="text" 
                value={customSystemPrompt}
                onChange={(e) => setCustomSystemPrompt(e.target.value)}
                placeholder="Set static task instruction (optional)..."
                className="bg-transparent text-[11px] text-slate-400 font-mono outline-none border-b border-transparent focus:border-slate-700 w-48 md:w-60"
                title="System directives"
              />
            </div>
          </div>

          <div className="relative">
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-800 bg-[#1e1e20]/60 hover:bg-[#1e1e20] transition-all cursor-pointer text-left select-none"
                >
                  <span className="text-[11px] font-mono font-medium text-slate-400">
                    {user.email.toUpperCase()}
                  </span>
                  
                  {/* User profile avatar or letters badge */}
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName}
                      referrerPolicy="no-referrer"
                      className="w-5.5 h-5.5 rounded-full object-cover border border-slate-700 shadow-sm"
                    />
                  ) : (
                    <div className="w-5.5 h-5.5 rounded-full bg-gradient-to-tr from-[#00f2fe] to-[#7f00ff] flex items-center justify-center font-bold text-[10px] text-white shadow-sm select-none tracking-widest leading-none">
                      {user.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>

                {/* Account info floating dropdown sub-menu */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <>
                      {/* Close trigger catcher */}
                      <button 
                        aria-label="Close user dropdown"
                        className="fixed inset-0 z-40 bg-transparent cursor-default border-0 outline-none w-full h-full"
                        onClick={() => setProfileDropdownOpen(false)} 
                      />
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-36 w-64 rounded-xl border border-slate-800/80 bg-[#121214] p-4 shadow-xl z-50 text-left font-sans"
                      >
                        <div className="space-y-1 pb-3 mb-3 border-b border-slate-800">
                          <p className="text-[10px] font-mono font-bold tracking-widest text-sky-400 uppercase flex items-center gap-1">
                            <ShieldCheck size={11} className="text-sky-400 animate-pulse" />
                            {user.providerId === "simulated" ? "SIMULATED ACCOUNT" : user.providerId === "apple.com" ? "APPLE CONNECT" : "GOOGLE AUTHENTICATED"}
                          </p>
                          <h5 className="text-sm font-semibold text-white truncate leading-none pt-0.5">{user.displayName}</h5>
                          <p className="text-xs text-slate-500 truncate leading-none pt-0.5">{user.email}</p>
                        </div>

                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 transition-all cursor-pointer text-left font-mono"
                        >
                          <LogOut size={13} />
                          <span>DISCONNECT SECURELY</span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="relative group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#00f2fe]/40 bg-[#00f2fe]/5 hover:bg-[#00f2fe]/10 transition-all cursor-pointer overflow-hidden shadow-[0_0_15px_-3px_rgba(0,242,254,0.1)] active:scale-95"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#00f2fe]/10 to-[#7f00ff]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Key size={11} className="text-[#00f2fe] group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-[10px] font-mono font-bold tracking-wider text-[#00f2fe] group-hover:text-white transition-colors">
                  SECURE CONNECTION &bull; CONNECT
                </span>
              </button>
            )}
          </div>
        </div>

        {/* BULK CONTENTS WINDOW */}
        {activeTab === "question_paper" ? (
          <QuestionPaperGenerator />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-3 scrollbar-none">
          <div className="max-w-3xl mx-auto space-y-6 pt-4 pb-24">
            
            {/* INITIAL BLANK ONBOARDING PANEL (Shown only if no conversations or just welcome line) */}
            {activeSession.messages.length <= 1 && (
              <div className="pt-8 md:pt-12 space-y-10">
                
                {/* Premium Animated Aura AI Logo Container */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="w-full max-w-xl mx-auto flex justify-center"
                >
                  <SageLogoAnimation scale={1.0} interactive={true} />
                </motion.div>
                
                {/* Huge iconic greetings block */}
                <div className="space-y-3 text-center">
                  <motion.h1
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-3xl md:text-4xl font-semibold tracking-tight leading-none bg-gradient-to-r from-[#00f2fe] via-[#7f00ff] to-[#8a2be2] bg-clip-text text-transparent pb-1"
                  >
                    Welcome, {user ? user.displayName : "Veerendra"}.
                  </motion.h1>
                  <motion.h2
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="text-2xl md:text-3xl font-medium tracking-tight text-slate-400"
                  >
                    Direct directivity stable &bull; Command Aura AI
                  </motion.h2>
                </div>

                {/* Suggestions Grid Row Cards */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8"
                >
                  {PROMPT_SUGGESTIONS.map((sug, i) => {
                    const CardIcon = sug.icon;
                    return (
                      <button
                        key={sug.id}
                        onClick={() => handleSendMessage(sug.prompt)}
                        className="p-5 bg-[#1e1e20] hover:bg-[#282a2c] rounded-2xl border border-transparent hover:border-[#3c4043] text-left transition-all duration-300 min-h-36 flex flex-col justify-between group cursor-pointer shadow-sm relative overflow-hidden"
                      >
                        <span className="text-[13.5px] leading-relaxed text-[#e3e3e3] group-hover:text-white font-medium">
                          {sug.subtext}
                        </span>
                        
                        <div className="flex justify-between items-center w-full mt-4">
                          <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase truncate max-w-[120px]">
                            {sug.label}
                          </span>
                          <div className={`p-2 bg-[#131314] rounded-full text-slate-400 group-hover:text-white transition-all`}>
                            <CardIcon size={16} />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </motion.div>
              </div>
            )}

            {/* Conversation Flow Render list */}
            {activeSession.messages.length > 0 && (
              <div className="space-y-2">
                <AnimatePresence initial={false}>
                  {activeSession.messages.map((msg) => (
                    <MessageItem 
                      key={msg.id} 
                      message={msg} 
                      onRegenerate={msg.role === "assistant" ? handleRegenerateLast : undefined} 
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Thinking / Streaming loader indicator */}
            {status === "THINKING" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-6 px-4 md:px-6 py-6 items-center"
              >
                <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 select-none">
                  <SageCoreVisual status="THINKING" size={48} accentColor="#00f2fe" outerColor="#7f00ff" secondaryColor="#00ffcc" />
                </div>
                <div className="flex-1 space-y-3 pt-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono font-semibold tracking-wider">
                    <span>AURA COGNITIVE SYNAPSE STREAM ACTIVE</span>
                    <span className="flex gap-0.5">
                      <span className="w-1 h-1 bg-[#00f2fe] rounded-full animate-bounce delay-100" />
                      <span className="w-1 h-1 bg-[#00f2fe] rounded-full animate-bounce delay-200" />
                      <span className="w-1 h-1 bg-[#00f2fe] rounded-full animate-bounce delay-300" />
                    </span>
                  </div>
                  
                  {/* Aura high-voltage neon loading bar */}
                  <div className="w-full h-1 rounded-full overflow-hidden relative bg-slate-900/60">
                    <motion.div 
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 bg-gradient-to-r from-[#00f2fe] via-[#7f00ff] to-[#00ffcc] w-[40%] h-full rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={chatEndRef} />
          </div>
        </div>

        {/* CENTER BOTTOM CHAT INPUT CONTAINER */}
        <div className="absolute bottom-0 inset-x-0 p-4 md:p-6 bg-gradient-to-t from-[#131314] via-[#131314] to-transparent z-20">
          <div className="max-w-2xl mx-auto space-y-2">
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 bg-[#1e1e20] hover:bg-[#282a2c] rounded-full border border-transparent focus-within:border-[#3c4043] pl-5 pr-2 py-1.5 group transition-all duration-300 shadow-md relative"
            >
              {/* Optional mic/img decoration on left like original Gemini */}
              <button 
                type="button"
                className="p-2 text-slate-400 hover:text-slate-200 rounded-full cursor-not-allowed transition-all hidden sm:block"
                title="Google Docs integration"
              >
                <Plus size={16} />
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={status !== "IDLE"}
                placeholder={
                  status !== "IDLE" 
                    ? "Generating high-fidelity logical directives..." 
                    : "Enter a prompt here..."
                }
                className="flex-1 bg-transparent border-0 outline-none text-[15px] text-[#e3e3e3] placeholder:text-slate-500 disabled:opacity-50 py-1"
              />

              {/* Action utilities right */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  type="button"
                  className="p-2 text-slate-400 hover:text-slate-200 rounded-full cursor-not-allowed transition-all hidden sm:block"
                  title="Upload Image/Audio pipeline"
                >
                  <Image size={17} />
                </button>
                <button
                  type="button"
                  className="p-2 text-slate-400 hover:text-[#a8c7fa] rounded-full cursor-not-allowed transition-all hidden sm:block"
                  title="Speech synthesis dictation"
                >
                  <Mic size={17} />
                </button>

                <button
                  type="submit"
                  disabled={status !== "IDLE" || !inputMessage.trim()}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-20 cursor-pointer text-slate-900 bg-[#a8c7fa] hover:bg-[#90bbf5] flex-shrink-0 shadow-sm"
                >
                  <ArrowUp size={18} />
                </button>
              </div>
            </form>

            {/* Disclaimer disclaimer footer */}
            <div className="text-[11px] text-center text-slate-500 font-medium select-none px-4">
              Aura AI can make mistakes. Verify critical reasoning templates. Built under optimized modern heuristics.
            </div>

          </div>
        </div>
          </>
        )}

        {/* Auth Modal Portal */}
        <AuthModal 
          isOpen={authModalOpen} 
          onClose={() => setAuthModalOpen(false)} 
          onSignInSuccess={handleSignInSuccess} 
        />

      </main>

    </div>
  );
}
