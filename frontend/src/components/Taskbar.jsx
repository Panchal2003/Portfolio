import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWindows } from '../context/useWindows';
import { meta } from '../config/shortcuts';

export default function Taskbar() {
  const { windows, focusWindow, openWindow, toggleStartMenu, startMenuOpen } = useWindows();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (d) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const formatDate = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, height: 48,
      background: 'var(--taskbar-bg)', backdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', padding: '0 8px', zIndex: 9999, gap: 4,
    }}>
      {/* Start Button */}
      <motion.button
        onClick={(e) => { e.stopPropagation(); toggleStartMenu(); }}
        whileHover={{ boxShadow: '0 0 15px rgba(0,240,255,0.3)' }}
        whileTap={{ scale: 0.95 }}
        style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
          background: startMenuOpen ? 'rgba(0,240,255,0.2)' : 'rgba(0,240,255,0.05)',
          border: '1px solid', borderColor: startMenuOpen ? 'var(--primary)' : 'var(--border)',
          borderRadius: 4, color: 'var(--primary)', cursor: 'pointer',
          fontFamily: "'Orbitron', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1,
        }}
      >
        <span style={{ fontSize: 16 }}>⬡</span>
        <span>START</span>
      </motion.button>

      <div style={{ width: 1, height: 28, background: 'var(--border)', margin: '0 4px' }} />

      {/* Owner Info */}
      <div
        onClick={() => openWindow('sysinfo', 'System Info', 'ℹ️', 'sysinfo')}
        style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '2px 12px', cursor: 'pointer', borderRadius: 4,
          transition: 'background 0.2s',
          minWidth: 0,
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,240,255,0.08)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <span style={{
          fontFamily: "'Orbitron', sans-serif", fontSize: 10, fontWeight: 700,
          color: 'var(--primary)', letterSpacing: '0.5px', lineHeight: 1.3,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {meta.name}
        </span>
        <span style={{
          fontFamily: "'Share Tech Mono', monospace", fontSize: 9,
          color: 'var(--text-dim)', lineHeight: 1.2, whiteSpace: 'nowrap',
          overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {meta.title}
        </span>
      </div>

      <div style={{ width: 1, height: 28, background: 'var(--border)', margin: '0 4px' }} />

      {/* Open Windows */}
      <div style={{ display: 'flex', gap: 2, flex: 1, overflow: 'auto' }}>
        {windows.map((win) => (
          <motion.button
            key={win.id}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px',
              background: !win.minimized ? 'rgba(0,240,255,0.15)' : 'transparent',
              border: 'none',
              borderBottom: !win.minimized ? '2px solid var(--primary)' : '2px solid transparent',
              borderRadius: '4px 4px 0 0',
              color: !win.minimized ? 'var(--primary)' : 'var(--text-dim)',
              cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif", fontSize: 13, fontWeight: 500,
              maxWidth: 160, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', height: 36,
            }}
            onClick={() => focusWindow(win.id)}
            whileHover={{ background: 'rgba(0,240,255,0.1)' }}
          >
            <span>{win.icon}</span>
            <span>{win.title}</span>
          </motion.button>
        ))}
      </div>

      {/* System Tray */}
      <div style={{ width: 1, height: 28, background: 'var(--border)', margin: '0 4px' }} />

      {/* System Info button */}
      <motion.button
        onClick={() => openWindow('sysinfo', 'System Info', 'ℹ️', 'sysinfo')}
        whileHover={{ background: 'rgba(0,240,255,0.1)' }}
        style={{
          background: 'none', border: 'none', color: 'var(--text-dim)',
          fontSize: 16, cursor: 'pointer', padding: '4px 6px', borderRadius: 4, display: 'flex',
        }}
        title="System Info & Shortcuts"
      >
        ℹ️
      </motion.button>

      {/* Clock */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
        padding: '0 8px', fontFamily: "'Share Tech Mono', monospace", fontSize: 12,
        color: 'var(--text-dim)', lineHeight: 1.3,
      }}>
        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{formatTime(time)}</span>
        <span>{formatDate(time)}</span>
      </div>
    </div>
  );
}
