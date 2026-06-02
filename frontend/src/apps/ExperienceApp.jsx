import React from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaCircle } from 'react-icons/fa';

const pulseKeyframes = `
@keyframes greenPulse {
  0%, 100% { box-shadow: 0 0 4px #00ff88, 0 0 8px #00ff8844; }
  50% { box-shadow: 0 0 8px #00ff88, 0 0 16px #00ff8866; }
}
`;

export default function ExperienceApp({ experience = [] }) {
  const sorted = [...experience].sort((a, b) => (a.order || 0) - (b.order || 0));
  const isMobile = window.innerWidth <= 480;

  return (
    <div style={{
      padding: '24px',
      fontFamily: "'Rajdhani', sans-serif",
      color: '#e0e0ff',
      minHeight: '100%',
    }}>
      <style>{pulseKeyframes}</style>

      {/* Header */}
      <div style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '12px',
        color: '#8888aa',
        marginBottom: '24px',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        borderBottom: '1px solid #2a2a4a',
        paddingBottom: '8px',
      }}>
        {'>'} SYSTEM://MISSION_LOG
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative', paddingLeft: '0' }}>
        {sorted.map((entry, i) => {
          const isLeft = i % 2 === 0;
          return (
            <motion.div
              key={entry._id || i}
              initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              style={{
                display: 'flex',
                marginBottom: '24px',
                position: 'relative',
              }}
            >
              {/* Timeline Line & Dot */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginRight: isMobile ? '12px' : '20px',
                flexShrink: 0,
                position: 'relative',
              }}>
                {/* Dot */}
                <div style={{
                  width: isMobile ? '12px' : '16px',
                  height: isMobile ? '12px' : '16px',
                  borderRadius: '50%',
                  background: entry.current ? '#00ff88' : '#00f0ff',
                  border: `2px solid ${entry.current ? '#00ff88' : '#00f0ff'}`,
                  boxShadow: entry.current
                    ? '0 0 8px #00ff88, 0 0 16px #00ff8844'
                    : '0 0 8px #00f0ff, 0 0 16px #00f0ff44',
                  animation: entry.current ? 'greenPulse 2s ease-in-out infinite' : 'none',
                  zIndex: 2,
                  flexShrink: 0,
                }} />
                {/* Connecting Line */}
                {i < sorted.length - 1 && (
                  <div style={{
                    width: '2px',
                    flex: 1,
                    background: 'linear-gradient(180deg, #00f0ff44, #00f0ff11)',
                    marginTop: '0',
                  }} />
                )}
              </div>

              {/* Card - smaller on mobile */}
              <motion.div
                whileHover={{ boxShadow: '0 4px 20px #00f0ff22' }}
                style={{
                  flex: 1,
                  background: '#111128',
                  border: '1px solid #2a2a4a',
                  borderRadius: isMobile ? '8px' : '10px',
                  padding: isMobile ? '12px' : '20px',
                  transition: 'box-shadow 0.3s',
                }}
              >
                {/* Duration & Active Badge */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: isMobile ? '6px' : '10px',
                  flexWrap: 'wrap',
                }}>
                  <span style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: isMobile ? '9px' : '11px',
                    color: '#8888aa',
                    background: '#0a0a1a',
                    border: '1px solid #2a2a4a',
                    borderRadius: '12px',
                    padding: '2px 8px',
                    letterSpacing: '0.5px',
                  }}>
                    {entry.duration}
                  </span>
                  {entry.current && (
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: '9px',
                      color: '#00ff88',
                      background: '#00ff8815',
                      border: '1px solid #00ff8844',
                      borderRadius: '12px',
                      padding: '2px 8px',
                      letterSpacing: '1px',
                    }}>
                      <FaCircle style={{
                        fontSize: '5px',
                        animation: 'greenPulse 1.5s ease-in-out infinite',
                        borderRadius: '50%',
                      }} />
                      ACTIVE
                    </span>
                  )}
                </div>

                {/* Company */}
                <h3 style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: isMobile ? '14px' : '18px',
                  fontWeight: 'bold',
                  color: '#e0e0ff',
                  margin: '0 0 2px 0',
                }}>
                  {entry.company}
                </h3>

                {/* Role */}
                <div style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: isMobile ? '13px' : '15px',
                  color: '#00f0ff',
                  fontWeight: 600,
                  marginBottom: isMobile ? '8px' : '14px',
                }}>
                  {entry.role}
                </div>

                {/* Description - fewer items on mobile */}
                <div style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: isMobile ? '10px' : '12px',
                  lineHeight: '1.7',
                  color: '#e0e0ff',
                }}>
                  {(entry.description || []).slice(0, isMobile ? 2 : 5).map((desc, j) => (
                    <div key={j} style={{ marginBottom: '2px' }}>
                      <span style={{ color: '#00f0ff' }}>{'> '}</span>
                      <span style={{ color: '#ccccee' }}>{desc}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {sorted.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#8888aa',
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '14px',
        }}>
          No mission logs found.
        </div>
      )}
    </div>
  );
}
