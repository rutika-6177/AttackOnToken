# CTRL_ALT_CHAOS — The World's Worst Portfolio

> *A carefully curated showcase of work, achievement, and borderline unreasonable interaction design.*

[![Build](https://img.shields.io/badge/build-passing-brightgreen)](#) [![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue)](#) [![React](https://img.shields.io/badge/React-19-61dafb)](#) [![Vite](https://img.shields.io/badge/Vite-8-646cff)](#)

CTRL_ALT_CHAOS is a deliberately inconvenient, premium-looking portfolio site for the fictional **Vesper Nox** — Creative Technologist & Interface Architect. The site looks like it cost $50,000 to build and behaves like it was designed by an actively unhelpful genius.

---

## 📸 What It Looks Like

Two routes:

| Route | Description |
|---|---|
| `/` | **The Unreasonable Login** — an elaborate simulated login gate with absurd verification steps |
| `/profile` | **The Cursed Portfolio** — a beautiful, complete portfolio with 12+ ragebait interaction mechanics |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Run

```bash
git clone https://github.com/rutika-6177/AttackOnToken.git
cd AttackOnToken
npm install
npm run dev
```

Open **http://localhost:5173** — you'll see the login page.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server at localhost:5173 |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run oxlint |

---

## 🎭 Features & Ragebait Mechanics

### Login Page (`/`)

1. **Rotating Username Placeholder** — cycles through increasingly absurd placeholder texts every 3.5 seconds
2. **Fake Password Field** — explicitly non-functional; your input is not stored, transmitted, or acknowledged
3. **Philosophical Checkbox** — has reservations about being checked; requires 3 clicks to cooperate
4. **Absurd CAPTCHA** — solvable questions with intentionally unhelpful wrong-answer feedback
5. **Auth Progress Bar** — tracks partial form completion, then transitions to the diagnostic step
6. **Fake System Diagnostic** — timed terminal-style readout that peaks at exactly 97%
7. **The Final Verification** — accepts *literally any text* as proof of consciousness
8. **Escalating Submit Button Labels** — changes wording on every failed attempt
9. **Demo Access** — always-visible skip button for accessibility and sanity

### Portfolio Page (`/profile`)

10. **Cursed Navigation Labels** — hover labels shift to sarcastic annotations based on your rage level
11. **Scroll Progress Bar** — caps at 97%, then displays a dramatic message
12. **Fake Volume Slider** — visual only; overshoots on drag; never touches system audio
13. **Rebellious Theme Switcher** — cycles through 4 near-identical "themes" before arriving back at the default
14. **Moving Hire Button** — stays still for 2 clicks, moves on hover for the 3rd attempt, stops after you catch it
15. **Project Card Expansion Drama** — requires 3 clicks to fully expand (with increasingly encouraging sub-text)
16. **CV Bureaucracy Simulator** — 7-step modal process with format selection, environmental impact disclosure, and queue assignment; ends in a real downloadable PDF
17. **Email Coordinate Puzzle** — email hidden in a 6×5 coordinate grid; "Copy Directly" fallback always visible
18. **Skill Verification Minigame** — memory card matching game with 8 tech-icon pairs; skippable
19. **Secret Terminal** — accessible via the terminal icon in the nav; supports `help`, `whoami`, `projects`, `skills`, `secret`, `rage`, `hire`, `coffee`, `ls`, `cat readme`, and more; command history with ↑/↓
20. **Suspicious AI Chatbot (ARCS)** — confidently provides wrong portfolio navigation advice; ~60% accurate per its own disclosure
21. **Self-Aware Remarks** — occasional floating contextual commentary that appears based on rage level
22. **Achievement System** — 25 unlockable achievements tracked across sessions
23. **Developer Control Panel** — discreet DEV button (bottom-right); exposes all controls

---

## ⚡ Rage Engine

The **Rage Engine** is a singleton (`src/engine/RageEngine.ts`) that tracks all interactions and maintains a shared score across both routes via `localStorage`.

### Levels

| Level | Score Threshold | Description |
|---|---|---|
| Suspiciously Normal | 0 | Nothing unusual. Yet. |
| Mildly Inconvenient | 25 | The interface is warming up |
| Aggressively Unhelpful | 75 | Features. All of this is features. |
| Certified Ragebait | 150 | Frame it. |
| The Website Has Become Self-Aware | 300 | This was always going to happen |

### Scoring

Actions that earn points: visiting the profile (+5), login attempts (+5 each), completing challenges (+15–30), unlocking discoveries (+15), unlocking achievements (+10), opening the terminal (+10), interacting with the chatbot (+2/message), and many small interactions.

The chaos intensity multiplier (adjustable in Dev Mode) scales all earned points proportionally.

---

## 🏆 Achievements (25 total)

| Achievement | How to unlock |
|---|---|
| First Contact | Visit the site |
| Expected / Persistent / Legendary Dedication | Fail login 1/3/5 times |
| The Pragmatist | Use Demo Access |
| I Am Not A Robot | Pass the CAPTCHA |
| Read the Terms of the Button | Hover the submit button |
| ls -la vibes | Open the terminal |
| RTFM | Run `help` in the terminal |
| Curious / Very Curious | Discover easter eggs |
| Bureaucrat / Finally | Start/complete CV download |
| Graduated → Singularity | Reach each rage level |
| Skill Issue: Resolved | Complete/skip the minigame |
| Puzzle Solver | Solve the email grid |
| Loud and Wrong | Max out the volume slider |
| Taste Test | Cycle through all themes |
| Desperate Measures | Open ARCS chatbot |
| You Found It | Open developer mode |
| 97% Complete | Scroll the full portfolio |
| Faster Than Light | Click the button before it moves |
| Achievement Achievement | Open the achievements panel |

---

## 🛠 Architecture

```
src/
├── engine/
│   └── RageEngine.ts          # Singleton score/state/achievement engine
├── hooks/
│   ├── useRageEngine.ts       # React hook for RageEngine subscription
│   └── useAchievementToast.ts # Hook for achievement unlock notifications
├── types/
│   └── index.ts               # Shared TypeScript types
├── data/
│   └── portfolio.ts           # Static portfolio content (projects, experience, skills)
├── styles/
│   ├── global.css             # Design tokens, typography, base components
│   ├── login.css              # Login page specific styles
│   └── portfolio.css          # Portfolio page specific styles
├── pages/
│   ├── LoginPage.tsx          # Route: /
│   └── PortfolioPage.tsx      # Route: /profile
├── components/
│   ├── AchievementToast.tsx   # Floating achievement unlock notifications
│   ├── FakeTerminal.tsx       # Secret terminal with easter egg commands
│   ├── SuspiciousChatbot.tsx  # ARCS — the confidently wrong AI assistant
│   ├── DeveloperPanel.tsx     # DEV mode control panel
│   ├── CvModal.tsx            # 7-step CV download bureaucracy
│   ├── EmailPuzzle.tsx        # Coordinate grid email puzzle
│   └── SkillMinigame.tsx      # Memory card matching game
├── App.tsx                    # React Router setup
└── main.tsx                   # Entry point

public/
└── cv-vesper-nox.pdf          # Downloadable sample CV (fictional)
```

### Key Design Decisions

- **No backend, no auth** — the login is entirely simulated. No credentials are captured, stored, or transmitted. Ever.
- **localStorage only** — rage score persists across page refreshes; cleared on reset.
- **Every challenge is skippable** — Demo Access on login, skip buttons on all modals.
- **Accessibility** — all interactive elements have `aria-label`, focus states, semantic HTML. The terminal is keyboard navigable. Modals trap focus correctly. Animations respect `prefers-reduced-motion`.
- **Lucide React** for icons, **Motion for React** for animations, **React Router** for routing.

---

## 🎮 Developer Mode

Click the **DEV** button in the bottom-right corner (on the portfolio page).

Developer Mode lets you:
- View live score, level, interaction count, achievements, and failure count
- Adjust **Chaos Intensity** (0–100%) — scales all scored points
- Toggle individual mechanics on/off (12 toggles)
- **Reset All Progress** — clears localStorage and resets the engine to defaults

---

## 📥 CV Download

The portfolio includes `public/cv-vesper-nox.pdf` — a valid PDF document with fictional career information for Vesper Nox. It downloads via the 7-step bureaucracy modal (or directly at `/cv-vesper-nox.pdf`).

---

## ♿ Accessibility Notes

- All buttons and interactive elements have accessible names
- Focus is managed in modals (click overlay to close)
- Keyboard navigation works throughout (Tab, Enter, Space, Escape, ↑/↓ in terminal)
- Color contrast meets WCAG AA
- `prefers-reduced-motion` suppresses all animations
- No system audio is ever played or controlled
- No browser permissions are requested
- No pop-ups, alert boxes, or full-screen traps

---

## 🚨 Troubleshooting

**Build fails with TS errors?**
```bash
npm run build
# Check the error list and ensure node_modules is up to date
npm install
```

**Dev server not loading fonts?**
The site loads fonts from Google Fonts. An internet connection is required for the typography to render correctly. Fallback fonts are defined.

**Achievements not saving?**
Achievement state is stored in `localStorage` under key `ctrl_alt_chaos_v1`. If localStorage is disabled (private browsing, strict settings), achievements will not persist between sessions but everything still works.

**Want to reset everything?**
Open Dev Mode (DEV button, bottom-right) → Reset All Progress. Or manually clear: `localStorage.removeItem('ctrl_alt_chaos_v1')`.

**Chunk size warning in build?**
The `motion` library is large. This is a warning only — the production build works correctly. Code splitting can be added if needed.

---

## 📋 Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 6.0 | Type safety |
| Vite | 8 | Build tool & dev server |
| Motion for React | 12 | Animations |
| Lucide React | 0.474 | Icons |
| React Router | 7 | Client-side routing |
| Google Fonts | — | Playfair Display + Inter + JetBrains Mono |

---

## 🌿 Git Workflow

Working branch: `feature/ctrl-alt-chaos-ragebait`  
Target: merge to `main` on `https://github.com/rutika-6177/AttackOnToken`

---

*Made with deliberate inconvenience. No frameworks were harmed.*
