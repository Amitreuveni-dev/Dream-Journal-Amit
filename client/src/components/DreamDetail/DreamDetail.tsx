import { motion, AnimatePresence } from 'framer-motion';
import { Dream } from '../../services/dreamsApi';
import { MoodType } from '../../validation/dreamSchemas';
import styles from './DreamDetail.module.scss';

interface DreamDetailProps {
  dream: Dream | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (dream: Dream) => void;
  onDelete: (id: string) => void;
}

const moodEmojis: Record<MoodType, string> = {
  happy: '😊',
  sad: '😢',
  anxious: '😰',
  peaceful: '😌',
  confused: '😕',
  excited: '🤩',
  fearful: '😨',
  neutral: '😐',
};

export default function DreamDetail({ dream, isOpen, onClose, onEdit, onDelete }: DreamDetailProps) {
  if (!dream) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.header}>
              <div className={styles.headerContent}>
                <div className={styles.meta}>
                  <span className={styles.date}>{formatDate(dream.date)}</span>
                  {dream.isLucid && (
                    <span className={styles.lucidBadge}>
                      <span>✨</span> Lucid Dream
                    </span>
                  )}
                </div>
                <h2 className={styles.title}>{dream.title}</h2>
              </div>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={onClose}
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className={styles.content}>
              <div className={styles.dreamContent}>
                {dream.content.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className={styles.details}>
                {dream.tags.length > 0 && (
                  <div className={styles.section}>
                    <h4 className={styles.sectionTitle}>Tags</h4>
                    <div className={styles.tags}>
                      {dream.tags.map((tag) => (
                        <span key={tag} className={styles.tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className={styles.indicators}>
                  {dream.mood && (
                    <div className={styles.indicator}>
                      <span className={styles.indicatorLabel}>Mood</span>
                      <span className={styles.indicatorValue}>
                        {moodEmojis[dream.mood]} {dream.mood}
                      </span>
                    </div>
                  )}
                  {dream.clarity && (
                    <div className={styles.indicator}>
                      <span className={styles.indicatorLabel}>Clarity</span>
                      <span className={styles.indicatorValue}>
                        {'★'.repeat(dream.clarity)}{'☆'.repeat(5 - dream.clarity)}
                      </span>
                    </div>
                  )}
                </div>

                {dream.analysis && (
                  <div className={styles.section}>
                    <h4 className={styles.sectionTitle}>AI Analysis</h4>
                    {dream.analysis.interpretation && (
                      <p className={styles.interpretation}>{dream.analysis.interpretation}</p>
                    )}
                    {dream.analysis.symbols && dream.analysis.symbols.length > 0 && (
                      <div className={styles.symbols}>
                        <span className={styles.symbolsLabel}>Symbols:</span>
                        {dream.analysis.symbols.map((symbol) => (
                          <span key={symbol} className={styles.symbol}>{symbol}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.footer}>
              <button
                className={styles.deleteBtn}
                onClick={() => {
                  onDelete(dream._id);
                  onClose();
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Delete
              </button>
              <button
                className={styles.editBtn}
                onClick={() => {
                  onEdit(dream);
                  onClose();
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit Dream
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
