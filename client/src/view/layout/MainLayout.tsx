/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useNavigate } from "react-router";
import styles from "./MainLayout.module.scss";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { logout } from "../redux/slices/authSlice";
import { authService } from "../services/authService";

interface LayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const MainLayout = ({ children, darkMode, setDarkMode }: LayoutProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

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
          <button className={styles.logOutBtn} onClick={async () => {
            try {
              await authService.logout();
            } catch (error: any) {
              console.error("Server logout failed — but proceeding anyway");
            }
            dispatch(logout());
          }}>LogOut</button>
        </div>
      </header>

      <main className={styles.content}>{children}</main>

      <footer className={styles.footer}>
        &copy; All rights reserved {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default MainLayout;
