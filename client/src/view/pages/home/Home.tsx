import DreamList from "../../components/DreamList";
import styles from "./Home.module.scss";

const Home = () => {
  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Your Dreams</h2>
      <DreamList />
    </div>
  );
};

export default Home;
