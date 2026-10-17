// ============================================================
//  useRageEngine — React hook for subscribing to RageEngine
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { RageEngine } from '../engine/RageEngine';
import type { RageState } from '../types';

export function useRageEngine() {
  const [state, setState] = useState<RageState>(() => RageEngine.getState());

  useEffect(() => {
    const unsub = RageEngine.subscribe((s) => setState({ ...s }));
    return unsub;
  }, []);

  const addScore = useCallback((pts: number, reason?: string) => {
    RageEngine.addScore(pts, reason);
  }, []);

  const unlock = useCallback((id: string) => {
    return RageEngine.unlock(id);
  }, []);

  const completeChallenge = useCallback((id: string, pts?: number) => {
    RageEngine.completeChallenge(id, pts);
  }, []);

  const discover = useCallback((id: string) => {
    RageEngine.discover(id);
  }, []);

  const recordFailure = useCallback(() => {
    RageEngine.recordFailure();
    RageEngine.checkAchievements();
  }, []);

  const setMechanic = useCallback((key: string, enabled: boolean) => {
    RageEngine.setMechanic(key, enabled);
  }, []);

  const setChaosIntensity = useCallback((v: number) => {
    RageEngine.setChaosIntensity(v);
  }, []);

  const reset = useCallback(() => {
    RageEngine.reset();
  }, []);

  const getLevelName = useCallback(() => RageEngine.getLevelName(), []);

  const getAllAchievements = useCallback(() => RageEngine.getAllAchievements(), []);

  const getNextThreshold = useCallback(() => RageEngine.getNextLevelThreshold(), []);

  const isOnCooldown = useCallback((id: string, ms: number) => {
    return RageEngine.isOnCooldown(id, ms);
  }, []);

  const setCooldown = useCallback((id: string) => {
    RageEngine.setCooldown(id);
  }, []);

  return {
    state,
    addScore,
    unlock,
    completeChallenge,
    discover,
    recordFailure,
    setMechanic,
    setChaosIntensity,
    reset,
    getLevelName,
    getAllAchievements,
    getNextThreshold,
    isOnCooldown,
    setCooldown,
  };
}
