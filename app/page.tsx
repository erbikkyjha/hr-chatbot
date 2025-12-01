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

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  async function askHR() {
    if (!question.trim() || isLoading) return;

    const userQuestion = question;
    setQuestion("");
    setIsLoading(true);

    setMessages((prev) => [...prev, { isUser: true, message: userQuestion }]);

    try {
      const res = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userQuestion }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { isUser: false, message: data.answer },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { isUser: false, message: "Sorry, I'm having trouble connecting. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askHR();
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 sm:p-6 flex items-center justify-center overflow-hidden">
      {/* Main container with fixed height - no browser scroll */}
      <div className="max-w-4xl w-full bg-white/90 shadow-2xl rounded-2xl p-6 border border-gray-200 h-full max-h-[95vh] flex flex-col">
        
        {/* Header - fixed height */}
        <div className="text-center mb-6 flex-shrink-0">
          <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-2xl">🤖</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            HR AI Assistant
          </h1>
          <p className="text-gray-600 mt-1 text-sm">
            Get instant answers to your HR questions
          </p>
        </div>

        {/* Chat Container - takes remaining space with internal scroll only */}
        <div className="flex-1 min-h-0 mb-4">
          <div
            ref={chatBoxRef}
            className="border border-gray-200 rounded-2xl h-full overflow-y-auto bg-gradient-to-b from-white to-gray-50 shadow-inner p-4"
          >
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💬</span>
                  </div>
                  <p className="text-lg font-medium">Welcome to HR Assistant!</p>
                  <p className="text-sm mt-1">Ask me anything about HR policies, benefits, or procedures.</p>
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <ChatMessage key={i} isUser={msg.isUser} message={msg.message} />
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-md px-6 py-4 max-w-xs">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area - fixed height */}
        <div className="flex gap-3 flex-shrink-0">
          <div className="flex-1 relative">
            <input
              className="w-full p-4 pr-12 border border-gray-300 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about leave policies, benefits, onboarding..."
              disabled={isLoading}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              ⏎
            </div>
          </div>
          <button
            onClick={askHR}
            disabled={isLoading || !question.trim()}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed min-w-[100px] flex items-center justify-center"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Ask"
            )}
          </button>
        </div>

        {/* Quick Suggestions - fixed height */}
        {messages.length === 0 && (
          <div className="mt-4 flex-shrink-0">
            <p className="text-sm text-gray-500 text-center mb-3">Try asking:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "How do I request time off?",
                "What are the working hours?",
                "Tell me about health benefits",
                "How does performance review work?"
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setQuestion(suggestion)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200 shadow-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}