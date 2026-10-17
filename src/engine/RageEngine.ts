// ============================================================
//  CTRL_ALT_CHAOS — Rage Engine
//  Central state management for score, levels, achievements
// ============================================================

import type { RageLevel, RageState, Achievement } from '../types';

const STORAGE_KEY = 'ctrl_alt_chaos_v1';

const LEVEL_THRESHOLDS: Record<RageLevel, number> = {
  suspiciously_normal: 0,
  mildly_inconvenient: 25,
  aggressively_unhelpful: 75,
  certified_ragebait: 150,
  self_aware: 300,
};

const LEVEL_NAMES: Record<RageLevel, string> = {
  suspiciously_normal: 'Suspiciously Normal',
  mildly_inconvenient: 'Mildly Inconvenient',
  aggressively_unhelpful: 'Aggressively Unhelpful',
  certified_ragebait: 'Certified Ragebait',
  self_aware: 'The Website Has Become Self-Aware',
};

const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_blood', title: 'First Contact', description: 'You touched the website. Bold move.' },
  { id: 'login_fail_1', title: 'Expected', description: 'Failed the login. Relatable.' },
  { id: 'login_fail_3', title: 'Persistent', description: 'Failed 3 times. The website is impressed and also judging you.' },
  { id: 'login_fail_5', title: 'Legendary Dedication', description: 'Five failed attempts. Please seek help. (The fun kind.)' },
  { id: 'demo_access', title: 'The Pragmatist', description: 'Used Demo Access instead of solving the puzzle. We respect efficiency.' },
  { id: 'captcha_pass', title: 'I Am Not A Robot', description: "Proved you're human by doing something no robot would bother with." },
  { id: 'terms_read', title: 'Read the Terms of the Button', description: 'You hovered long enough to read the tooltip. Legally, you agreed.' },
  { id: 'terminal_found', title: 'ls -la vibes', description: 'Opened the secret terminal. Impressive. Also suspicious.' },
  { id: 'terminal_help', title: 'RTFM', description: 'Ran the help command. A person of culture.' },
  { id: 'easter_egg_1', title: 'Curious', description: 'Discovered a hidden easter egg. The website sees you.' },
  { id: 'easter_egg_2', title: 'Very Curious', description: 'Found the second easter egg. Are you okay?' },
  { id: 'cv_started', title: 'Bureaucrat', description: 'Initiated the CV download bureaucracy. Grab a coffee.' },
  { id: 'cv_downloaded', title: 'Finally', description: 'Actually downloaded the CV. It took… some effort.' },
  { id: 'rage_level_2', title: 'Graduated', description: 'Reached Mildly Inconvenient. The website is warming up.' },
  { id: 'rage_level_3', title: 'You Did This', description: 'Reached Aggressively Unhelpful. You have only yourself to blame.' },
  { id: 'rage_level_4', title: 'Certified', description: 'Reached Certified Ragebait. Frame this.' },
  { id: 'rage_level_5', title: 'Singularity', description: 'The website is now self-aware. This is on you.' },
  { id: 'skill_verified', title: 'Skill Issue: Resolved', description: 'Completed the skill verification minigame. Or you just clicked Skip. We don\'t judge.' },
  { id: 'email_copied', title: 'Puzzle Solver', description: 'Decoded the coordinate email puzzle. The email still doesn\'t work.' },
  { id: 'volume_max', title: 'Loud and Wrong', description: 'Maxed out the fake volume slider. It did nothing.' },
  { id: 'theme_cycled', title: 'Taste Test', description: 'Cycled through all five "themes." Settled on the same one.' },
  { id: 'chatbot_opened', title: 'Desperate Measures', description: 'Asked the AI assistant for help. The AI is also lying.' },
  { id: 'dev_mode', title: 'You Found It', description: 'Opened Developer Mode. With great power comes great responsibility to make things worse.' },
  { id: 'profile_full_scroll', title: '97% Complete', description: 'Scrolled through the entire portfolio. We hope it was worth it.' },
  { id: 'moving_button_caught', title: 'Faster Than Light', description: 'Clicked the button before it could move. Speedrunner mentality.' },
  { id: 'achievements_checked', title: 'Achievement Achievement', description: 'Opened the achievements panel. Meta.' },
];

const DEFAULT_STATE: RageState = {
  score: 0,
  level: 'suspiciously_normal',
  interactions: 0,
  challengesCompleted: 0,
  failedAttempts: 0,
  discoveries: [],
  achievements: [],
  loginAttempts: 0,
  mechanics: {
    cursedNav: true,
    themeSwitch: true,
    volumeSlider: true,
    cvBureaucracy: true,
    emailPuzzle: true,
    terminal: true,
    movingButton: true,
    skillMinigame: true,
    chatbot: true,
    selfAwareTooltips: true,
    progressBar: true,
    achievementSystem: true,
  },
  chaosIntensity: 50,
  sessionStart: Date.now(),
  lastEventTime: 0,
};

type Listener = (state: RageState) => void;

