import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import Home from "./view/pages/home/Home";
import ProtectedRoute from "./view/components/ProtectedRoute";
import Login from "./view/pages/login/Login";
import Register from "./view/pages/register/Register";

import "./index.css";
import AddDream from "./view/pages/addDream/AddDream";

function App() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.body.className = darkMode ? "dark-theme" : "light-theme";
  }, [darkMode]);

  return (
    <Routes>
      <Route
        path="/"
        element=
        {
          <ProtectedRoute>
            <Home darkMode={darkMode} setDarkMode={setDarkMode} />
          </ProtectedRoute>
        }
      />
      <Route path="add-dream" element=
        {
          <ProtectedRoute>
            <AddDream />
          </ProtectedRoute>
        } />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
