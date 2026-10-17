// ============================================================
//  SkillMinigame — memory card matching challenge
// ============================================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy } from 'lucide-react';
import { useRageEngine } from '../hooks/useRageEngine';

interface Props {
  onClose: () => void;
}

const CARD_PAIRS = [
  { id: 'ts', symbol: 'TS' },
  { id: 'react', symbol: '⚛' },
  { id: 'css', symbol: '🎨' },
  { id: 'git', symbol: '⎇' },
  { id: 'node', symbol: '🟢' },
  { id: 'rust', symbol: '🦀' },
  { id: 'fig', symbol: '✏️' },
  { id: 'db', symbol: '🗄' },
];

interface Card {
  id: string;
  uid: string;
  symbol: string;
  flipped: boolean;
  matched: boolean;
}

function buildDeck(): Card[] {
  const cards: Card[] = CARD_PAIRS.flatMap((p) => [
    { ...p, uid: `${p.id}-a`, flipped: false, matched: false },
    { ...p, uid: `${p.id}-b`, flipped: false, matched: false },
  ]);
  // Shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

export default function SkillMinigame({ onClose }: Props) {
  const { unlock, completeChallenge, addScore } = useRageEngine();
  const [cards, setCards] = useState<Card[]>(() => buildDeck());
  const [selected, setSelected] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [locked, setLocked] = useState(false);

  const matchedCount = cards.filter((c) => c.matched).length / 2;
  const totalPairs = CARD_PAIRS.length;

  useEffect(() => {
    if (matchedCount === totalPairs && totalPairs > 0) {
      setWon(true);
      unlock('skill_verified');
      completeChallenge('skill_minigame', 25);
    }
  }, [matchedCount, totalPairs]);

  const handleCard = (uid: string) => {
    if (locked) return;
    const card = cards.find((c) => c.uid === uid);
    if (!card || card.flipped || card.matched) return;
    if (selected.includes(uid)) return;

    const newSelected = [...selected, uid];
    setCards((prev) =>
      prev.map((c) => c.uid === uid ? { ...c, flipped: true } : c)
    );

    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      addScore(1, 'minigame_move');
      const [a, b] = newSelected.map((id) => cards.find((c) => c.uid === id)!);
      const isMatch = a.id === b.id && a.uid !== b.uid;

      setLocked(true);
      setTimeout(() => {
        if (isMatch) {
          setCards((prev) =>
            prev.map((c) =>
              newSelected.includes(c.uid) ? { ...c, matched: true, flipped: true } : c
            )
          );
        } else {
          setCards((prev) =>
            prev.map((c) =>
              newSelected.includes(c.uid) ? { ...c, flipped: false } : c
            )
          );
        }
        setSelected([]);
        setLocked(false);
      }, 900);
      setSelected([]);
    } else {
      setSelected(newSelected);
    }
  };

  const restart = () => {
    setCards(buildDeck());
    setSelected([]);
    setMoves(0);
    setWon(false);
    setLocked(false);
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Skill verification minigame"
    >
      <motion.div
        className="modal-box"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        style={{ maxWidth: 500 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <h3 className="modal-title" style={{ fontSize: '1.25rem' }}>
            Skill Verification™
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)' }}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        <p className="modal-sub" style={{ marginBottom: 16 }}>
          To confirm Vesper's skills are real and not AI-generated,
          please complete this memory matching game.
          You may also click "Skip" if you're choosing to trust blindly. We respect that.
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          fontSize: '0.8rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
        }}>
          <span>Matched: {matchedCount}/{totalPairs}</span>
          <span>Moves: {moves}</span>
        </div>

        <AnimatePresence>
          {won ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                textAlign: 'center',
                padding: '32px 24px',
                background: 'rgba(34,197,94,0.05)',
                border: '1px solid rgba(34,197,94,0.2)',
                borderRadius: 'var(--r-lg)',
                marginBottom: 16,
              }}
            >
              <Trophy size={32} style={{ color: '#16a34a', margin: '0 auto 12px' }} />
              <p style={{ fontWeight: 700, color: '#16a34a', marginBottom: 4 }}>
                Skills Verified!
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Completed in {moves} moves. The skills are definitely real.
                {moves < 20 && ' Impressive. Suspiciously so.'}
              </p>
            </motion.div>
          ) : (
            <div className="minigame-grid" role="list" aria-label="Memory card grid">
              {cards.map((card) => (
                <motion.button
                  key={card.uid}
                  className={`minigame-card ${card.flipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
                  onClick={() => handleCard(card.uid)}
                  whileHover={!card.flipped && !card.matched ? { scale: 1.04 } : {}}
                  whileTap={!card.flipped && !card.matched ? { scale: 0.96 } : {}}
                  role="listitem"
                  aria-label={
                    card.flipped || card.matched
                      ? `${card.symbol} card`
                      : 'Hidden card'
                  }
                  aria-pressed={card.flipped || card.matched}
                >
                  <AnimatePresence mode="wait">
                    {card.flipped || card.matched ? (
                      <motion.span
                        key="front"
                        initial={{ rotateY: -90 }}
                        animate={{ rotateY: 0 }}
                        exit={{ rotateY: 90 }}
                        transition={{ duration: 0.15 }}
                        style={{ fontSize: '1.1rem' }}
                      >
                        {card.symbol}
                      </motion.span>
                    ) : (
                      <motion.span
                        key="back"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ fontSize: '0.9rem', color: 'var(--text-faint)' }}
                      >
                        ?
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
          )}
        </AnimatePresence>

        <div style={{ display: 'flex', gap: 12 }}>
          {won ? (
            <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>
              Close
            </button>
          ) : (
            <>
              <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={restart}>
                Restart
              </button>
              <button
                className="btn btn-ghost"
                style={{ justifyContent: 'center' }}
                onClick={() => { completeChallenge('skill_skip', 5); unlock('skill_verified'); onClose(); }}
              >
                Skip
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
