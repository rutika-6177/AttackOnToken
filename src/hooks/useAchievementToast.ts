// ============================================================
//  useAchievementToast — shows achievement popups
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { RageEngine } from '../engine/RageEngine';
import type { Achievement } from '../types';

interface Toast {
  id: string;
  achievement: Achievement;
  visible: boolean;
}

export function useAchievementToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const prevAchievements = useRef<string[]>([]);

  useEffect(() => {
    const unsub = RageEngine.subscribe((state) => {
      const currentIds = state.achievements.map((a) => a.id);
      const newOnes = currentIds.filter((id) => !prevAchievements.current.includes(id));
      if (newOnes.length > 0) {
        const newAchievements = state.achievements.filter((a) => newOnes.includes(a.id));
        setToasts((prev) => [
          ...prev,
          ...newAchievements.map((a) => ({ id: a.id, achievement: a, visible: true })),
        ]);
        setTimeout(() => {
          setToasts((prev) =>
            prev.map((t) =>
              newOnes.includes(t.id) ? { ...t, visible: false } : t,
            ),
          );
        }, 4000);
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => !newOnes.includes(t.id)));
        }, 4600);
      }
      prevAchievements.current = currentIds;
    });
    return unsub;
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, dismiss };
}
