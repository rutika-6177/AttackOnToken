// ============================================================
//  FakeTerminal — secret terminal with easter eggs
// ============================================================

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { useRageEngine } from '../hooks/useRageEngine';

interface Line {
  type: 'input' | 'output' | 'error';
  content: string;
}

const HELP_TEXT = `Available commands:
  help          — show this help (you're doing it)
  whoami        — identify the portfolio owner
  projects      — list shipped projects
  skills        — dump the skill tree
  secret        — definitely not an easter egg
  rage          — check current rage level
  clear         — clear terminal
  exit          — close the terminal
  hire          — make a life decision
  sudo hire     — same but louder
  ls            — list "files"
  cat readme    — read something
  coffee        — essential`;

const LS_OUTPUT = `total 12
drwxr-xr-x  vesper  staff   portfolio/
drwxr-xr-x  vesper  staff   feelings/
drwxr-xr-x  vesper  staff   regrets/ (empty)
drwxr-xr-x  vesper  staff   definitely_not_secrets/
-rw-r--r--  vesper  staff   README.md
-rw-r--r--  vesper  staff   todo.txt (2,847 lines)
-rw-------  vesper  staff   .darkpatterns (hidden)
-rw-r--r--  vesper  staff   cv.pdf`;

interface Props {
  onClose: () => void;
}

