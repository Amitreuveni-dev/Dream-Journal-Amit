import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './Hero.module.scss';

export default function Hero() {
  const { scrollYProgress } = useScroll();

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, 50]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.section
      className={styles.hero}
      style={{ opacity, scale, y }}
    >
      {/* Background gradient orbs */}
      <div className={styles.backgroundOrbs}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.orb3} />
      </div>

      <motion.div
        className={styles.content}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className={styles.badge} variants={itemVariants}>
          <span className={styles.badgeIcon}>✨</span>
          <span>AI-Powered Dream Analysis</span>
        </motion.div>

        <motion.h1 className={styles.title} variants={itemVariants}>
          Transform Your Dreams
          <br />
          Into <span className={styles.gradient}>Insights</span>
        </motion.h1>

        <motion.p className={styles.subtitle} variants={itemVariants}>
          Record your dreams, discover hidden patterns, and unlock the
          mysteries of your subconscious mind with advanced AI analysis.
        </motion.p>

        <motion.div className={styles.ctaButtons} variants={itemVariants}>
          <Link to="/register" className={styles.primaryBtn}>
            Start Free
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
          <a href="#features" className={styles.secondaryBtn}>
            Learn More
          </a>
        </motion.div>

        <motion.div className={styles.stats} variants={itemVariants}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>10K+</span>
            <span className={styles.statLabel}>Dreams Logged</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNumber}>98%</span>
            <span className={styles.statLabel}>Accuracy</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNumber}>24/7</span>
            <span className={styles.statLabel}>AI Analysis</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <span>Scroll to explore</span>
        <motion.div
          className={styles.scrollLine}
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.section>
  );
}
