"use client";

interface ChatMessageProps {
  isUser: boolean;
  message: string;
}

export default function ChatMessage({ isUser, message }: ChatMessageProps) {
  if (isUser) {
    return (
      <div className="flex items-end justify-end gap-2.5">
        <div className="max-w-[75%] bg-gradient-to-br from-violet-600 to-blue-600 text-white px-4 py-3 rounded-2xl rounded-br-md shadow-lg text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message}
        </div>
        <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md text-sm">
          👤
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2.5 justify-start">
      <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md text-sm">
        🤖
      </div>
      <div className="max-w-[75%] bg-slate-700 text-slate-100 px-4 py-3 rounded-2xl rounded-bl-md shadow-lg text-sm leading-relaxed whitespace-pre-wrap break-words border border-slate-600">
        {message}
      </div>
    </div>
  );
}