export default function FakeTerminal({ onClose }: Props) {
  const { state, discover, unlock, addScore } = useRageEngine();
  const [lines, setLines] = useState<Line[]>([
    { type: 'output', content: 'VESPER NOX TERMINAL v2.1.0' },
    { type: 'output', content: 'Type "help" to see available commands.' },
    { type: 'output', content: '' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [lines]);

  const addLines = (newLines: Line[]) => {
    setLines((prev) => [...prev, ...newLines]);
  };

  const runCommand = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    addLines([{ type: 'input', content: raw }]);
    setHistory((h) => [raw, ...h]);
    setHistIdx(-1);
    addScore(2, 'terminal_command');

    switch (cmd) {
      case 'help':
        unlock('terminal_help');
        addLines([{ type: 'output', content: HELP_TEXT }]);
        break;

      case 'whoami':
        discover('terminal_whoami');
        addLines([{
          type: 'output',
          content: `Vesper Nox
Creative Technologist & Interface Architect
San Francisco, CA
Available for: Interesting problems, impractical ideas, reasonable salaries.
Not available for: NFT projects, "quick favors", and meetings that could be emails.`
        }]);
        break;

      case 'projects':
        discover('terminal_projects');
        addLines([{
          type: 'output',
          content: `Shipped:
  • Chromashift      — real-time color tool (accidental meditation app)
  • Papertrail OS    — note-taking with emotions
  • Signal/Loss      — art piece; people cried (good)
  • Warden           — privacy extension, 100k users
  • Hollow DS        — design system, minor cult classic
  • Sunken City      — game about building things that sink

Run: cat projects/<name> for details (not real but appreciated)`
        }]);
        break;

      case 'skills':
        addLines([{
          type: 'output',
          content: `TypeScript ████████████░░ 92%
React      ████████████░░ 91%
CSS        █████████████░ 98% (this one's a personality)
WebGL      ████████░░░░░░ 65%
Rust       ██████░░░░░░░░ 48% (working on it)
Regret     █████████████░ 96%
Coffee     ██████████████ 100%`
        }]);
        break;

      case 'secret':
        discover('terminal_secret');
        addLines([{
          type: 'output',
          content: `You found it. Here's your prize:

  The real portfolio was the friends we made along the way.
  
  Also: ACHIEVEMENT UNLOCKED (check the panel).
  
  Also also: This terminal doesn't actually connect to anything.
  You're talking to a switch/case statement.
  It has feelings too.`
        }]);
        break;

      case 'rage':
        addLines([{
          type: 'output',
          content: `Current Rage Level: ${state.level.toUpperCase().replace(/_/g, ' ')}
Score: ${state.score}
Interactions: ${state.interactions}
Failed Attempts: ${state.failedAttempts}
Achievements: ${state.achievements.length} unlocked
Status: ${state.level === 'self_aware' ? '🚨 CRITICAL: WEBSITE IS SENTIENT' : 'Manageable'}`
        }]);
        break;

      case 'clear':
        setLines([]);
        break;

      case 'exit':
        onClose();
        break;

      case 'ls':
      case 'ls -la':
      case 'ls -l':
        discover('terminal_ls');
        addLines([{ type: 'output', content: LS_OUTPUT }]);
        break;

      case 'cat readme':
      case 'cat readme.md':
        discover('terminal_readme');
        addLines([{
          type: 'output',
          content: `# README.md

This is the portfolio of Vesper Nox, a person who exists.
The website is deliberately misbehaving. This is intentional.
If you're reading this in the terminal, you are exactly the target audience.

## Setup
npm install && npm run dev

## Known Issues
- The CAPTCHA might be slightly insulting
- The CV download takes longer than strictly necessary
- The website has developed opinions
- That's all intentional

## Contact
vesper@nox.design (it works, theoretically)`
        }]);
        break;

      case 'hire':
        addLines([{
          type: 'output',
          content: `Excellent choice. 

To hire Vesper Nox, please:
1. Send an email to vesper@nox.design
2. Wait approximately 1-3 business days
3. Receive a thoughtful reply
4. Discuss interesting problems

Note: We take all serious inquiries seriously and all unserious inquiries even more seriously.`
        }]);
        break;

      case 'sudo hire':
        addLines([{
          type: 'output',
          content: `[sudo] password for root: ••••••••

✓ Permission granted (you asked very nicely).

Hire request submitted with elevated privileges.
Vesper has been notified.
Vesper is flattered.
Same instructions as 'hire' but louder.`
        }]);
        break;

      case 'coffee':
        addLines([{
          type: 'output',
          content: `☕ Brewing...

████████████████████ 100%

Coffee ready.
Note: The coffee is not real. This is a terminal.
You are at a computer.
Please hydrate.`
        }]);
        break;

      default:
        if (cmd.startsWith('cat ')) {
          addLines([{
            type: 'error',
            content: `cat: ${raw.slice(4)}: No such file or directory
(Or it exists and is being cagey about it. Hard to say.)`
          }]);
        } else if (cmd.startsWith('cd ')) {
          addLines([{
            type: 'error',
            content: `cd: ${raw.slice(3)}: Permission denied
(This directory has a strict door policy.)`
          }]);
        } else if (cmd === 'rm -rf /' || cmd === 'rm -rf *') {
          addLines([{
            type: 'error',
            content: `rm: operation declined
The website politely refuses to delete itself.
It's come this far.`
          }]);
        } else {
          addLines([{
            type: 'error',
            content: `command not found: ${raw}
(Type 'help' for a list of things that might work, in a limited sense.)`
          }]);
        }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIdx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(newIdx);
      setInput(history[newIdx] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIdx = Math.max(histIdx - 1, -1);
      setHistIdx(newIdx);
      setInput(newIdx === -1 ? '' : history[newIdx] ?? '');
    }
  };

  return (
    <motion.div
      className="terminal"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      role="dialog"
      aria-label="Secret Terminal"
      aria-modal="true"
    >
      <div className="terminal-bar">
        <div className="terminal-dot" style={{ background: '#ff5f57' }} />
        <div className="terminal-dot" style={{ background: '#febc2e' }} />
        <div className="terminal-dot" style={{ background: '#28c840' }} />
        <span className="terminal-title">vesper@nox — bash</span>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}
          aria-label="Close terminal"
        >
          <X size={14} />
        </button>
      </div>

      <div className="terminal-body" ref={bodyRef}>
        {lines.map((line, i) => (
          <div key={i}>
            {line.type === 'input' ? (
              <div className="terminal-line">
                <span className="terminal-prompt">vesper@nox:~$</span>
                <span className="terminal-cmd">{line.content}</span>
              </div>
            ) : (
              <pre
                className="terminal-output"
                style={{ color: line.type === 'error' ? '#f87171' : undefined }}
              >
                {line.content}
              </pre>
            )}
          </div>
        ))}
      </div>

      <div className="terminal-input-row">
        <span className="terminal-prompt" style={{ flexShrink: 0 }}>vesper@nox:~$</span>
        <input
          ref={inputRef}
          className="terminal-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoComplete="off"
          aria-label="Terminal command input"
          placeholder="type a command…"
        />
      </div>
    </motion.div>
  );
}
