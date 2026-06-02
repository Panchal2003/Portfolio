import { useState } from 'react';
import { motion } from 'framer-motion';

const tabs = ['Elements', 'Console', 'Network', 'Performance', 'Source'];

const elementsTree = [
  { tag: 'html', indent: 0, attrs: 'lang="en"' },
  { tag: 'head', indent: 1 },
  { tag: 'meta', indent: 2, attrs: 'charset="UTF-8"', selfClose: true },
  { tag: 'title', indent: 2, content: 'Sachin Kumar Panchal | Portfolio' },
  { tag: '/head', indent: 1 },
  { tag: 'body', indent: 1, attrs: 'class="sachin-os cyberpunk"' },
  { tag: 'div', indent: 2, attrs: 'id="root" data-theme="cyberpunk"' },
  { tag: 'canvas', indent: 3, attrs: 'class="scene-3d" width="1920" height="1080"', selfClose: true },
  { tag: 'div', indent: 3, attrs: 'class="floating-particles" data-count="40"', selfClose: true },
  { tag: 'div', indent: 3, attrs: 'class="desktop-icons draggable"' },
  { tag: '!-- 7 Desktop App Icons --', indent: 4, isComment: true },
  { tag: '/div', indent: 3 },
  { tag: 'div', indent: 3, attrs: 'class="window-manager"' },
  { tag: '!-- Dynamic OS Windows --', indent: 4, isComment: true },
  { tag: '/div', indent: 3 },
  { tag: 'div', indent: 3, attrs: 'class="taskbar"' },
  { tag: '/div', indent: 3 },
  { tag: '/div', indent: 2 },
  { tag: '/body', indent: 1 },
  { tag: '/html', indent: 0 },
];

const consoleMessages = [
  { type: 'info', msg: '🚀 SACHIN_OS v2.0.26 initialized' },
  { type: 'log', msg: '📦 Modules: React, Three.js, Framer Motion' },
  { type: 'log', msg: `🔗 API: ${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}` },
  { type: 'info', msg: '🎮 Desktop environment ready' },
  { type: 'log', msg: '💾 Technologies loaded' },
  { type: 'log', msg: '📁 Projects loaded' },
  { type: 'warn', msg: '⚠️ 3D scene: 6 floating geometries active' },
  { type: 'info', msg: '🎨 Theme: Cyberpunk Neon (#00f0ff)' },
  { type: 'log', msg: '✨ Custom cursor active' },
  { type: 'success', msg: '✅ All systems operational' },
  { type: 'log', msg: '> Built with ❤️ by Sachin Kumar Panchal' },
];

const networkReqs = [
  { method: 'GET', url: '/api/profile', status: 200, type: 'json', size: '1.2KB', time: '45ms' },
  { method: 'GET', url: '/api/skills', status: 200, type: 'json', size: '2.8KB', time: '32ms' },
  { method: 'GET', url: '/api/projects', status: 200, type: 'json', size: '3.1KB', time: '38ms' },
  { method: 'GET', url: '/api/experience', status: 200, type: 'json', size: '1.9KB', time: '28ms' },
  { method: 'GET', url: '/api/education', status: 200, type: 'json', size: '0.6KB', time: '22ms' },
  { method: 'GET', url: '/fonts/Orbitron.woff2', status: 200, type: 'font', size: '24KB', time: '120ms' },
  { method: 'GET', url: '/scene3d.chunk.js', status: 200, type: 'script', size: '886KB', time: '250ms' },
];

const perfData = [
  ['FPS', '60'], ['Load Time', '1.8s'], ['DOM Nodes', '342'], ['JS Heap', '18.4 MB'],
  ['Components', '24'], ['Animations', '47'], ['Particles', '40'], ['3D Meshes', '6'],
];

const sourceCode = `// SACHIN_OS Portfolio — Main Entry
// React + Three.js + Framer Motion
// Backend: Node.js + Express + MongoDB

import { WindowProvider } from './context/WindowContext';
import Desktop from './components/Desktop';
import Scene3D from './components/Scene3D';

function PortfolioOS() {
  const [booted, setBooted] = useState(false);
  return (
    <div className="sachin-os">
      <Scene3D />
      <BootScreen onComplete={() => setBooted(true)} />
      {booted && (
        <WindowProvider>
          <Desktop />
          <CustomCursor />
          <Notifications />
        </WindowProvider>
      )}
    </div>
  );
}

// Developer: Sachin Kumar Panchal
// GitHub: github.com/Panchal2003`;

