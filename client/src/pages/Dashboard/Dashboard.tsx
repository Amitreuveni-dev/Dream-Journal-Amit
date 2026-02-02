import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineViewGrid,
  HiOutlineViewList,
  HiOutlineMoon,
  HiOutlineSparkles,
  HiOutlineLightBulb,
  HiOutlineCalendar,
} from 'react-icons/hi';
import { useGetDreamsQuery, useDeleteDreamMutation, MoodType } from '../../redux/api/dreamsApi';
import {
  setSearch,
  setMoodFilter,
  setLucidFilter,
  setSort,
  setView,
  clearFilters,
} from '../../redux/slices/dreamsSlice';
import { RootState } from '../../redux/store';
import DreamCard from '../../components/DreamCard';
import Navbar from '../../components/Navbar/Navbar';
import styles from './Dashboard.module.scss';

const moods: { value: MoodType | ''; label: string }[] = [
  { value: '', label: 'All Moods' },
  { value: 'happy', label: '😊 Happy' },
  { value: 'sad', label: '😢 Sad' },
  { value: 'anxious', label: '😰 Anxious' },
  { value: 'peaceful', label: '😌 Peaceful' },
  { value: 'confused', label: '😕 Confused' },
  { value: 'excited', label: '🤩 Excited' },
  { value: 'fearful', label: '😨 Fearful' },
  { value: 'neutral', label: '😐 Neutral' },
];

const Dashboard = () => {
  const dispatch = useDispatch();
  const { filters, view } = useSelector((state: RootState) => state.dreams);
  const [showFilters, setShowFilters] = useState(false);

  const queryParams = useMemo(() => ({
    search: filters.search || undefined,
    mood: filters.mood || undefined,
    isLucid: filters.isLucid ?? undefined,
    sort: filters.sort,
  }), [filters]);

  const { data, isLoading, isFetching } = useGetDreamsQuery(queryParams);
  const [deleteDream] = useDeleteDreamMutation();

  const handleDelete = async (id: string) => {
    if (window.confirm('Move this dream to trash?')) {
      await deleteDream(id);
    }
  };

  const dreams = data?.dreams ?? [];
  const stats = useMemo(() => ({
    total: dreams.length,
    lucid: dreams.filter((d) => d.isLucid).length,
    analyzed: dreams.filter((d) => d.analysis).length,
    thisMonth: dreams.filter((d) => {
      const dreamDate = new Date(d.date);
      const now = new Date();
      return (
        dreamDate.getMonth() === now.getMonth() &&
        dreamDate.getFullYear() === now.getFullYear()
      );
    }).length,
  }), [dreams]);

  const hasActiveFilters = filters.search || filters.mood || filters.isLucid !== null;

  return (
    <>
      <Navbar />
      <main className={styles.dashboard}>
        <div className={styles.container}>
          <header className={styles.header}>
            <div className={styles.titleSection}>
              <h1>Dream Journal</h1>
              <p>Record and explore your subconscious mind</p>
            </div>
            <Link to="/dreams/new" className={styles.newDreamBtn}>
              <HiOutlinePlus />
              New Dream
            </Link>
          </header>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🌙</div>
              <div className={styles.statInfo}>
                <h3>{stats.total}</h3>
                <p>Total Dreams</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <HiOutlineLightBulb />
              </div>
              <div className={styles.statInfo}>
                <h3>{stats.lucid}</h3>
                <p>Lucid Dreams</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <HiOutlineSparkles />
              </div>
              <div className={styles.statInfo}>
                <h3>{stats.analyzed}</h3>
                <p>AI Analyzed</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <HiOutlineCalendar />
              </div>
              <div className={styles.statInfo}>
                <h3>{stats.thisMonth}</h3>
                <p>This Month</p>
              </div>
            </div>
          </div>

          <div className={styles.toolbar}>
            <div className={styles.searchWrapper}>
              <HiOutlineSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search dreams..."
                className={styles.searchInput}
                value={filters.search}
                onChange={(e) => dispatch(setSearch(e.target.value))}
              />
            </div>

            <div className={styles.toolbarActions}>
              <button
                className={`${styles.filterBtn} ${showFilters ? styles.active : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <HiOutlineFilter />
                Filters
              </button>
              <button
                className={`${styles.viewBtn} ${view === 'grid' ? styles.active : ''}`}
                onClick={() => dispatch(setView('grid'))}
                aria-label="Grid view"
              >
                <HiOutlineViewGrid />
              </button>
              <button
                className={`${styles.viewBtn} ${view === 'list' ? styles.active : ''}`}
                onClick={() => dispatch(setView('list'))}
                aria-label="List view"
              >
                <HiOutlineViewList />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className={styles.filterPanel}>
              <div className={styles.filterGroup}>
                <label>Mood</label>
                <select
                  value={filters.mood}
                  onChange={(e) => dispatch(setMoodFilter(e.target.value as MoodType | ''))}
                >
                  {moods.map((mood) => (
                    <option key={mood.value} value={mood.value}>
                      {mood.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>Type</label>
                <select
                  value={filters.isLucid === null ? '' : String(filters.isLucid)}
                  onChange={(e) => {
                    const value = e.target.value;
                    dispatch(setLucidFilter(value === '' ? null : value === 'true'));
                  }}
                >
                  <option value="">All Types</option>
                  <option value="true">Lucid Only</option>
                  <option value="false">Non-Lucid Only</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>Sort By</label>
                <select
                  value={filters.sort}
                  onChange={(e) => dispatch(setSort(e.target.value as typeof filters.sort))}
                >
                  <option value="-date">Newest First</option>
                  <option value="date">Oldest First</option>
                  <option value="title">Title A-Z</option>
                  <option value="-title">Title Z-A</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  className={styles.clearFiltersBtn}
                  onClick={() => dispatch(clearFilters())}
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {isLoading ? (
            <div className={styles.loadingGrid}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className={styles.skeletonCard} />
              ))}
            </div>
          ) : dreams.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>
                <HiOutlineMoon />
              </span>
              <h2 className={styles.emptyTitle}>
                {hasActiveFilters ? 'No dreams found' : 'No dreams yet'}
              </h2>
              <p className={styles.emptyText}>
                {hasActiveFilters
                  ? 'Try adjusting your filters or search terms.'
                  : 'Start recording your dreams to unlock insights from your subconscious mind.'}
              </p>
              {!hasActiveFilters && (
                <Link to="/dreams/new" className={styles.newDreamBtn}>
                  <HiOutlinePlus />
                  Record Your First Dream
                </Link>
              )}
            </div>
          ) : (
            <div className={`${styles.dreamsGrid} ${view === 'list' ? styles.listView : ''}`}>
              {dreams.map((dream) => (
                <DreamCard
                  key={dream._id}
                  dream={dream}
                  view={view}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {isFetching && !isLoading && (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>
              Updating...
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Dashboard;
