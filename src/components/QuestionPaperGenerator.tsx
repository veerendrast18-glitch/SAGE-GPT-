import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, 
  Sparkles, 
  GraduationCap, 
  Clock, 
  ListChecks, 
  BookOpen, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  Lock, 
  Eye, 
  CheckCircle, 
  X, 
  HelpCircle, 
  ChevronRight, 
  RotateCcw,
  BookMarked
} from "lucide-react";

interface Question {
  questionNumber: string;
  questionText: string;
  marks: number;
  questionType: "MCQ" | "SHORT" | "LONG" | string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

interface ExamSection {
  sectionTitle: string;
  sectionDescription: string;
  questions: Question[];
}

interface ExamPaper {
  title: string;
  subject: string;
  gradeClass: string;
  duration: string;
  totalMarks: string;
  instructions: string[];
  sections: ExamSection[];
}

export default function QuestionPaperGenerator() {
  // Preset Subjects
  const SUBJECTS = [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English Literature",
    "History & Civics",
    "Economics"
  ];

  const DIFFICULTIES = [
    "Easy (Conceptual Recall)",
    "Medium (Balanced Application)",
    "Hard (Critical Thinking & Analysis)",
    "Mixed (30% Easy, 50% Medium, 20% Hard)"
  ];

  // Form State
  const [title, setTitle] = useState("Semester Final Examination");
  const [subject, setSubject] = useState("Computer Science");
  const [customSubject, setCustomSubject] = useState("");
  const [gradeClass, setGradeClass] = useState("Grade 11 / Advanced Placement");
  const [duration, setDuration] = useState("90 Minutes");
  const [totalMarks, setTotalMarks] = useState("80 Marks");
  const [difficulty, setDifficulty] = useState("Mixed (30% Easy, 50% Medium, 20% Hard)");
  const [mcqCount, setMcqCount] = useState(5);
  const [shortCount, setShortCount] = useState(3);
  const [longCount, setLongCount] = useState(2);
  const [topics, setTopics] = useState("Data structures (arrays, trees, stack, queue), time complexity notation (Big-O), search algorithms, and basic recursions.");
  const [guidelines, setGuidelines] = useState("Design challenging questions that avoid simple direct search. Include real-world system design scenarios for descriptive questions.");

  // Generation Engine State
  const [generating, setGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paper, setPaper] = useState<ExamPaper | null>(null);

  // App UI State
  const [viewMode, setViewMode] = useState<"student" | "teacher">("student");
  const [paperTheme, setPaperTheme] = useState<"classic" | "cyber">("cyber");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [gradingChecked, setGradingChecked] = useState(false);
  const [copied, setCopied] = useState(false);

  // Triggering paper generation via Node backend API
  const handleGeneratePaper = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setErrorMessage(null);
    setGradingChecked(false);
    setSelectedAnswers({});

    try {
      const response = await fetch("/api/generate-paper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subject: subject === "Custom" ? customSubject : subject,
          gradeClass,
          duration,
          totalMarks,
          difficulty,
          mcqCount,
          shortCount,
          longCount,
          topics,
          guidelines
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Evaluation Core disconnected.");
      }

      const data = await response.json();
      setPaper(data);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Synthesizer stream aborted unexpectedly.");
    } finally {
      setGenerating(false);
    }
  };

  // Reset paper form presets
  const handleResetFormPreset = () => {
    setTitle("Semester Final Examination");
    setSubject("Computer Science");
    setCustomSubject("");
    setGradeClass("Grade 11 / Advanced Placement");
    setDuration("90 Minutes");
    setTotalMarks("80 Marks");
    setDifficulty("Mixed (30% Easy, 50% Medium, 20% Hard)");
    setMcqCount(5);
    setShortCount(3);
    setLongCount(2);
    setTopics("Data structures (arrays, trees, stack, queue), time complexity notation (Big-O), search algorithms, and basic recursions.");
    setGuidelines("Design challenging questions that avoid simple direct search. Include real-world system design scenarios for descriptive questions.");
  };

