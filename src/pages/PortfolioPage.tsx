import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll } from 'motion/react';
import {
  Download, Mail, MapPin,
  ChevronDown, ExternalLink,
  Terminal, Volume2, VolumeX, Palette, Trophy,
  Code, Link2
} from 'lucide-react';

import { useRageEngine } from '../hooks/useRageEngine';
import { PORTFOLIO_OWNER, PROJECTS, EXPERIENCE, SKILLS, EDUCATION } from '../data/portfolio';
import CvModal from '../components/CvModal';
import EmailPuzzle from '../components/EmailPuzzle';
import FakeTerminal from '../components/FakeTerminal';
import SkillMinigame from '../components/SkillMinigame';
import SuspiciousChatbot from '../components/SuspiciousChatbot';
import DeveloperPanel from '../components/DeveloperPanel';
import AchievementToast from '../components/AchievementToast';
import '../styles/portfolio.css';

// ── Themes ──────────────────────────────────────────────────
const THEMES = [
  { name: 'Default (Warm)', vars: {} },
  { name: 'Slightly Cooler', vars: { '--bg': '#F5F5F0', '--c-red': '#C13B2B' } },
  { name: 'Technically Different', vars: { '--bg': '#F7F4EF', '--c-red': '#B8371F' } },
  { name: 'Not What You Expected', vars: { '--bg': '#F0EDE8', '--c-red': '#D44030' } },
  { name: 'Default (Warm)', vars: {} }, // back to start
];

// ── NAV SECTIONS ────────────────────────────────────────────
const NAV_ITEMS = ['about', 'skills', 'projects', 'experience', 'contact'];

// ── Self-aware remarks by rage level ──────────────────────────
const SELF_AWARE_REMARKS = {
  mildly_inconvenient: [
    "Notice anything unusual? No? Perfect.",
    "The interface is warming up.",
  ],
  aggressively_unhelpful: [
    "We're aware of the 'issues.' They are features.",
    "Your frustration is appreciated and statistically expected.",
  ],
  certified_ragebait: [
    "At this point you're staying for the chaos. We respect that.",
    "You have achieved Certified Ragebait status. Congratulations.",
  ],
  self_aware: [
    "The website is now fully sentient. We apologize. Sort of.",
    "This was always going to happen. The only surprise is that it took this long.",
  ],
};

