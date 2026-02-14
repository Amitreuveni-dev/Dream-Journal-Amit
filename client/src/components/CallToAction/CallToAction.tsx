import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAppSelector } from '../../redux/store';
import styles from './CallToAction.module.scss';

export default function CallToAction() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section ref={sectionRef} className={styles.cta}>
      {/* Background gradient */}
      <div className={styles.background}>
        <motion.div className={styles.gradientOrb} style={{ y }} />
      </div>

      <motion.div className={styles.container} style={{ opacity }}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className={styles.emoji}>🌙</span>

          <h2 className={styles.title}>
            Ready to Explore Your
            <br />
            <span className={styles.gradient}>Subconscious Mind?</span>
          </h2>

          <p className={styles.subtitle}>
            Join thousands of dreamers who are unlocking the secrets of their
            minds. Start your journey today, completely free.
          </p>

          <div className={styles.buttons}>
            <Link to={isAuthenticated ? '/dashboard' : '/register'} className={styles.primaryBtn}>
              {isAuthenticated ? 'Go to Dashboard' : 'Start Your Journey'}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <p className={styles.note}>
            No credit card required. Free forever for personal use.
          </p>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <span>🌙</span>
            <span>NightLog</span>
          </div>
          <p className={styles.footerText}>
            © {new Date().getFullYear()} NightLog. All rights reserved.
          </p>
        </div>
      </footer>
    </section>
  );
}
