import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function MobileSplash({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0a0a1a',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
        padding: '0 24px',
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
          width: '100%',
          maxWidth: 320,
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ scale: 0.84, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 18, delay: 0.08 }}
          style={{
            width: 74,
            height: 74,
            borderRadius: 20,
            background: 'linear-gradient(135deg, rgba(0,240,255,0.16), rgba(17,17,40,0.86))',
            border: '2px solid rgba(0,240,255,0.34)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 40px rgba(0,240,255,0.15), 0 0 80px rgba(191,0,255,0.08)',
            flexShrink: 0,
          }}
        >
          <span style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 28,
            fontWeight: 900,
            background: 'linear-gradient(135deg, #00f0ff, #bf00ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            SKP
          </span>
        </motion.div>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 18,
            fontWeight: 800,
            color: 'rgba(224,224,255,0.94)',
            letterSpacing: 1.4,
            lineHeight: 1.2,
            marginBottom: 6,
          }}>
            Sachin Kumar Panchal
          </div>
          <div style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 14,
            color: 'rgba(0,240,255,0.72)',
            letterSpacing: 1.6,
            fontWeight: 600,
            lineHeight: 1.2,
          }}>
            Software Developer 
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{
          width: 150,
          height: 3,
          background: '#1a1a3e',
          borderRadius: 2,
          overflow: 'hidden',
          marginTop: 8,
        }}
      >
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ delay: 0.8, duration: 1.35, ease: 'easeInOut' }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #00f0ff, #bf00ff)',
            borderRadius: 2,
            boxShadow: '0 0 8px #00f0ff',
          }}
        />
      </motion.div>
    </motion.div>
  );
}
