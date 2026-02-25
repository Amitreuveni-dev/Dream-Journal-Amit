import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector } from '../../redux/store';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './Navbar.module.scss';

export default function Navbar() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const {
    theme,
    toggleTheme,
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    highContrast,
    toggleHighContrast,
  } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
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
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
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
                  {/* Theme toggle */}
                  <button
                    className={styles.menuItem}
                    onClick={() => {
                      toggleTheme();
                      setIsMenuOpen(false);
                    }}
                  >
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

                  {/* Font size */}
                  <div className={styles.menuSection}>
                    <span className={styles.menuLabel}>Text Size</span>
                    <div className={styles.fontControls}>
                      <button
                        className={styles.fontBtn}
                        onClick={decreaseFontSize}
                        disabled={fontSize === 'small'}
                        aria-label="Decrease font size"
                        title="Smaller text"
                      >
                        <span className={styles.fontSmall}>A</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="9" height="9">
                          <polyline points="18 15 12 9 6 15" />
                        </svg>
                      </button>
                      <button
                        className={styles.fontBtn}
                        onClick={increaseFontSize}
                        disabled={fontSize === 'large'}
                        aria-label="Increase font size"
                        title="Larger text"
                      >
                        <span className={styles.fontLarge}>A</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="9" height="9">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* High contrast */}
                  <button
                    className={`${styles.menuItem} ${highContrast ? styles.menuItemActive : ''}`}
                    onClick={() => {
                      toggleHighContrast();
                      setIsMenuOpen(false);
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a10 10 0 0 1 0 20V2z" fill="currentColor" stroke="none" />
                    </svg>
                    <span>High Contrast</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}
