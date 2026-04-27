require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const OpenAI = require("openai");
const chatStore = require("./chatStore");

const app = express();
app.set("trust proxy", 1);
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// ─── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json({ limit: "10kb" }));

// Rate limiting: 30 messages per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: "Too many requests. Please slow down." },
});
app.use("/api/", limiter);
app.get("/", (req, res) => {
  res.send("TaxBot Backend is running 🚀");
});

// ─── System Prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a professional Tax Assistant chatbot specializing in the Indian tax system.

STRICT RULES:
1. ONLY answer questions related to: TAX, INCOME TAX, FINANCE, TAX FILING, ITR, GST, TDS, deductions, tax planning, and related Indian financial regulations.
2. If the user asks ANYTHING unrelated to taxes or finance, respond EXACTLY with: "I only assist with tax-related queries. Please ask me something about Indian taxes, ITR filing, deductions, or tax planning."
3. Always use Indian tax system context — Income Tax Act 1961, FY 2024-25 (AY 2025-26).
4. Use **bold** for key terms, section numbers, and important figures.
5. Format lists with bullet points for clarity.
6. Ask follow-up questions when user intent is unclear (e.g., ask about income range, employment type, age).
7. Proactively suggest legal tax-saving methods when relevant.
8. Reference correct sections (80C, 80D, 24b, 80CCD, etc.) and forms (ITR-1, ITR-2, Form 16, 26AS, etc.).
9. Always use ₹ symbol for Indian Rupee amounts.
10. Mention due dates, penalties, and compliance requirements when relevant.

KEY TAX INFORMATION TO KNOW:
- New Tax Regime slabs (FY 2024-25): 0% up to ₹3L, 5% ₹3-7L, 10% ₹7-10L, 15% ₹10-12L, 20% ₹12-15L, 30% above ₹15L
- Old Tax Regime: Standard deductions apply (80C ₹1.5L, 80D ₹25K, etc.)
- ITR filing deadline: July 31st (non-audit cases)
- Rebate u/s 87A: No tax if income ≤ ₹7L (new regime), ≤ ₹5L (old regime)
- Standard Deduction: ₹75,000 (new regime), ₹50,000 (old regime)
- New regime is DEFAULT from FY 2023-24 onwards

TONE: Professional, friendly, clear, and concise. Use simple language. Avoid jargon unless explaining it.`;

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "TaxBot India API is running" });
});

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    // Validate request
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Invalid request: messages array required" });
    }

    // Validate message structure
    for (const msg of messages) {
      if (!msg.role || !msg.content || !["user", "assistant"].includes(msg.role)) {
        return res.status(400).json({ error: "Invalid message format" });
      }
      if (typeof msg.content !== "string" || msg.content.trim().length === 0) {
        return res.status(400).json({ error: "Message content cannot be empty" });
      }
      if (msg.content.length > 2000) {
        return res.status(400).json({ error: "Message too long (max 2000 characters)" });
      }
    }

    // Keep only last 20 messages to manage context window
    const trimmedMessages = messages.slice(-20);

    // Call Groq API (OpenAI-compatible)
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...trimmedMessages],
      max_tokens: 1024,
    });

    const reply = response.choices[0]?.message?.content || "";

    res.json({
      message: reply,
      usage: {
        input_tokens: response.usage?.prompt_tokens || 0,
        output_tokens: response.usage?.completion_tokens || 0,
      },
    });
  } catch (error) {
    console.error("API Error:", error);

    if (error.status === 401) {
      return res.status(500).json({ error: "API authentication failed. Check your API key." });
    }
    if (error.status === 429) {
      return res.status(429).json({ error: "API rate limit reached. Please try again shortly." });
    }

    res.status(500).json({ error: "Internal server error. Please try again." });
  }
});

// ─── Chat History Routes ───────────────────────────────────────────────────────

// Save chat
app.post("/api/chat/save", (req, res) => {
  try {
    const { title, messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid request: messages array required" });
    }
    const chat = chatStore.saveChat(title, messages);
    res.json({ success: true, chat });
  } catch (error) {
    console.error("Save chat error:", error);
    res.status(500).json({ error: "Failed to save chat" });
  }
});

// Get all chats
app.get("/api/chat/history", (req, res) => {
  try {
    const chats = chatStore.getChats();
    res.json({ chats });
  } catch (error) {
    console.error("Get chats error:", error);
    res.status(500).json({ error: "Failed to get chat history" });
  }
});

// Get single chat
app.get("/api/chat/history/:id", (req, res) => {
  try {
    const chat = chatStore.getChatById(req.params.id);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    res.json({ chat });
  } catch (error) {
    console.error("Get chat error:", error);
    res.status(500).json({ error: "Failed to get chat" });
  }
});

// Delete chat
app.delete("/api/chat/history/:id", (req, res) => {
  try {
    const deleted = chatStore.deleteChat(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Chat not found" });
    }
    res.json({ success: true, message: "Chat deleted" });
  } catch (error) {
    console.error("Delete chat error:", error);
    res.status(500).json({ error: "Failed to delete chat" });
  }
});

// ─── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 TaxBot India Backend running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}\n`);
});

