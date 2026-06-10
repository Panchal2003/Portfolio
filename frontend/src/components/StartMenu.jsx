import { motion } from 'framer-motion';

export default function StartMenu({ apps, onOpenApp }) {
  const isMobile = window.innerWidth <= 1024;

  const menuStyle = {
    position: 'fixed',
    bottom: isMobile ? 'calc(74px + env(safe-area-inset-bottom, 0px))' : '52px',
    left: isMobile ? 0 : '8px',
    right: isMobile ? 0 : 'auto',
    width: isMobile ? '100%' : '320px',
    maxHeight: isMobile ? 'calc(100vh - 28px - 74px - env(safe-area-inset-bottom, 0px))' : 'auto',
    background: 'var(--window-bg)',
    backdropFilter: 'blur(20px)',
    border: '1px solid var(--border)',
    borderRadius: isMobile ? '16px 16px 0 0' : '12px 12px 0 0',
    overflow: 'hidden',
    zIndex: 10000,
    boxShadow: '0 -5px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 240, 255, 0.1)',
  };

  const headerStyle = {
    padding: '20px',
    background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.1), rgba(191, 0, 255, 0.1))',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const avatarStyle = {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: "'Orbitron', sans-serif",
    boxShadow: '0 0 15px rgba(0, 240, 255, 0.3)',
  };

  const nameStyle = {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--primary)',
  };

  const roleStyle = {
    fontSize: '11px',
    color: 'var(--text-dim)',
    fontFamily: "'Share Tech Mono', monospace",
  };

  const listStyle = {
    padding: '8px 0',
    maxHeight: '400px',
    overflowY: 'auto',
  };

  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 20px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: 'none',
    background: 'none',
    width: '100%',
    color: 'var(--text)',
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: '15px',
    fontWeight: 500,
    textAlign: 'left',
  };

  const footerStyle = {
    padding: '12px 20px',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  return (
    <motion.div
      style={menuStyle}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div style={headerStyle}>
        <div style={avatarStyle}>S</div>
        <div>
          <div style={nameStyle}>SACHIN_OS</div>
          <div style={roleStyle}>v2.0 // Full Stack Dev</div>
        </div>
      </div>

      {/* App List */}
      <div style={listStyle}>
        {apps.map((app) => (
          <motion.button
            key={app.id}
            style={itemStyle}
            onClick={() => onOpenApp(app)}
            whileHover={{ background: 'rgba(0, 240, 255, 0.1)', paddingLeft: '28px' }}
          >
            <span style={{ fontSize: '20px', width: '30px', textAlign: 'center' }}>{app.icon}</span>
            <span>{app.title}</span>
          </motion.button>
        ))}
      </div>

      {/* Footer */}
      <div style={footerStyle}>
        <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: "'Share Tech Mono', monospace" }}>
          © 2026 Sachin Kumar Panchal
        </span>
      </div>
    </motion.div>
  );
}
