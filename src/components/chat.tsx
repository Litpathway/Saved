"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, X, Send, ArrowUpRight } from "lucide-react";
type Message = { role: "assistant" | "user"; content: string };
export function Chat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello, welcome to Savelanded. I can help with tracking, quote requests, and shipping questions. How can I help?",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, busy]);
  async function send(text: string) {
    if (!text.trim() || busy) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setBusy(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await r.json();
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.reply ?? data.error },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "I could not connect. Please use the contact page to reach our team.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="chat-root">
      {open && (
        <section
          className="chat-window"
          role="dialog"
          aria-label="Savelanded support"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              toggle.current?.focus();
            }
          }}
        >
          <div className="chat-header">
            <span className="chat-avatar">
              <MessageCircle size={23} />
            </span>
            <div>
              <strong>Savelanded support</strong>
              <span>Sea & air freight enquiries</span>
            </div>
            <button
              aria-label="Close support chat"
              onClick={() => {
                setOpen(false);
                toggle.current?.focus();
              }}
            >
              <X size={19} />
            </button>
          </div>
          <div className="chat-messages" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`chat-message ${m.role}`}>
                {m.content}
              </div>
            ))}
            {messages.length === 1 && (
              <div className="chat-suggestions">
                {[
                  "How do I track a shipment?",
                  "Request a shipping quote",
                  "Speak to a person",
                ].map((s) => (
                  <button key={s} onClick={() => send(s)}>
                    {s}
                    <ArrowUpRight size={13} />
                  </button>
                ))}
              </div>
            )}
            {busy && (
              <p className="typing">
                Replying<span>…</span>
              </p>
            )}
            <div ref={end} />
          </div>
          <div className="chat-disclosure">
            Automated shipping assistant. Contact our team for booking details.
            <br />
            Avoid personal, payment, or sensitive information.
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              aria-label="Your support message"
              placeholder="Ask a shipping question…"
              value={input}
              maxLength={1000}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
            />
            <button disabled={busy || !input.trim()} aria-label="Send message">
              <Send size={19} />
            </button>
          </form>
          <Link
            className="chat-human"
            href="/contact"
            onClick={() => setOpen(false)}
          >
            Contact our team <ArrowUpRight size={13} />
          </Link>
        </section>
      )}
      <button
        ref={toggle}
        className="chat-toggle"
        aria-label={open ? "Close support chat" : "Open support chat"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <X size={23} />
        ) : (
          <>
            <MessageCircle size={22} />
            <span>Support</span>
          </>
        )}
      </button>
    </div>
  );
}
