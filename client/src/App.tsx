import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./view/pages/home/Home";
import ProtectedRoute from "./view/components/ProtectedRoute";
import Login from "./view/pages/login/Login";
import Register from "./view/pages/register/Register";
import "./index.css";
import AddDream from "./view/pages/addDream/AddDream";
import MainLayout from "./view/layout/MainLayout";
import { authService } from "./view/services/authService";
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "./view/redux/slices/authSlice";

function App() {
  const [darkMode, setDarkMode] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    const checkUser = async () => {
      const user = await authService.getCurrentUser();

      if (user) {
        dispatch(loginSuccess(user));
      } else {
        dispatch(logout());
      }
    };

    checkUser();
  }, [dispatch]);


  useEffect(() => {
    document.body.className = darkMode ? "dark-theme" : "light-theme";
  }, [darkMode]);

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element=
          {
            <ProtectedRoute>
              <MainLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                <Home />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/add-dream" element=
          {
            <ProtectedRoute>
              <MainLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                <AddDream />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
