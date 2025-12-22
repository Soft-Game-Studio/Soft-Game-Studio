import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  X,
  Trash2,
  Send,
  Sparkles
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { findMatch } from "./utils/matcher";
import { resolveData } from "./utils/resolver";
import { formatResponse } from "./utils/formatter";

/* ================= MENU ================= */
const MENU_OPTIONS = [
  { label: "👨‍💼 Founder", value: "Who is the founder?" },
  { label: "🚀 Services", value: "What services do you offer?" },
  { label: "📁 Projects", value: "Show me your projects" },
  { label: "📞 Contact", value: "Contact details" },
  { label: "📚 Education", value: "Educational resources" },
  { label: "🖥️ Exam Platform", value: "Tell me about exam platform" },
];

/* ================= COMPONENT ================= */
const SGSChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text:
        "Hello! 👋 I’m the Soft Game Studio AI assistant.\nHow can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ================= HELPERS ================= */
  const addMessage = (text, sender) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender, text },
    ]);
  };

  const handleSend = async (rawText) => {
    if (!rawText || loading) return;

    addMessage(rawText, "user");
    setLoading(true);

    // Simulate processing time
    setTimeout(() => {
      try {
        const match = findMatch(rawText);
        let responseText = "";

        if (match) {
          const data = resolveData(match.source);
          responseText = formatResponse(data, match.intent);
        } else {
          responseText = "I'm not sure I understand. Could you try asking in a different way? You can also check the topics below.";
        }

        addMessage(responseText, "bot");
      } catch (error) {
        console.error("Chat Error:", error);
        addMessage("⚠️ I encountered an error. Please try again later.", "bot");
      } finally {
        setLoading(false);
      }
    }, 600);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
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
                   bg-gradient-to-br from-indigo-600 to-violet-600 
                   text-white shadow-2xl flex items-center justify-center 
                   hover:scale-105 transition-all border border-white/20"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-[400px] h-[600px] max-h-[80vh]
                     bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden
                     border border-gray-100 font-sans animation-fade-in-up"
        >
          {/* Header */}
          <div
            className="px-5 py-4 bg-gradient-to-r from-indigo-600 to-violet-600
                       text-white flex items-center justify-between shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                <Sparkles size={18} className="text-yellow-300" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">
                  Soft Game Studio
                </h3>
                <div className="flex items-center gap-1.5 text-[10px] opacity-90 font-medium tracking-wider uppercase mt-0.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  AI Assistant
                </div>
              </div>
            </div>

            <button
              onClick={clearChat}
              title="Clear chat"
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 px-4 py-4 overflow-y-auto bg-slate-50 scroll-smooth">
            <div className="space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === "user"
                      ? "justify-end"
                      : "justify-start"
                    }`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[85%] shadow-sm ${m.sender === "user"
                        ? "bg-indigo-600 text-white rounded-br-sm"
                        : "bg-white border border-gray-100 text-gray-700 rounded-bl-sm"
                      }`}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ node, ...props }) => <p className="mb-1 last:mb-0" {...props} />,
                        ul: ({ node, ...props }) => <ul className="pl-4 mb-2 space-y-1" {...props} />,
                        li: ({ node, ...props }) => <li className="list-disc text-inherit" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />
                      }}
                    >
                      {m.text}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex gap-1.5 items-center">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={endRef} />
            </div>

            {/* In-chat Menu Suggestion (only if few messages) */}
            {messages.length < 3 && !loading && (
              <div className="mt-6 mb-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
                  Suggested Topics
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {MENU_OPTIONS.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => handleSend(opt.value)}
                      className="text-xs text-left px-3 py-2.5 rounded-xl border border-gray-200
                                 bg-white hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700
                                 transition-colors shadow-sm text-gray-600 font-medium"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <form onSubmit={onSubmit} className="relative flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="w-full pl-4 pr-12 py-3 bg-gray-50 border-transparent 
                           text-gray-700 placeholder-gray-400 text-sm rounded-xl
                           focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 
                           transition-all outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="absolute right-2 p-1.5 bg-indigo-600 text-white rounded-lg 
                           hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors shadow-md flex items-center justify-center"
              >
                <Send size={16} />
              </button>
            </form>
            <div className="text-center mt-2">
              <p className="text-[10px] text-gray-400">
                Powered by Soft Game Studio AI
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SGSChatWidget;
