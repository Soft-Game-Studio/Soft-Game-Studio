import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  Send,
  X,
  Wifi,
  WifiOff,
  Trash2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


/* ================= CONFIG ================= */
const API_BASE = "https://sgs-chat-bot-491884292047.asia-south2.run.app";

/* ================= SESSION ================= */
const getSessionId = () => {
  let id = localStorage.getItem("sgs_chat_session_id");
  if (!id) {
    id = `session_${Date.now()}`;
    localStorage.setItem("sgs_chat_session_id", id);
  }
  return id;
};

/* ================= INTENT NORMALIZER ================= */
const normalizeMessage = (text) => {
  const t = text.toLowerCase().trim();

  const map = {
    founder: ["founder", "founders", "ceo", "owner"],
    contact: ["contact", "contact details", "email", "phone"],
    services: ["services", "service", "offer"],
    projects: ["projects", "portfolio", "work"],
    education: ["education", "courses", "learning"],
    exam: ["exam", "test", "assessment"],
    greeting: ["hi", "hello", "hey"],
    farewell: ["bye", "goodbye"],
    gratitude: ["thanks", "thank you"],
  };

  for (const [intent, words] of Object.entries(map)) {
    if (words.some((w) => t.includes(w))) return intent;
  }

  return text;
};

const INTENT_TO_QUESTION = {
  founder: "Who is founder and co-founder of Soft Game Studio?",
  services: "What services does Soft Game Studio offer?",
  projects: "What projects has Soft Game Studio developed?",
  contact: "What are Soft Game Studio's contact details?",
  education: "What educational resources does Soft Game Studio provide?",
  exam: "What is the SGS Exam Platform?"
};


/* ================= API ================= */
const sendMessageToBot = async (message, sessionId) => {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sessionId }),
  });
  return res.json();
};

/* ================= MENU ================= */
const MENU_OPTIONS = [
  { label: "👨‍💼 Founder", value: "founder" },
  { label: "🚀 Services", value: "services" },
  { label: "📁 Projects", value: "projects" },
  { label: "📞 Contact", value: "contact" },
  { label: "📚 Education", value: "education" },
  { label: "🖥️ Exam Platform", value: "exam" },
];

/* ================= COMPONENT ================= */
const SGSChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text:
        "Hello 👋 I’m the Soft Game Studio assistant.\nPlease choose an option below or type your question.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("connected");

  const sessionId = useRef(getSessionId());
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= HELPERS ================= */
  const addMessage = (text, sender) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender, text },
    ]);
  };

  const handleSend = async (rawText) => {
  if (!rawText || loading) return;

  const normalized = normalizeMessage(rawText);

  // 🔥 CRITICAL FIX
  const finalMessage =
    INTENT_TO_QUESTION[normalized] || rawText;

  addMessage(rawText, "user");
  setLoading(true);

  try {
    const res = await sendMessageToBot(
      finalMessage,
      sessionId.current
    );

    addMessage(
      res?.content ||
        "I'm not sure about that. Please try another option.",
      "bot"
    );
  } catch {
    addMessage("⚠️ Server not reachable.", "bot");
  } finally {
    setLoading(false);
  }
};

  const onSubmit = (e) => {
    e.preventDefault();
    handleSend(input.trim());
    setInput("");
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: "bot",
        text: "Chat cleared. How can I help you now?",
      },
    ]);
  };

  /* ================= UI ================= */
  return (

  <>
    {/* Floating Chat Button */}
    <button
      onClick={() => setOpen(!open)}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full 
                 bg-gradient-to-br from-indigo-600 to-blue-600 
                 text-white shadow-2xl flex items-center justify-center 
                 hover:scale-105 transition-all"
    >
      {open ? <X size={22} /> : <MessageCircle size={22} />}
    </button>

    {open && (
      <div
        className="fixed bottom-24 right-6 z-50 w-[95vw] max-w-md h-[72vh]
                   bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden
                   border border-gray-200"
      >
        {/* Header */}
        <div
          className="px-5 py-4 bg-gradient-to-r from-indigo-600 to-blue-600
                     text-white flex items-center justify-between"
        >
          <div>
            <h3 className="font-semibold text-base">
              Soft Game Studio
            </h3>
            <div className="flex items-center gap-2 text-xs opacity-90 mt-0.5">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              <span>Online</span>
            </div>
          </div>

          <button
            onClick={clearChat}
            title="Clear chat"
            className="opacity-80 hover:opacity-100 transition"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 px-4 py-4 overflow-y-auto bg-gray-50 space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl text-sm leading-relaxed max-w-[85%] shadow-sm ${
                  m.sender === "user"
                    ? "bg-indigo-600 text-white rounded-br-md"
                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-md"
                }`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {m.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {/* MENU SECTION */}
          {!loading && (
            <div className="pt-5 mt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-3">
                Select an option to continue
              </p>

              <div className="grid grid-cols-2 gap-3">
                {MENU_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSend(opt.value)}
                    className="text-sm px-4 py-2.5 rounded-xl border
                               bg-white hover:bg-indigo-50 hover:border-indigo-300
                               transition shadow-sm text-gray-700"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* Footer (No Input – Menu Only) */}
        <div className="px-4 py-3 bg-gray-100 text-center text-xs text-gray-500">
          This assistant works via guided options only
        </div>
      </div>
    )}
  </>


  );
};

export default SGSChatWidget;
