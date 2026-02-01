import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import styles from './Features.module.scss';

interface Feature {
  icon: string;
  title: string;
  description: string;
  gradient: string;
}

const features: Feature[] = [
  {
    icon: '🧠',
    title: 'AI Dream Analysis',
    description:
      'Our advanced AI analyzes your dreams to identify mood patterns, recurring symbols, and hidden meanings in your subconscious.',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  },
  {
    icon: '📊',
    title: 'Insights Dashboard',
    description:
      'Visualize your dream patterns over time with beautiful charts and discover trends you never knew existed.',
    gradient: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
  },
  {
    icon: '🔮',
    title: 'Symbol Recognition',
    description:
      'Automatically identify and catalog dream symbols, building a personal dream dictionary unique to you.',
    gradient: 'linear-gradient(135deg, #a855f7, #d946ef)',
  },
  {
    icon: '🌍',
    title: 'Multi-Language',
    description:
      'Record dreams in any language. Our AI automatically detects and analyzes content regardless of the language used.',
    gradient: 'linear-gradient(135deg, #d946ef, #ec4899)',
  },
  {
    icon: '🔒',
    title: 'Private & Secure',
    description:
      'Your dreams are encrypted and protected. We never share or sell your personal dream data.',
    gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
  },
  {
    icon: '✨',
    title: 'Lucid Tracking',
    description:
      'Track your lucid dreams separately and monitor your progress in achieving dream awareness.',
    gradient: 'linear-gradient(135deg, #f43f5e, #6366f1)',
  },
];

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      className={styles.featureCard}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <div
        className={styles.iconWrapper}
        style={{ background: feature.gradient }}
      >
        <span className={styles.icon}>{feature.icon}</span>
      </div>
      <h3 className={styles.featureTitle}>{feature.title}</h3>
      <p className={styles.featureDescription}>{feature.description}</p>
    </motion.div>
  );
}

export default function Features() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.section
      ref={sectionRef}
      id="features"
      className={styles.features}
      style={{ opacity }}
    >
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.sectionLabel}>Features</span>
          <h2 className={styles.sectionTitle}>
            Everything You Need to
            <br />
            <span className={styles.gradient}>Understand Your Dreams</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Powerful tools designed to help you record, analyze, and gain
            insights from your dreams.
          </p>
        </motion.div>

        <div className={styles.grid}>
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