  // Copy Paper text to Clipboard in formatted readable text
  const handleCopyToClipboard = () => {
    if (!paper) return;

    let text = `=========================================\n`;
    text += `${paper.title.toUpperCase()}\n`;
    text += `Subject: ${paper.subject} | Grade level: ${paper.gradeClass}\n`;
    text += `Duration: ${paper.duration} | Max score: ${paper.totalMarks}\n`;
    text += `=========================================\n\n`;
    
    text += `GENERAL INSTRUCTIONS:\n`;
    paper.instructions.forEach((ins, idx) => {
      text += `${idx + 1}. ${ins}\n`;
    });
    text += `\n`;

    paper.sections.forEach((sec) => {
      text += `-----------------------------------------\n`;
      text += `${sec.sectionTitle.toUpperCase()}\n`;
      if (sec.sectionDescription) {
        text += `Description: ${sec.sectionDescription}\n`;
      }
      text += `-----------------------------------------\n\n`;

      sec.questions.forEach((q) => {
        text += `[Q${q.questionNumber}] (${q.marks} Marks)\n`;
        text += `${q.questionText}\n`;
        if (q.options && q.options.length > 0) {
          q.options.forEach((opt) => {
            text += `   ${opt}\n`;
          });
        }
        text += `\n`;
        if (viewMode === "teacher") {
          text += `👉 Correct Answer: ${q.correctAnswer}\n`;
          text += `👉 Marking guide/explanation:\n${q.explanation}\n\n`;
        }
      });
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Downloading Exam JSON
  const handleDownloadJson = () => {
    if (!paper) return;
    const blob = new Blob([JSON.stringify(paper, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${paper.subject.toLowerCase().replace(/\s+/g, "_")}_exam_paper.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Standard Printer Handler
  const handlePrintPaper = () => {
    window.print();
  };

  // MCQ answer selection
  const handleSelectOption = (questionNum: string, optionLetter: string) => {
    if (gradingChecked) return; // locked after check
    setSelectedAnswers(prev => ({
      ...prev,
      [questionNum]: optionLetter
    }));
  };

  // Render Grade percentage
  const calculateMcqScore = () => {
    if (!paper) return { correct: 0, total: 0 };
    let correct = 0;
    let total = 0;

    paper.sections.forEach((sec) => {
      sec.questions.forEach((q) => {
        if (q.questionType === "MCQ") {
          total++;
          const selected = selectedAnswers[q.questionNumber]; // Letter code e.g. "A"
          if (selected) {
            // Check if selected letter matches correctAnswer (look at first character e.g. "A)" or just "A" in correct answer)
            const ansKey = q.correctAnswer.trim().toUpperCase();
            if (ansKey.startsWith(selected) || ansKey.includes(`(${selected})`) || ansKey.includes(`${selected})`)) {
              correct++;
            }
          }
        }
      });
    });

    return { correct, total };
  };

  const mcqStats = calculateMcqScore();

  return (
    <div className="flex flex-col flex-1 h-full overflow-y-auto pb-12 select-text px-4 md:px-8 pt-4 md:pt-6">
      
      {/* Header Banner Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e1e20] pb-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7f00ff] to-[#00f2fe] flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(127,0,255,0.35)]">
            <GraduationCap size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold font-sans tracking-tight text-white">Quantum Curriculum Engine</h1>
              <span className="text-[10px] bg-gradient-to-r from-[#00f2fe] to-[#cf64ff] text-slate-950 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">Aura v2.5</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Generate perfectly balanced, high-fidelity academic question papers with instant marking rubrics.</p>
          </div>
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={handleResetFormPreset}
            className="px-3.5 py-1.5 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-mono font-bold text-slate-400 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            title="Reset parameters to defaults"
          >
            <RotateCcw size={13} />
            Reset Inputs
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-950/40 border border-red-900/55 rounded-xl flex items-start gap-3.5 shadow-lg max-w-4xl animate-bounce">
          <div className="w-8 h-8 rounded-full bg-red-950 flex items-center justify-center text-red-400 font-bold flex-shrink-0">
            <X size={16} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-red-200">Neural Gateway Handshake Interrupted</h4>
            <p className="text-xs text-red-300/80 mt-1">{errorMessage}</p>
            <p className="text-[10px] text-red-400 font-mono mt-2">Check your GEMINI_API_KEY inside Settings &gt; Secrets in AI Studio.</p>
          </div>
        </div>
      )}

      {/* Main Dual Grid Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side Parameter Console - Inputs Form (Col 5) */}
        <div className="lg:col-span-5 bg-[#1a1a1c]/90 border border-slate-900 rounded-2xl p-6 shadow-xl space-y-6 select-none relative overflow-hidden backdrop-blur-md">
          {/* subtle ambient color */}
          <div className="absolute right-0 top-0 w-24 h-24 bg-[#00f2fe]/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute left-0 bottom-0 w-24 h-24 bg-[#7f00ff]/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <BookMarked size={16} className="text-[#00f2fe]" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[#00f2fe]">Syllabus & Blueprint Matrix</h2>
          </div>

          <form onSubmit={handleGeneratePaper} className="space-y-5">
            {/* Exam Title */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Exam Title / Header</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Midterm General Examination"
                className="w-full bg-[#131314] border border-slate-800 focus:border-[#00f2fe] hover:border-slate-700 outline-none rounded-xl text-slate-200 px-4 py-2.5 text-xs transition-all focus:ring-1 focus:ring-[#00f2fe]/20"
              />
            </div>

            {/* Subject Choices Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Academic Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#131416] border border-slate-800 focus:border-[#00f2fe] outline-none rounded-xl text-slate-200 px-3 py-2.5 text-xs transition-all"
                >
                  {SUBJECTS.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                  <option value="Custom">Custom Choice...</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Grade / Class Level</label>
                <input
                  type="text"
                  value={gradeClass}
                  onChange={(e) => setGradeClass(e.target.value)}
                  required
                  placeholder="e.g. Year 2 AP Computer Science"
                  className="w-full bg-[#131314] border border-slate-800 focus:border-[#00f2fe] hover:border-slate-700 outline-none rounded-xl text-slate-200 px-4 py-2.5 text-xs transition-all"
                />
              </div>
            </div>

            {subject === "Custom" && (
              <div className="space-y-2 animate-fadeIn">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#cf64ff] block font-bold">Custom Subject Name</label>
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  required={subject === "Custom"}
                  placeholder="Type specialized subject name"
                  className="w-full bg-[#131314] border border-pink-900 focus:border-[#cf64ff] outline-none rounded-xl text-slate-200 px-4 py-2.5 text-xs transition-all font-semibold"
                />
              </div>
            )}

            {/* Scale Parameters */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Exam Duration</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                  placeholder="90 Minutes"
                  className="w-full bg-[#131314] border border-slate-800 focus:border-[#00f2fe] outline-none rounded-xl text-slate-200 px-4 py-2.5 text-xs transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Total Max Score</label>
                <input
                  type="text"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                  required
                  placeholder="100 Marks"
                  className="w-full bg-[#131314] border border-slate-800 focus:border-[#00f2fe] outline-none rounded-xl text-slate-200 px-4 py-2.5 text-xs transition-all"
                />
              </div>
            </div>

            {/* Blueprint Distribution sliders & counter inputs */}
            <div className="bg-[#131315] border border-slate-900/85 p-4 rounded-xl space-y-4">
              <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block border-b border-slate-900 pb-1.5">Blueprint Section counts</label>
              
              <div className="grid grid-cols-3 gap-3 md:gap-4 text-center">
                <div className="bg-[#1a1a1c] p-2.5 rounded-lg border border-slate-900">
                  <span className="text-[10px] font-mono text-[#00f2fe] block mb-1">Section A: MCQs</span>
                  <div className="flex items-center justify-center gap-1.5">
                    <button type="button" onClick={() => setMcqCount(Math.max(0, mcqCount - 1))} className="w-5 h-5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs flex items-center justify-center cursor-pointer">-</button>
                    <span className="text-xs font-bold text-white w-6 block">{mcqCount}</span>
                    <button type="button" onClick={() => setMcqCount(Math.min(15, mcqCount + 1))} className="w-5 h-5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs flex items-center justify-center cursor-pointer">+</button>
                  </div>
                  <span className="text-[9px] text-slate-500 block mt-1">1 Mark each</span>
                </div>

                <div className="bg-[#1a1a1c] p-2.5 rounded-lg border border-slate-900">
                  <span className="text-[10px] font-mono text-[#00ffcc] block mb-1">Section B: Short</span>
                  <div className="flex items-center justify-center gap-1.5">
                    <button type="button" onClick={() => setShortCount(Math.max(0, shortCount - 1))} className="w-5 h-5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs flex items-center justify-center cursor-pointer">-</button>
                    <span className="text-xs font-bold text-white w-6 block">{shortCount}</span>
                    <button type="button" onClick={() => setShortCount(Math.min(10, shortCount + 1))} className="w-5 h-5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs flex items-center justify-center cursor-pointer">+</button>
                  </div>
                  <span className="text-[9px] text-slate-500 block mt-1">3-5 Mks each</span>
                </div>

                <div className="bg-[#1a1a1c] p-2.5 rounded-lg border border-slate-900">
                  <span className="text-[10px] font-mono text-[#cf64ff] block mb-1">Section C: Long</span>
                  <div className="flex items-center justify-center gap-1.5">
                    <button type="button" onClick={() => setLongCount(Math.max(0, longCount - 1))} className="w-5 h-5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs flex items-center justify-center cursor-pointer">-</button>
                    <span className="text-xs font-bold text-white w-6 block">{longCount}</span>
                    <button type="button" onClick={() => setLongCount(Math.min(8, longCount + 1))} className="w-5 h-5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs flex items-center justify-center cursor-pointer">+</button>
                  </div>
                  <span className="text-[9px] text-slate-500 block mt-1">8-10 Mks each</span>
                </div>
              </div>

              {mcqCount + shortCount + longCount === 0 && (
                <p className="text-[10px] text-amber-400 font-mono text-center">Warning: Configure at least 1 section question count!</p>
              )}
            </div>

            {/* Difficulty Mix preset */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Difficulty Profile</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-[#131416] border border-slate-800 focus:border-[#00f2fe] outline-none rounded-xl text-slate-200 px-3 py-2.5 text-xs transition-all"
              >
                {DIFFICULTIES.map((df) => (
                  <option key={df} value={df}>{df}</option>
                ))}
              </select>
            </div>

            {/* Syllabus / Chapters Topics Description */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Syllabus Chapters / Evaluation Topics</label>
              <textarea
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
                required
                rows={3}
                placeholder="List topics, sections, skills to cover, or specific chapters..."
                className="w-full bg-[#131314] border border-slate-800 focus:border-[#00f2fe] hover:border-slate-700 outline-none rounded-xl text-slate-200 px-4 py-2.5 text-xs transition-all font-sans resize-y"
              />
            </div>

            {/* System Special Constraints / Guidelines */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Special Directives & Formatting Guidelines</label>
              <textarea
                value={guidelines}
                onChange={(e) => setGuidelines(e.target.value)}
                rows={2}
                placeholder="e.g. Include programming code traces, diagrams templates, or standard citations..."
                className="w-full bg-[#131314] border border-slate-800 focus:border-[#00f2fe] hover:border-slate-700 outline-none rounded-xl text-slate-200 px-4 py-2.5 text-xs transition-all font-sans resize-y"
              />
            </div>

            {/* Neural Generate Button */}
            <button
              type="submit"
              disabled={generating || mcqCount + shortCount + longCount === 0}
              className="w-full bg-gradient-to-r from-[#7f00ff] via-[#4f46e5] to-[#00f2fe] py-3.5 hover:brightness-110 active:scale-[0.98] rounded-xl text-sm font-bold tracking-wider text-slate-950 uppercase transition-all flex items-center justify-center gap-2 relative disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-[0_4px_25px_rgba(127,0,255,0.25)] select-none cursor-pointer"
            >
              {generating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Configuring Cognitive Matrices...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Synthesize Exam Paper</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side Visual Exam Board - Printable Display Paper (Col 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          <AnimatePresence mode="wait">
            {!paper ? (
              // Empty Layout Display
              <motion.div
                key="empty-exam"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-[#1a1a1c]/40 border border-dashed border-slate-800/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center h-[580px]"
              >
                <div className="p-4 bg-slate-900/60 rounded-full border border-slate-800 text-slate-500 mb-4 animate-bounce">
                  <FileText size={32} />
                </div>
                <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-slate-400">Exam Blueprint Board</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed">
                  Configure your subject syllabus and section weights on the left. Transmit neural request to assemble a customized question paper template.
                </p>
                <div className="flex gap-2.5 mt-6">
                  <div className="h-2 w-2 rounded-full bg-[#00f2fe] opacity-40 animate-ping" />
                  <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Aura Engine Idle link open</span>
                </div>
              </motion.div>
            ) : (
              // Active Generated Exam Paper Paper Layout Frame
              <motion.div
                key="active-exam-paper"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                {/* Control Action Ribbon Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1e1e20] p-3 rounded-xl border border-slate-900">
                  
                  {/* View Toggles */}
                  <div className="flex bg-[#131314] rounded-lg p-1 border border-slate-950/40 font-mono text-[11px] font-bold select-none">
                    <button
                      onClick={() => setViewMode("student")}
                      className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 cursor-pointer ${
                        viewMode === "student"
                          ? "bg-gradient-to-r from-[#004a77] to-[#00f2fe]/20 text-[#00f2fe]"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      <Eye size={12} />
                      Student Mode
                    </button>
                    <button
                      onClick={() => setViewMode("teacher")}
                      className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 cursor-pointer ${
                        viewMode === "teacher"
                          ? "bg-gradient-to-r from-[#5b00b7]/40 to-[#cf64ff]/20 text-[#cf64ff]"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      <Lock size={12} />
                      Teacher mode (Answers)
                    </button>
                  </div>

                  {/* Theme Switcher classic print vs dark cyber */}
                  <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500 border-l border-r border-slate-900 px-3 py-1">
                    <span>Theme:</span>
                    <button
                      onClick={() => setPaperTheme("cyber")}
                      className={`px-2 py-0.5 rounded ${paperTheme === "cyber" ? "bg-slate-900 text-[#00f2fe] font-bold" : "hover:text-slate-300"}`}
                    >
                      Synth
                    </button>
                    <button
                      onClick={() => setPaperTheme("classic")}
                      className={`px-2 py-0.5 rounded ${paperTheme === "classic" ? "bg-white text-slate-950 font-bold" : "hover:text-slate-300"}`}
                    >
                      Academic
                    </button>
                  </div>

                  {/* Operational Print/Download Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyToClipboard}
                      className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg hover:text-white transition-all cursor-pointer"
                      title="Copy plaintext to Clipboard"
                    >
                      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    </button>

                    <button
                      onClick={handleDownloadJson}
                      className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg hover:text-white transition-all cursor-pointer"
                      title="Download clean Exam JSON"
                    >
                      <Download size={14} />
                    </button>

                    <button
                      onClick={handlePrintPaper}
                      className="p-2 bg-slate-800/80 hover:bg-slate-700 text-[#00f2fe] border border-[#00f2fe]/20 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                      title="Direct PDF Print layout"
                    >
                      <Printer size={14} />
                      <span className="text-[11px] font-sans font-semibold hidden sm:inline">Print Paper</span>
                    </button>
                  </div>
                </div>

                {/* Score panel inside Student View */}
                {viewMode === "student" && mcqStats.total > 0 && (
                  <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-xl flex items-center justify-between gap-4 select-none animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-[#004a77]/20 border border-[#00f2fe]/20 text-[#00f2fe] rounded-lg">
                        <ListChecks size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">Interactive Student Response Link</h4>
                        <p className="text-[10px] text-slate-500">Attempt Multiple Choice Questions below to check score.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {gradingChecked ? (
                        <div className="text-right">
                          <span className="text-xs font-semibold text-slate-400 block">MCQ Evaluation:</span>
                          <span className="text-sm font-bold bg-[#131114] border border-slate-800 text-[#00ffcc] py-0.5 px-3 rounded-full font-mono">
                            {mcqStats.correct} / {mcqStats.total} Correct
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setGradingChecked(true)}
                          disabled={Object.keys(selectedAnswers).length === 0}
                          className="px-4 py-2 bg-[#00ffcc] hover:brightness-110 text-slate-950 font-bold rounded-lg text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed select-none cursor-pointer"
                        >
                          Evaluate Response
                        </button>
                      )}
                      {gradingChecked && (
                        <button
                          onClick={() => {
                            setGradingChecked(false);
                            setSelectedAnswers({});
                          }}
                          className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-lg hover:text-white cursor-pointer"
                          title="Reset MCQ Selection"
                        >
                          <RotateCcw size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Print Paper Sandbox (Hidden or high contrast depending on paperTheme) */}
                <div 
                  id="printable-academic-exam-canvas"
                  className={`p-6 sm:p-10 rounded-2xl shadow-xl transition-all relative overflow-hidden font-sans border ${
                    paperTheme === "classic" 
                      ? "bg-white text-[#131314] border-slate-200" 
                      : "bg-[#161618] text-[#e3e3e3] border-slate-900"
                  }`}
                >
                  {/* Print only Header metadata info blocks */}
                  <div className="border-b-4 border-slate-950 pb-5 mb-6 text-center select-text">
                    <div className="text-[10px] font-mono font-bold tracking-widest uppercase mb-1 opacity-60">Aura AI Evaluation Services</div>
                    <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight leading-none mb-2 font-serif text-slate-950">
                      {paper.title}
                    </h1>
                    
                    <div className="w-24 h-1 bg-slate-950 mx-auto my-3" />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-semibold text-slate-800/90 mt-2">
                      <div className="bg-slate-100/90 p-2 rounded">
                        <span className="text-[9px] text-slate-500 block uppercase tracking-wider font-mono">Subject</span>
                        <span className="font-serif font-bold">{paper.subject}</span>
                      </div>
                      <div className="bg-slate-100/90 p-2 rounded">
                        <span className="text-[9px] text-slate-500 block uppercase tracking-wider font-mono">Class / Grade</span>
                        <span>{paper.gradeClass}</span>
                      </div>
                      <div className="bg-slate-100/90 p-2 rounded">
                        <span className="text-[9px] text-slate-500 block uppercase tracking-wider font-mono">Time Allowed</span>
                        <span>{paper.duration}</span>
                      </div>
                      <div className="bg-slate-100/90 p-2 rounded">
                        <span className="text-[9px] text-slate-500 block uppercase tracking-wider font-mono">Max Marks</span>
                        <span className="font-bold">{paper.totalMarks}</span>
                      </div>
                    </div>
                  </div>

                  {/* General Instructions Block */}
                  <div className={`p-4 rounded-xl border mb-8 ${
                    paperTheme === "classic" ? "bg-slate-50 border-slate-200" : "bg-[#1e1e20] border-slate-800/80"
                  }`}>
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#00f2fe] mb-2 flex items-center gap-1.5 border-b border-slate-800/40 pb-1">
                      <HelpCircle size={12} />
                      Instructions to Candidates
                    </h3>
                    <ul className="list-decimal pl-4.5 text-xs space-y-1.5 opacity-85 select-text">
                      {paper.instructions.map((ins, index) => (
                        <li key={index}>{ins}</li>
                      ))}
                      <li>Write all equations, calculations, code snippets, or rationale clearly.</li>
                    </ul>
                  </div>

                  {/* Section questions iteration */}
                  <div className="space-y-10 select-text">
                    {paper.sections.map((section, sIndex) => (
                      <div key={sIndex} className="space-y-6">
                        
                        {/* Section Header */}
                        <div className="border-b-2 border-slate-400 pb-1.5">
                          <h2 className="text-sm font-mono font-bold tracking-widest uppercase">
                            {section.sectionTitle}
                          </h2>
                          {section.sectionDescription && (
                            <p className="text-[11px] italic opacity-75 mt-0.5">
                              {section.sectionDescription}
                            </p>
                          )}
                        </div>

                        {/* Questions list */}
                        <div className="space-y-6 divide-y divide-slate-100/10">
                          {section.questions.map((q, qIndex) => (
                            <div key={qIndex} className={`pt-5 space-y-3.5 leading-relaxed`}>
                              
                              {/* Question number, text, marks header */}
                              <div className="flex items-start justify-between gap-4 font-serif">
                                <p className="text-sm font-semibold flex-1">
                                  <span className="font-mono font-bold mr-2 text-slate-500">[Q{q.questionNumber}]</span>
                                  {q.questionText}
                                </p>
                                <span className={`text-[10px] font-mono border font-bold px-2 py-0.5 rounded uppercase tracking-wider flex-shrink-0 ${
                                  paperTheme === "classic" ? "bg-slate-100 border-slate-200 text-slate-800" : "bg-[#1c1c1f] border-slate-800"
                                }`}>
                                  {q.marks} Marks
                                </span>
                              </div>

                              {/* MCQ Options options rendering block */}
                              {q.questionType === "MCQ" && q.options && q.options.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6 font-sans">
                                  {q.options.map((option, optIdx) => {
                                    // Extract option capital letter code: e.g., "A"
                                    const letterCode = option.trim().charAt(0);
                                    const isSelected = selectedAnswers[q.questionNumber] === letterCode;
                                    
                                    // Highlight if checked score
                                    const isCorrect = q.correctAnswer.trim().toUpperCase().startsWith(letterCode);
                                    let btnStyle = "";
                                    
                                    if (gradingChecked) {
                                      if (isCorrect) {
                                        btnStyle = "bg-green-500/20 border-green-500 text-green-400 font-semibold";
                                      } else if (isSelected) {
                                        btnStyle = "bg-red-500/20 border-red-500 text-red-400 font-semibold";
                                      } else {
                                        btnStyle = "opacity-40";
                                      }
                                    } else {
                                      btnStyle = isSelected
                                        ? "bg-[#00f2fe]/10 border-[#00f2fe] text-[#00f2fe] font-semibold"
                                        : "hover:bg-slate-100/5 hover:border-slate-400";
                                    }

                                    return (
                                      <button
                                        key={optIdx}
                                        type="button"
                                        disabled={gradingChecked}
                                        onClick={() => handleSelectOption(q.questionNumber, letterCode)}
                                        className={`p-3 border text-left rounded-xl text-xs transition-all flex items-center justify-between ${
                                          paperTheme === "classic" 
                                            ? "border-slate-200 hover:bg-slate-50" 
                                            : "border-slate-800"
                                        } ${btnStyle} cursor-pointer`}
                                      >
                                        <span>{option}</span>
                                        {gradingChecked && isCorrect && <CheckCircle size={14} className="text-green-400" />}
                                        {gradingChecked && isSelected && !isCorrect && <X size={14} className="text-red-400" />}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}

                              {/* Teacher Mode Solution sheet Reveal */}
                              {viewMode === "teacher" && (
                                <div className="mt-4 p-4.5 bg-[#4f46e5]/10 border border-[#4f46e5]/30 rounded-xl space-y-2 animate-fadeIn font-sans shadow-inner">
                                  <div className="flex items-center gap-1.5 text-xs text-[#cf64ff] font-sans font-bold uppercase tracking-wide">
                                    <CheckCircle size={13} />
                                    <span>Primary Answer Key Matrix</span>
                                  </div>
                                  <div className="text-xs bg-[#131114] p-3 rounded border border-[#4f46e5]/20 font-serif whitespace-pre-line text-slate-300">
                                    {q.correctAnswer}
                                  </div>

                                  <div className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500 block pt-1">Step-by-step marking rubric & solution rationale:</div>
                                  <p className="text-xs italic text-slate-400 leading-relaxed font-sans mt-1">
                                    {q.explanation}
                                  </p>
                                </div>
                              )}

                            </div>
                          ))}
                        </div>

                      </div>
                    ))}
                  </div>

                  {/* Elegant footer copyright print stamp */}
                  <div className="border-t border-slate-300/40 pt-6 mt-12 text-center text-[10px] font-mono text-slate-500 flex justify-between uppercase tracking-widest font-bold">
                    <span>Generated By AURA curriculum AI</span>
                    <span>System ID: AQ-7901</span>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

      {/* Styled Print Rules in pure CSS so side panels are omitted natively in browser print mode */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-academic-exam-canvas, #printable-academic-exam-canvas * {
            visibility: visible;
          }
          #printable-academic-exam-canvas {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
