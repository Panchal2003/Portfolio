import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaGithub, FaLinkedin, FaRocket, FaCode, FaMicrochip } from 'react-icons/fa';
import {
  calculateTotalExperienceMonths,
  formatMonthsAsExperience,
  formatRoleDuration,
} from '../utils/portfolioData';

const scanLineKeyframes = `
@keyframes scanLine {
  0% { top: -10%; }
  100% { top: 110%; }
}
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 15px #00f0ff, 0 0 30px #00f0ff44; }
  50% { box-shadow: 0 0 25px #00f0ff, 0 0 50px #00f0ff66; }
}
@keyframes borderRotate {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AboutApp({ profile, stats: statsProp, experience = [] }) {
  const { name = '', title = '', email = '', phone = '', bio = '', socialLinks = {} } = profile || {};
  const [hovered, setHovered] = useState(null);
  const isMobile = window.innerWidth <= 480;

  const totalExp = formatMonthsAsExperience(calculateTotalExperienceMonths(experience), true);
  const stats = [
    { label: 'YRS EXP', value: totalExp, icon: <FaRocket /> },
    { label: 'PROJECTS', value: statsProp?.projects || '2+', icon: <FaCode /> },
    { label: 'TECHNOLOGIES', value: statsProp?.technologies || '10+', icon: <FaMicrochip /> },
  ];

  const bioSentences = useMemo(() => {
    const parts = bio
      ? bio.split(/(?<=[.!?])\s+/).filter(Boolean)
      : [];

    const extras = [
      'I build complete web products from interface design to API integration and deployment.',
      'My focus is clean frontend experience, secure backend logic, and practical production delivery.',
      'I enjoy converting business requirements into reliable software that works well on desktop and mobile.',
    ];

    return [...parts, ...extras];
  }, [bio]);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      style={{
        padding: '24px',
        fontFamily: "'Rajdhani', sans-serif",
        color: '#e0e0ff',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100%',
      }}
    >
      <style>{scanLineKeyframes}</style>

      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 10,
      }}>
        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #00f0ff44, transparent)',
          animation: 'scanLine 3s linear infinite',
        }} />
      </div>

      <motion.div variants={item} style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '12px',
        color: '#8888aa',
        marginBottom: '24px',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        borderBottom: '1px solid #2a2a4a',
        paddingBottom: '8px',
      }}>
        {'>'} SYSTEM://USER_PROFILE
      </motion.div>

      <motion.div variants={item} style={{
        display: 'flex',
        gap: isMobile ? '14px' : '24px',
        marginBottom: isMobile ? '18px' : '28px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <div style={{
          width: isMobile ? '96px' : '132px',
          height: isMobile ? '96px' : '132px',
          borderRadius: '50%',
          position: 'relative',
          animation: 'pulseGlow 2s ease-in-out infinite',
          flexShrink: 0,
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            inset: '-4px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #00f0ff, #bf00ff, #ff0080, #00f0ff)',
            backgroundSize: '300% 300%',
            animation: 'borderRotate 3s ease infinite',
            zIndex: -1,
          }} />
          <img
            src="/profile.png"
            alt="Sachin Kumar Panchal"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%',
              border: '3px solid #111128',
            }}
          />
        </div>

        <div style={{ flex: 1, minWidth: isMobile ? '140px' : '200px' }}>
          <h1 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: isMobile ? '20px' : '28px',
            fontWeight: 'bold',
            color: '#00f0ff',
            textShadow: '0 0 20px #00f0ff66',
            margin: 0,
          }}>
            {name}
          </h1>
          <p style={{
            fontSize: isMobile ? '13px' : '16px',
            color: '#bf00ff',
            margin: '4px 0 0 0',
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 600,
          }}>
            {title}
          </p>
        </div>
      </motion.div>

      <motion.div variants={item} style={{
        background: '#0a0a1a',
        border: '1px solid #2a2a4a',
        borderRadius: '8px',
        padding: isMobile ? '12px' : '16px',
        marginBottom: isMobile ? '16px' : '24px',
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: isMobile ? '12px' : '13px',
        lineHeight: '1.8',
        marginLeft: isMobile ? '-8px' : 0,
        marginRight: isMobile ? '-8px' : 0,
        width: isMobile ? 'calc(100% + 16px)' : 'auto',
      }}>
        <div style={{ color: '#8888aa', marginBottom: '8px', fontSize: '11px', letterSpacing: '1px' }}>
          // BIO_DATA
        </div>
        {bioSentences.map((sentence, index) => (
          <div key={`${sentence}-${index}`} style={{ color: '#e0e0ff', marginBottom: '4px' }}>
            <span style={{ color: '#00f0ff' }}>{'> '}</span>{sentence}
          </div>
        ))}
      </motion.div>

      {experience.length > 0 && (
        <motion.div variants={item} style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px',
          marginBottom: '24px',
        }}>
          {experience.map((entry, index) => (
            <div key={entry._id || index} style={{
              background: '#0a0a1a',
              border: '1px solid #2a2a4a',
              borderRadius: '10px',
              padding: '14px 16px',
              boxShadow: '0 0 18px rgba(0,240,255,0.05)',
            }}>
              <div style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '11px',
                color: '#8888aa',
                letterSpacing: '1px',
                marginBottom: '4px',
              }}>
                EXPERIENCE {String(index + 1).padStart(2, '0')}
              </div>
              <div style={{
                color: '#00f0ff',
                fontWeight: 700,
                marginBottom: '6px',
                fontSize: '14px',
              }}>
                {entry.role}
              </div>
              <div style={{
                fontFamily: "'Share Tech Mono', monospace",
                color: '#8888aa',
                fontSize: '11px',
              }}>
                {formatRoleDuration(entry.duration || '')}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      <motion.div variants={item} style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
        flexWrap: 'wrap',
      }}>
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px #00f0ff44' }}
            style={{
              flex: '1 1 140px',
              background: '#111128',
              border: '1px solid #2a2a4a',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center',
              cursor: 'default',
            }}
          >
            <div style={{ color: '#00f0ff', fontSize: '20px', marginBottom: '8px' }}>
              {stat.icon}
            </div>
            <div style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#00f0ff',
              textShadow: '0 0 10px #00f0ff44',
            }}>
              {stat.value}
            </div>
            <div style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '11px',
              color: '#8888aa',
              letterSpacing: '1px',
              marginTop: '4px',
            }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={item} style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
        flexWrap: 'wrap',
      }}>
        {email && (
          <div style={infoCardStyle}>
            <FaEnvelope style={{ color: '#00f0ff' }} />
            <span>{email}</span>
          </div>
        )}
        {phone && (
          <div style={infoCardStyle}>
            <FaPhone style={{ color: '#00f0ff' }} />
            <span>{phone}</span>
          </div>
        )}
      </motion.div>

      <motion.div variants={item} style={{
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
      }}>
        {socialLinks.github && (
          <SocialIcon
            href={socialLinks.github}
            hovered={hovered === 'github'}
            color="#bf00ff"
            onEnter={() => setHovered('github')}
            onLeave={() => setHovered(null)}
          >
            <FaGithub />
          </SocialIcon>
        )}
        {socialLinks.linkedin && (
          <SocialIcon
            href={socialLinks.linkedin}
            hovered={hovered === 'linkedin'}
            color="#00f0ff"
            onEnter={() => setHovered('linkedin')}
            onLeave={() => setHovered(null)}
          >
            <FaLinkedin />
          </SocialIcon>
        )}
        <motion.a
          href="/SACHIN_KUMAR_PANCHAL_RESUME.pdf"
          target="_blank"
          rel="noopener noreferrer"
          download
          whileHover={{ scale: 1.05, boxShadow: '0 0 25px #00f0ff66' }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 22px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg,#00f0ff,#bf00ff)',
            color: '#050510',
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 'bold',
            letterSpacing: '1px',
            textDecoration: 'none',
            fontSize: '14px',
            boxShadow: '0 0 20px #00f0ff44',
            transition: 'all 0.3s ease',
          }}
        >
          <FaRocket />
          DOWNLOAD RESUME
        </motion.a>
      </motion.div>
    </motion.div>
  );
}

function SocialIcon({ href, hovered, color, onEnter, onLeave, children }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.1, boxShadow: `0 0 20px ${color}66` }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '44px',
        height: '44px',
        borderRadius: '8px',
        background: '#111128',
        border: `1px solid ${hovered ? color : '#2a2a4a'}`,
        color: hovered ? color : '#e0e0ff',
        fontSize: '20px',
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'border-color 0.3s, color 0.3s',
      }}
    >
      {children}
    </motion.a>
  );
}

const infoCardStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  background: '#111128',
  border: '1px solid #2a2a4a',
  borderRadius: '6px',
  padding: '10px 16px',
  fontSize: '14px',
};
