// Certificates/Achievements Gallery App
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCertificate, FaExternalLinkAlt, FaTimes, FaCalendarAlt } from 'react-icons/fa';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 }
  }
};

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

function AchievementCard({ achievement, onSelect, isMobile }) {
  return (
    <motion.div
      variants={cardVariant}
      style={{
        background: '#111128',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 4px 12px #00000044',
        border: '1px solid #2a2a4a',
        position: 'relative',
      }}
      onClick={() => onSelect(achievement)}
      whileHover={{ 
        y: -5, 
        boxShadow: '0 12px 32px #00f0ff22',
        border: '1px solid #00f0ff'
      }}
    >
      {/* Gradient Top Border */}
      <div style={{
        height: '3px',
        background: 'linear-gradient(90deg, #00f0ff, #bf00ff)',
      }} />

      {/* Certificate Image */}
      {achievement.image && (
        <div style={{
          height: isMobile ? '140px' : '180px',
          overflow: 'hidden',
          background: '#0a0a1a',
        }}>
          <img 
            src={achievement.image} 
            alt={achievement.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      )}

      {/* Content */}
      <div style={{ padding: isMobile ? '14px' : '20px' }}>
        {/* Icon */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '10px',
        }}>
          <FaCertificate style={{ color: '#ffaa00', fontSize: isMobile ? '14px' : '16px' }} />
          <span style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: isMobile ? '10px' : '11px',
            color: '#ffaa00',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            Certificate
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: isMobile ? '14px' : '16px',
          fontWeight: 'bold',
          color: '#e0e0ff',
          margin: '0 0 8px 0',
        }}>
          {achievement.title}
        </h3>

        {/* Description */}
        {achievement.description && (
          <p style={{
            fontSize: isMobile ? '12px' : '13px',
            color: '#8888aa',
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: '1.5',
          }}>
            {achievement.description}
          </p>
        )}

        {/* Date */}
        {achievement.date && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '12px',
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: isMobile ? '10px' : '11px',
            color: '#666688',
          }}>
            <FaCalendarAlt style={{ fontSize: '10px' }} />
            {new Date(achievement.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function AchievementDetail({ achievement, onBack, isMobile }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      style={{
        background: '#111128',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #2a2a4a',
      }}
    >
      {/* Back Button */}
      <button
        onClick={onBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'transparent',
          border: '1px solid #3a3a5a',
          borderRadius: '8px',
          padding: isMobile ? '6px 10px' : '8px 14px',
          cursor: 'pointer',
          marginBottom: isMobile ? '12px' : '20px',
          transition: 'border-color 0.3s',
          color: '#8888aa',
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: isMobile ? '10px' : '12px',
        }}
        onMouseEnter={(e) => e.target.style.borderColor = '#00f0ff'}
        onMouseLeave={(e) => e.target.style.borderColor = '#3a3a5a'}
      >
        ← BACK TO CERTIFICATES
      </button>

      {/* Certificate Image */}
      {achievement.image && (
        <div style={{
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: isMobile ? '16px' : '24px',
          background: '#0a0a1a',
        }}>
          <img 
            src={achievement.image} 
            alt={achievement.title}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: isMobile ? '300px' : '500px',
              objectFit: 'contain',
            }}
          />
        </div>
      )}

      {/* Content */}
      <div style={{
        padding: isMobile ? '16px' : '24px',
        paddingTop: 0,
      }}>
        {/* Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px',
        }}>
          <FaCertificate style={{ color: '#ffaa00', fontSize: '14px' }} />
          <span style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '11px',
            color: '#ffaa00',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            Certificate
          </span>
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: isMobile ? '18px' : '24px',
          fontWeight: 'bold',
          color: '#e0e0ff',
          margin: '0 0 16px 0',
        }}>
          {achievement.title}
        </h2>

        {/* Description */}
        {achievement.description && (
          <div style={{
            background: '#0a0a1a',
            borderRadius: '8px',
            padding: isMobile ? '12px' : '16px',
            marginBottom: isMobile ? '14px' : '20px',
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: isMobile ? '13px' : '14px',
            lineHeight: '1.7',
            color: '#aaaacc',
          }}>
            {achievement.description}
          </div>
        )}

        {/* Date & Link */}
        <div style={{ 
          display: 'flex', 
          gap: isMobile ? '12px' : '16px', 
          flexWrap: 'wrap',
          marginBottom: isMobile ? '16px' : '20px',
        }}>
          {achievement.date && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: isMobile ? '11px' : '12px',
              color: '#666688',
            }}>
              <FaCalendarAlt style={{ fontSize: '12px' }} />
              {new Date(achievement.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          )}

          {achievement.link && (
            <a
              href={achievement.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: isMobile ? '8px 14px' : '10px 20px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #00f0ff20, #bf00ff20)',
                border: '1px solid #00f0ff',
                color: '#00f0ff',
                fontSize: isMobile ? '11px' : '13px',
                fontFamily: "'Share Tech Mono', monospace",
                textDecoration: 'none',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #00f0ff40, #bf00ff40)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #00f0ff20, #bf00ff20)';
              }}
            >
              <FaExternalLinkAlt style={{ fontSize: '11px' }} />
              VIEW CERTIFICATE
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function AchievementsApp({ achievements = [] }) {
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const isMobile = window.innerWidth <= 480;

  const sortedAchievements = [...achievements].sort((a, b) => (a.order || 0) - (b.order || 0));

  if (!achievements) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        color: '#00f0ff',
        fontFamily: "'Share Tech Mono', monospace",
      }}>
        Loading certificates...
      </div>
    );
  }

  if (achievements.length === 0) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        color: '#8888aa',
        fontFamily: "'Share Tech Mono', monospace",
      }}>
        No certificates found.
      </div>
    );
  }

  return (
    <div style={{
      padding: isMobile ? '16px' : '24px',
      height: '100%',
      overflow: 'auto',
      background: 'linear-gradient(180deg, #0a0a1a 0%, #111128 100%)',
    }}>
      {/* Header */}
      <div style={{
        marginBottom: isMobile ? '20px' : '32px',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '8px',
        }}>
          <FaCertificate style={{ color: '#ffaa00', fontSize: isMobile ? '20px' : '28px' }} />
          <h1 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: isMobile ? '20px' : '28px',
            fontWeight: 'bold',
            color: '#e0e0ff',
            margin: 0,
            textShadow: '0 0 20px #00f0ff44',
          }}>
            CERTIFICATIONS
          </h1>
        </div>
        <p style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: isMobile ? '11px' : '13px',
          color: '#666688',
          margin: 0,
        }}>
          {achievements.length} certificate{achievements.length !== 1 ? 's' : ''} earned
        </p>
      </div>

      <AnimatePresence mode="wait">
        {selectedAchievement ? (
          <AchievementDetail
            key="detail"
            achievement={selectedAchievement}
            onBack={() => setSelectedAchievement(null)}
            isMobile={isMobile}
          />
        ) : (
          <motion.div
            key="grid"
            variants={container}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: isMobile ? '12px' : '20px',
            }}
          >
            {sortedAchievements.map((achievement) => (
              <AchievementCard
                key={achievement._id || achievement.title}
                achievement={achievement}
                onSelect={setSelectedAchievement}
                isMobile={isMobile}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
