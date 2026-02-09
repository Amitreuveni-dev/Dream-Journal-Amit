import styles from './Skeleton.module.scss';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'textSm' | 'textLg' | 'title' | 'avatar' | 'button' | 'badge';
  style?: React.CSSProperties;
}

export function Skeleton({ className, width, height, variant, style }: SkeletonProps) {
  const variantClass = variant ? styles[variant] : '';

  return (
    <div
      className={`${styles.skeleton} ${variantClass} ${className || ''}`}
      style={{
        width: width,
        height: height,
        ...style,
      }}
    />
  );
}

// Dream Card Skeleton
export function DreamCardSkeleton() {
  return (
    <div className={styles.dreamCard}>
      <div className={styles.dreamCardHeader}>
        <div className={styles.dreamCardMeta}>
          <Skeleton width={80} height={13} />
          <Skeleton variant="badge" width={55} />
        </div>
      </div>
      <Skeleton className={styles.dreamCardTitle} />
      <div className={styles.dreamCardContent}>
        <Skeleton variant="text" />
        <Skeleton variant="text" width="90%" />
        <Skeleton variant="text" width="75%" />
      </div>
      <div className={styles.dreamCardFooter}>
        <div className={styles.dreamCardTags}>
          <Skeleton className={styles.dreamCardTag} />
          <Skeleton className={styles.dreamCardTag} width={70} />
        </div>
        <div className={styles.dreamCardIndicators}>
          <Skeleton width={24} height={24} style={{ borderRadius: '50%' }} />
          <Skeleton width={60} height={14} />
        </div>
      </div>
    </div>
  );
}

// Trash Card Skeleton (with restore/delete actions)
export function TrashCardSkeleton() {
  return (
    <div className={styles.trashCard}>
      <div className={styles.dreamCardHeader}>
        <div className={styles.dreamCardMeta}>
          <Skeleton width={80} height={13} />
          <Skeleton variant="badge" width={55} />
        </div>
        <Skeleton width={70} height={20} style={{ borderRadius: '6px' }} />
      </div>
      <Skeleton className={styles.dreamCardTitle} />
      <div className={styles.dreamCardContent}>
        <Skeleton variant="text" />
        <Skeleton variant="text" width="90%" />
        <Skeleton variant="text" width="75%" />
      </div>
      <div className={styles.dreamCardFooter}>
        <div className={styles.dreamCardTags}>
          <Skeleton className={styles.dreamCardTag} />
          <Skeleton className={styles.dreamCardTag} width={50} />
        </div>
        <Skeleton width={24} height={24} style={{ borderRadius: '50%' }} />
      </div>
      <div className={styles.trashCardActions}>
        <Skeleton className={styles.trashCardAction} />
        <Skeleton className={styles.trashCardAction} />
      </div>
    </div>
  );
}

// Stat Card Skeleton
export function StatCardSkeleton() {
  return (
    <div className={styles.statCard}>
      <Skeleton className={styles.statIcon} />
      <div className={styles.statInfo}>
        <Skeleton className={styles.statValue} />
        <Skeleton className={styles.statLabel} />
      </div>
    </div>
  );
}

// Chart Card Skeleton
export function ChartCardSkeleton() {
  return (
    <div className={styles.chartCard}>
      <Skeleton className={styles.chartTitle} />
      <div className={styles.chartArea}>
        <Skeleton className={styles.chartBar} height={40} width="80%" />
        <Skeleton className={styles.chartBar} height={60} width="60%" />
        <Skeleton className={styles.chartBar} height={80} width="90%" />
        <Skeleton className={styles.chartBar} height={50} width="70%" />
        <Skeleton className={styles.chartBar} height={30} width="50%" />
      </div>
    </div>
  );
}

// Profile Section Skeleton
export function ProfileSectionSkeleton() {
  return (
    <div className={styles.profileSection}>
      <Skeleton className={styles.profileSectionTitle} />
      <div className={styles.profileAvatar}>
        <Skeleton className={styles.profileAvatarCircle} />
        <div className={styles.profileAvatarInfo}>
          <Skeleton width={150} height={14} />
        </div>
      </div>
      <div className={styles.profileInputGroup}>
        <Skeleton className={styles.profileLabel} />
        <Skeleton className={styles.profileInput} />
      </div>
      <div className={styles.profileInputGroup}>
        <Skeleton className={styles.profileLabel} />
        <Skeleton className={styles.profileInput} />
      </div>
      <div className={styles.profileInputGroup}>
        <Skeleton className={styles.profileLabel} width={40} />
        <Skeleton className={styles.profileTextarea} />
      </div>
      <Skeleton className={styles.profileButton} />
    </div>
  );
}

// Preferences Section Skeleton
export function PreferencesSectionSkeleton() {
  return (
    <div className={styles.profileSection}>
      <Skeleton className={styles.profileSectionTitle} width={120} />
      <div className={styles.preferenceItem}>
        <div className={styles.preferenceInfo}>
          <Skeleton className={styles.preferenceTitle} width={80} />
          <Skeleton className={styles.preferenceDesc} />
        </div>
        <Skeleton className={styles.preferenceToggle} />
      </div>
      <div className={styles.preferenceItem}>
        <div className={styles.preferenceInfo}>
          <Skeleton className={styles.preferenceTitle} />
          <Skeleton className={styles.preferenceDesc} width={180} />
        </div>
        <Skeleton className={styles.preferenceToggle} />
      </div>
      <div className={styles.preferenceItem}>
        <div className={styles.preferenceInfo}>
          <Skeleton className={styles.preferenceTitle} width={100} />
          <Skeleton className={styles.preferenceDesc} width={220} />
        </div>
        <Skeleton className={styles.preferenceToggle} />
      </div>
    </div>
  );
}

// Security Section Skeleton
export function SecuritySectionSkeleton() {
  return (
    <div className={styles.profileSection}>
      <Skeleton className={styles.profileSectionTitle} width={100} />
      <Skeleton className={styles.profileButton} width={160} />
    </div>
  );
}

export default Skeleton;
