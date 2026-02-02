import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Landing from './pages/Landing';
import { Login, Register } from './pages/Auth';
import Dashboard from './pages/Dashboard';
import DreamEditor from './pages/DreamEditor';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dreams/new" element={<DreamEditor />} />
        <Route path="/dreams/:id/edit" element={<DreamEditor />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
