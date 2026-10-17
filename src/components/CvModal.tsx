// ============================================================
//  CvModal — bureaucratic CV download experience
// ============================================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Clock } from 'lucide-react';
import { useRageEngine } from '../hooks/useRageEngine';

interface Props {
  onClose: () => void;
}

const BUREAUCRACY_STEPS = [
  {
    title: 'Step 1 of 7: Confirm Intent',
    desc: 'Please confirm you intend to download a CV and not a recipe, a manifesto, or the Wikipedia article on "PDF format".',
    action: 'Yes, I want the CV',
    delay: 0,
  },
  {
    title: 'Step 2 of 7: Legal Acknowledgment',
    desc: 'By downloading this CV, you acknowledge that you have read it, intend to read it, or at minimum appreciate its existence.',
    action: 'I acknowledge (vaguely)',
    delay: 1200,
  },
  {
    title: 'Step 3 of 7: Format Selection',
    desc: 'Please select your preferred PDF format.',
    action: null, // has sub-options
    delay: 800,
    options: ['PDF (standard)', 'PDF (slightly smaller)', 'PDF (same as the other one)', 'PDF (the correct choice)'],
  },
  {
    title: 'Step 4 of 7: System Verification',
    desc: 'Confirming that your device supports PDF files.',
    action: null, // automated
    delay: 2500,
    automated: true,
  },
  {
    title: 'Step 5 of 7: Environmental Impact',
    desc: 'This CV is digital. No trees were harmed. Please click to confirm you are okay with this.',
    action: 'I appreciate the forests',
    delay: 800,
  },
  {
    title: 'Step 6 of 7: Reviewer Assignment',
    desc: 'Assigning you to a CV reviewer queue. You are currently reviewer #1 of 1.',
    action: null,
    automated: true,
    delay: 1800,
  },
  {
    title: 'Step 7 of 7: Final Confirmation',
    desc: 'Everything is ready. The CV is prepared. Click the button to receive it.',
    action: '⬇ Download CV (For Real This Time)',
    delay: 0,
    isFinal: true,
  },
];

export default function CvModal({ onClose }: Props) {
  const { unlock, completeChallenge, addScore } = useRageEngine();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [autoMsg, setAutoMsg] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);

  const current = BUREAUCRACY_STEPS[step];

  useEffect(() => {
    if (step === 0) unlock('cv_started');
  }, [step]);

  const advance = () => {
    const next = step + 1;
    if (next >= BUREAUCRACY_STEPS.length) return;

    if (current.delay > 0) {
      setLoading(true);
      const startTime = Date.now();
      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setLoadingProgress(Math.min(100, (elapsed / current.delay) * 100));
      }, 50);
      setTimeout(() => {
        clearInterval(timer);
        setLoading(false);
        setLoadingProgress(0);
        setStep(next);
        addScore(3, 'cv_step');
      }, current.delay);
    } else {
      setStep(next);
      addScore(3, 'cv_step');
    }
  };

  const handleDownload = () => {
    unlock('cv_downloaded');
    completeChallenge('cv', 30);
    const link = document.createElement('a');
    link.href = '/cv-vesper-nox.pdf';
    link.download = 'Vesper-Nox-CV.pdf';
    link.click();
    onClose();
  };

  const handleOption = (opt: string) => {
    setSelectedFormat(opt);
    setTimeout(advance, 300);
  };

  // Auto-advance for automated steps
  useEffect(() => {
    const s = BUREAUCRACY_STEPS[step];
    if (s?.automated) {
      const msgs = [
        'Checking PDF support…',
        'Compatibility confirmed.',
        'Assigning queue position…',
        'Queue position: 1 of 1.',
        'Priority: Elevated (you waited).',
      ];
      let i = 0;
      const interval = setInterval(() => {
        if (i < msgs.length) {
          setAutoMsg(msgs[i]);
          i++;
        }
      }, s.delay / msgs.length);
      const timeout = setTimeout(() => {
        clearInterval(interval);
        setAutoMsg('');
        setStep((prev) => prev + 1);
        addScore(3, 'cv_auto_step');
      }, s.delay);
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [step]);

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="CV Download Process"
    >
      <motion.div
        className="modal-box"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--text-faint)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            CV Download — Bureaucratic Edition™
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)' }}
            aria-label="Cancel CV download"
          >
            <X size={16} />
          </button>
        </div>

        {/* Step progress */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
          {BUREAUCRACY_STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 99,
                background: i <= step
                  ? 'var(--c-graphite)'
                  : 'var(--border-strong)',
                transition: 'background 0.3s',
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <h3 className="modal-title">{current.title}</h3>
            <p className="modal-sub">{current.desc}</p>

            {/* Format options */}
            {current.options && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {current.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleOption(opt)}
                    style={{
                      padding: '10px 14px',
                      background: selectedFormat === opt ? 'var(--bg-2)' : 'var(--bg-card)',
                      border: `1.5px solid ${selectedFormat === opt ? 'var(--border-strong)' : 'var(--border)'}`,
                      borderRadius: 'var(--r-md)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      color: 'var(--text)',
                      transition: 'all 0.15s',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Automated step */}
            {current.automated && (
              <div style={{
                padding: '12px 16px',
                background: 'var(--bg-2)',
                borderRadius: 'var(--r-md)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                marginBottom: 16,
                minHeight: 60,
              }}>
                <motion.span
                  key={autoMsg}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {autoMsg || 'Initializing…'}
                </motion.span>
              </div>
            )}

            {/* Loading bar for delayed steps */}
            {loading && (
              <div style={{ marginBottom: 16 }}>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${loadingProgress}%` }} />
                </div>
              </div>
            )}

            {/* Actions */}
            {current.action && !current.automated && !loading && (
              <button
                className={`btn ${current.isFinal ? 'btn-accent' : 'btn-primary'}`}
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={current.isFinal ? handleDownload : advance}
              >
                {current.isFinal && <Download size={15} />}
                {current.action}
              </button>
            )}

            {loading && (
              <button
                className="btn btn-outline"
                style={{ width: '100%', justifyContent: 'center', opacity: 0.5 }}
                disabled
              >
                <Clock size={14} style={{ animation: 'spin 1s linear infinite' }} />
                Processing…
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