export default function InspectApp() {
  const [tab, setTab] = useState('Elements');
  const [sel, setSel] = useState(null);
  const mono = "'Share Tech Mono', monospace";

  const renderElements = () => (
    <div style={{ padding: '8px 0', fontSize: '12px', fontFamily: mono, lineHeight: 1.8 }}>
      {elementsTree.map((el, i) => (
        <div key={i} onClick={() => setSel(i)} style={{
          paddingLeft: el.indent * 18 + 10, cursor: 'pointer',
          background: sel === i ? 'rgba(0,240,255,0.08)' : 'transparent',
          borderLeft: sel === i ? '2px solid #00f0ff' : '2px solid transparent',
        }}>
          {el.isComment ? <span style={{ color: '#6a6a8a' }}>&lt;{el.tag}&gt;</span> : (
            <>
              <span style={{ color: '#888' }}>&lt;</span>
              <span style={{ color: '#ff6b9d' }}>{el.tag}</span>
              {el.attrs && <span style={{ color: '#9cdcfe' }}> {el.attrs}</span>}
              <span style={{ color: '#888' }}>{el.selfClose ? ' />' : '>'}</span>
              {el.content && <><span style={{ color: '#ce9178' }}>{el.content}</span><span style={{ color: '#888' }}>&lt;/<span style={{ color: '#ff6b9d' }}>{el.tag}</span>&gt;</span></>}
            </>
          )}
        </div>
      ))}
    </div>
  );

  const renderConsole = () => (
    <div style={{ padding: '10px', fontSize: '12px', fontFamily: mono }}>
      {consoleMessages.map((m, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}
          style={{ padding: '4px 8px', borderBottom: '1px solid rgba(255,255,255,0.03)',
            color: m.type === 'warn' ? '#ffaa00' : m.type === 'success' ? '#00ff88' : m.type === 'info' ? '#00b4ff' : '#c0c0e0' }}>
          <span style={{ color: '#555', marginRight: 8, fontSize: 10 }}>{String(i + 1).padStart(2, '0')}</span>{m.msg}
        </motion.div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', marginTop: 10, borderTop: '1px solid #2a2a4a', paddingTop: 8 }}>
        <span style={{ color: '#00f0ff', marginRight: 8 }}>{'>'}</span>
        <span style={{ color: '#666', animation: 'blink 1s infinite' }}>_</span>
      </div>
    </div>
  );

  const renderNetwork = () => (
    <div style={{ fontSize: '11px', fontFamily: mono }}>
      <div style={{ display: 'grid', gridTemplateColumns: '55px 1fr 45px 55px 55px 50px', padding: '6px 10px', background: 'rgba(0,240,255,0.05)', borderBottom: '1px solid #2a2a4a', color: '#888', fontWeight: 600 }}>
        {['Method', 'URL', 'Status', 'Type', 'Size', 'Time'].map(h => <span key={h}>{h}</span>)}
      </div>
      {networkReqs.map((r, i) => (
        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
          style={{ display: 'grid', gridTemplateColumns: '55px 1fr 45px 55px 55px 50px', padding: '5px 10px', borderBottom: '1px solid rgba(255,255,255,0.02)', color: '#c0c0e0' }}>
          <span style={{ color: '#00ff88' }}>{r.method}</span>
          <span style={{ color: '#9cdcfe', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.url}</span>
          <span style={{ color: '#00ff88' }}>{r.status}</span>
          <span style={{ color: '#888' }}>{r.type}</span>
          <span>{r.size}</span>
          <span style={{ color: '#888' }}>{r.time}</span>
        </motion.div>
      ))}
    </div>
  );

  const renderPerf = () => (
    <div style={{ padding: 15, display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 12 }}>
      {perfData.map(([k, v], i) => (
        <motion.div key={k} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
          style={{ background: 'rgba(0,240,255,0.04)', border: '1px solid #2a2a4a', borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 10, color: '#888', fontFamily: mono, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{k}</div>
          <div style={{ fontSize: 20, fontFamily: "'Orbitron', sans-serif", fontWeight: 700, color: '#00f0ff' }}>{v}</div>
        </motion.div>
      ))}
    </div>
  );

  const renderSource = () => (
    <div style={{ padding: 10, fontSize: 12, fontFamily: mono, lineHeight: 1.7 }}>
      {sourceCode.split('\n').map((line, i) => (
        <div key={i} style={{ display: 'flex' }}>
          <span style={{ color: '#444', width: 35, textAlign: 'right', paddingRight: 12, flexShrink: 0, userSelect: 'none' }}>{i + 1}</span>
          <span style={{ color: line.trim().startsWith('//') ? '#6a9955' : line.trim().startsWith('import') ? '#c586c0' : line.includes('function') || line.includes('const') ? '#569cd6' : line.includes('<') ? '#ff6b9d' : '#d4d4d4' }}>
            {line || ' '}
          </span>
        </div>
      ))}
    </div>
  );

  const content = { Elements: renderElements, Console: renderConsole, Network: renderNetwork, Performance: renderPerf, Source: renderSource };

  return (
    <div style={{ background: '#141422', height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 4, overflow: 'hidden', margin: '-20px', fontFamily: mono }}>
      <div style={{ display: 'flex', background: '#1e1e2e', borderBottom: '1px solid #2a2a4a', flexShrink: 0 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 16px', background: tab === t ? '#141422' : 'transparent',
            borderBottom: tab === t ? '2px solid #00f0ff' : '2px solid transparent', border: 'none',
            color: tab === t ? '#00f0ff' : '#888', fontFamily: mono, fontSize: 11, cursor: 'pointer',
          }}>{t}</button>
        ))}
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>{content[tab]?.()}</div>
    </div>
  );
}
