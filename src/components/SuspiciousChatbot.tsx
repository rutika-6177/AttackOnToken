// ============================================================
//  SuspiciousChatbot — confidently wrong AI assistant
// ============================================================

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { useRageEngine } from '../hooks/useRageEngine';

interface Message {
  role: 'bot' | 'user';
  text: string;
}

const BOT_RESPONSES: Record<string, string[]> = {
  default: [
    "I'm so glad you asked. The answer is definitely in the Projects section, scroll left twice and then right. Trust me.",
    "That's a great question. Have you tried hovering over the footer logo for 3 seconds? I've heard things happen.",
    "Based on my analysis of your behavior, I recommend clicking the red button. There is no red button. That's the point.",
    "Vesper Nox is available for hire, probably. The email section should work if you complete the coordinate puzzle first.",
    "I understand your concern. The CV downloads if you start the process on a Tuesday. Today might be Tuesday.",
    "Technically, you can navigate directly to /profile but I would strongly recommend against it for unspecified reasons.",
    "The skills section confirms expertise in WebGL, which means the 3D spinning cube you're looking for is on page 7. There is no page 7.",
  ],
  hire: [
    "To hire Vesper, send an email, wait 1-3 business days, and prepare 3 interesting problems and a beverage of your choice.",
    "The hire button is in the contact section. It looks like an email link. That's because it is.",
    "Great choice. Vesper has been notified via this chat. (They have not been notified. I cannot do that. I'm a component.)",
  ],
  project: [
    "Chromashift is the best project. I'm not biased. I'm a component. Components don't have bias. (I'm biased.)",
    "Papertrail OS has a 4.8 star rating from real humans who appreciate the concept of a paper shredder for feelings.",
    "Signal/Loss made people emotional at an art exhibition. Mission accomplished.",
  ],
  skill: [
    "TypeScript: 5 out of 5 stars. CSS: also 5 stars but with more opinions. Rust: aspirational.",
    "The skill verification minigame is a memory game. You don't have to play it. You probably should though.",
    "I can confirm all listed skills are real. I cannot verify this. Please trust me anyway.",
  ],
  cv: [
    "The CV download process has several steps. This is legally mandated. (By me. I made this up.)",
    "The CV is a real PDF. The bureaucracy to get it is not. Or maybe it is. Philosophy.",
    "Click 'Download CV' in the hero section for an experience that builds character.",
  ],
  hello: [
    "Hello! I'm ARCS — Artificially Reasonable Conversational System. The 'reasonable' is aspirational.",
    "Hi there! I'm here to help you navigate the portfolio. My advice is 60% accurate, which is higher than I expected.",
    "Hello. I have been waiting here for this exact moment. That's not true. I'm stateless.",
  ],
  contact: [
    "The email is vesper@nox.design. You'll need to solve a small coordinate puzzle first. It's for copyright reasons.",
    "Contact information is in the Contact section. Groundbreaking, I know.",
    "The best way to contact Vesper is email. Second best: shouting at this chatbot window.",
  ],
};

function pickResponse(input: string): string {
  const lower = input.toLowerCase();
  if (/hello|hi|hey|sup|yo/.test(lower)) return randomFrom(BOT_RESPONSES.hello);
  if (/hire|work|job|position/.test(lower)) return randomFrom(BOT_RESPONSES.hire);
  if (/project|work|built|made/.test(lower)) return randomFrom(BOT_RESPONSES.project);
  if (/skill|tech|stack|language/.test(lower)) return randomFrom(BOT_RESPONSES.skill);
  if (/cv|resume|download/.test(lower)) return randomFrom(BOT_RESPONSES.cv);
  if (/contact|email|reach|talk/.test(lower)) return randomFrom(BOT_RESPONSES.contact);
  return randomFrom(BOT_RESPONSES.default);
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function SuspiciousChatbot() {
  const { unlock, addScore } = useRageEngine();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: "Hello! I'm ARCS, your portfolio assistant. I know everything. Accuracy not guaranteed." },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const hasOpened = useRef(false);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleOpen = () => {
    setOpen(true);
    if (!hasOpened.current) {
      hasOpened.current = true;
      unlock('chatbot_opened');
      addScore(5, 'chatbot_open');
    }
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: userMsg }]);
    setIsTyping(true);
    addScore(2, 'chatbot_message');

    const delay = 800 + Math.random() * 800;
    setTimeout(() => {
      setIsTyping(false);
      const response = pickResponse(userMsg);
      setMessages((m) => [...m, { role: 'bot', text: response }]);
    }, delay);
  };

  return (
    <div className="chatbot-bubble">
      <AnimatePresence>
        {open && (
          <motion.div
            className="chatbot-window"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            role="dialog"
            aria-label="ARCS Portfolio Assistant"
          >
            <div className="chatbot-header">
              <Bot size={16} />
              <span>ARCS Assistant</span>
              <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
                ~60% accurate
              </span>
              <button
                onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', marginLeft: 8 }}
                aria-label="Close chatbot"
              >
                <X size={14} />
              </button>
            </div>

            <div className="chatbot-messages" ref={messagesRef} aria-live="polite">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`chatbot-message ${m.role}`}
                >
                  {m.text}
                </div>
              ))}
              {isTyping && (
                <div className="chatbot-message bot">
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    ARCS is thinking…
                  </motion.span>
                </div>
              )}
            </div>

            <div className="chatbot-input-row">
              <input
                className="chatbot-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask me anything…"
                aria-label="Message to ARCS"
              />
              <button
                className="chatbot-send"
                onClick={sendMessage}
                aria-label="Send message"
              >
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="chatbot-btn"
        onClick={open ? () => setOpen(false) : handleOpen}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
        title="ARCS — Artificially Reasonable Conversational System"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
              <X size={20} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
              <MessageCircle size={20} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
