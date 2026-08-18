import React, { useState, useRef, useEffect } from 'react';
import { BotIcon, SendIcon, XIcon, SparklesIcon } from 'lucide-react';
import { askChatbot } from '../services/api';
import { LoadingDots } from './ui';

type Message = {
  role: 'user' | 'bot';
  text: string;
};

const QUICK_QUESTIONS = [
  'How do I get to Exit Gate from Side Gate?',
  'Starting from Main Entrance Gate, how do I reach Exit Gate?',
  'Can you tell me each turn from Exit Gate to ATM?',
  'How do I reach Platform 1 from Main Entrance Gate?',
  'If I start at Side Gate, where should I go first to reach Toilet 1?',
  'I have luggage with me. From the Main Entrance Gate, where can I reach the Cloak Room?',
  'I am at the Cloak Room and need to reach the Help Clinic. What route should I follow?',
];

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      text: "Hi! I'm SETU Assistant. Ask me anything about Dadar Railway Station — platforms, facilities, exits, and more.",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, messages, loading]);

  async function sendMessage(text?: string) {
    const msg = (text ?? question).trim();
    if (!msg || loading) return;

    setMessages((prev) => [...prev, { role: 'user', text: msg }]);
    setQuestion('');
    setLoading(true);

    try {
      const data = await askChatbot(msg);
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text:
            (data as { answer?: string })?.answer ||
            "Sorry, I couldn't find an answer for that.",
        },
      ]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: "Sorry, I couldn't connect to the SETU chatbot right now. Please check your connection and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
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
            fixed z-50
            right-3 sm:right-5 md:right-6
            bottom-[calc(4.75rem+env(safe-area-inset-bottom))] md:bottom-6
            w-14 h-14 rounded-2xl
            bg-navy text-white shadow-elevated
            flex items-center justify-center
            hover:bg-navy-800 hover:scale-105
            active:scale-95
            transition-all duration-200
          "
        >
          <BotIcon className="w-6 h-6" strokeWidth={2} />
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-label="SETU Assistant chat"
          className="
            fixed z-[60]
            left-2 right-2 bottom-2
            sm:left-auto sm:right-4 sm:bottom-4
            md:right-6 md:bottom-6
            w-auto sm:w-[min(92vw,400px)]
            h-[calc(100dvh-1rem)] sm:h-[min(72dvh,640px)]
            max-h-[calc(100dvh-1rem)]
            rounded-2xl shadow-elevated border hairline
            overflow-hidden flex flex-col bg-canvas
            animate-slide-up
          "
        >
          {/* Header */}
          <div className="shrink-0 gradient-hero text-white px-4 py-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber text-navy flex items-center justify-center shrink-0 shadow-soft">
              <SparklesIcon className="w-5 h-5" strokeWidth={2.2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-base truncate">SETU Assistant</p>
              <p className="text-xs text-white/65 truncate flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-setu-green animate-pulse-soft" />
                Dadar Station AI Guide
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chatbot"
              className="tap w-9 h-9 shrink-0 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors duration-150"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 overscroll-contain">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex animate-fade-in ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-navy/8 flex items-center justify-center shrink-0 mr-2 mt-1">
                    <BotIcon className="w-3.5 h-3.5 text-navy" strokeWidth={2} />
                  </div>
                )}
                <div
                  className={`
                    max-w-[82%] sm:max-w-[78%]
                    rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed break-words
                    ${
                      message.role === 'user'
                        ? 'bg-navy text-white rounded-br-md shadow-soft'
                        : 'bg-white text-navy border border-border rounded-bl-md shadow-soft'
                    }
                  `}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start animate-fade-in">
                <div className="w-7 h-7 rounded-lg bg-navy/8 flex items-center justify-center shrink-0 mr-2">
                  <BotIcon className="w-3.5 h-3.5 text-navy" strokeWidth={2} />
                </div>
                <div className="bg-white border border-border rounded-2xl rounded-bl-md px-4 py-3 shadow-soft">
                  <LoadingDots />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions */}
          <div className="shrink-0 px-3 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
            {QUICK_QUESTIONS.map((text) => (
              <button
                key={text}
                onClick={() => sendMessage(text)}
                disabled={loading}
                className="
                  shrink-0 rounded-full border border-border bg-white
                  px-3 py-1.5 text-xs font-medium text-navy
                  whitespace-nowrap hover:border-teal hover:bg-teal-50
                  disabled:opacity-40 transition-colors duration-150
                "
              >
                {text}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="shrink-0 bg-white border-t border-border p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Dadar station..."
                disabled={loading}
                aria-label="Chat message"
                className="
                  flex-1 min-w-0 h-11 rounded-xl border border-border
                  px-3.5 text-sm text-navy placeholder:text-muted
                  outline-none focus:border-teal focus:ring-2 focus:ring-teal/20
                  disabled:bg-slate-50 transition-all duration-150
                "
              />
              <button
                onClick={() => sendMessage()}
                disabled={!question.trim() || loading}
                aria-label="Send message"
                className="
                  shrink-0 w-11 h-11 rounded-xl bg-navy text-white
                  flex items-center justify-center
                  hover:bg-navy-800 disabled:opacity-40
                  active:scale-95 transition-all duration-150
                "
              >
                <SendIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
