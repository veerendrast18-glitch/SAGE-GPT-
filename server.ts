import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for VST GPT Generator Core
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, systemInstruction, mode } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages array" });
      }

      // Safe lazy check of configuration
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: "API key missing. Reference instructions in Setting secrets to provision." 
        });
      }

      const client = getAiClient();
      
      const contents = messages.map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

      // VST Instruction set based on custom Selected Mode
      const baseInstruction = "You are VST (Virtual Synthesis Technologies) GPT, a super-intelligent autonomous conversational reasoning core. Your output should be phrased elegantly, structured, mathematically clean, stylishly formatted in markdown with monospace elements, and direct. Avoid conversational filler or apologies. Always start your response with a concise technical summary or bullet points.";
      const modeInstruction = mode ? `\nActivate specialized matrix processing: ${mode}.` : "";
      const finalInstruction = `${baseInstruction} ${systemInstruction || ""} ${modeInstruction}`;

      const responseStream = await client.models.generateContentStream({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction: finalInstruction,
          temperature: 0.85,
        },
      });

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) {
          res.write(`data: ${JSON.stringify({ text })}\n\n`);
        }
      }
      res.write("data: [DONE]\n\n");
      res.end();

    } catch (e: any) {
      console.error("Gemini API Error in session flow:", e);
      res.status(500).json({ error: e.message || "An error occurred inside VST GPT Core" });
    }
  });

  // API Route for Question Paper Generation
  app.post("/api/generate-paper", async (req, res) => {
    try {
      const {
        title,
        subject,
        gradeClass,
        duration,
        totalMarks,
        difficulty,
        mcqCount,
        shortCount,
        longCount,
        topics,
        guidelines
      } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "API key missing. Reference instructions in Setting secrets to provision."
        });
      }

      const client = getAiClient();

      const prompt = `Generate a high-quality academic question paper based on the following configurations:
- Title/Header: ${title || "Standard Evaluation Examination"}
- Subject: ${subject || "General Science & Mathematics"}
- Grade/Class Level: ${gradeClass || "Grade 10"}
- Total Marks: ${totalMarks || "100 Marks"}
- Duration: ${duration || "2 Hours"}
- Difficulty Level: ${difficulty || "Medium (balanced Easy/Medium/Hard)"}
- Syllabus/Topics to cover: ${topics || "All standard chapters and structural concepts"}
- Question Distribution metrics:
  * Multiple Choice Questions (MCQ) Count: ${mcqCount || 0}
  * Short Answer Questions Count: ${shortCount || 0}
  * Long Answer / Descriptive Questions Count: ${longCount || 0}
- Specific guidelines/instructions for the system: ${guidelines || "Follow university academic guidelines and clarity."}

Make sure every single question is technically precise and elegant.
Each question MUST include:
1. questionNumber: A string starting with 1, 2, 3... or a clean sequence
2. questionText: Clear, descriptive text of the question
3. marks: Int representing the weight
4. questionType: Must be exact string "MCQ", "SHORT", or "LONG"
5. options: Array of 4 strings choice prefixes e.g. ["A) ...", "B) ..."] (only if MCQ, otherwise empty array)
6. correctAnswer: Correct choice letter + brief answer for MCQs, or core points and guidelines for SHORT/LONG
7. explanation: Step-by-step solution, rationale, or visual layout guideline for marking`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an elite academic curriculum developer and educator. Your objective is to engineer perfect, mathematically correct, grammatically impeccable exam papers. You MUST respond exclusively in the requested JSON structure.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              subject: { type: Type.STRING },
              gradeClass: { type: Type.STRING },
              duration: { type: Type.STRING },
              totalMarks: { type: Type.STRING },
              instructions: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              sections: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    sectionTitle: { type: Type.STRING },
                    sectionDescription: { type: Type.STRING },
                    questions: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          questionNumber: { type: Type.STRING },
                          questionText: { type: Type.STRING },
                          marks: { type: Type.INTEGER },
                          questionType: { type: Type.STRING },
                          options: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                          },
                          correctAnswer: { type: Type.STRING },
                          explanation: { type: Type.STRING }
                        },
                        required: ["questionNumber", "questionText", "marks", "questionType"]
                      }
                    }
                  },
                  required: ["sectionTitle", "questions"]
                }
              }
            },
            required: ["title", "subject", "duration", "totalMarks", "instructions", "sections"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response content generated from Gemini");
      }

      const paperData = JSON.parse(responseText.trim());
      res.json(paperData);

    } catch (e: any) {
      console.error("Error generating question paper:", e);
      res.status(500).json({ error: e.message || "Failed to generate question paper. Try checking your prompt options." });
    }
  });

  // Serve Frontend
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
    console.log(`VST GPT Engine running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start custom VST GPT engine server:", err);
});
