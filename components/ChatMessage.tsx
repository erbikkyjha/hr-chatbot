"use client";

interface ChatMessageProps {
  isUser: boolean;
  message: string;
}

export default function ChatMessage({ isUser, message }: ChatMessageProps) {
  return (
    <div
      className={`p-3 rounded-xl mb-3 max-w-sm break-words shadow-sm ${
        isUser
          ? "bg-blue-600 text-white ml-auto rounded-br-none"
          : "bg-gray-200 text-gray-900 mr-auto rounded-bl-none"
      }`}
    >
      {message}
    </div>
  );
}