export default function PortfolioPage() {
  const { state, unlock, addScore, completeChallenge, discover } = useRageEngine();

  // Modal states
  const [showCv, setShowCv] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showSkillGame, setShowSkillGame] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  // Volume slider state
  const [volume, setVolume] = useState(30);
  const [volumeDisplay, setVolumeDisplay] = useState(30);
  const [volumeOvershooting, setVolumeOvershooting] = useState(false);

  // Theme cycling
  const [themeIdx, setThemeIdx] = useState(0);
  const [themeCycling, setThemeCycling] = useState(false);
  const [themeCycleCount, setThemeCycleCount] = useState(0);

  // Nav labels (cursed navigation)
  const [activeSection, setActiveSection] = useState('about');
  const [navLabelOverrides, setNavLabelOverrides] = useState<Record<string, string>>({});

  // Moving button
  const [hireBtnOffset, setHireBtnOffset] = useState({ x: 0, y: 0 });
  const [hireBtnAttempts, setHireBtnAttempts] = useState(0);
  const [hireBtnCaught, setHireBtnCaught] = useState(false);

  // Expanded projects
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [projectExpansionStep, setProjectExpansionStep] = useState<Record<string, number>>({});

  // Scroll indicator
  const { scrollYProgress } = useScroll();
  const [scrollPct, setScrollPct] = useState(0);
  const [scrollDramaMsg, setScrollDramaMsg] = useState('');

  // Self-aware remark
  const [remark, setRemark] = useState('');
  const [remarkVisible, setRemarkVisible] = useState(false);

  // Refs for section intersection
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // ── Initial effects ─────────────────────────────────────
  useEffect(() => {
    addScore(5, 'profile_visit');
    unlock('first_blood');
  }, []);

  // Apply theme CSS vars
  useEffect(() => {
    const theme = THEMES[themeIdx];
    Object.entries(theme.vars).forEach(([key, val]) => {
      document.documentElement.style.setProperty(key, val);
    });
    return () => {
      // reset on unmount
      Object.keys(theme.vars).forEach((key) => {
        document.documentElement.style.removeProperty(key);
      });
    };
  }, [themeIdx]);

  // Scroll tracking
  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      const pct = Math.round(v * 100);
      setScrollPct(pct);

      if (pct >= 97 && scrollDramaMsg === '') {
        setScrollDramaMsg("97% — Almost there. One final scroll…");
        discover('full_scroll');
        unlock('profile_full_scroll');
      }
    });
    return () => unsub();
  }, [scrollYProgress, scrollDramaMsg]);

  // Intersection observer for active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Self-aware remarks timer
  useEffect(() => {
    const remarks = SELF_AWARE_REMARKS[state.level as keyof typeof SELF_AWARE_REMARKS];
    if (!remarks || remarkVisible) return;

    const timeout = setTimeout(() => {
      const msg = remarks[Math.floor(Math.random() * remarks.length)];
      setRemark(msg);
      setRemarkVisible(true);
      setTimeout(() => setRemarkVisible(false), 4000);
    }, 12000);

    return () => clearTimeout(timeout);
  }, [state.level]);

  // ── Handlers ────────────────────────────────────────────

  const handleTheme = () => {
    if (themeCycling) return;
    setThemeCycling(true);
    addScore(3, 'theme_cycle');

    // Cycle through themes with delays
    let i = themeIdx;
    const step = () => {
      i = (i + 1) % THEMES.length;
      setThemeIdx(i);
      const newCount = themeCycleCount + 1;
      setThemeCycleCount(newCount);
      if (newCount >= THEMES.length) unlock('theme_cycled');
      if (i !== themeIdx % THEMES.length || i !== 0) {
        setTimeout(step, 600);
      } else {
        setThemeCycling(false);
      }
    };

    // Run through a few before settling
    let steps = 0;
    const runSteps = () => {
      const nextI = (themeIdx + steps + 1) % THEMES.length;
      setThemeIdx(nextI);
      steps++;
      if (steps < 4) {
        setTimeout(runSteps, 500);
      } else {
        setThemeCycling(false);
        if (steps >= THEMES.length) unlock('theme_cycled');
      }
    };
    setTimeout(runSteps, 100);
  };

  const handleVolumeChange = (newVal: number) => {
    addScore(1, 'volume_drag');
    // Overshoot effect
    const overshoot = newVal + (Math.random() * 20 - 10);
    const clamped = Math.max(0, Math.min(100, overshoot));
    setVolumeDisplay(clamped);
    setVolumeOvershooting(true);
    setTimeout(() => {
      setVolume(newVal);
      setVolumeDisplay(newVal);
      setVolumeOvershooting(false);
    }, 350);
    if (newVal === 100) unlock('volume_max');
  };

  const handleHireBtn = () => {
    const newAttempts = hireBtnAttempts + 1;
    setHireBtnAttempts(newAttempts);
    addScore(5, 'hire_click');

    if (newAttempts >= 3 && !hireBtnCaught) {
      unlock('moving_button_caught');
      setHireBtnCaught(true);
      completeChallenge('moving_button', 15);
      setShowEmail(true);
    } else if (newAttempts === 2) {
      // Move the button
      setHireBtnOffset({
        x: (Math.random() - 0.5) * 80,
        y: (Math.random() - 0.5) * 40,
      });
    } else {
      setShowEmail(true);
    }
  };

  const handleHireBtnHover = () => {
    if (hireBtnAttempts >= 2 && !hireBtnCaught) {
      // Move away on hover
      setHireBtnOffset({
        x: (Math.random() - 0.5) * 120,
        y: (Math.random() - 0.5) * 60,
      });
    }
  };

  const handleProjectExpand = (id: string) => {
    if (expandedProject === id) {
      setExpandedProject(null);
      return;
    }
    // Deliberate expansion drama
    const step = projectExpansionStep[id] ?? 0;
    if (step < 2) {
      // First two clicks: pretend to expand wrong section
      setProjectExpansionStep((prev) => ({ ...prev, [id]: step + 1 }));
      addScore(2, 'project_expand_attempt');
    } else {
      setExpandedProject(id);
      addScore(5, 'project_expanded');
    }
  };

  // Cursed nav label
  const handleNavHover = (section: string) => {
    if (state.level === 'suspiciously_normal') return;
    const prank = {
      about: 'About (allegedly)',
      skills: 'Skills (unverified)',
      projects: 'Projects (shipped, mostly)',
      experience: 'Experience (ask follow-ups)',
      contact: 'Contact (response not guaranteed)',
    }[section];
    if (prank) {
      setNavLabelOverrides((prev) => ({ ...prev, [section]: prank }));
      setTimeout(() => {
        setNavLabelOverrides((prev) => {
          const next = { ...prev };
          delete next[section];
          return next;
        });
      }, 2000);
    }
  };

  const scrollTo = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    addScore(2, 'nav_click');
  };

  const skillsByCategory = SKILLS.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof SKILLS>);

  const catLabels: Record<string, string> = {
    language: 'Languages',
    framework: 'Frameworks & Libraries',
    tool: 'Tools & Platforms',
    design: 'Design',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Scroll indicator */}
      <div className="scroll-indicator" aria-hidden="true">
        <div className="scroll-fill" style={{ width: `${Math.min(97, scrollPct)}%` }} />
      </div>

      {/* 97% drama message */}
      <AnimatePresence>
        {scrollDramaMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              bottom: 'var(--space-7)',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--c-graphite)',
              color: 'rgba(255,255,255,0.8)',
              padding: '10px 20px',
              borderRadius: 'var(--r-full)',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-mono)',
              zIndex: 9000,
              whiteSpace: 'nowrap',
              boxShadow: 'var(--shadow-lg)',
            }}
            role="status"
          >
            {scrollDramaMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Self-aware remark */}
      <AnimatePresence>
        {remarkVisible && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'fixed',
              top: 72,
              right: 'var(--space-5)',
              maxWidth: 280,
              background: 'var(--c-graphite)',
              color: 'rgba(255,255,255,0.7)',
              padding: '10px 16px',
              borderRadius: 'var(--r-md)',
              fontSize: '0.78rem',
              fontStyle: 'italic',
              zIndex: 8000,
              boxShadow: 'var(--shadow-md)',
              borderLeft: '3px solid var(--accent)',
            }}
            role="status"
            aria-live="polite"
          >
            {remark}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="portfolio-nav" role="navigation" aria-label="Portfolio navigation">
        <div className="nav-inner">
          <div className="nav-logo">
            <div className="nav-logo-mark" aria-hidden="true">VN</div>
            Vesper Nox
          </div>

          <div className="nav-links" role="list">
            {NAV_ITEMS.map((section) => (
              <button
                key={section}
                className={`nav-link ${activeSection === section ? 'active' : ''}`}
                onClick={() => scrollTo(section)}
                onMouseEnter={() => handleNavHover(section)}
                role="listitem"
                aria-current={activeSection === section ? 'page' : undefined}
              >
                {navLabelOverrides[section] ??
                  section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>

          <div className="nav-actions">
            {/* Volume widget */}
            <div
              className="volume-widget"
              style={{ width: 140 }}
              title="Volume slider (visual only — does not affect system audio)"
            >
              <button
                onClick={() => {
                  setVolume(v => v === 0 ? 30 : 0);
                  addScore(2, 'volume_mute');
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0 }}
                aria-label={volume === 0 ? 'Unmute (visual only)' : 'Mute (visual only)'}
              >
                {volumeDisplay === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
              <div
                className="volume-track"
                role="slider"
                aria-label="Volume (visual only, does not affect system audio)"
                aria-valuenow={volume}
                aria-valuemin={0}
                aria-valuemax={100}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                  handleVolumeChange(pct);
                }}
              >
                <motion.div
                  className="volume-fill"
                  style={{ width: `${volumeDisplay}%` }}
                  animate={{ width: `${volumeDisplay}%` }}
                  transition={{ type: volumeOvershooting ? 'spring' : 'tween', stiffness: 200 }}
                />
                <div
                  className="volume-thumb"
                  style={{ left: `${volumeDisplay}%` }}
                />
              </div>
            </div>

            {/* Theme toggle */}
            <button
              className="btn btn-ghost"
              style={{ padding: '8px', borderRadius: 'var(--r-sm)' }}
              onClick={handleTheme}
              disabled={themeCycling}
              aria-label="Toggle theme (may cycle through several options)"
              title={`Current theme: ${THEMES[themeIdx].name}`}
            >
              <Palette size={16} />
            </button>

            {/* Achievements */}
            <button
              className="btn btn-ghost"
              style={{ padding: '8px', borderRadius: 'var(--r-sm)', position: 'relative' }}
              onClick={() => { setShowAchievements(v => !v); unlock('achievements_checked'); }}
              aria-label={`Achievements (${state.achievements.length} unlocked)`}
              title="View achievements"
            >
              <Trophy size={16} />
              {state.achievements.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  width: 8,
                  height: 8,
                  background: 'var(--accent)',
                  borderRadius: '50%',
                  fontSize: 0,
                }} aria-hidden="true" />
              )}
            </button>

            {/* Secret Terminal */}
            <button
              className="btn btn-ghost"
              style={{ padding: '8px', borderRadius: 'var(--r-sm)' }}
              onClick={() => {
                setShowTerminal(v => !v);
                unlock('terminal_found');
                addScore(10, 'terminal_open');
              }}
              aria-label="Secret terminal"
              title="Open secret terminal"
            >
              <Terminal size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────── */}
      <section className="hero">
        <div className="container">
          <div className="hero-inner">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="hero-label">
                <div className="hero-label-dot" aria-hidden="true" />
                <span className="label">Available for hire</span>
              </div>

              <h1 className="hero-name">
                Vesper<br /><em>Nox</em>
              </h1>

              <p className="hero-role">
                Creative Technologist & Interface Architect
              </p>

              <p className="hero-tagline">
                "{PORTFOLIO_OWNER.tagline}"
              </p>

              <div className="hero-ctas">
                <button
                  className="btn btn-primary"
                  onClick={() => setShowCv(true)}
                >
                  <Download size={15} />
                  Download CV
                </button>

                <motion.button
                  className="btn btn-accent"
                  animate={{ x: hireBtnOffset.x, y: hireBtnOffset.y }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  onClick={handleHireBtn}
                  onHoverStart={handleHireBtnHover}
                  title={
                    hireBtnAttempts >= 2 && !hireBtnCaught
                      ? "Button is currently experiencing autonomy. Try again."
                      : "Get in touch"
                  }
                  aria-label="Hire Vesper Nox"
                >
                  <Mail size={15} />
                  {hireBtnAttempts === 0 && 'Get In Touch'}
                  {hireBtnAttempts === 1 && 'Seriously, Get In Touch'}
                  {hireBtnAttempts >= 2 && !hireBtnCaught && 'Catch Me If You Can'}
                  {hireBtnCaught && "I\u2019ve Been Caught"}
                </motion.button>

                <button
                  className="btn btn-outline"
                  onClick={() => { setShowSkillGame(true); addScore(5, 'skill_game_open'); }}
                  title="Verify my skills with a minigame"
                >
                  <Code size={15} />
                  Verify Skills
                </button>
              </div>
            </motion.div>

            <motion.div
              className="hero-aside"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="hero-avatar" aria-label="Vesper Nox avatar">
                VN
              </div>
              <div style={{ marginTop: 16, textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', marginBottom: 8 }}>
                  <MapPin size={13} color="var(--text-faint)" />
                  <span className="body-sm" style={{ color: 'var(--text-muted)' }}>San Francisco, CA</span>
                </div>
                <span className={`badge badge-green`}>
                  Open to opportunities
                </span>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            {[
              ['7+', 'Years Experience'],
              ['12k+', 'Users Reached'],
              ['6', 'Shipped Projects'],
              ['1', 'Acquired Startup'],
            ].map(([num, label]) => (
              <div key={label} className="stat-item">
                <div className="stat-num">{num}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ──────────────────────────── */}
      <section
        id="about"
        className="section"
        ref={(el) => { sectionRefs.current['about'] = el; }}
      >
        <div className="container">
          <div className="section-header">
            <span className="section-num">01</span>
            <h2 className="section-title">About</h2>
          </div>
          <div className="about-grid">
            <div className="about-bio">
              {PORTFOLIO_OWNER.bio.split('\n\n').map((p, i) => (
                <p key={i}>{p.trim()}</p>
              ))}
            </div>
            <div className="about-aside">
              {[
                { label: 'Location', value: PORTFOLIO_OWNER.location },
                { label: 'Currently', value: 'Senior Interface Architect @ Synthwave Labs' },
                { label: 'Education', value: 'B.F.A. Interaction Design, CCA' },
                { label: 'Contact', value: PORTFOLIO_OWNER.email },
                { label: 'Status', value: 'Accepting interesting problems' },
              ].map(({ label, value }) => (
                <div key={label} className="about-detail">
                  <span className="about-detail-label">{label}</span>
                  <span className="about-detail-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ─────────────────────────── */}
      <section
        id="skills"
        className="section"
        ref={(el) => { sectionRefs.current['skills'] = el; }}
      >
        <div className="container">
          <div className="section-header">
            <span className="section-num">02</span>
            <h2 className="section-title">Skills</h2>
            <button
              className="btn btn-outline"
              style={{ marginLeft: 'auto', fontSize: '0.8rem', padding: '8px 16px' }}
              onClick={() => { setShowSkillGame(true); addScore(3, 'verify_skills_click'); }}
            >
              Verify These →
            </button>
          </div>

          {Object.entries(skillsByCategory).map(([cat, catSkills]) => (
            <div key={cat} style={{ marginBottom: 'var(--space-6)' }}>
              <p className="skill-cat-label">{catLabels[cat] || cat}</p>
              <div className="skills-grid">
                {catSkills.map((skill) => (
                  <motion.div
                    key={skill.name}
                    className="skill-item"
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="skill-name">{skill.name}</span>
                    <div className="skill-dots" aria-label={`${skill.name}: ${skill.level} out of 5`}>
                      {[1,2,3,4,5].map((dot) => (
                        <div
                          key={dot}
                          className={`skill-dot ${dot <= skill.level ? 'filled' : ''}`}
                        />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROJECTS ───────────────────────── */}
      <section
        id="projects"
        className="section"
        ref={(el) => { sectionRefs.current['projects'] = el; }}
      >
        <div className="container">
          <div className="section-header">
            <span className="section-num">03</span>
            <h2 className="section-title">Projects</h2>
          </div>

          <div className="projects-grid">
            {PROJECTS.map((project) => {
              const step = projectExpansionStep[project.id] ?? 0;
              const isExpanded = expandedProject === project.id;
              return (
                <motion.div
                  key={project.id}
                  className="project-card"
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="project-card-header">
                    <h3 className="project-title">{project.title}</h3>
                    <span className="project-year">{project.year}</span>
                  </div>
                  <p className="project-desc">{project.description}</p>
                  <div className="project-tech">
                    {project.tech.map((t) => (
                      <span key={t} className="project-tech-tag">{t}</span>
                    ))}
                  </div>
                  <span className={`badge ${project.status === 'shipped' ? 'badge-green' : 'badge-accent'}`}>
                    {project.status}
                  </span>

                  {/* Expansion logic */}
                  <button
                    className="project-expand"
                    onClick={() => handleProjectExpand(project.id)}
                    aria-expanded={isExpanded}
                    aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${project.title} details`}
                  >
                    <ChevronDown
                      size={14}
                      style={{
                        transform: isExpanded ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.3s',
                      }}
                    />
                    {isExpanded
                      ? 'Show less'
                      : step === 0
                        ? 'Read more'
                        : step === 1
                          ? 'Click again to expand (trust us)'
                          : 'One more click'}
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        className="project-details"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35 }}
                      >
                        {project.details}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {step > 0 && step < 2 && !isExpanded && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--text-faint)',
                        fontStyle: 'italic',
                        marginTop: 4,
                      }}
                    >
                      {step === 1 && 'Almost. One more click. Definitely.'}
                    </motion.p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ─────────────────────── */}
      <section
        id="experience"
        className="section"
        ref={(el) => { sectionRefs.current['experience'] = el; }}
      >
        <div className="container">
          <div className="section-header">
            <span className="section-num">04</span>
            <h2 className="section-title">Experience</h2>
          </div>

          <div className="experience-list">
            {EXPERIENCE.map((exp, i) => (
              <motion.div
                key={i}
                className="experience-item"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="exp-meta">
                  <p className="exp-period">{exp.period}</p>
                  <p className="exp-company">{exp.company}</p>
                </div>
                <div>
                  <h3 className="exp-role">{exp.role}</h3>
                  <ul className="exp-bullets">
                    {exp.description.map((bullet, j) => (
                      <li key={j}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Education */}
          <div style={{ marginTop: 'var(--space-8)' }}>
            <div className="section-header" style={{ marginBottom: 'var(--space-5)' }}>
              <span className="section-num">—</span>
              <h2 className="section-title" style={{ fontSize: '1.5rem' }}>Education</h2>
            </div>
            {EDUCATION.map((edu, i) => (
              <div key={i} style={{
                padding: 'var(--space-5) 0',
                borderBottom: i < EDUCATION.length - 1 ? '1px solid var(--border)' : 'none',
                display: 'flex',
                gap: 'var(--space-6)',
              }}>
                <div style={{ width: 180, flexShrink: 0 }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-faint)' }}>
                    {edu.year}
                  </p>
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700 }}>
                    {edu.degree}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '4px 0' }}>
                    {edu.school}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-faint)', fontStyle: 'italic' }}>
                    {edu.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ────────────────────────── */}
      <section
        id="contact"
        className="section"
        ref={(el) => { sectionRefs.current['contact'] = el; }}
      >
        <div className="container">
          <div className="section-header">
            <span className="section-num">05</span>
            <h2 className="section-title">Contact</h2>
          </div>

          <div className="contact-grid">
            <div>
              <h3 className="contact-headline">
                Let's build something<br />
                <em style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--c-gray-cool)' }}>
                  unreasonable.
                </em>
              </h3>
              <p className="contact-sub">
                I'm open to roles, collaborations, and highly specific consulting
                engagements. Interesting problems are more interesting than interesting
                job titles. Please describe the problem.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => setShowEmail(true)}
              >
                <Mail size={15} />
                Get In Touch
              </button>
            </div>

            <div className="contact-links">
              {[
                {
                  label: 'Email',
                  value: PORTFOLIO_OWNER.email,
                  icon: <Mail size={16} />,
                  onClick: () => setShowEmail(true),
                },
                {
                  label: 'GitHub',
                  value: PORTFOLIO_OWNER.github,
                  icon: <Link2 size={16} />,
                  onClick: () => { discover('github_click'); window.open('https://github.com', '_blank'); },
                },
                {
                  label: 'LinkedIn',
                  value: PORTFOLIO_OWNER.linkedin,
                  icon: <Link2 size={16} />,
                  onClick: () => { discover('linkedin_click'); window.open('https://linkedin.com', '_blank'); },
                },
                {
                  label: 'Location',
                  value: PORTFOLIO_OWNER.location,
                  icon: <MapPin size={16} />,
                  onClick: undefined,
                },
              ].map(({ label, value, icon, onClick }) => (
                <button
                  key={label}
                  className="contact-link-item"
                  onClick={onClick}
                  style={{ cursor: onClick ? 'pointer' : 'default', textAlign: 'left', border: 'none' }}
                  aria-label={`${label}: ${value}`}
                >
                  <span style={{ color: 'var(--text-muted)' }}>{icon}</span>
                  <div>
                    <div className="contact-link-label">{label}</div>
                    <div className="contact-link-value">{value}</div>
                  </div>
                  {onClick && <ExternalLink size={13} color="var(--text-faint)" style={{ marginLeft: 'auto' }} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── RAGE SCORE SUMMARY ─────────────── */}
      <section style={{ padding: 'var(--space-9) 0' }}>
        <div className="container">
          <div className="rage-score-panel">
            <div className="rage-panel-header">
              <Trophy size={14} />
              Session Report — Exploration Summary
            </div>
            <div className="rage-panel-score">{state.score}</div>
            <div className="rage-panel-level">Level: {state.level.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</div>

            <div className="rage-panel-stats">
              {[
                ['Interactions', state.interactions],
                ['Challenges Completed', state.challengesCompleted],
                ['Failed Attempts', state.failedAttempts],
                ['Achievements', `${state.achievements.length}/25`],
                ['Discoveries', state.discoveries.length],
                ['Session Level', state.level === 'self_aware' ? '🚨 MAX' : state.level.replace(/_/g, ' ')],
              ].map(([label, value]) => (
                <div key={label as string} className="rage-stat">
                  <div className="rage-stat-num">{value}</div>
                  <div className="rage-stat-label">{label}</div>
                </div>
              ))}
            </div>

            {/* Achievement grid */}
            <div style={{ marginTop: 'var(--space-6)', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 'var(--space-5)' }}>
              <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-4)' }}>
                Achievements ({state.achievements.length}/25)
              </p>
              <div className="achievement-grid">
                {state.achievements.slice(0, 12).map((a) => (
                  <div key={a.id} className="achievement-badge unlocked">
                    <div className="achievement-title">{a.title}</div>
                    <div className="achievement-desc">{a.description}</div>
                  </div>
                ))}
              </div>
              {state.achievements.length === 0 && (
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                  No achievements yet. Try clicking things. Or failing to click things.
                </p>
              )}
              <button
                className="btn btn-outline"
                style={{
                  marginTop: 'var(--space-4)',
                  borderColor: 'rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: '0.8rem',
                }}
                onClick={() => { setShowAchievements(true); unlock('achievements_checked'); }}
              >
                View All Achievements
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">Vesper Nox — CTRL_ALT_CHAOS</div>
          <div className="footer-copy">
            Made with deliberate inconvenience. No frameworks were harmed.
          </div>
          <div className="footer-rage">
            Rage: {state.score}pts
          </div>
        </div>
      </footer>

      {/* ── Achievements Overlay ── */}
      <AnimatePresence>
        {showAchievements && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setShowAchievements(false)}
            role="dialog"
            aria-modal="true"
            aria-label="All achievements"
          >
            <motion.div
              className="modal-box"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              style={{ maxWidth: 700, background: 'var(--c-graphite)', color: 'var(--c-white)', maxHeight: '80vh', overflowY: 'auto' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>
                  All Achievements ({state.achievements.length}/25)
                </h3>
                <button
                  onClick={() => setShowAchievements(false)}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
                  aria-label="Close achievements"
                >
                  ✕
                </button>
              </div>
              <div className="achievement-grid">
                  {[
                  { id: 'first_blood', title: 'First Contact', description: 'You touched the website. Bold move.' },
                  { id: 'login_fail_1', title: 'Expected', description: 'Failed the login. Relatable.' },
                  { id: 'login_fail_3', title: 'Persistent', description: 'Failed 3 times. The website is impressed and also judging you.' },
                  { id: 'login_fail_5', title: 'Legendary Dedication', description: 'Five failed attempts. Please seek help.' },
                  { id: 'demo_access', title: 'The Pragmatist', description: 'Used Demo Access instead of solving the puzzle.' },
                  { id: 'captcha_pass', title: 'I Am Not A Robot', description: "Proved you're human." },
                  { id: 'terms_read', title: 'Read the Terms of the Button', description: 'You hovered long enough to agree.' },
                  { id: 'terminal_found', title: 'ls -la vibes', description: 'Opened the secret terminal.' },
                  { id: 'terminal_help', title: 'RTFM', description: 'Ran the help command.' },
                  { id: 'easter_egg_1', title: 'Curious', description: 'Discovered a hidden easter egg.' },
                  { id: 'easter_egg_2', title: 'Very Curious', description: 'Found the second easter egg.' },
                  { id: 'cv_started', title: 'Bureaucrat', description: 'Initiated the CV download bureaucracy.' },
                  { id: 'cv_downloaded', title: 'Finally', description: 'Actually downloaded the CV.' },
                  { id: 'rage_level_2', title: 'Graduated', description: 'Reached Mildly Inconvenient.' },
                  { id: 'rage_level_3', title: 'You Did This', description: 'Reached Aggressively Unhelpful.' },
                  { id: 'rage_level_4', title: 'Certified', description: 'Reached Certified Ragebait.' },
                  { id: 'rage_level_5', title: 'Singularity', description: 'The website is now self-aware.' },
                  { id: 'skill_verified', title: 'Skill Issue: Resolved', description: 'Completed the skill verification.' },
                  { id: 'email_copied', title: 'Puzzle Solver', description: 'Decoded the email puzzle.' },
                  { id: 'volume_max', title: 'Loud and Wrong', description: 'Maxed out the fake volume slider.' },
                  { id: 'theme_cycled', title: 'Taste Test', description: 'Cycled through all themes.' },
                  { id: 'chatbot_opened', title: 'Desperate Measures', description: 'Asked the AI assistant.' },
                  { id: 'dev_mode', title: 'You Found It', description: 'Opened Developer Mode.' },
                  { id: 'profile_full_scroll', title: '97% Complete', description: 'Scrolled through everything.' },
                  { id: 'moving_button_caught', title: 'Faster Than Light', description: 'Clicked the button before it moved.' },
                ].map((def) => {
                  const unlocked = state.achievements.find(a => a.id === def.id);
                  return (
                    <div key={def.id} className={`achievement-badge ${unlocked ? 'unlocked' : 'locked'}`}>
                      <div className="achievement-title">
                        {unlocked ? '✓ ' : '🔒 '}{def.title}
                      </div>
                      <div className="achievement-desc">{def.description}</div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Terminal overlay ── */}
      <AnimatePresence>
        {showTerminal && (
          <div style={{
            position: 'fixed',
            bottom: 'var(--space-5)',
            right: 'var(--space-7)',
            width: 'min(520px, calc(100vw - 40px))',
            zIndex: 9990,
          }}>
            <FakeTerminal onClose={() => setShowTerminal(false)} />
          </div>
        )}
      </AnimatePresence>

      {/* ── Modals ── */}
      <AnimatePresence>
        {showCv && <CvModal onClose={() => setShowCv(false)} />}
        {showEmail && <EmailPuzzle email={PORTFOLIO_OWNER.email} onClose={() => setShowEmail(false)} />}
        {showSkillGame && <SkillMinigame onClose={() => setShowSkillGame(false)} />}
      </AnimatePresence>

      {/* ── Global widgets ── */}
      <SuspiciousChatbot />
      <DeveloperPanel />
      <AchievementToast />
    </div>
  );
}
