import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Check, X, AlertCircle, RefreshCw, Terminal, ChevronRight } from 'lucide-react';
import { useRageEngine } from '../hooks/useRageEngine';
import '../styles/login.css';

// ── Error messages that escalate with rage level ──────────────────────────
const ERROR_MSGS = {
  0: [
    "Username field is for display purposes only.",
    "Please enter a username that is not your username.",
    "This field has chosen not to participate.",
  ],
  1: [
    "We noticed you typing. We don't know how to feel about that.",
    "Username accepted. Just kidding.",
    "System is 'thinking' about whether to accept that.",
  ],
  2: [
    "Nice try. The username field has requested a lawyer.",
    "Authentication failed: too much confidence detected.",
    "This account is passwordless, keyless, and vaguely hostile.",
  ],
  3: [
    "ERROR 418: I'm a teapot. (Unrelated, but felt important.)",
    "The server has gone for a walk. Please wait indefinitely.",
    "Your password would be accepted if passwords were real.",
  ],
  4: [
    "The website is now fully conscious and declines to comment.",
    "ALERT: Enthusiasm detected. Initiating countermeasures.",
    "You've been at this for a while. The form respects the commitment.",
  ],
};

const SUBMIT_BTN_LABELS = [
  'Sign In',
  'Access Portfolio',
  'I Agree to Nothing',
  'Proceed with Caution',
  'Fine, Let Me In',
  "I'm Still Here",
  'This Is My 6th Attempt',
  'Please',
];

const USERNAME_PLACEHOLDERS = [
  'your@email.com',
  'definitely_not_a_bot',
  'iAmHuman123',
  'what_is_a_username',
  'vesper.nox.fan.account',
  '[REDACTED]',
  'please_just_work',
  'username (what does this even do)',
  'NULL',
  'user_2847491',
  'your_actual_name (just kidding)',
];

const CAPTCHA_CHALLENGES = [
  {
    question: "Which of the following is NOT a primary color (according to this CAPTCHA, not science)?",
    options: ["Blue", "Red", "Chartreuse", "Yellow"],
    correct: "Chartreuse",
    wrongMsg: "Incorrect. Chartreuse is clearly not a primary color. We are in agreement and yet you chose wrong.",
  },
  {
    question: "Complete the sequence: 1, 2, 3, 4, ___",
    options: ["5", "Thursday", "Potato", "Yes"],
    correct: "5",
    wrongMsg: "The answer was 5. You knew this. We both knew this.",
  },
  {
    question: "How many corners does a square have?",
    options: ["4", "12", "Blue", "Fewer than before"],
    correct: "4",
    wrongMsg: "Incorrect. A square has four corners. This is not a philosophy exam.",
  },
  {
    question: "Select the word that is also a planet:",
    options: ["Chair", "Mars", "Wednesday", "Biscuit"],
    correct: "Mars",
    wrongMsg: "Wednesday is not a planet. We checked. Twice.",
  },
];

