// ============================================================
//  EmailPuzzle — coordinate grid puzzle to copy email
// ============================================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check } from 'lucide-react';
import { useRageEngine } from '../hooks/useRageEngine';

interface Props {
  email: string;
  onClose: () => void;
}

// Grid: 6 columns (A-F), 5 rows (1-5)
// Email characters hidden in grid cells at specific coords
const EMAIL = 'vesper@nox.design';

// We'll create a 6x5 grid where certain cells contain the email characters in order
// The puzzle gives clues like "A3, B1, C2..." etc.
const GRID_COLS = 6;
const GRID_ROWS = 5;
const LETTERS = ['A','B','C','D','E','F'];

// Fixed mapping: email char index -> [col, row]
const CHAR_COORDS: [number, number][] = [
  [0, 2], [1, 0], [2, 3], [3, 1], [4, 4], // v e s p e
  [5, 0], [0, 1], [1, 3], [2, 0], [3, 4], // r @ n o x
  [4, 2], [5, 3], [0, 4], [1, 1], [2, 2], // . d e s i
  [3, 0], [4, 1], [5, 2],                  // g n
];

function buildGrid(): string[][] {
  const grid: string[][] = Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(''));
  const used = new Set<string>();

  // Place email chars
  EMAIL.split('').forEach((char, i) => {
    const [col, row] = CHAR_COORDS[i] ?? [i % GRID_COLS, Math.floor(i / GRID_COLS)];
    grid[row][col] = char;
    used.add(`${row}-${col}`);
  });

  // Fill rest with random-ish characters
  const fillers = 'abcdefghijklmnopqrstuvwxyz0123456789!#%^&*()[]{}';
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      if (!grid[r][c]) {
        grid[r][c] = fillers[Math.floor(Math.random() * fillers.length)];
      }
    }
  }
  return grid;
}

export default function EmailPuzzle({ email, onClose }: Props) {
  const { unlock, completeChallenge, addScore } = useRageEngine();
  const [grid] = useState(() => buildGrid());
  const [copied, setCopied] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [revealed, setRevealed] = useState<string[]>([]);

  // The "clue" is the sequence of coordinates
  const clueStr = EMAIL.split('')
    .map((_, i) => {
      const [col, row] = CHAR_COORDS[i] ?? [0, 0];
      return `${LETTERS[col]}${row + 1}`;
    })
    .join('-');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      unlock('email_copied');
      completeChallenge('email', 20);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setShowFallback(true);
    }
  };

  const handleCellClick = (row: number, col: number) => {
    const key = `${row}-${col}`;
    const charIdx = CHAR_COORDS.findIndex(([c, r]) => c === col && r === row);
    if (charIdx !== -1) {
      setRevealed((prev) => {
        if (!prev.includes(key)) return [...prev, key];
        return prev;
      });
      addScore(2, 'email_grid_click');
    }
  };

  const progress = Math.round((revealed.length / EMAIL.length) * 100);

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Email coordinate puzzle"
    >
      <motion.div
        className="modal-box"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        style={{ maxWidth: 560 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 className="modal-title" style={{ fontSize: '1.25rem' }}>
            Email Access Protocol™
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)' }}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <p className="modal-sub">
          For copyright reasons, the email address is encoded in the grid below.
          Find the characters in coordinate order to decode it.{' '}
          <strong>Or just click "Copy Email Directly" at the bottom.</strong>
          {' '}We're not monsters.
        </p>

        {/* Coordinate clue */}
        <div style={{
          background: 'var(--bg-2)',
          borderRadius: 'var(--r-md)',
          padding: '10px 14px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          marginBottom: 16,
          wordBreak: 'break-all',
          lineHeight: 1.8,
        }}>
          <span style={{ color: 'var(--text-faint)', marginRight: 8 }}>Coordinates:</span>
          {clueStr}
        </div>

        {/* Grid */}
        <div style={{ marginBottom: 16, overflowX: 'auto' }}>
          {/* Column headers */}
          <div style={{ display: 'grid', gridTemplateColumns: `24px repeat(${GRID_COLS}, 1fr)`, gap: 4, marginBottom: 4 }}>
            <div />
            {LETTERS.map((l) => (
              <div key={l} style={{
                textAlign: 'center',
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: 'var(--text-faint)',
              }}>
                {l}
              </div>
            ))}
          </div>

          {grid.map((row, r) => (
            <div key={r} style={{ display: 'grid', gridTemplateColumns: `24px repeat(${GRID_COLS}, 1fr)`, gap: 4, marginBottom: 4 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: 'var(--text-faint)',
              }}>
                {r + 1}
              </div>
              {row.map((cell, c) => {
                const key = `${r}-${c}`;
                const isEmailChar = CHAR_COORDS.some(([col, row]) => col === c && row === r);
                const isRevealed = revealed.includes(key);
                return (
                  <motion.button
                    key={c}
                    onClick={() => handleCellClick(r, c)}
                    style={{
                      aspectRatio: '1',
                      background: isRevealed
                        ? 'rgba(34,197,94,0.1)'
                        : isEmailChar
                          ? 'var(--bg-2)'
                          : 'var(--bg-card)',
                      border: `1.5px solid ${
                        isRevealed
                          ? '#16a34a'
                          : isEmailChar
                            ? 'var(--border-strong)'
                            : 'var(--border)'
                      }`,
                      borderRadius: 4,
                      cursor: isEmailChar ? 'pointer' : 'default',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      color: isRevealed ? '#16a34a' : 'var(--text-muted)',
                      fontWeight: isEmailChar ? 700 : 400,
                      transition: 'all 0.15s',
                    }}
                    whileHover={isEmailChar ? { scale: 1.05 } : {}}
                    aria-label={`Grid cell ${LETTERS[c]}${r + 1}`}
                  >
                    {cell}
                  </motion.button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Progress */}
        {revealed.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="progress-label">
              <span>Characters found</span>
              <span>{revealed.length} / {EMAIL.length}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
          <motion.button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={handleCopy}
            whileTap={{ scale: 0.98 }}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Check size={15} /> Copied! (The email, not the puzzle)
                </motion.span>
              ) : (
                <motion.span key="copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Copy size={15} /> Copy Email Directly
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <button
            className="btn btn-ghost"
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}
            onClick={() => {
              setShowFallback(true);
              addScore(5, 'email_manual');
            }}
          >
            I'll just type it myself (vesper@nox.design)
          </button>

          {showFallback && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                padding: '12px 16px',
                background: 'var(--bg-2)',
                borderRadius: 'var(--r-md)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                textAlign: 'center',
                color: 'var(--text)',
                userSelect: 'all',
              }}
              role="textbox"
              aria-label="Email address"
            >
              {email}
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
