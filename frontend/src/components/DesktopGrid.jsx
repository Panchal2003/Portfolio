import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { desktopApps } from '../config/shortcuts';
import { DESKTOP_GRID_PRESETS } from '../utils/uiSettings';

const glowColors = [
  'rgba(0, 240, 255, 0.6)',
  'rgba(191, 0, 255, 0.6)',
  'rgba(255, 0, 128, 0.6)',
  'rgba(0, 255, 136, 0.6)',
  'rgba(255, 170, 0, 0.6)',
  'rgba(0, 170, 255, 0.6)',
  'rgba(255, 80, 80, 0.6)',
  'rgba(0, 240, 255, 0.6)',
  'rgba(191, 0, 255, 0.6)',
  'rgba(0, 240, 255, 0.6)',
];

export default function DesktopGrid({ apps, onOpenApp, gridPreset = '3x3' }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const gridApps = useMemo(() => apps, [apps]);
  const preset = DESKTOP_GRID_PRESETS[gridPreset] || DESKTOP_GRID_PRESETS['3x3'];
  const columns = preset.columns;
  const rows = preset.rows;

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const availableWidth = window.innerWidth - 120;
      const availableHeight = window.innerHeight - 120;
      const scaleX = availableWidth / rect.width;
      const scaleY = availableHeight / rect.height;
      setScale(Math.min(scaleX, scaleY, 1));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 40,
        left: 60,
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap: 24,
        padding: 24,
        zIndex: 2,
        width: columns * 160,
        height: rows * 180,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      }}
    >
      {gridApps.map((app, index) => {
        const glow = glowColors[index % glowColors.length];

        return (
          <motion.button
            key={app.id}
            type="button"
            onClick={() => onOpenApp(app)}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.08, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.08, boxShadow: `0 0 35px ${glow}, 0 0 70px ${glow.replace('0.6', '0.15')}` }}
            whileTap={{ scale: 0.92 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '20px 16px',
              borderRadius: 18,
              background: 'rgba(17,17,40,0.35)',
              border: '1px solid rgba(42,42,74,0.25)',
              backdropFilter: 'blur(12px)',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: -3,
                borderRadius: 20,
                border: `2px solid ${glow.replace('0.6', '0.1')}`,
                pointerEvents: 'none',
              }}
            />
            <span
              style={{
                fontSize: 48,
                filter: `drop-shadow(0 0 6px ${glow.replace('0.6', '0.25')})`,
                transition: 'filter 0.3s',
                lineHeight: 1,
              }}
            >
              {app.icon}
            </span>
            <span
              style={{
                fontSize: 12,
                color: 'var(--text)',
                textAlign: 'center',
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: 600,
                textShadow: '0 2px 4px rgba(0,0,0,0.9)',
                letterSpacing: '0.5px',
                transition: 'all 0.3s',
                maxWidth: '100%',
                lineHeight: 1.3,
              }}
            >
              {app.title}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
