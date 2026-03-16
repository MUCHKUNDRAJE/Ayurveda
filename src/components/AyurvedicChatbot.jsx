import { useState, useRef, useEffect } from "react";

/* ─────────────────────────────────────────────
   Paste this component anywhere in your React
   app. It renders a floating chat button fixed
   to the bottom-right corner of the page.
   ───────────────────────────────────────────── */

const BRAND = {
  name: "Dhanvantari",
  tagline: "Your Ayurvedic Wellness Guide",
  avatar: "🌿",
};

const QUICK_REPLIES = [
  "What is my Dosha type?",
  "Remedies for digestion",
  "Stress & anxiety herbs",
  "Panchakarma details",
  "Book consultation",
];

const BOT_RESPONSES = {
  default:
    "Namaste 🙏 I'm here to guide you on your path to holistic wellness. Could you share more about what you're experiencing?",
  dosha:
    "Your Dosha (Vata, Pitta, or Kapha) is the cornerstone of Ayurvedic healing. To identify yours, I'll ask a few questions about your body type, appetite, sleep patterns, and temperament. Shall we begin? 🌱",
  digestion:
    "Ayurveda views digestion as Agni — the sacred fire of transformation. Common remedies include Triphala, ginger-lemon water before meals, and warm herbal teas with cumin & fennel. Would you like a personalized plan?",
  stress:
    "For stress & anxiety, Ashwagandha (Withania somnifera) is the king of adaptogens in Ayurveda. Brahmi, Shankhpushpi, and daily Abhyanga (oil massage) with sesame oil can deeply calm the nervous system. 🌸",
  panchakarma:
    "Panchakarma is a 5-fold detoxification therapy — Vamana, Virechana, Basti, Nasya, and Raktamokshana. It cleanses deep-seated toxins (Ama) and rejuvenates the body. Our doctors can design a personalized program for you.",
  book: "I'd love to connect you with one of our Ayurvedic physicians! Please share your name, preferred date, and the concern you'd like to address. Or call us at +91-XXXX-XXXX. 📅",
};

function getBotReply(text) {
  const t = text.toLowerCase();
  if (t.includes("dosha")) return BOT_RESPONSES.dosha;
  if (t.includes("digest") || t.includes("stomach") || t.includes("acidity"))
    return BOT_RESPONSES.digestion;
  if (t.includes("stress") || t.includes("anxiety") || t.includes("sleep"))
    return BOT_RESPONSES.stress;
  if (t.includes("panchakarma") || t.includes("detox"))
    return BOT_RESPONSES.panchakarma;
  if (t.includes("book") || t.includes("consult") || t.includes("appoint"))
    return BOT_RESPONSES.book;
  return BOT_RESPONSES.default;
}

const INITIAL_MESSAGES = [
  {
    id: 1,
    from: "bot",
    text: `Namaste 🙏 Welcome to ${BRAND.name}.\n\nI'm your Ayurvedic wellness companion. Ask me about herbal remedies, your Dosha type, diet guidance, or book a consultation with our physicians.`,
    time: new Date(),
  },
];

// ── Lotus SVG icon for the FAB ──────────────────
function LotusIcon({ size = 28, color = "#fff" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32 52C32 52 14 40 14 26C14 18.268 22.268 12 30 14C26 8 38 8 34 14C41.732 12 50 18.268 50 26C50 40 32 52 32 52Z"
        fill={color}
        opacity="0.9"
      />
      <path
        d="M32 52C32 52 20 44 18 32C13 35 10 45 22 50L32 52Z"
        fill={color}
        opacity="0.5"
      />
      <path
        d="M32 52C32 52 44 44 46 32C51 35 54 45 42 50L32 52Z"
        fill={color}
        opacity="0.5"
      />
      <ellipse cx="32" cy="38" rx="4" ry="5" fill={color} opacity="0.4" />
    </svg>
  );
}

// ── Mandala SVG header background ──────────────
function MandalaBg() {
  return (
    <svg
      style={{
        position: "absolute",
        right: -30,
        top: -30,
        opacity: 0.08,
        pointerEvents: "none",
      }}
      width="160"
      height="160"
      viewBox="0 0 200 200"
    >
      {[0, 30, 60, 90, 120, 150].map((r) => (
        <g key={r} transform={`rotate(${r} 100 100)`}>
          <ellipse cx="100" cy="55" rx="8" ry="22" fill="#fff" />
          <ellipse cx="100" cy="145" rx="8" ry="22" fill="#fff" />
          <ellipse cx="55" cy="100" rx="22" ry="8" fill="#fff" />
          <ellipse cx="145" cy="100" rx="22" ry="8" fill="#fff" />
        </g>
      ))}
      <circle cx="100" cy="100" r="30" stroke="#fff" strokeWidth="2" fill="none" />
      <circle cx="100" cy="100" r="48" stroke="#fff" strokeWidth="1" fill="none" />
      <circle cx="100" cy="100" r="66" stroke="#fff" strokeWidth="1" fill="none" />
    </svg>
  );
}

