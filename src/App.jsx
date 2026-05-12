// src/App.jsx
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Player from './pages/Player';

// Note: HashRouter is used here. It is highly recommended for GitHub Pages 
// deployments to prevent 404 errors on deep links.
function App() {
  return (
    <Router>
      <div className="min-h-screen max-w-md mx-auto bg-gray-900 shadow-2xl overflow-hidden relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/player/:id" element={<Player />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
