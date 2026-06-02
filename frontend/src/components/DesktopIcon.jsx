import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const glowColors = [
  'rgba(0, 240, 255, 0.6)',
  'rgba(191, 0, 255, 0.6)',
  'rgba(255, 0, 128, 0.6)',
  'rgba(0, 255, 136, 0.6)',
  'rgba(255, 170, 0, 0.6)',
  'rgba(0, 170, 255, 0.6)',
  'rgba(255, 80, 80, 0.6)',
];

function getIconMetrics(mode) {
  if (mode === 'mobile') {
    return {
      width: 72,
      minHeight: 82,
      iconSize: 30,
      labelSize: 10,
      gap: 8,
      padding: '14px 8px',
      borderRadius: 16,
      reserveTop: 148,
      reserveBottom: 86,
      floatOffset: 3,
    };
  }

  if (mode === 'tablet') {
    return {
      width: 88,
      minHeight: 96,
      iconSize: 36,
      labelSize: 10,
      gap: 8,
      padding: '16px 10px',
      borderRadius: 16,
      reserveTop: 164,
      reserveBottom: 86,
      floatOffset: 4,
    };
  }

  return {
    width: 125,
    minHeight: 125,
    iconSize: 54,
    labelSize: 12,
    gap: 10,
    padding: '20px 16px',
    borderRadius: 18,
    reserveTop: 0,
    reserveBottom: 56,
    floatOffset: 6,
  };
}

export function DraggableIcon({
  icon,
  label,
  onOpen,
  index = 0,
  floatDelay = 0,
  initialPos,
  mode = 'desktop',
  storageKey = 'iconPositions',
}) {
  const metrics = getIconMetrics(mode);
  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState(initialPos || { x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(null);
  const hasMoved = useRef(false);
  const positionRef = useRef(initialPos || { x: 0, y: 0 });
  const glow = glowColors[index % glowColors.length];
  const allowHoverEffects = mode === 'desktop';

  const handlePointerDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    dragStart.current = {
      x: event.clientX - pos.x,
      y: event.clientY - pos.y,
    };
    hasMoved.current = false;
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) {
      return undefined;
    }

    const handlePointerMove = (event) => {
      const maxX = Math.max(0, window.innerWidth - metrics.width - 8);
      const maxY = Math.max(metrics.reserveTop, window.innerHeight - metrics.minHeight - metrics.reserveBottom);
      const nextPos = {
        x: Math.round(Math.max(0, Math.min(maxX, event.clientX - dragStart.current.x))),
        y: Math.round(Math.max(metrics.reserveTop, Math.min(maxY, event.clientY - dragStart.current.y))),
      };

      if (
        Math.abs(nextPos.x - positionRef.current.x) > 1 ||
        Math.abs(nextPos.y - positionRef.current.y) > 1
      ) {
        hasMoved.current = true;
      }
      positionRef.current = nextPos;
      setPos(nextPos);
    };

    const handlePointerUp = () => {
      setDragging(false);
      const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
      saved[label] = positionRef.current;
      localStorage.setItem(storageKey, JSON.stringify(saved));
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragging, label, metrics.minHeight, metrics.reserveBottom, metrics.reserveTop, metrics.width, storageKey]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        zIndex: dragging ? 50 : 2,
        touchAction: 'none',
      }}
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.08, type: 'spring', stiffness: 200 }}
    >
      <motion.div
        onPointerDown={handlePointerDown}
        onClick={() => {
          if (!hasMoved.current) {
            onOpen();
          }
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        animate={!dragging ? { y: [0, -metrics.floatOffset, 0] } : {}}
        transition={{ y: { duration: 2.5 + ((index % 3) * 0.4), repeat: Infinity, ease: 'easeInOut', delay: floatDelay } }}
        whileHover={allowHoverEffects ? { scale: 1.15, boxShadow: `0 0 35px ${glow}, 0 0 70px ${glow.replace('0.6', '0.15')}` } : undefined}
        whileTap={{ scale: 0.92 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: metrics.gap,
          padding: metrics.padding,
          borderRadius: metrics.borderRadius,
          background: hovered && allowHoverEffects
            ? `radial-gradient(circle, ${glow.replace('0.6', '0.18')} 0%, rgba(17,17,40,0.6) 70%)`
            : 'rgba(17,17,40,0.35)',
          border: hovered && allowHoverEffects
            ? `1.5px solid ${glow.replace('0.6', '0.6')}`
            : '1px solid rgba(42,42,74,0.25)',
          backdropFilter: 'blur(12px)',
          width: metrics.width,
          minHeight: metrics.minHeight,
          position: 'relative',
          overflow: 'hidden',
          transition: 'background 0.3s, border 0.3s',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        {hovered && allowHoverEffects && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '200%',
              height: '100%',
              background: `linear-gradient(90deg, transparent, ${glow.replace('0.6', '0.1')}, transparent)`,
              animation: 'shimmer 1.5s infinite',
              pointerEvents: 'none',
            }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            inset: -3,
            borderRadius: metrics.borderRadius + 2,
            border: `2px solid ${glow.replace('0.6', hovered && allowHoverEffects ? '0.4' : '0.1')}`,
            pointerEvents: 'none',
          }}
        />
        <span
          style={{
            fontSize: metrics.iconSize,
            filter: hovered && allowHoverEffects
              ? `drop-shadow(0 0 20px ${glow}) drop-shadow(0 0 40px ${glow})`
              : `drop-shadow(0 0 6px ${glow.replace('0.6', '0.25')})`,
            transition: 'filter 0.3s',
            lineHeight: 1,
          }}
        >
          {icon}
        </span>
        <span
          style={{
            fontSize: metrics.labelSize,
            color: hovered && allowHoverEffects ? '#fff' : 'var(--text)',
            textAlign: 'center',
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 600,
            textShadow: hovered && allowHoverEffects ? `0 0 12px ${glow}` : '0 2px 4px rgba(0,0,0,0.9)',
            letterSpacing: '0.5px',
            transition: 'all 0.3s',
            maxWidth: '100%',
            lineHeight: 1.3,
          }}
        >
          {label}
        </span>
      </motion.div>
    </motion.div>
  );
}

export function MobileIcon({ icon, label, onOpen, index = 0 }) {
  const glow = glowColors[index % glowColors.length];

  return (
    <motion.div
      onClick={onOpen}
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.06, type: 'spring', stiffness: 250 }}
      whileTap={{ scale: 0.85 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div
        style={{
          width: 58,
          height: 58,
          borderRadius: 16,
          background: `linear-gradient(135deg, ${glow.replace('0.6', '0.15')}, rgba(17,17,40,0.7))`,
          border: `1px solid ${glow.replace('0.6', '0.25')}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          boxShadow: `0 4px 20px ${glow.replace('0.6', '0.12')}, inset 0 1px 0 rgba(255,255,255,0.05)`,
          backdropFilter: 'blur(8px)',
        }}
      >
        {icon}
      </div>
      <span
        style={{
          fontSize: 10,
          color: 'rgba(224,224,255,0.7)',
          textAlign: 'center',
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: 600,
          maxWidth: 72,
          lineHeight: 1.2,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          textShadow: '0 1px 3px rgba(0,0,0,0.8)',
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}
