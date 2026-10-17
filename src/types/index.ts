// ============================================================
//  CTRL_ALT_CHAOS — Type Definitions
// ============================================================

export type RageLevel =
  | 'suspiciously_normal'
  | 'mildly_inconvenient'
  | 'aggressively_unhelpful'
  | 'certified_ragebait'
  | 'self_aware';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt?: number;
}

export interface RageState {
  score: number;
  level: RageLevel;
  interactions: number;
  challengesCompleted: number;
  failedAttempts: number;
  discoveries: string[];
  achievements: Achievement[];
  loginAttempts: number;
  mechanics: Record<string, boolean>;
  chaosIntensity: number; // 0–100
  sessionStart: number;
  lastEventTime: number;
}

export interface ChallengeResult {
  passed: boolean;
  message: string;
  pointsAwarded: number;
}

export interface TerminalCommand {
  command: string;
  response: string | (() => string);
  hidden?: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  year: number;
  status: 'shipped' | 'in-progress' | 'abandoned';
  link?: string;
  details: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string[];
}

export interface Skill {
  name: string;
  level: number; // 1-5
  category: 'language' | 'framework' | 'tool' | 'design';
}
