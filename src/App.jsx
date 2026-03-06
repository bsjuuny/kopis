import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import PerformanceDetail from './pages/PerformanceDetail';
import DonationPopup from './components/DonationPopup';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1514306191717-452ec28c7f31?q=80&w=2070&auto=format&fit=crop')] bg-fixed bg-cover bg-no-repeat relative">
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm z-0"></div>

        <div className="relative z-10 w-full min-h-screen">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/performance/:id" element={<PerformanceDetail />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>

          <footer className="text-center py-8 text-slate-500 text-sm">
            <p>© {new Date().getFullYear()} KOPIS Arts. Data provided by KOPIS.</p>
          </footer>
          <DonationPopup />
        </div>
      </div>
    </Router>
  );
}

export default App;
