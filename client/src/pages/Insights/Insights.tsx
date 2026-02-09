import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  useGetInsightsStatsQuery,
  useGetMoodDistributionQuery,
  useGetSymbolFrequencyQuery,
  InsightsQueryParams,
} from '../../services';
import ThemeToggle from '../../components/ThemeToggle';
import { StatCardSkeleton, ChartCardSkeleton } from '../../components/Skeleton';
import styles from './Insights.module.scss';

type Period = '7d' | '30d' | '90d' | '1y' | 'all';

const MOOD_COLORS: Record<string, string> = {
  happy: '#22c55e',
  peaceful: '#3b82f6',
  excited: '#f59e0b',
  neutral: '#94a3b8',
  confused: '#a855f7',
  anxious: '#f97316',
  sad: '#6366f1',
  fearful: '#ef4444',
};

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '1y', label: 'Last year' },
  { value: 'all', label: 'All time' },
];

export default function Insights() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>('30d');

  const queryParams: InsightsQueryParams = { period };

  const { data: statsData, isLoading: statsLoading } = useGetInsightsStatsQuery(queryParams);
  const { data: moodsData, isLoading: moodsLoading } = useGetMoodDistributionQuery(queryParams);
  const { data: symbolsData, isLoading: symbolsLoading } = useGetSymbolFrequencyQuery(queryParams);

  const stats = statsData?.data;
  const moodDistribution = moodsData?.data?.moodDistribution || [];
  const dreamsOverTime = moodsData?.data?.dreamsOverTime || [];
  const topTags = symbolsData?.data?.topTags || [];
  const topSymbols = symbolsData?.data?.topSymbols || [];

  const isLoading = statsLoading || moodsLoading || symbolsLoading;

  // Prepare pie chart data with colors
  const pieData = moodDistribution.map((item) => ({
    name: item.mood.charAt(0).toUpperCase() + item.mood.slice(1),
    value: item.count,
    color: MOOD_COLORS[item.mood] || '#94a3b8',
  }));

  return (
    <motion.div
      className={styles.insights}
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
          <h1 className={styles.title}>Dream Insights</h1>
        </div>
        <div className={styles.headerRight}>
          <select
            className={styles.periodSelect}
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
          >
            {PERIOD_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ThemeToggle />
        </div>
      </header>

      <main className={styles.main}>
        {isLoading ? (
          <>
            {/* Stats Cards Skeleton */}
            <section className={styles.statsGrid}>
              {[...Array(4)].map((_, i) => (
                <StatCardSkeleton key={i} />
              ))}
            </section>

            {/* Charts Skeleton */}
            <div className={styles.chartsGrid}>
              {[...Array(4)].map((_, i) => (
                <ChartCardSkeleton key={i} />
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Stats Cards */}
            <section className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📝</div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{stats?.totalDreams || 0}</span>
                  <span className={styles.statLabel}>Total Dreams</span>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>✨</div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{stats?.avgClarity || 0}</span>
                  <span className={styles.statLabel}>Avg. Clarity</span>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🌟</div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{stats?.lucidPercentage || 0}%</span>
                  <span className={styles.statLabel}>Lucid Dreams</span>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🏷️</div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{stats?.avgTagsPerDream || 0}</span>
                  <span className={styles.statLabel}>Avg. Tags/Dream</span>
                </div>
              </div>
            </section>

            {/* Charts Section */}
            <div className={styles.chartsGrid}>
              {/* Dreams Over Time */}
              <section className={styles.chartCard}>
                <h2 className={styles.chartTitle}>Dreams Over Time</h2>
                {dreamsOverTime.length > 0 ? (
                  <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={dreamsOverTime}>
                        <defs>
                          <linearGradient id="colorDreams" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                        <XAxis
                          dataKey="date"
                          stroke="var(--text-secondary)"
                          tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return `${date.getMonth() + 1}/${date.getDate()}`;
                          }}
                        />
                        <YAxis
                          stroke="var(--text-secondary)"
                          tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                          allowDecimals={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            color: 'var(--text-primary)',
                          }}
                          labelStyle={{ color: 'var(--text-primary)' }}
                          formatter={(value: number) => [value, 'Dreams']}
                        />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#6366f1"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorDreams)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className={styles.noData}>No data available for this period</div>
                )}
              </section>

              {/* Mood Distribution */}
              <section className={styles.chartCard}>
                <h2 className={styles.chartTitle}>Mood Distribution</h2>
                {pieData.length > 0 ? (
                  <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            color: 'var(--text-primary)',
                          }}
                          formatter={(value: number, name: string) => [value, name]}
                        />
                        <Legend
                          wrapperStyle={{ color: 'var(--text-secondary)' }}
                          formatter={(value) => (
                            <span style={{ color: 'var(--text-secondary)' }}>{value}</span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className={styles.noData}>No mood data available</div>
                )}
              </section>

              {/* Top Tags */}
              <section className={styles.chartCard}>
                <h2 className={styles.chartTitle}>Top Tags</h2>
                {topTags.length > 0 ? (
                  <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={topTags} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                        <XAxis
                          type="number"
                          stroke="var(--text-secondary)"
                          tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                          allowDecimals={false}
                        />
                        <YAxis
                          type="category"
                          dataKey="tag"
                          stroke="var(--text-secondary)"
                          tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                          width={80}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            color: 'var(--text-primary)',
                          }}
                          formatter={(value: number) => [value, 'Dreams']}
                        />
                        <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className={styles.noData}>No tags data available</div>
                )}
              </section>

              {/* Top Symbols */}
              <section className={styles.chartCard}>
                <h2 className={styles.chartTitle}>AI-Detected Symbols</h2>
                {topSymbols.length > 0 ? (
                  <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={topSymbols} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                        <XAxis
                          type="number"
                          stroke="var(--text-secondary)"
                          tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                          allowDecimals={false}
                        />
                        <YAxis
                          type="category"
                          dataKey="symbol"
                          stroke="var(--text-secondary)"
                          tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                          width={80}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            color: 'var(--text-primary)',
                          }}
                          formatter={(value: number) => [value, 'Occurrences']}
                        />
                        <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className={styles.noData}>
                    No AI analysis data yet. Analyze your dreams to see symbols here.
                  </div>
                )}
              </section>
            </div>
          </>
        )}
      </main>
    </motion.div>
  );
}
