import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  useGetTrashedDreamsQuery,
  useRestoreDreamMutation,
  usePermanentDeleteDreamMutation,
  Dream,
} from '../../services';
import DreamDetail from '../../components/DreamDetail/DreamDetail';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';
import { TrashCardSkeleton } from '../../components/Skeleton/Skeleton';
import styles from './Trash.module.scss';

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

export default function Trash() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetTrashedDreamsQuery();
  const [restoreDream] = useRestoreDreamMutation();
  const [permanentDeleteDream] = usePermanentDeleteDreamMutation();

  const [viewingDream, setViewingDream] = useState<Dream | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const trashedDreams = data?.dreams || [];

  const handleRestore = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await restoreDream(id).unwrap();
      toast.success('Dream restored successfully');
      if (viewingDream?._id === id) {
        setIsDetailOpen(false);
        setViewingDream(null);
      }
    } catch {
      toast.error('Failed to restore dream');
    }
  };

  const handlePermanentDelete = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (window.confirm('Permanently delete this dream? This action cannot be undone.')) {
      try {
        await permanentDeleteDream(id).unwrap();
        toast.success('Dream permanently deleted');
        if (viewingDream?._id === id) {
          setIsDetailOpen(false);
          setViewingDream(null);
        }
      } catch {
        toast.error('Failed to delete dream');
      }
    }
  };

  const handleView = (dream: Dream) => {
    setViewingDream(dream);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setViewingDream(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDeletedAt = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    const daysLeft = 30 - diffDays;
    if (daysLeft <= 0) return 'Expiring soon';
    return `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`;
  };

  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength).trim() + '...';
  };

  return (
    <motion.div
      className={styles.trash}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>
              <span className={styles.trashIcon}>🗑️</span>
              Trash
            </h1>
            <span className={styles.count}>
              {trashedDreams.length} dream{trashedDreams.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <div className={styles.headerRight}>
          <p className={styles.subtitle}>
            Dreams in trash are automatically deleted after 30 days
          </p>
          <ThemeToggle />
        </div>
      </header>

      <main className={styles.main}>
        {isLoading ? (
          <div className={styles.grid}>
            {[...Array(6)].map((_, i) => (
              <TrashCardSkeleton key={i} />
            ))}
          </div>
        ) : trashedDreams.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🌙</span>
            <h2>Trash is empty</h2>
            <p>Dreams you delete will appear here for 30 days before being permanently removed.</p>
            <button className={styles.backToDashboard} onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            <AnimatePresence mode="popLayout">
              {trashedDreams.map((dream) => (
                <motion.article
                  key={dream._id}
                  className={styles.card}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => handleView(dream)}
                >
                  <div className={styles.cardHeader}>
                    <div className={styles.meta}>
                      <span className={styles.date}>{formatDate(dream.date)}</span>
                      {dream.isLucid && (
                        <span className={styles.lucidBadge}>
                          <span className={styles.lucidIcon}>✨</span>
                          Lucid
                        </span>
                      )}
                    </div>
                    <span className={styles.expiryBadge}>{formatDeletedAt(dream.deletedAt)}</span>
                  </div>

                  <h3 className={styles.cardTitle}>{dream.title}</h3>
                  <p className={styles.cardContent}>{truncateContent(dream.content)}</p>

                  <div className={styles.cardFooter}>
                    <div className={styles.tags}>
                      {dream.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className={styles.tag}>
                          {tag}
                        </span>
                      ))}
                      {dream.tags.length > 2 && (
                        <span className={styles.moreTag}>+{dream.tags.length - 2}</span>
                      )}
                    </div>
                    <div className={styles.indicators}>
                      {dream.mood && (
                        <span className={styles.mood} title={dream.mood}>
                          {moodEmojis[dream.mood] || '😐'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.cardActions}>
                    <button
                      className={styles.restoreBtn}
                      onClick={(e) => handleRestore(dream._id, e)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        <path d="M3 3v5h5" />
                      </svg>
                      Restore
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={(e) => handlePermanentDelete(dream._id, e)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {viewingDream && (
        <DreamDetail
          dream={viewingDream}
          isOpen={isDetailOpen}
          onClose={handleCloseDetail}
          onEdit={() => handleRestore(viewingDream._id)}
          onDelete={() => handlePermanentDelete(viewingDream._id)}
        />
      )}
    </motion.div>
  );
}
