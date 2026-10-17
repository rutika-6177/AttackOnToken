// ============================================================
//  DeveloperPanel — debug/chaos control panel
// ============================================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { useRageEngine } from '../hooks/useRageEngine';


const MECHANIC_LABELS: Record<string, string> = {
  cursedNav: 'Cursed Navigation',
  themeSwitch: 'Rebellious Theme Switch',
  volumeSlider: 'Impossible Volume',
  cvBureaucracy: 'CV Bureaucracy',
  emailPuzzle: 'Email Coordinate Puzzle',
  terminal: 'Secret Terminal',
  movingButton: 'Moving Button',
  skillMinigame: 'Skill Verification Game',
  chatbot: 'Suspicious Chatbot',
  selfAwareTooltips: 'Self-Aware Tooltips',
  progressBar: 'Progress Bar Drama',
  achievementSystem: 'Achievement System',
};

export default function DeveloperPanel() {
  const { state, setMechanic, setChaosIntensity, reset, unlock } = useRageEngine();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen((o) => !o);
    if (!open) unlock('dev_mode');
  };

  return (
    <div style={{
      position: 'fixed',
      right: 'var(--space-5)',
      bottom: 'var(--space-5)',
      zIndex: 9998,
    }}>
      <button
        onClick={handleOpen}
        style={{
          background: 'var(--c-graphite)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 'var(--r-md)',
          padding: '8px 12px',
          color: 'rgba(255,255,255,0.6)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '0.72rem',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.06em',
          boxShadow: 'var(--shadow-md)',
        }}
        aria-label="Toggle developer panel"
        title="Developer Mode — Chaos Controls"
      >
        <Settings size={13} />
        DEV
        {open ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="devmode-panel"
            style={{ bottom: 44, right: 0, position: 'absolute' }}
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            role="dialog"
            aria-label="Developer control panel"
          >
            <div className="devmode-title">
              <Settings size={12} />
              Developer Mode — Chaos Controls
            </div>

            {/* Score readout */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 'var(--r-sm)',
              padding: '10px 12px',
              marginBottom: 12,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
            }}>
              {[
                ['Score', state.score],
                ['Level', state.level.slice(0, 12)],
                ['Interactions', state.interactions],
                ['Achievements', `${state.achievements.length}/25`],
                ['Failed', state.failedAttempts],
                ['Challenges', state.challengesCompleted],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {label}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--c-white)' }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>

            {/* Chaos intensity */}
            <div style={{ marginBottom: 12 }}>
              <div className="devmode-toggle-row" style={{ borderBottom: 'none' }}>
                <span>Chaos Intensity</span>
                <span style={{ color: 'var(--c-red)' }}>{state.chaosIntensity}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={state.chaosIntensity}
                onChange={(e) => setChaosIntensity(Number(e.target.value))}
                className="devmode-slider"
                style={{ accentColor: 'var(--c-red)' }}
                aria-label="Chaos intensity"
              />
            </div>

            {/* Mechanic toggles */}
            <div style={{
              maxHeight: 180,
              overflowY: 'auto',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              paddingTop: 8,
              marginBottom: 8,
            }}>
              {Object.entries(MECHANIC_LABELS).map(([key, label]) => (
                <div key={key} className="devmode-toggle-row">
                  <span style={{ fontSize: '0.73rem' }}>{label}</span>
                  <div
                    className={`toggle-switch ${state.mechanics[key] ? 'on' : ''}`}
                    onClick={() => setMechanic(key, !state.mechanics[key])}
                    role="switch"
                    aria-checked={state.mechanics[key]}
                    aria-label={`Toggle ${label}`}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setMechanic(key, !state.mechanics[key])}
                  >
                    <div className="toggle-thumb" />
                  </div>
                </div>
              ))}
            </div>

            <button
              className="devmode-btn danger"
              onClick={reset}
            >
              <RotateCcw size={11} style={{ display: 'inline', marginRight: 6 }} />
              Reset All Progress
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
