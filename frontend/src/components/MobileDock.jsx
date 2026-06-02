import { motion } from 'framer-motion';

const glowColors = [
  'rgba(0, 240, 255, 0.58)',
  'rgba(191, 0, 255, 0.58)',
  'rgba(255, 0, 128, 0.58)',
];

export default function MobileDock({ items = [] }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: 'var(--taskbar-bg)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingTop: 10,
        paddingBottom: 8,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-evenly',
          maxWidth: 340,
          margin: '0 auto',
          gap: 8,
        }}
      >
        {items.map((item, index) => {
          const glow = glowColors[index % glowColors.length];
          return (
            <motion.button
              key={item.id}
              type="button"
              whileTap={{ scale: 0.88 }}
              onClick={item.onClick}
              style={{
                border: 'none',
                background: 'transparent',
                display: 'grid',
                justifyItems: 'center',
                gap: 6,
                color: 'var(--text)',
                minWidth: 72,
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 16,
                  background: `linear-gradient(135deg, ${glow.replace('0.58', '0.16')}, rgba(17,17,40,0.7))`,
                  border: `1px solid ${glow.replace('0.58', '0.22')}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
                }}
              >
                {item.icon}
              </div>
              <span
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: 10,
                  letterSpacing: 0.4,
                  color: 'var(--text-dim)',
                }}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
      <div
        style={{
          width: 36,
          height: 4,
          borderRadius: 2,
          background: 'rgba(255,255,255,0.2)',
          margin: '8px auto 0',
        }}
      />
    </div>
  );
}

