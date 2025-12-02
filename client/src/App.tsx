import { Route, Routes } from 'react-router'
import './App.css'
import Register from './view/pages/register/Register'
import Login from './view/pages/login/Login'
import Home from './view/pages/home/Home'

function App() {

  return (
    <>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/' element={<Home />}/>
        
      </Routes>
    </>
  )
}

export default App
