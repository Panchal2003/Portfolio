import { useState } from 'react';
import { motion } from 'framer-motion';
import { meta, keyboardShortcuts, desktopApps, theme } from '../config/shortcuts';

const tabs = ['Overview', 'Shortcuts', 'Apps', 'Theme', 'Credits'];

export default function SystemInfoApp({ profile }) {
  const socialLinks = profile?.socialLinks || {};
  const [activeTab, setActiveTab] = useState('Overview');
  const mono = "'Share Tech Mono', monospace";

  const renderOverview = () => (
    <div style={{ padding: 20 }}>
      {/* OS Logo */}
      <div style={{ textAlign: 'center', marginBottom: 30 }}>
        <div style={{
          fontFamily: "'Orbitron', sans-serif", fontSize: 36, fontWeight: 900,
          background: 'linear-gradient(135deg, #00f0ff, #bf00ff, #ff0080)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          marginBottom: 6,
        }}>
          {meta.osName}
        </div>
        <div style={{ fontFamily: mono, fontSize: 12, color: '#666', letterSpacing: 2 }}>
          {meta.version} • Cyberpunk Edition
        </div>
      </div>

      {/* System Specs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          ['👤 User', meta.name],
          ['💼 Role', 'Software Engineer'],
          ['🏢 Position', 'Full Stack MERN Developer'],
          ['🎯 Designation', 'Project Lead'],
          ['🖥️ OS', `${meta.osName} ${meta.version}`],
          ['⚛️ Framework', 'React.js + Vite'],
          ['🔧 Backend', 'Node.js + Express.js'],
          ['🗄️ Database', 'MongoDB'],
          ['🎨 Theme', 'Cyberpunk Neon'],
          ['🔐 Auth', 'JWT + RBAC'],
          ['🌐 3D Engine', 'Three.js + R3F'],
          ['✨ Animations', 'Framer Motion'],
          ['📦 Components', '24 Active'],
          ['🎮 Features', 'Draggable Icons, Custom Cursor'],
          ['📱 Responsive', 'Desktop + Tablet + Mobile'],
          ['🔍 DevTools', 'Built-in Inspector'],
        ].map(([label, value], i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            style={{
              padding: '10px 14px', background: 'rgba(0,240,255,0.03)',
              border: '1px solid #1a1a3e', borderRadius: 8,
            }}
          >
            <div style={{ fontFamily: mono, fontSize: 10, color: '#666', marginBottom: 4, letterSpacing: 1 }}>
              {label}
            </div>
            <div style={{ fontSize: 13, color: '#e0e0ff', fontWeight: 600 }}>
              {value}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderShortcuts = () => (
    <div style={{ padding: 20 }}>
      <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 14, color: '#00f0ff', marginBottom: 16, letterSpacing: 1 }}>
        ⌨️ KEYBOARD SHORTCUTS
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {keyboardShortcuts.map((s, i) => (
          <motion.div
            key={s.keys}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px', background: 'rgba(0,240,255,0.03)',
              border: '1px solid #1a1a3e', borderRadius: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
              <span style={{ fontSize: 14, color: '#e0e0ff', fontWeight: 600 }}>{s.action}</span>
            </div>
            <div style={{
              display: 'flex', gap: 4,
            }}>
              {s.keys.split(' + ').map((key, ki) => (
                <span key={ki}>
                  <span style={{
                    fontFamily: mono, fontSize: 11, color: '#00f0ff',
                    background: 'rgba(0,240,255,0.08)', border: '1px solid rgba(0,240,255,0.2)',
                    padding: '4px 10px', borderRadius: 5, fontWeight: 600,
                  }}>
                    {key}
                  </span>
                  {ki < s.keys.split(' + ').length - 1 && (
                    <span style={{ color: '#555', margin: '0 2px', fontSize: 11 }}> + </span>
                  )}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mouse Shortcuts */}
      <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 14, color: '#bf00ff', marginTop: 24, marginBottom: 16, letterSpacing: 1 }}>
        🖱️ MOUSE & TOUCH
      </div>
      {[
        { action: 'Open App', shortcut: 'Click Icon' },
        { action: 'Move Icon', shortcut: 'Drag Icon' },
        { action: 'Context Menu', shortcut: 'Right Click' },
        { action: 'Drag Window', shortcut: 'Drag Title Bar' },
        { action: 'Close Window', shortcut: 'Red Button ●' },
        { action: 'Minimize Window', shortcut: 'Yellow Button ●' },
        { action: 'Maximize Window', shortcut: 'Green Button ●' },
      ].map((item, i) => (
        <motion.div
          key={item.action}
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 16px', borderBottom: '1px solid #1a1a3e',
          }}
        >
          <span style={{ fontSize: 13, color: '#c0c0e0' }}>{item.action}</span>
          <span style={{ fontFamily: mono, fontSize: 11, color: '#bf00ff', background: 'rgba(191,0,255,0.08)', border: '1px solid rgba(191,0,255,0.2)', padding: '3px 10px', borderRadius: 5 }}>
            {item.shortcut}
          </span>
        </motion.div>
      ))}
    </div>
  );

  const renderApps = () => (
    <div style={{ padding: 20 }}>
      <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 14, color: '#00f0ff', marginBottom: 16, letterSpacing: 1 }}>
        📦 INSTALLED APPLICATIONS
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
        {[...desktopApps, { id: 'inspect', title: 'DevTools', icon: '🔍' }, { id: 'sysinfo', title: 'System Info', icon: '🖥️' }].map((app, i) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 16px', background: '#111128',
              border: '1px solid #1a1a3e', borderRadius: 10,
            }}
          >
            <span style={{ fontSize: 28 }}>{app.icon}</span>
            <div>
              <div style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>{app.title}</div>
              <div style={{ fontFamily: mono, fontSize: 9, color: '#555' }}>app.{app.id}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderTheme = () => (
    <div style={{ padding: 20 }}>
      <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 14, color: '#00f0ff', marginBottom: 16, letterSpacing: 1 }}>
        🎨 THEME: CYBERPUNK NEON
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
        {Object.entries(theme).map(([name, color], i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', background: '#111128',
              border: '1px solid #1a1a3e', borderRadius: 8,
            }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: color,
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: `0 0 10px ${color}40`,
            }} />
            <div>
              <div style={{ fontSize: 12, color: '#e0e0ff', fontWeight: 600, textTransform: 'capitalize' }}>
                {name.replace(/([A-Z])/g, ' $1')}
              </div>
              <div style={{ fontFamily: mono, fontSize: 10, color: '#666' }}>{color}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 14, color: '#bf00ff', marginTop: 24, marginBottom: 16, letterSpacing: 1 }}>
        🔤 FONTS
      </div>
      {[
        { font: 'Orbitron', usage: 'Headings & Titles', sample: 'SACHIN_OS' },
        { font: 'Rajdhani', usage: 'Body Text & UI', sample: 'Full Stack Developer' },
        { font: 'Share Tech Mono', usage: 'Code & Terminal', sample: '> system.ready()' },
      ].map((f) => (
        <div key={f.font} style={{ padding: '12px 16px', borderBottom: '1px solid #1a1a3e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13, color: '#e0e0ff', fontWeight: 600 }}>{f.font}</div>
            <div style={{ fontSize: 10, color: '#666' }}>{f.usage}</div>
          </div>
          <div style={{ fontFamily: `'${f.font}', sans-serif`, fontSize: 14, color: '#00f0ff' }}>{f.sample}</div>
        </div>
      ))}
    </div>
  );

  const renderCredits = () => (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Avatar */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%', margin: '0 auto 16px',
          background: 'linear-gradient(135deg, #00f0ff, #bf00ff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, fontFamily: "'Orbitron', sans-serif", fontWeight: 900, color: '#fff',
          boxShadow: '0 0 30px rgba(0,240,255,0.3)',
        }}>
          SKP
        </div>

        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
          {meta.name}
        </div>
        <div style={{ fontFamily: mono, fontSize: 12, color: '#00f0ff', marginBottom: 20, letterSpacing: 1 }}>
          {meta.title}
        </div>

        <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, #2a2a4a, transparent)', margin: '0 auto 20px' }} />

        <div style={{ fontSize: 13, color: '#888', lineHeight: 1.8, maxWidth: 400, margin: '0 auto' }}>
          Designed & Developed this OS-style portfolio from scratch using
          <span style={{ color: '#61dafb' }}> React.js</span>,
          <span style={{ color: '#68a063' }}> Node.js</span>,
          <span style={{ color: '#4db33d' }}> MongoDB</span>,
          <span style={{ color: '#00f0ff' }}> Three.js</span>, and
          <span style={{ color: '#bf00ff' }}> Framer Motion</span>.
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 24 }}>
          <a href={socialLinks.github} target="_blank" rel="noreferrer"
            style={{
              padding: '8px 20px', background: 'rgba(0,240,255,0.08)',
              border: '1px solid rgba(0,240,255,0.3)', borderRadius: 8,
              color: '#00f0ff', fontFamily: mono, fontSize: 12,
              textDecoration: 'none', transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,240,255,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,240,255,0.08)'}
          >
            GitHub →
          </a>
          <a href={socialLinks.linkedin} target="_blank" rel="noreferrer"
            style={{
              padding: '8px 20px', background: 'rgba(191,0,255,0.08)',
              border: '1px solid rgba(191,0,255,0.3)', borderRadius: 8,
              color: '#bf00ff', fontFamily: mono, fontSize: 12,
              textDecoration: 'none', transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(191,0,255,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(191,0,255,0.08)'}
          >
            LinkedIn →
          </a>
        </div>

        <div style={{ marginTop: 30, fontFamily: mono, fontSize: 10, color: '#444', letterSpacing: 1 }}>
          © 2026 {meta.name}. All Rights Reserved.
        </div>
      </motion.div>
    </div>
  );

  const content = { Overview: renderOverview, Shortcuts: renderShortcuts, Apps: renderApps, Theme: renderTheme, Credits: renderCredits };

  return (
    <div style={{ background: '#0a0a1a', height: '100%', display: 'flex', flexDirection: 'column', margin: -20, overflow: 'hidden' }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', background: '#111128', borderBottom: '1px solid #2a2a4a', flexShrink: 0, overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '10px 18px', background: activeTab === tab ? '#0a0a1a' : 'transparent',
            borderBottom: activeTab === tab ? '2px solid #00f0ff' : '2px solid transparent',
            border: 'none', color: activeTab === tab ? '#00f0ff' : '#666',
            fontFamily: "'Orbitron', sans-serif", fontSize: 10, fontWeight: 600,
            cursor: 'pointer', letterSpacing: 1, textTransform: 'uppercase',
            transition: 'all 0.2s', whiteSpace: 'nowrap',
          }}>
            {tab}
          </button>
        ))}
      </div>
      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {content[activeTab]?.()}
      </div>
    </div>
  );
}
