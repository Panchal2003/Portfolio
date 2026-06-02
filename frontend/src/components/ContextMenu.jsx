import { motion } from 'framer-motion';
import { useWindows } from '../context/useWindows';

export default function ContextMenu({ x, y, profile }) {
  const { hideContextMenu, openWindow } = useWindows();

  const github = profile?.socialLinks?.github;
  const linkedin = profile?.socialLinks?.linkedin;

  const menuItems = [
    { label: '📧 Contact Me', action: () => openWindow('contact', 'Contact', '📧', 'contact') },
    { label: '💻 Open Terminal', action: () => openWindow('terminal', 'Terminal', '💻', 'terminal') },
    { divider: true },
    { label: '👤 About Me', action: () => openWindow('about', 'About Me', '👤', 'about') },
    { label: '⚡ Tech Stack', action: () => openWindow('skills', 'Tech Stack', '⚡', 'skills') },
    { label: '🚀 Projects', action: () => openWindow('projects', 'Projects', '🚀', 'projects') },
    { divider: true },
    ...(github ? [{ label: '🔗 GitHub', action: () => window.open(github, '_blank') }] : []),
    ...(linkedin ? [{ label: '🔗 LinkedIn', action: () => window.open(linkedin, '_blank') }] : []),
    ...((github || linkedin) ? [{ divider: true }] : []),
    { label: '🔍 Inspect', action: () => openWindow('inspect', 'DevTools', '🔍', 'inspect') },
  ];

  const menuStyle = {
    position: 'fixed',
    top: Math.min(y, window.innerHeight - 300),
    left: Math.min(x, window.innerWidth - 220),
    width: '200px',
    background: 'var(--window-bg)',
    backdropFilter: 'blur(20px)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '6px 0',
    zIndex: 10001,
    boxShadow: '0 5px 30px rgba(0, 0, 0, 0.5)',
  };

  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    width: '100%',
    color: 'var(--text)',
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: '13px',
    textAlign: 'left',
    transition: 'all 0.15s',
  };

  const dividerStyle = {
    height: '1px',
    background: 'var(--border)',
    margin: '4px 12px',
  };

  return (
    <motion.div
      style={menuStyle}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.15 }}
      onClick={(e) => e.stopPropagation()}
    >
      {menuItems.map((item, i) =>
        item.divider ? (
          <div key={i} style={dividerStyle} />
        ) : (
          <motion.button
            key={i}
            style={itemStyle}
            onClick={() => { item.action(); hideContextMenu(); }}
            whileHover={{ background: 'rgba(0, 240, 255, 0.1)', color: 'var(--primary)' }}
          >
            {item.label}
          </motion.button>
        )
      )}
    </motion.div>
  );
}
