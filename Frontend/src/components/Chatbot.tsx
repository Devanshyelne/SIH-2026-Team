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
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open SETU chatbot"
          className="
            fixed
            z-50
            right-3
            sm:right-5
            md:right-6
            bottom-[calc(4.5rem+env(safe-area-inset-bottom))]
            md:bottom-6
            w-14
            h-14
            rounded-full
            bg-navy
            text-white
            shadow-xl
            flex
            items-center
            justify-center
            hover:scale-105
            active:scale-95
            transition-transform
          "
        >
          <BotIcon className="w-6 h-6" strokeWidth={2} />
        </button>
      )}

      {open && (
        <div
          className="
            fixed
            z-[60]
            left-2
            right-2
            bottom-2
            sm:left-auto
            sm:right-4
            sm:bottom-4
            md:right-6
            md:bottom-6
            w-auto
            sm:w-[min(92vw,400px)]
            h-[calc(100dvh-1rem)]
            sm:h-[min(72dvh,640px)]
            max-h-[calc(100dvh-1rem)]
            rounded-2xl
            shadow-2xl
            border
            hairline
            overflow-hidden
            flex
            flex-col
            bg-canvas
          "
        >
          {/* Header */}
          <div className="shrink-0 bg-navy text-white px-3 sm:px-4 py-3 sm:py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber text-navy flex items-center justify-center shrink-0">
              <BotIcon
                className="w-5 h-5"
                strokeWidth={2.2}
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-base truncate">
                SETU Assistant
              </p>

              <p className="text-xs text-white/70 truncate">
                Dadar Station AI Guide
              </p>
            </div>

            <button
              onClick={() => setOpen(false)}
              aria-label="Close chatbot"
              className="tap w-10 shrink-0 flex items-center justify-center rounded-lg hover:bg-white/10"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-3 overscroll-contain">
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
                  className={`
                    max-w-[88%]
                    sm:max-w-[82%]
                    rounded-2xl
                    px-3.5
                    py-3
                    text-sm
                    leading-relaxed
                    break-words
                    ${
                      message.role === "user"
                        ? "bg-navy text-white rounded-br-md"
                        : "bg-white text-navy border border-slate-200 rounded-bl-md"
                    }
                  `}
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
          <div className="shrink-0 px-3 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
            {[
              "Where is the booking office?",
              "How do I reach Platform 5?",
              "Where is the drinking water?",
            ].map((text) => (
              <button
                key={text}
                onClick={() => setQuestion(text)}
                className="
                  shrink-0
                  rounded-full
                  border
                  border-slate-300
                  bg-white
                  px-3
                  py-2
                  text-xs
                  font-medium
                  text-navy
                  whitespace-nowrap
                "
              >
                {text}
              </button>
            ))}
          </div>

          {/* Input */}
          <div
            className="
              shrink-0
              bg-white
              border-t
              border-slate-200
              p-3
              pb-[calc(0.75rem+env(safe-area-inset-bottom))]
            "
          >
            <div className="flex items-center gap-2">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Dadar station..."
                disabled={loading}
                className="
                  flex-1
                  min-w-0
                  h-11
                  rounded-xl
                  border
                  border-slate-300
                  px-3
                  text-sm
                  text-navy
                  outline-none
                  focus:border-navy
                  disabled:bg-slate-100
                "
              />

              <button
                onClick={sendMessage}
                disabled={!question.trim() || loading}
                aria-label="Send message"
                className="
                  shrink-0
                  w-11
                  h-11
                  rounded-xl
                  bg-navy
                  text-white
                  flex
                  items-center
                  justify-center
                  disabled:opacity-40
                "
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