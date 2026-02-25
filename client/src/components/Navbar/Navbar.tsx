import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useAppSelector } from '../../redux/store';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './Navbar.module.scss';

export default function Navbar() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

          <div className={styles.menuWrapper} ref={menuRef}>
            <button
              className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerOpen : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  className={styles.dropdown}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  <button className={styles.menuItem} onClick={() => { toggleTheme(); setIsMenuOpen(false); }}>
                    {theme === 'dark' ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="5" />
                        <line x1="12" y1="1" x2="12" y2="3" />
                        <line x1="12" y1="21" x2="12" y2="23" />
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                        <line x1="1" y1="12" x2="3" y2="12" />
                        <line x1="21" y1="12" x2="23" y2="12" />
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                      </svg>
                    )}
                    <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                  </button>

                  <div className={styles.menuDivider} />

                  <a href="#features" className={styles.menuItem} onClick={() => setIsMenuOpen(false)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span>Features</span>
                  </a>

                  <a href="#how-it-works" className={styles.menuItem} onClick={() => setIsMenuOpen(false)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>How It Works</span>
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
