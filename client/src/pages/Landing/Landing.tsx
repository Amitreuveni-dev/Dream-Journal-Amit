import Navbar from '../../components/Navbar/Navbar';
import Hero from '../../components/Hero/Hero';
import Features from '../../components/Features/Features';
import CallToAction from '../../components/CallToAction/CallToAction';
import styles from './Landing.module.scss';

export default function Landing() {
  return (
    <div className={styles.landing}>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <CallToAction />
      </main>
    </div>
  );
}
