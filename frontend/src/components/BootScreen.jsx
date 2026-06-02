import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const bootMessages = [
  { text: 'SACHIN_OS v2.0.26 - Cyberpunk Edition', delay: 0 },
  { text: 'Initializing system...', delay: 400 },
  { text: 'Loading kernel modules...', delay: 800 },
  { text: '[OK] CPU: Full Stack MERN Architecture', delay: 1200 },
  { text: '[OK] RAM: React.js | Node.js | MongoDB loaded', delay: 1600 },
  { text: '[OK] GPU: Cyberpunk renderer initialized', delay: 2000 },
  { text: '[OK] NET: Portfolio server connected', delay: 2400 },
  { text: '[OK] AUTH: JWT Security module active', delay: 2800 },
  { text: 'Loading user profile: Sachin Kumar Panchal...', delay: 3200 },
  { text: 'All systems operational. Welcome, visitor.', delay: 3600 },
  { text: '', delay: 4000 },
  { text: 'Launching desktop environment...', delay: 4200 },
];

export default function BootScreen({ onComplete }) {
  const [visibleLines, setVisibleLines] = useState([]);
  const [progress, setProgress] = useState(0);
  const showSkip = true;

  useEffect(() => {
    const timers = bootMessages.map((msg, i) =>
      setTimeout(() => {
        setVisibleLines(prev => [...prev, msg.text]);
        setProgress(((i + 1) / bootMessages.length) * 100);
      }, msg.delay)
    );

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 5000);

  return () => {
  if (Array.isArray(timers)) {
    timers.forEach(timer => clearTimeout(timer));
  }
  if (completeTimer) {
    clearTimeout(completeTimer);
  }
};
  }, [onComplete]);

  const isMobile = window.innerWidth <= 480;

  const containerStyle = {
    position: 'fixed',
    inset: 0,
    background: '#000',
    zIndex: 10000,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: isMobile ? '20px' : '40px',
    fontFamily: "'Share Tech Mono', monospace",
    overflow: 'hidden',
  };

  const lineStyle = {
    color: '#00f0ff',
    fontSize: isMobile ? '11px' : '14px',
    lineHeight: '1.8',
    textShadow: '0 0 10px rgba(0, 240, 255, 0.5)',
  };

  const okStyle = {
    color: '#00ff88',
  };

  const progressBarContainer = {
    width: isMobile ? '80%' : '300px',
    height: '4px',
    background: '#1a1a3e',
    borderRadius: '2px',
    marginTop: '30px',
    overflow: 'hidden',
  };

  const progressBarFill = {
    height: '100%',
    background: 'linear-gradient(90deg, #00f0ff, #bf00ff)',
    borderRadius: '2px',
    transition: 'width 0.3s ease',
    width: `${progress}%`,
    boxShadow: '0 0 10px #00f0ff',
  };

  const skipStyle = {
    position: 'absolute',
    bottom: isMobile ? '20px' : '40px',
    right: isMobile ? '20px' : '40px',
    background: 'none',
    border: '1px solid #2a2a4a',
    color: '#8888aa',
    padding: '8px 20px',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '12px',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'all 0.3s',
  };

  const scanlineStyle = {
    position: 'absolute',
    inset: 0,
    background: 'repeating-linear-gradient(0deg, rgba(0, 240, 255, 0.03) 0px, rgba(0, 240, 255, 0.03) 1px, transparent 1px, transparent 3px)',
    pointerEvents: 'none',
    animation: 'flicker 4s infinite',
  };

  return (
    <motion.div
      style={containerStyle}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={scanlineStyle} />

      <div style={{ maxWidth: '700px' }}>
        {visibleLines.map((line, i) => (
          <motion.div
            key={i}
            style={lineStyle}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {line.startsWith('[OK]') ? (
              <>
                <span style={okStyle}>[OK]</span>
                {line.substring(4)}
              </>
            ) : line}
          </motion.div>
        ))}
      </div>

      <div style={progressBarContainer}>
        <div style={progressBarFill} />
      </div>

      {showSkip && (
        <button
          style={skipStyle}
          onClick={onComplete}
          onMouseEnter={(e) => {
            e.target.style.borderColor = '#00f0ff';
            e.target.style.color = '#00f0ff';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = '#2a2a4a';
            e.target.style.color = '#8888aa';
          }}
        >
          SKIP {'>>'}
        </button>
      )}
    </motion.div>
  );
}
