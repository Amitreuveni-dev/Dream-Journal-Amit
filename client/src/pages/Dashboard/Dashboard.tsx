import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppSelector } from '../../redux/store';
import { useLogoutMutation, useDeleteDreamMutation, Dream } from '../../services';
import DreamList from '../../components/DreamList';
import DreamForm from '../../components/DreamForm';
import DreamDetail from '../../components/DreamDetail';
import ThemeToggle from '../../components/ThemeToggle';
import styles from './Dashboard.module.scss';

export default function Dashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [deleteDream] = useDeleteDreamMutation();
  const navigate = useNavigate();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDream, setEditingDream] = useState<Dream | null>(null);
  const [viewingDream, setViewingDream] = useState<Dream | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success('Logged out successfully');
      navigate('/');
    } catch {
      toast.error('Logout failed');
    }
  };

  const handleCreateNew = () => {
    setEditingDream(null);
    setIsFormOpen(true);
  };

  const handleEdit = (dream: Dream) => {
    setEditingDream(dream);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Move this dream to trash?')) {
      try {
        await deleteDream(id).unwrap();
        toast.success('Dream moved to trash');
      } catch {
        toast.error('Failed to delete dream');
      }
    }
  };

  const handleView = (dream: Dream) => {
    setViewingDream(dream);
    setIsDetailOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingDream(null);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setViewingDream(null);
  };

  const handleDreamUpdate = (updatedDream: Dream) => {
    setViewingDream(updatedDream);
  };

  return (
    <motion.div
      className={styles.dashboard}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🌙</span>
          <span className={styles.logoText}>NightLog</span>
        </div>
        <div className={styles.userSection}>
          <button className={styles.profileBtn} onClick={() => navigate('/profile')}>
            <span className={styles.avatar}>
              {user?.avatar ? (
                <img src={user.avatar} alt={user.username} />
              ) : (
                user?.username?.charAt(0).toUpperCase()
              )}
            </span>
            <span className={styles.greeting}>{user?.username}</span>
          </button>
          <ThemeToggle />
          <button className={styles.homeBtn} onClick={() => navigate('/')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Home
          </button>
          <button className={styles.insightsBtn} onClick={() => navigate('/insights')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3v18h18" />
              <path d="M18 9l-5 5-4-4-6 6" />
            </svg>
            Insights
          </button>
          <button className={styles.trashBtn} onClick={() => navigate('/trash')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Trash
          </button>
          <button
            className={styles.logoutBtn}
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <DreamList
          onCreateNew={handleCreateNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      </main>

      <DreamForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        editDream={editingDream}
      />

      <DreamDetail
        dream={viewingDream}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDreamUpdate={handleDreamUpdate}
      />
    </motion.div>
  );
}
