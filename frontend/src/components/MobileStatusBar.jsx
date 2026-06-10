import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSignal, FaBatteryFull } from 'react-icons/fa';

export default function MobileStatusBar({ onOpenSystemInfo }) {
  const [time, setTime] = useState(new Date());
  const longPressTimer = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (value) =>
    value.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const handleLongPressStart = () => {
    longPressTimer.current = setTimeout(() => {
      navigate('/admin');
    }, 3000);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  return (
    <motion.div
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 32,
        background: 'var(--taskbar-bg)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'env(safe-area-inset-top, 0px) 16px 0 16px',
        zIndex: 10000,
      }}
    >
      <span
        onTouchStart={handleLongPressStart}
        onTouchEnd={handleLongPressEnd}
        onTouchCancel={handleLongPressEnd}
        onMouseDown={handleLongPressStart}
        onMouseUp={handleLongPressEnd}
        onMouseLeave={handleLongPressEnd}
        style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 12,
          fontWeight: 700,
          color: 'var(--text)',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        SACHIN_OS
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--text-dim)',
        }}>
          {formatTime(time)}
        </span>
        <FaSignal style={{ fontSize: 10, color: 'var(--text-dim)' }} />
        <FaBatteryFull style={{ fontSize: 12, color: 'var(--text-dim)' }} />
        <motion.span
          whileTap={{ scale: 0.8 }}
          onClick={(event) => {
            event.stopPropagation();
            onOpenSystemInfo?.();
          }}
          style={{
            fontSize: 14,
            cursor: 'pointer',
            marginLeft: 4,
            WebkitTapHighlightColor: 'transparent',
            color: 'var(--primary)',
          }}
        >
          🖥️
        </motion.span>
      </div>
    </motion.div>
  );
}

