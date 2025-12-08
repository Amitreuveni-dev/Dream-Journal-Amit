import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import DreamList from "../../components/DreamList";
import { useNavigate } from "react-router";
import styles from "./Home.module.scss";

interface HomeProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const Home = ({ darkMode, setDarkMode }: HomeProps) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className={styles.page}>

      <header className={styles.header}>
        <div className={styles.leftSection}>
          <div className={styles.avatar}></div>
          <div>
            <p className={styles.hello}>Hello,</p>
            <strong className={styles.username}>{user?.name}</strong>
          </div>
        </div>

        <h1 className={styles.title}>Dream Journal</h1>

        <div className={styles.rightSection}>
          <button
            className={styles.themeSwitch}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "🌙 Dark" : "☀️ Light"}
          </button>

          <button
            className={styles.addBtn}
            onClick={() => navigate("/add-dream")}
          >
            + Add Dream
          </button>
        </div>
      </header>

      <main className={styles.content}>
        <h2>Your Dreams</h2>
        <DreamList />
      </main>

    </div>
  );
};

export default Home;
