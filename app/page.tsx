"use client";

import { useState, useRef, useEffect } from "react";
import ChatMessage from "@/components/ChatMessage";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<
    { isUser: boolean; message: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const chatBoxRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  async function askHR() {
    if (!question.trim() || isLoading) return;

    const userQuestion = question;
    setQuestion("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setIsLoading(true);

    setMessages((prev) => [...prev, { isUser: true, message: userQuestion }]);

    try {
      const res = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userQuestion, corporation_id: 1 }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { isUser: false, message: data.answer },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          isUser: false,
          message: "Sorry, I'm having trouble connecting. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askHR();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  return (
    <div className="h-screen flex bg-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-800 border-r border-slate-700 p-4 flex-shrink-0">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-lg">🤖</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">HR Assist</span>
        </div>

        <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-3 px-1">
          Quick Topics
        </p>
        <div className="flex flex-col gap-1">
          {[
            { icon: "🏖️", label: "Leave & Time Off" },
            { icon: "💊", label: "Health Benefits" },
            { icon: "📋", label: "Onboarding" },
            { icon: "📈", label: "Performance Review" },
            { icon: "💰", label: "Payroll & Salary" },
            { icon: "🏢", label: "Work Policies" },
          ].map(({ icon, label }) => (
            <button
              key={label}
              onClick={() => setQuestion(`Tell me about ${label.toLowerCase()}`)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-150 text-sm text-left"
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-slate-700">
          <p className="text-slate-500 text-xs text-center">
            Powered by AI · Confidential
          </p>
        </div>
      </aside>

      {/* Main chat area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-5 py-3.5 bg-slate-800 border-b border-slate-700 flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-blue-500 rounded-lg flex items-center justify-center md:hidden">
            <span>🤖</span>
          </div>
          <div>
            <h1 className="text-white font-semibold text-base leading-tight">HR AI Assistant</h1>
            <p className="text-slate-400 text-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-pulse"></span>
              Online · Ready to help
            </p>
          </div>
        </header>

        {/* Messages */}
        <div
          ref={chatBoxRef}
          className="flex-1 min-h-0 overflow-y-auto px-4 py-6 space-y-2"
          style={{ background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)" }}
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl mb-5">
                <span className="text-4xl">🤖</span>
              </div>
              <h2 className="text-white text-2xl font-bold mb-2">Welcome to HR Assistant</h2>
              <p className="text-slate-400 text-sm max-w-sm mb-8">
                Ask me anything about HR policies, benefits, leave, payroll, or procedures.
              </p>
              <div className="grid grid-cols-2 gap-2 max-w-md w-full">
                {[
                  { icon: "🏖️", text: "How do I request time off?" },
                  { icon: "💊", text: "What health benefits do I get?" },
                  { icon: "📈", text: "How does performance review work?" },
                  { icon: "🕐", text: "What are the working hours?" },
                ].map(({ icon, text }) => (
                  <button
                    key={text}
                    onClick={() => setQuestion(text)}
                    className="flex items-start gap-2 p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 rounded-xl text-left transition-all duration-150 group"
                  >
                    <span className="text-lg mt-0.5">{icon}</span>
                    <span className="text-slate-300 group-hover:text-white text-xs leading-snug">{text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <ChatMessage key={i} isUser={msg.isUser} message={msg.message} />
            ))
          )}

          {isLoading && (
            <div className="flex items-end gap-2.5 justify-start">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                <span className="text-sm">🤖</span>
              </div>
              <div className="bg-slate-700 rounded-2xl rounded-bl-md px-5 py-3.5 shadow-lg">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="flex-shrink-0 bg-slate-800 border-t border-slate-700 px-4 py-4">
          <div className="flex items-end gap-3 bg-slate-700 border border-slate-600 rounded-2xl px-4 py-3 shadow-lg focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all duration-200">
            <textarea
              ref={textareaRef}
              className="flex-1 bg-transparent text-white placeholder-slate-400 resize-none outline-none text-sm leading-relaxed min-h-[24px] max-h-[120px]"
              rows={1}
              value={question}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask about leave, benefits, policies… (Shift+Enter for new line)"
              disabled={isLoading}
            />
            <button
              onClick={askHR}
              disabled={isLoading || !question.trim()}
              className="w-9 h-9 flex-shrink-0 bg-gradient-to-br from-violet-500 to-blue-500 hover:from-violet-400 hover:to-blue-400 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed rounded-xl flex items-center justify-center shadow-md hover:shadow-violet-500/30 transition-all duration-200 transform hover:scale-105 disabled:scale-100"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-white">
                  <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-slate-500 text-xs text-center mt-2">
            Press <kbd className="bg-slate-700 text-slate-300 px-1 py-0.5 rounded text-xs">Enter</kbd> to send ·{" "}
            <kbd className="bg-slate-700 text-slate-300 px-1 py-0.5 rounded text-xs">Shift+Enter</kbd> for new line
          </p>
        </div>
      </div>
    </div>
  );
}
