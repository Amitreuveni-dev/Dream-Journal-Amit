import { motion } from 'framer-motion';
import { Dream } from '../../services/dreamsApi';
import styles from './DreamCard.module.scss';

interface DreamCardProps {
  dream: Dream;
  onEdit: (dream: Dream) => void;
  onDelete: (id: string) => void;
  onClick: (dream: Dream) => void;
}

const moodEmojis: Record<string, string> = {
  happy: '😊',
  sad: '😢',
  anxious: '😰',
  peaceful: '😌',
  confused: '😕',
  excited: '🤩',
  fearful: '😨',
  neutral: '😐',
};

export default function DreamCard({ dream, onEdit, onDelete, onClick }: DreamCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength).trim() + '...';
  };

  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => onClick(dream)}
    >
      <div className={styles.header}>
        <div className={styles.meta}>
          <span className={styles.date}>{formatDate(dream.date)}</span>
          {dream.isLucid && (
            <span className={styles.lucidBadge}>
              <span className={styles.lucidIcon}>✨</span>
              Lucid
            </span>
          )}
        </div>
        <div className={styles.actions}>
          <button
            className={styles.actionBtn}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(dream);
            }}
            aria-label="Edit dream"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            className={`${styles.actionBtn} ${styles.deleteBtn}`}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(dream._id);
            }}
            aria-label="Delete dream"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>

      <h3 className={styles.title}>{dream.title}</h3>
      <p className={styles.content}>{truncateContent(dream.content)}</p>

      <div className={styles.footer}>
        <div className={styles.tags}>
          {dream.tags.slice(0, 3).map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
          {dream.tags.length > 3 && (
            <span className={styles.moreTag}>+{dream.tags.length - 3}</span>
          )}
        </div>
        <div className={styles.indicators}>
          {dream.mood && (
            <span className={styles.mood} title={dream.mood}>
              {moodEmojis[dream.mood] || '😐'}
            </span>
          )}
          {dream.clarity && (
            <span className={styles.clarity} title={`Clarity: ${dream.clarity}/5`}>
              {'★'.repeat(dream.clarity)}
              {'☆'.repeat(5 - dream.clarity)}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