// ── Typing indicator ───────────────────────────
function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 5, padding: "10px 14px", alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#A8845C",
            display: "inline-block",
            animation: `ayuBounce 1.2s ${i * 0.2}s infinite ease-in-out`,
          }}
        />
      ))}
    </div>
  );
}

// ── Individual Message Bubble ──────────────────
function MessageBubble({ msg, isBot }) {
  const timeStr = msg.time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <div
      style={{
        display: "flex",
        flexDirection: isBot ? "row" : "row-reverse",
        alignItems: "flex-end",
        gap: 8,
        marginBottom: 14,
        animation: "ayuFadeUp 0.3s ease",
      }}
    >
      {isBot && (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6B8F4E, #4A7C59)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
            flexShrink: 0,
            boxShadow: "0 2px 8px rgba(74,124,89,0.3)",
          }}
        >
          🌿
        </div>
      )}
      <div style={{ maxWidth: "78%", display: "flex", flexDirection: "column", alignItems: isBot ? "flex-start" : "flex-end" }}>
        <div
          style={{
            padding: "10px 14px",
            borderRadius: isBot ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
            background: isBot
              ? "#FFF8EC"
              : "linear-gradient(135deg, #6B8F4E, #4A7C59)",
            color: isBot ? "#3D2B1A" : "#fff",
            fontSize: 13.5,
            lineHeight: 1.6,
            fontFamily: "'Lora', Georgia, serif",
            boxShadow: isBot
              ? "0 1px 4px rgba(0,0,0,0.07), inset 0 0 0 1px rgba(168,132,92,0.15)"
              : "0 2px 12px rgba(74,124,89,0.35)",
            whiteSpace: "pre-wrap",
          }}
        >
          {msg.text}
        </div>
        <span style={{ fontSize: 10.5, color: "#B8A08A", marginTop: 4, fontFamily: "sans-serif" }}>
          {timeStr}
        </span>
      </div>
    </div>
  );
}