class RageEngineClass {
  private state: RageState;
  private listeners: Set<Listener> = new Set();
  private cooldowns: Map<string, number> = new Map();

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): RageState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<RageState>;
        return { ...DEFAULT_STATE, ...parsed, sessionStart: Date.now() };
      }
    } catch {
      // ignore corrupt storage
    }
    return { ...DEFAULT_STATE };
  }

  private saveState(): void {
    try {
      // Never persist sensitive data – there is none, but be explicit
      const safe = { ...this.state };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
    } catch {
      // storage might be disabled
    }
  }

  private notify(): void {
    this.listeners.forEach((l) => l(this.state));
  }

  private recalculateLevel(): void {
    const levels = Object.entries(LEVEL_THRESHOLDS) as [RageLevel, number][];
    levels.sort((a, b) => b[1] - a[1]);
    for (const [level, threshold] of levels) {
      if (this.state.score >= threshold) {
        const prevLevel = this.state.level;
        this.state.level = level;
        if (prevLevel !== level) {
          this.checkLevelAchievement(level);
        }
        break;
      }
    }
  }

  private checkLevelAchievement(level: RageLevel): void {
    const levelToAchievement: Partial<Record<RageLevel, string>> = {
      mildly_inconvenient: 'rage_level_2',
      aggressively_unhelpful: 'rage_level_3',
      certified_ragebait: 'rage_level_4',
      self_aware: 'rage_level_5',
    };
    const id = levelToAchievement[level];
    if (id) this.unlock(id);
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getState(): RageState {
    return { ...this.state };
  }

  addScore(points: number, reason?: string): void {
    this.state.score += Math.round(points * (this.state.chaosIntensity / 50));
    this.state.interactions++;
    this.state.lastEventTime = Date.now();
    this.recalculateLevel();
    this.saveState();
    this.notify();
    if (reason) console.debug(`[RageEngine] +${points} pts: ${reason}`);
  }

  recordFailure(): void {
    this.state.failedAttempts++;
    this.state.loginAttempts++;
    this.addScore(5, 'failure');
    this.checkAchievements();
  }

  completeChallenge(id: string, points = 20): void {
    this.state.challengesCompleted++;
    this.addScore(points, `challenge:${id}`);
  }

  discover(id: string): void {
    if (!this.state.discoveries.includes(id)) {
      this.state.discoveries.push(id);
      this.addScore(15, `discovery:${id}`);
      if (this.state.discoveries.length === 1) this.unlock('easter_egg_1');
      if (this.state.discoveries.length >= 3) this.unlock('easter_egg_2');
    }
  }

  unlock(achievementId: string): Achievement | null {
    const def = ALL_ACHIEVEMENTS.find((a) => a.id === achievementId);
    if (!def) return null;
    const already = this.state.achievements.find((a) => a.id === achievementId);
    if (already) return null;
    const unlocked: Achievement = { ...def, unlockedAt: Date.now() };
    this.state.achievements.push(unlocked);
    this.addScore(10, `achievement:${achievementId}`);
    this.saveState();
    this.notify();
    return unlocked;
  }

  checkAchievements(): void {
    const { loginAttempts, interactions } = this.state;
    if (interactions >= 1) this.unlock('first_blood');
    if (loginAttempts >= 1) this.unlock('login_fail_1');
    if (loginAttempts >= 3) this.unlock('login_fail_3');
    if (loginAttempts >= 5) this.unlock('login_fail_5');
  }

  isOnCooldown(eventId: string, ms: number): boolean {
    const last = this.cooldowns.get(eventId) ?? 0;
    return Date.now() - last < ms;
  }

  setCooldown(eventId: string): void {
    this.cooldowns.set(eventId, Date.now());
  }

  setMechanic(key: string, enabled: boolean): void {
    this.state.mechanics[key] = enabled;
    this.saveState();
    this.notify();
  }

  setChaosIntensity(value: number): void {
    this.state.chaosIntensity = Math.max(0, Math.min(100, value));
    this.saveState();
    this.notify();
  }

  reset(): void {
    this.state = { ...DEFAULT_STATE, sessionStart: Date.now() };
    this.cooldowns.clear();
    this.saveState();
    this.notify();
  }

  getLevelName(): string {
    return LEVEL_NAMES[this.state.level];
  }

  getAllAchievements(): Achievement[] {
    return ALL_ACHIEVEMENTS.map((def) => {
      const unlocked = this.state.achievements.find((a) => a.id === def.id);
      return unlocked ?? def;
    });
  }

  getNextLevelThreshold(): number {
    const levels = Object.entries(LEVEL_THRESHOLDS) as [RageLevel, number][];
    const current = LEVEL_THRESHOLDS[this.state.level];
    const next = levels
      .map(([, t]) => t)
      .filter((t) => t > current)
      .sort((a, b) => a - b)[0];
    return next ?? current;
  }
}

export const RageEngine = new RageEngineClass();
export { LEVEL_NAMES, ALL_ACHIEVEMENTS };