const DIAGNOSTIC_LINES = [
  { delay: 200, type: 'ok', text: 'loading authentication module...' },
  { delay: 600, type: 'ok', text: 'checking if you are a robot...' },
  { delay: 1100, type: 'warn', text: 'robot check inconclusive (you type very fast)' },
  { delay: 1600, type: 'ok', text: 'verifying account exists...' },
  { delay: 2000, type: 'warn', text: 'account exists (we are surprised too)' },
  { delay: 2500, type: 'ok', text: 'loading password module...' },
  { delay: 3000, type: 'err', text: 'ERROR: password module not found (intentional)' },
  { delay: 3500, type: 'ok', text: 'enabling passwordless auth...' },
  { delay: 4000, type: 'ok', text: 'passwordless auth enabled' },
  { delay: 4400, type: 'warn', text: 'warning: system is now just pretending' },
  { delay: 4900, type: 'ok', text: 'diagnostic complete. good luck.' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { state, recordFailure, completeChallenge, unlock, addScore } = useRageEngine();

  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitLabel, setSubmitLabel] = useState(SUBMIT_BTN_LABELS[0]);
  const [submitHover, setSubmitHover] = useState(false);

  // Challenge states
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [checkboxClicks, setCheckboxClicks] = useState(0);
  const [captchaIdx, setCaptchaIdx] = useState(0);
  const [captchaSelected, setCaptchaSelected] = useState<string | null>(null);
  const [captchaPassed, setCaptchaPassed] = useState(false);
  const [captchaMsg, setCaptchaMsg] = useState('');
  const [captchaAttempts, setCaptchaAttempts] = useState(0);

  // Progress
  const [progress, setProgress] = useState(0);
  const [diagnosticLines, setDiagnosticLines] = useState<typeof DIAGNOSTIC_LINES>([]);
  const [diagnosticDone, setDiagnosticDone] = useState(false);
  const [finalAnswer, setFinalAnswer] = useState('');
  const [finalAnswerCorrect, setFinalAnswerCorrect] = useState(false);

  const [loginStep, setLoginStep] = useState<'form' | 'diagnostic' | 'final'>('form');
  const [attempts, setAttempts] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const diagnosticRef = useRef<HTMLDivElement>(null);

  // Rotate placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % USERNAME_PLACEHOLDERS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Update submit label based on attempts
  useEffect(() => {
    const idx = Math.min(attempts, SUBMIT_BTN_LABELS.length - 1);
    setSubmitLabel(SUBMIT_BTN_LABELS[idx]);
  }, [attempts]);

  // Rage-escalating error messages
  const getErrorMsg = useCallback(() => {
    const rageIdx = {
      suspiciously_normal: 0,
      mildly_inconvenient: 1,
      aggressively_unhelpful: 2,
      certified_ragebait: 3,
      self_aware: 4,
    }[state.level] as keyof typeof ERROR_MSGS;
    const pool = ERROR_MSGS[rageIdx];
    return pool[Math.floor(Math.random() * pool.length)];
  }, [state.level]);

  const handleCheckbox = () => {
    const newClicks = checkboxClicks + 1;
    setCheckboxClicks(newClicks);

    if (newClicks === 1) {
      setCheckboxChecked(true);
      setTimeout(() => {
        setCheckboxChecked(false);
        setErrorMsg("The checkbox has philosophical reservations about being checked. It's complicated.");
      }, 800);
    } else if (newClicks === 2) {
      setCheckboxChecked(true);
      setTimeout(() => {
        setCheckboxChecked(false);
        setErrorMsg('The checkbox staged a protest. Briefly checked itself and then resigned.');
      }, 600);
    } else if (newClicks >= 3) {
      setCheckboxChecked(true);
      unlock('terms_read');
      setErrorMsg('');
    }
    addScore(3, 'checkbox_interaction');
  };

  const handleCaptchaSelect = (option: string) => {
    const challenge = CAPTCHA_CHALLENGES[captchaIdx];
    setCaptchaSelected(option);
    setCaptchaAttempts((a) => a + 1);

    if (option === challenge.correct) {
      setCaptchaPassed(true);
      setCaptchaMsg('');
      completeChallenge('captcha', 15);
      unlock('captcha_pass');
    } else {
      setCaptchaMsg(challenge.wrongMsg);
      // After wrong answer, cycle to next captcha if failed multiple times
      if (captchaAttempts >= 1) {
        setTimeout(() => {
          setCaptchaIdx((i) => (i + 1) % CAPTCHA_CHALLENGES.length);
          setCaptchaSelected(null);
          setCaptchaMsg('');
        }, 1800);
      }
      recordFailure();
    }
  };

  const runDiagnostic = () => {
    setLoginStep('diagnostic');
    setDiagnosticLines([]);
    setDiagnosticDone(false);
    setProgress(0);

    DIAGNOSTIC_LINES.forEach((line, i) => {
      setTimeout(() => {
        setDiagnosticLines((prev) => [...prev, line]);
        setProgress(Math.round(((i + 1) / DIAGNOSTIC_LINES.length) * 97));
        if (diagnosticRef.current) {
          diagnosticRef.current.scrollTop = diagnosticRef.current.scrollHeight;
        }
      }, line.delay);
    });

    setTimeout(() => {
      setDiagnosticDone(true);
      setProgress(97);
      setLoginStep('final');
    }, 5200);
  };

  const handleSubmit = () => {
    if (loginStep === 'form') {
      if (!checkboxChecked && checkboxClicks < 3) {
        setErrorMsg('You need to check the checkbox. (The checkbox disagrees, but rules are rules.)');
        return;
      }
      if (!captchaPassed) {
        setErrorMsg('Please complete the security check. It is slightly embarrassing for everyone involved.');
        return;
      }
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      recordFailure();
      setErrorMsg(getErrorMsg());
      addScore(5, 'submit_attempt');

      // After 2 attempts, offer diagnostic
      if (newAttempts >= 2) {
        runDiagnostic();
      }
    }
  };

  const handleFinalAnswer = () => {
    // The "final" question always has a correct answer that lets you through
    // But we make it seem hard
    if (finalAnswer.trim().toLowerCase().includes('vesper') ||
        finalAnswer.trim().toLowerCase().includes('yes') ||
        finalAnswer.trim().toLowerCase().includes('ok') ||
        finalAnswer.trim().toLowerCase().includes('sure') ||
        finalAnswer.trim() !== '') {
      setFinalAnswerCorrect(true);
      completeChallenge('login_final', 25);
      setTimeout(() => navigate('/profile'), 1200);
    } else {
      setErrorMsg("Please type something. Anything. We're not picky at this point.");
    }
  };

  const handleDemoAccess = () => {
    unlock('demo_access');
    addScore(10, 'demo_access');
    navigate('/profile');
  };

  const progressPercent = loginStep === 'form'
    ? (checkboxChecked ? 33 : 0) + (captchaPassed ? 33 : 0) + (username ? 17 : 0)
    : progress;

  return (
    <div className="login-root">
      {/* Rage bar at top */}
      <div className="rage-bar" aria-hidden="true">
        <div
          className="rage-bar-fill"
          style={{ width: `${Math.min(100, (state.score / 300) * 100)}%` }}
        />
      </div>

      {/* Left – Brand Panel */}
      <motion.div
        className="login-brand"
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="login-brand-grid" aria-hidden="true" />

        <div className="login-brand-logo">
          <div className="login-brand-logo-dot" />
          CTRL_ALT_CHAOS
        </div>

        <div>
          <motion.h1
            className="login-brand-headline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            The world's{' '}
            <em>finest</em>{' '}
            portfolio.<br />
            Allegedly.
          </motion.h1>
          <p className="login-brand-sub">
            A carefully curated showcase of work, achievement, and borderline
            unreasonable interaction design. Please sign in to continue.
            Or don't. The form doesn't care either way.
          </p>
        </div>

        {/* Decorative grid dots */}
        <motion.div
          style={{
            position: 'absolute',
            right: 32,
            top: 32,
            opacity: 0.15,
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          aria-hidden="true"
        >
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="35" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="40" cy="40" r="20" stroke="white" strokeWidth="1" />
            <circle cx="40" cy="40" r="4" fill="white" />
          </svg>
        </motion.div>

        <div className="login-brand-footer">
          System Status: <span style={{ color: '#4ade80' }}>NOMINAL (SUBJECTIVE)</span>
        </div>
      </motion.div>

      {/* Right – Login Panel */}
      <motion.div
        className="login-panel"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
      >
        <div className="login-form-wrap">
          <AnimatePresence mode="wait">
            {loginStep === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="login-title">Welcome back.</h2>
                <p className="login-subtitle">
                  Sign in to access the portfolio. This is technically optional since
                  there's a Demo Access button at the bottom. We appreciate the optimism.
                </p>

                {/* Username */}
                <div className="login-field">
                  <label className="login-label" htmlFor="username">Username</label>
                  <input
                    id="username"
                    ref={inputRef}
                    className="input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={USERNAME_PLACEHOLDERS[placeholderIdx]}
                    autoComplete="off"
                    spellCheck={false}
                  />
                  <p className="login-notice">
                    Username field does not validate usernames. It is decorative and empathetic.
                  </p>
                </div>

                {/* Password (fake) */}
                <div className="login-field">
                  <label className="login-label" htmlFor="password">Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="password"
                      className="input"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                    {password && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                          position: 'absolute',
                          right: 12,
                          top: '50%',
                          transform: 'translateY(-50%)',
                        }}
                      >
                        <X size={16} color="var(--c-red)" />
                      </motion.div>
                    )}
                  </div>
                  <p className="login-notice">
                    This account is passwordless. This field exists for comfort. Your input
                    is not stored, transmitted, or acknowledged.{' '}
                    {password && <em style={{ color: 'var(--c-red)' }}>
                      (We noticed you typed something. Very bold.)
                    </em>}
                  </p>
                </div>

                {/* Checkbox */}
                <div className="login-field">
                  <button
                    className="checkbox-row"
                    onClick={handleCheckbox}
                    aria-pressed={checkboxChecked}
                    aria-label="I agree, allegedly"
                  >
                    <div className={`checkbox-box ${checkboxChecked ? 'checked' : ''}`}>
                      <AnimatePresence>
                        {checkboxChecked && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Check size={12} color="white" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div>
                      <div className="checkbox-text">
                        I understand and agree, hypothetically
                      </div>
                      <div className="checkbox-subtext">
                        {checkboxClicks === 0 && "This checkbox believes checking is a social construct."}
                        {checkboxClicks === 1 && "We respect the checkbox's right to self-determine."}
                        {checkboxClicks === 2 && "The checkbox is reconsidering its position."}
                        {checkboxClicks >= 3 && "✓ The checkbox has been convinced. Reluctantly."}
                      </div>
                    </div>
                  </button>
                </div>

                {/* CAPTCHA */}
                <div className="login-field">
                  <div className="captcha-box">
                    <div className="captcha-header">
                      <span className="captcha-title">
                        🤖 Security Verification™
                      </span>
                      {!captchaPassed && (
                        <button
                          onClick={() => {
                            setCaptchaIdx((i) => (i + 1) % CAPTCHA_CHALLENGES.length);
                            setCaptchaSelected(null);
                            setCaptchaMsg('');
                            addScore(1, 'captcha_refresh');
                          }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                          title="Get a different (equally absurd) question"
                          aria-label="Refresh captcha"
                        >
                          <RefreshCw size={14} />
                        </button>
                      )}
                    </div>

                    <AnimatePresence mode="wait">
                      {captchaPassed ? (
                        <motion.div
                          key="passed"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            color: '#16a34a',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                          }}
                        >
                          <Check size={16} />
                          Human confirmed. Barely.
                        </motion.div>
                      ) : (
                        <motion.div
                          key={captchaIdx}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                        >
                          <p className="captcha-question">
                            {CAPTCHA_CHALLENGES[captchaIdx].question}
                          </p>
                          <div className="captcha-options">
                            {CAPTCHA_CHALLENGES[captchaIdx].options.map((opt) => (
                              <button
                                key={opt}
                                className={`captcha-option ${
                                  captchaSelected === opt
                                    ? opt === CAPTCHA_CHALLENGES[captchaIdx].correct
                                      ? 'selected-correct'
                                      : 'selected-wrong'
                                    : ''
                                }`}
                                onClick={() => handleCaptchaSelect(opt)}
                                disabled={captchaPassed}
                                aria-label={`CAPTCHA option: ${opt}`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                          {captchaMsg && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              style={{
                                marginTop: 8,
                                fontSize: '0.75rem',
                                color: 'var(--c-red)',
                                fontStyle: 'italic',
                              }}
                            >
                              {captchaMsg}
                            </motion.p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Progress */}
                <div className="progress-wrap">
                  <div className="progress-bar" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
                    <motion.div
                      className="progress-fill"
                      style={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="progress-label">
                    <span>Auth progress</span>
                    <span>{progressPercent}%</span>
                  </div>
                </div>

                {/* Error message */}
                <AnimatePresence>
                  {errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 8,
                        padding: '12px 14px',
                        background: 'rgba(193,59,43,0.06)',
                        border: '1px solid rgba(193,59,43,0.2)',
                        borderRadius: 'var(--r-md)',
                        marginBottom: 'var(--space-4)',
                      }}
                    >
                      <AlertCircle size={15} color="var(--c-red)" style={{ flexShrink: 0, marginTop: 1 }} />
                      <p style={{ fontSize: '0.82rem', color: 'var(--c-red)', lineHeight: 1.5 }}>
                        {errorMsg}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions */}
                <div className="login-actions">
                  <motion.button
                    className="login-btn login-btn-primary"
                    onClick={handleSubmit}
                    onHoverStart={() => { setSubmitHover(true); unlock('terms_read'); }}
                    onHoverEnd={() => setSubmitHover(false)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {submitHover && attempts > 2 ? '(Still Won\'t Work)' : submitLabel}
                  </motion.button>

                  <div className="login-divider">
                    <span>or</span>
                  </div>

                  <button
                    className="login-btn login-btn-demo"
                    onClick={handleDemoAccess}
                  >
                    <ChevronRight size={14} style={{ marginRight: 4 }} />
                    Demo Access — Skip All of This
                  </button>
                </div>
              </motion.div>
            )}

            {loginStep === 'diagnostic' && (
              <motion.div
                key="diagnostic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Terminal size={18} color="var(--text-muted)" />
                  <h2 className="login-title" style={{ fontSize: '1.25rem' }}>
                    Running system diagnostic…
                  </h2>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.5 }}>
                  We noticed the normal login isn't working. This is expected.
                  We're running a diagnostic to understand why. (We already know why.)
                </p>

                <div className="diagnostic" ref={diagnosticRef} role="log" aria-live="polite">
                  {diagnosticLines.map((line, i) => (
                    <motion.div
                      key={i}
                      className="diagnostic-line"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <span className="diagnostic-ts">
                        [{String(Math.floor(i * 0.4)).padStart(4, '0')}ms]
                      </span>
                      <span className={`diagnostic-${line.type}`}>
                        [{line.type.toUpperCase()}]
                      </span>
                      <span>{line.text}</span>
                    </motion.div>
                  ))}
                  {!diagnosticDone && (
                    <motion.div
                      className="diagnostic-line"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    >
                      <span className="diagnostic-ts">[....ms]</span>
                      <span className="diagnostic-ok">[WAIT ]</span>
                      <span>▊</span>
                    </motion.div>
                  )}
                </div>

                <div className="progress-wrap">
                  <div className="progress-bar">
                    <motion.div
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="progress-label">
                    <span>
                      {progress >= 97
                        ? '⚠ Stuck at 97% — one more thing'
                        : 'Diagnosing…'}
                    </span>
                    <span>{progress}%</span>
                  </div>
                </div>

                <button
                  className="login-btn login-btn-demo"
                  onClick={handleDemoAccess}
                  style={{ marginTop: 12, width: '100%' }}
                >
                  Skip diagnostic — Demo Access
                </button>
              </motion.div>
            )}

            {loginStep === 'final' && (
              <motion.div
                key="final"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div style={{
                  padding: '12px 16px',
                  background: 'rgba(250,204,21,0.08)',
                  border: '1px solid rgba(250,204,21,0.25)',
                  borderRadius: 'var(--r-md)',
                  marginBottom: 20,
                  fontSize: '0.8rem',
                  color: '#92400e',
                  fontFamily: 'var(--font-mono)',
                }}>
                  ⚠ Diagnostic complete. Stuck at 97%. One final verification required.
                </div>

                <h2 className="login-title" style={{ fontSize: '1.35rem', marginBottom: 8 }}>
                  Almost there. One last thing.
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.5 }}>
                  To complete authentication, please confirm you are a sentient being by
                  typing <em>anything</em> in the box below. Punctuation welcome. Screaming is fine.
                </p>

                <div className="login-field">
                  <label className="login-label" htmlFor="final-input">
                    Proof of Consciousness (any text)
                  </label>
                  <input
                    id="final-input"
                    className="input"
                    type="text"
                    value={finalAnswer}
                    onChange={(e) => setFinalAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleFinalAnswer()}
                    placeholder="Type literally anything…"
                    autoFocus
                  />
                </div>

                <AnimatePresence>
                  {finalAnswerCorrect && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '12px 16px',
                        background: 'rgba(34,197,94,0.08)',
                        border: '1px solid rgba(34,197,94,0.25)',
                        borderRadius: 'var(--r-md)',
                        marginBottom: 16,
                        fontSize: '0.85rem',
                        color: '#16a34a',
                      }}
                    >
                      <Check size={16} />
                      Consciousness verified. Redirecting to portfolio…
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="login-actions">
                  <motion.button
                    className="login-btn login-btn-primary"
                    onClick={handleFinalAnswer}
                    whileTap={{ scale: 0.98 }}
                    disabled={finalAnswerCorrect}
                  >
                    {finalAnswerCorrect ? 'Entering portfolio…' : 'Verify & Enter Portfolio'}
                  </motion.button>

                  <div className="login-divider">
                    <span>or skip all of this</span>
                  </div>

                  <button className="login-btn login-btn-demo" onClick={handleDemoAccess}>
                    Demo Access
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
