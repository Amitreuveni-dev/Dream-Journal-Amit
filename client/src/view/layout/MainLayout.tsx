import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useLocation, useNavigate } from "react-router";
import styles from "./MainLayout.module.scss";

interface LayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const MainLayout = ({ children, darkMode, setDarkMode }: LayoutProps) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isAddDreamPage = location.pathname === "/add-dream";

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
            onClick={() => setDarkMode((prev) => !prev)}
          >
            {darkMode ? "🌙 Dark" : "☀ Light"}
          </button>

          {!isAddDreamPage ? (
            <button
              className={styles.addBtn}
              onClick={() => navigate("/add-dream")}
            >
              + Add Dream
            </button>
          ) : (
            <button
              className={styles.addBtn}
              onClick={() => navigate("/")}
            >
              🏠 Home
            </button>
          )}
        </div>
      </header>

      <main className={styles.content}>{children}</main>
    </div>
  );
};

export default MainLayout;
