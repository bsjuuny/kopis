import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import PerformanceDetail from './pages/PerformanceDetail';
import DonationPopup from './components/DonationPopup';

function App() {
  return (
    <Router>
      <div className="min-h-screen transition-colors duration-500">
        <div className="relative z-10 w-full min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/performance/:id" element={<PerformanceDetail />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>

          <footer className="text-center py-10 text-[var(--text-muted)] text-sm font-medium">
            <p>© {new Date().getFullYear()} KOPIS Arts. All rights reserved.</p>
            <p className="mt-1 opacity-70">Data provided by KOPIS API</p>
          </footer>
          <DonationPopup />
        </div>
      </div>
    </Router>
  );
}

export default App;
