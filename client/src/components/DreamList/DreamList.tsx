import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dream, DreamsQueryParams, useGetDreamsQuery } from '../../services';
import { moodOptions, MoodType } from '../../validation/dreamSchemas';
import DreamCard from '../DreamCard/DreamCard';
import { DreamCardSkeleton } from '../Skeleton/Skeleton';
import styles from './DreamList.module.scss';

interface DreamListProps {
  onEdit: (dream: Dream) => void;
  onDelete: (id: string) => void;
  onView: (dream: Dream) => void;
  onCreateNew: () => void;
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

export default function DreamList({ onEdit, onDelete, onView, onCreateNew }: DreamListProps) {
  const [filters, setFilters] = useState<DreamsQueryParams>({
    page: 1,
    limit: 12,
    sortBy: 'date',
    sortOrder: 'desc',
  });
  const [searchInput, setSearchInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, isFetching } = useGetDreamsQuery(filters);

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleMoodFilter = (mood: MoodType | undefined) => {
    setFilters((prev) => ({ ...prev, mood, page: 1 }));
  };

  const handleLucidFilter = (isLucid: boolean | undefined) => {
    setFilters((prev) => ({ ...prev, isLucid, page: 1 }));
  };

  const handleSortChange = (sortBy: 'date' | 'createdAt' | 'title') => {
    setFilters((prev) => ({ ...prev, sortBy, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      sortBy: 'date',
      sortOrder: 'desc',
    });
    setSearchInput('');
  };

  const hasActiveFilters = filters.search || filters.mood || filters.isLucid !== undefined;

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div className={styles.searchBar}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search dreams..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.searchInput}
          />
          {searchInput && (
            <button
              className={styles.clearSearch}
              onClick={() => {
                setSearchInput('');
                setFilters((prev) => ({ ...prev, search: undefined, page: 1 }));
              }}
            >
              ×
            </button>
          )}
        </div>

        <div className={styles.actions}>
          <button
            className={`${styles.filterBtn} ${showFilters ? styles.filterBtnActive : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Filters
            {hasActiveFilters && <span className={styles.filterBadge} />}
          </button>

          <button className={styles.createBtn} onClick={onCreateNew}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Dream
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            className={styles.filtersPanel}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Mood</label>
              <div className={styles.moodFilters}>
                <button
                  className={`${styles.moodFilterBtn} ${!filters.mood ? styles.moodFilterActive : ''}`}
                  onClick={() => handleMoodFilter(undefined)}
                >
                  All
                </button>
                {moodOptions.map((mood) => (
                  <button
                    key={mood}
                    className={`${styles.moodFilterBtn} ${filters.mood === mood ? styles.moodFilterActive : ''}`}
                    onClick={() => handleMoodFilter(mood)}
                    title={mood}
                  >
                    {moodEmojis[mood]}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Type</label>
              <div className={styles.typeFilters}>
                <button
                  className={`${styles.typeBtn} ${filters.isLucid === undefined ? styles.typeBtnActive : ''}`}
                  onClick={() => handleLucidFilter(undefined)}
                >
                  All Dreams
                </button>
                <button
                  className={`${styles.typeBtn} ${filters.isLucid === true ? styles.typeBtnActive : ''}`}
                  onClick={() => handleLucidFilter(true)}
                >
                  Lucid Only
                </button>
                <button
                  className={`${styles.typeBtn} ${filters.isLucid === false ? styles.typeBtnActive : ''}`}
                  onClick={() => handleLucidFilter(false)}
                >
                  Regular Only
                </button>
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Sort By</label>
              <div className={styles.sortFilters}>
                <button
                  className={`${styles.sortBtn} ${filters.sortBy === 'date' ? styles.sortBtnActive : ''}`}
                  onClick={() => handleSortChange('date')}
                >
                  Dream Date
                </button>
                <button
                  className={`${styles.sortBtn} ${filters.sortBy === 'createdAt' ? styles.sortBtnActive : ''}`}
                  onClick={() => handleSortChange('createdAt')}
                >
                  Created
                </button>
                <button
                  className={`${styles.sortBtn} ${filters.sortBy === 'title' ? styles.sortBtnActive : ''}`}
                  onClick={() => handleSortChange('title')}
                >
                  Title
                </button>
              </div>
            </div>

            {hasActiveFilters && (
              <button className={styles.clearFilters} onClick={clearFilters}>
                Clear all filters
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className={styles.loadingGrid}>
          {[...Array(6)].map((_, i) => (
            <DreamCardSkeleton key={i} />
          ))}
        </div>
      ) : data?.dreams.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🌙</div>
          <h3>No dreams found</h3>
          <p>
            {hasActiveFilters
              ? 'Try adjusting your filters or search terms'
              : 'Start recording your dreams to see them here'}
          </p>
          {!hasActiveFilters && (
            <button className={styles.emptyBtn} onClick={onCreateNew}>
              Record your first dream
            </button>
          )}
        </div>
      ) : (
        <>
          <div className={`${styles.grid} ${isFetching ? styles.gridFetching : ''}`}>
            {data?.dreams.map((dream) => (
              <DreamCard
                key={dream._id}
                dream={dream}
                onEdit={onEdit}
                onDelete={onDelete}
                onClick={onView}
              />
            ))}
          </div>

          {data && data.pagination.pages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                onClick={() => handlePageChange(data.pagination.page - 1)}
                disabled={data.pagination.page === 1}
              >
                Previous
              </button>
              <span className={styles.pageInfo}>
                Page {data.pagination.page} of {data.pagination.pages}
              </span>
              <button
                className={styles.pageBtn}
                onClick={() => handlePageChange(data.pagination.page + 1)}
                disabled={data.pagination.page === data.pagination.pages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
