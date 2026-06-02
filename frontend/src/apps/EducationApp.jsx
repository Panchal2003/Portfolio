import React from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaCalendarAlt } from 'react-icons/fa';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const cardVariant = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }
};

export default function EducationApp({ education = [] }) {
  return (
    <div style={{
      padding: '24px',
      fontFamily: "'Rajdhani', sans-serif",
      color: '#e0e0ff',
      minHeight: '100%',
    }}>
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
        {'>'} SYSTEM://CREDENTIALS
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {education.map((edu, i) => (
          <motion.div
            key={edu._id || i}
            variants={cardVariant}
            whileHover={{ boxShadow: '0 8px 32px #00f0ff22' }}
            style={{
              position: 'relative',
              background: '#111128',
              borderRadius: '12px',
              padding: '28px',
              border: '1px solid #2a2a4a',
              overflow: 'hidden',
              transition: 'box-shadow 0.3s',
            }}
          >
            {/* Gradient border top */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #00f0ff, #bf00ff, #ff0080)',
            }} />

            {/* Corner decorations */}
            <div style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              width: '20px',
              height: '20px',
              borderTop: '2px solid #00f0ff44',
              borderLeft: '2px solid #00f0ff44',
            }} />
            <div style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '20px',
              height: '20px',
              borderTop: '2px solid #bf00ff44',
              borderRight: '2px solid #bf00ff44',
            }} />
            <div style={{
              position: 'absolute',
              bottom: '8px',
              left: '8px',
              width: '20px',
              height: '20px',
              borderBottom: '2px solid #bf00ff44',
              borderLeft: '2px solid #bf00ff44',
            }} />
            <div style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              width: '20px',
              height: '20px',
              borderBottom: '2px solid #00f0ff44',
              borderRight: '2px solid #00f0ff44',
            }} />

            {/* Icon */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #00f0ff15, #bf00ff15)',
                border: '1px solid #00f0ff33',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00f0ff',
                fontSize: '20px',
              }}>
                <FaGraduationCap />
              </div>

              {/* Year Badge */}
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '12px',
                color: '#bf00ff',
                background: '#bf00ff15',
                border: '1px solid #bf00ff44',
                borderRadius: '14px',
                padding: '4px 12px',
                letterSpacing: '0.5px',
              }}>
                <FaCalendarAlt style={{ fontSize: '10px' }} />
                {edu.year}
              </span>
            </div>

            {/* Degree */}
            <h3 style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#e0e0ff',
              margin: '0 0 6px 0',
            }}>
              {edu.degree}
            </h3>

            {/* Institution */}
            <div style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '16px',
              color: '#00f0ff',
              fontWeight: 600,
              marginBottom: '12px',
            }}>
              {edu.institution}
            </div>

            {/* Description */}
            {edu.description && (
              <div style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '12px',
                lineHeight: '1.8',
                color: '#8888aa',
                background: '#0a0a1a',
                border: '1px solid #2a2a4a',
                borderRadius: '6px',
                padding: '12px',
              }}>
                {edu.description}
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {education.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#8888aa',
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '14px',
        }}>
          No credentials found.
        </div>
      )}
    </div>
  );
}
