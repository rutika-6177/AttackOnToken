// ============================================================
//  AchievementToast — floating unlock notifications
// ============================================================

import { motion, AnimatePresence } from 'motion/react';
import { Trophy } from 'lucide-react';
import { useAchievementToast } from '../hooks/useAchievementToast';
import '../styles/portfolio.css';

export default function AchievementToast() {
  const { toasts, dismiss } = useAchievementToast();

  return (
    <div className="toast-container" aria-live="polite" aria-label="Achievement notifications">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            className="toast"
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            role="status"
            onClick={() => dismiss(t.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="toast-label">
              <Trophy size={10} style={{ display: 'inline', marginRight: 4 }} />
              Achievement Unlocked
            </div>
            <div className="toast-title">{t.achievement.title}</div>
            <div className="toast-desc">{t.achievement.description}</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
