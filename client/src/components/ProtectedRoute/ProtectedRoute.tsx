import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../redux/store';
import { useGetMeQuery } from '../../services';
import styles from './ProtectedRoute.module.scss';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAppSelector((state) => state.auth);
  const { isLoading: queryLoading } = useGetMeQuery(undefined, {
    skip: isAuthenticated,
  });

  const isLoading = authLoading || queryLoading;

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p className={styles.loadingText}>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
