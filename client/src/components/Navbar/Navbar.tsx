import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAppSelector } from '../../redux/store';
import styles from './Navbar.module.scss';

export default function Navbar() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  const navbarBackground = useTransform(
    scrollY,
    [0, 100],
    ['rgba(10, 10, 15, 0)', 'rgba(10, 10, 15, 0.95)']
  );

  const navbarBlur = useTransform(
    scrollY,
    [0, 100],
    ['blur(0px)', 'blur(12px)']
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}
      style={{
        backgroundColor: navbarBackground,
        backdropFilter: navbarBlur,
      }}
    >
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>🌙</span>
          <span className={styles.logoText}>NightLog</span>
        </Link>

        <div className={styles.navLinks}>
          <a href="#features" className={styles.navLink}>
            Features
          </a>
          <a href="#how-it-works" className={styles.navLink}>
            How It Works
          </a>
        </div>

        <div className={styles.authButtons}>
          {isAuthenticated ? (
            <Link to="/dashboard" className={styles.signupBtn}>
              My Dreams
            </Link>
          ) : (
            <>
              <Link to="/login" className={styles.loginBtn}>
                Log In
              </Link>
              <Link to="/register" className={styles.signupBtn}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
