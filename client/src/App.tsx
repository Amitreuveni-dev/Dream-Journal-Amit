import { Route, Routes } from 'react-router'
import './App.css'
import Home from './view/pages/home/Home'
import ProtectedRoute from './view/components/ProtectedRoute'
import Login from './view/pages/login/Login'
import Register from './view/pages/register/Register'

function App() {

  return (
    <>
      <Routes>

        <Route path='/' element=
          {
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
      </Routes>
    </>
  )
}

export default App
