import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Landing from './pages/Landing';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
