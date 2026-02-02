import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppSelector } from '../../redux/store';
import { useLogoutMutation, useDeleteDreamMutation, Dream } from '../../services';
import DreamList from '../../components/DreamList';
import DreamForm from '../../components/DreamForm';
import DreamDetail from '../../components/DreamDetail';
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
          <span className={styles.greeting}>Hello, {user?.username}</span>
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
      />
    </motion.div>
  );
}
