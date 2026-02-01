import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<div>NightLog - Coming Soon</div>} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
