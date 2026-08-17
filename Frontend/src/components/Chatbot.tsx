import React, { useState } from "react";
import {
  BotIcon,
  SendIcon,
  XIcon,
  Loader2Icon,
} from "lucide-react";
import { askChatbot } from "../services/api";

type Message = {
  role: "user" | "bot";
  text: string;
};

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hi! I'm SETU Assistant. Ask me anything about Dadar Railway Station.",
    },
  ]);

  async function sendMessage() {
    const text = question.trim();

    if (!text || loading) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const data = await askChatbot(text);

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text:
            data?.answer ||
            "Sorry, I couldn't find an answer for that.",
        },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text:
            "Sorry, I couldn't connect to the SETU chatbot. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Floating chatbot button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open SETU chatbot"
          className="absolute bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-navy text-white shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
        >
          <BotIcon className="w-6 h-6" strokeWidth={2} />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="absolute inset-0 z-[60] flex flex-col bg-canvas">
          {/* Header */}
          <div className="shrink-0 bg-navy text-white px-4 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber text-navy flex items-center justify-center">
              <BotIcon className="w-5 h-5" strokeWidth={2.2} />
            </div>

            <div className="flex-1">
              <p className="font-display font-semibold text-base">
                SETU Assistant
              </p>
              <p className="text-xs text-white/70">
                Dadar Station AI Guide
              </p>
            </div>

            <button
              onClick={() => setOpen(false)}
              aria-label="Close chatbot"
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-3 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-navy text-white rounded-br-md"
                      : "bg-white text-navy border border-slate-200 rounded-bl-md"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3">
                  <Loader2Icon
                    className="w-5 h-5 animate-spin text-navy"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Quick questions */}
          <div className="px-3 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
            {[
              "Where is the booking office?",
              "How do I reach Platform 5?",
              "Where is the drinking water?",
            ].map((text) => (
              <button
                key={text}
                onClick={() => setQuestion(text)}
                className="shrink-0 rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-navy"
              >
                {text}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="shrink-0 bg-white border-t border-slate-200 p-3">
            <div className="flex items-center gap-2">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Dadar station..."
                disabled={loading}
                className="flex-1 h-11 rounded-xl border border-slate-300 px-3 text-sm text-navy outline-none focus:border-navy disabled:bg-slate-100"
              />

              <button
                onClick={sendMessage}
                disabled={!question.trim() || loading}
                aria-label="Send message"
                className="w-11 h-11 rounded-xl bg-navy text-white flex items-center justify-center disabled:opacity-40"
              >
                <SendIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}