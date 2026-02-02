import { useNavigate } from 'react-router-dom';
import { HiOutlineCalendar, HiOutlineSparkles, HiOutlineLightBulb, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { Dream, MoodType } from '../../redux/api/dreamsApi';
import styles from './DreamCard.module.scss';

interface DreamCardProps {
  dream: Dream;
  view?: 'grid' | 'list';
  onDelete?: (id: string) => void;
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

const DreamCard = ({ dream, view = 'grid', onDelete }: DreamCardProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleClick = () => {
    navigate(`/dreams/${dream._id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/dreams/${dream._id}/edit`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(dream._id);
  };

  return (
    <article
      className={`${styles.card} ${view === 'list' ? styles.listView : ''}`}
      onClick={handleClick}
    >
      <div className={styles.actions}>
        <button className={styles.actionBtn} onClick={handleEdit} aria-label="Edit dream">
          <HiOutlinePencil />
        </button>
        <button
          className={`${styles.actionBtn} ${styles.delete}`}
          onClick={handleDelete}
          aria-label="Delete dream"
        >
          <HiOutlineTrash />
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{dream.title}</h3>
          {dream.mood && (
            <span className={`${styles.moodBadge} ${styles[dream.mood]}`}>
              {moodEmojis[dream.mood]} {dream.mood}
            </span>
          )}
        </div>

        <p className={styles.excerpt}>{dream.content}</p>

        {dream.tags.length > 0 && (
          <div className={styles.tags}>
            {dream.tags.slice(0, 3).map((tag) => (
              <span key={tag} className={styles.tag}>
                #{tag}
              </span>
            ))}
            {dream.tags.length > 3 && (
              <span className={styles.tag}>+{dream.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>

      <div className={styles.meta}>
        <span className={styles.date}>
          <HiOutlineCalendar />
          {formatDate(dream.date)}
        </span>

        <div className={styles.indicators}>
          {dream.isLucid && (
            <span className={`${styles.indicator} ${styles.lucid}`}>
              <HiOutlineLightBulb />
              Lucid
            </span>
          )}

          {dream.analysis && (
            <span className={`${styles.indicator} ${styles.analyzed}`}>
              <HiOutlineSparkles />
              Analyzed
            </span>
          )}

          <div className={styles.clarity}>
            {[1, 2, 3, 4, 5].map((level) => (
              <span
                key={level}
                className={`${styles.clarityDot} ${level <= dream.clarity ? styles.filled : ''}`}
              />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

export default DreamCard;