// ── Main Chatbot Component ─────────────────────
export default function AyurvedicChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [pulse, setPulse] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
      setTimeout(() => inputRef.current?.focus(), 300);
      setPulse(false);
    }
  }, [open, messages]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), from: "user", text: text.trim(), time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply = getBotReply(text);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, from: "bot", text: reply, time: new Date() },
      ]);
    }, 1400 + Math.random() * 600);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* ── Keyframe Animations ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Lora:wght@400;500&display=swap');

        @keyframes ayuBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40%            { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes ayuFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ayuSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes ayuPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(107,143,78,0.6); }
          50%       { box-shadow: 0 0 0 12px rgba(107,143,78,0); }
        }
        @keyframes ayuSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .ayu-scrollbar::-webkit-scrollbar { width: 4px; }
        .ayu-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .ayu-scrollbar::-webkit-scrollbar-thumb { background: #D4B896; border-radius: 4px; }
        .ayu-chip:hover { background: #6B8F4E !important; color: #fff !important; transform: translateY(-1px); }
        .ayu-send:hover { background: #4A7C59 !important; }
        .ayu-close:hover { background: rgba(255,255,255,0.2) !important; }
      `}</style>

      {/* ── Floating Action Button ── */}
      <div
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        {/* Tooltip label */}
        {!open && pulse && (
          <div
            style={{
              background: "#3D2B1A",
              color: "#F5E6D3",
              fontSize: 12,
              fontFamily: "'Lora', serif",
              padding: "6px 12px",
              borderRadius: 20,
              whiteSpace: "nowrap",
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              animation: "ayuFadeUp 0.5s ease",
            }}
          >
            🌿 Ask Ayurveda
          </div>
        )}

        <button
          onClick={() => setOpen((v) => !v)}
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            background: "linear-gradient(135deg, #6B8F4E 0%, #4A7C59 50%, #3D6B4A 100%)",
            boxShadow: pulse && !open
              ? "0 4px 20px rgba(74,124,89,0.5)"
              : "0 4px 20px rgba(74,124,89,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.25s ease, box-shadow 0.25s ease",
            animation: pulse && !open ? "ayuPulse 2s infinite" : "none",
            transform: open ? "rotate(45deg) scale(0.95)" : "scale(1)",
          }}
          aria-label="Open Ayurvedic Chat"
        >
          {open ? (
            <span style={{ color: "#fff", fontSize: 26, lineHeight: 1 }}>✕</span>
          ) : (
            <LotusIcon size={30} color="#fff" />
          )}
        </button>
      </div>

      {/* ── Chat Window ── */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 104,
            right: 28,
            width: 370,
            maxWidth: "calc(100vw - 32px)",
            height: 580,
            maxHeight: "calc(100vh - 130px)",
            borderRadius: 24,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            zIndex: 9998,
            boxShadow:
              "0 24px 64px rgba(61,43,26,0.22), 0 4px 16px rgba(0,0,0,0.08)",
            animation: "ayuSlideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)",
            fontFamily: "'Lora', Georgia, serif",
            border: "1px solid rgba(168,132,92,0.2)",
          }}
        >
          {/* ── Header ── */}
          <div
            style={{
              background: "linear-gradient(135deg, #3D5A2A 0%, #4A7C59 55%, #5A8F6E 100%)",
              padding: "18px 18px 16px",
              position: "relative",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <MandalaBg />
            {/* Top row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {/* Avatar */}
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.15)",
                    border: "2px solid rgba(255,255,255,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    backdropFilter: "blur(4px)",
                  }}
                >
                  🌿
                </div>
                <div>
                  <div
                    style={{
                      color: "#fff",
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 20,
                      fontWeight: 700,
                      letterSpacing: "0.01em",
                      lineHeight: 1.1,
                    }}
                  >
                    {BRAND.name}
                  </div>
                  <div
                    style={{
                      color: "rgba(255,255,255,0.75)",
                      fontSize: 11.5,
                      fontFamily: "sans-serif",
                      marginTop: 2,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {BRAND.tagline}
                  </div>
                </div>
              </div>
              {/* Online badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  background: "rgba(255,255,255,0.12)",
                  padding: "4px 10px",
                  borderRadius: 20,
                  fontSize: 11,
                  color: "#B8F0C8",
                  fontFamily: "sans-serif",
                  fontWeight: 600,
                  backdropFilter: "blur(4px)",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#4ADE80",
                    animation: "ayuPulse 2s infinite",
                  }}
                />
                Online
              </div>
            </div>

            {/* Decorative leaf divider */}
            <div
              style={{
                marginTop: 14,
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
              }}
            />
            <div style={{ marginTop: 10, display: "flex", gap: 16 }}>
              {[
                { icon: "🌱", label: "Holistic Care" },
                { icon: "⚕️", label: "Expert Vaidyas" },
                { icon: "🪴", label: "Natural Herbs" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 10.5,
                    color: "rgba(255,255,255,0.8)",
                    fontFamily: "sans-serif",
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Messages ── */}
          <div
            className="ayu-scrollbar"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 14px 8px",
              background: "#F2E8D5",
            }}
          >
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} isBot={msg.from === "bot"} />
            ))}
            {typing && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 8,
                  marginBottom: 14,
                  animation: "ayuFadeUp 0.3s ease",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #6B8F4E, #4A7C59)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                  }}
                >
                  🌿
                </div>
                <div
                  style={{
                    background: "#FFF8EC",
                    borderRadius: "4px 16px 16px 16px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.07), inset 0 0 0 1px rgba(168,132,92,0.2)",
                  }}
                >
                  <TypingDots />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* ── Quick Replies ── */}
          <div
            style={{
              padding: "8px 14px",
              background: "#E8D9BF",
              borderTop: "1px solid rgba(139,100,55,0.2)",
              overflowX: "auto",
              display: "flex",
              gap: 7,
              flexWrap: "nowrap",
              scrollbarWidth: "none",
            }}
          >
            {QUICK_REPLIES.map((q) => (
              <button
                key={q}
                className="ayu-chip"
                onClick={() => sendMessage(q)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 20,
                  border: "1px solid rgba(107,143,78,0.5)",
                  background: "#D4C5A3",
                  color: "#3A5220",
                  fontSize: 11.5,
                  fontFamily: "'Lora', serif",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                  flexShrink: 0,
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* ── Input Bar ── */}
          <div
            style={{
              padding: "10px 12px",
              background: "#E8D9BF",
              borderTop: "1px solid rgba(139,100,55,0.2)",
              display: "flex",
              gap: 8,
              alignItems: "flex-end",
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about herbs, remedies, Dosha…"
              rows={1}
              style={{
                flex: 1,
                resize: "none",
                border: "1.5px solid rgba(168,132,92,0.3)",
                borderRadius: 16,
                padding: "10px 14px",
                fontSize: 13.5,
                fontFamily: "'Lora', Georgia, serif",
                color: "#3D2B1A",
                background: "#FFF8EC",
                outline: "none",
                lineHeight: 1.5,
                maxHeight: 90,
                overflowY: "auto",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.04)",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(107,143,78,0.6)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(168,132,92,0.3)")
              }
            />
            <button
              className="ayu-send"
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                border: "none",
                background: input.trim()
                  ? "linear-gradient(135deg, #6B8F4E, #4A7C59)"
                  : "#D4C9B8",
                cursor: input.trim() ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.2s ease",
                boxShadow: input.trim()
                  ? "0 3px 12px rgba(74,124,89,0.35)"
                  : "none",
              }}
              aria-label="Send"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>

          {/* ── Footer ── */}
          <div
            style={{
              padding: "6px 14px",
              background: "#D9C9A8",
              textAlign: "center",
              fontSize: 10.5,
              color: "#7A5C2E",
              fontFamily: "sans-serif",
              borderTop: "1px solid rgba(139,100,55,0.2)",
            }}
          >
            ✦ Powered by Ancient Ayurvedic Wisdom ✦
          </div>
        </div>
      )}
    </>
  );
}