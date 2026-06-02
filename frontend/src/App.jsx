import { useState, useCallback, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { WindowProvider } from './context/WindowContext';
import BootScreen from './components/BootScreen';
import MobileSplash from './components/MobileSplash';
import Desktop from './components/Desktop';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

const Scene3D = lazy(() => import('./components/Scene3D'));

function PortfolioOS() {
  const isMobile = window.innerWidth <= 480;
  const [booted, setBooted] = useState(false);

  const handleBootComplete = useCallback(() => {
    setBooted(true);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* 3D background - wrapped in error boundary */}
      <Suspense fallback={null}>
        <Scene3D />
      </Suspense>

      {/* Boot screen: mobile splash vs desktop terminal boot */}
      <AnimatePresence mode="wait">
        {!booted && (
          isMobile
            ? <MobileSplash key="splash" onComplete={handleBootComplete} />
            : <BootScreen key="boot" onComplete={handleBootComplete} />
        )}
      </AnimatePresence>

      {/* Desktop - always render after boot, sits above 3D */}
      {booted && (
        <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
          <WindowProvider>
            <Desktop />
          </WindowProvider>
        </div>
      )}
    </div>
  );
}

const App = () => {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#111128',
            color: '#e0e0ff',
            border: '1px solid #2a2a4a',
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: '0.95rem',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.1)',
          },
          success: {
            iconTheme: { primary: '#00f0ff', secondary: '#0a0a1a' },
          },
          error: {
            iconTheme: { primary: '#ff3366', secondary: '#0a0a1a' },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<PortfolioOS />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
