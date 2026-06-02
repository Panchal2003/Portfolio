import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = ['All', 'Frontend', 'Backend', 'Database', 'Languages', 'Tools'];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
  }
};

const cardVariant = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } }
};

export default function SkillsApp({ skills = [] }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [hoveredCard, setHoveredCard] = useState(null);
  const isMobile = window.innerWidth <= 480;

  const filteredSkills = useMemo(() => {
    if (activeCategory === 'All') return skills;
    return skills.filter(s =>
      s.category && s.category.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [skills, activeCategory]);

  const avgProficiency = useMemo(() => {
    if (filteredSkills.length === 0) return 0;
    const sum = filteredSkills.reduce((acc, s) => acc + (s.proficiency || 0), 0);
    return Math.round(sum / filteredSkills.length);
  }, [filteredSkills]);

  const getCategoryColor = (cat) => {
    const colors = {
      Frontend: '#00f0ff',
      Backend: '#bf00ff',
      Database: '#ff0080',
      Languages: '#00ff88',
      Tools: '#ffaa00',
    };
    return colors[cat] || '#00f0ff';
  };

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
        marginBottom: '20px',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        borderBottom: '1px solid #2a2a4a',
        paddingBottom: '8px',
      }}>
        {'>'} SYSTEM://TECH_DIAGNOSTICS
      </div>

      {/* System Load Indicator */}
      <div style={{
        background: '#111128',
        border: '1px solid #2a2a4a',
        borderRadius: '8px',
        padding: '12px 16px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <span style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '11px',
          color: '#8888aa',
          letterSpacing: '1px',
          whiteSpace: 'nowrap',
        }}>
          SYSTEM LOAD:
        </span>
        <div style={{
          flex: 1,
          height: '8px',
          background: '#0a0a1a',
          borderRadius: '4px',
          overflow: 'hidden',
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${avgProficiency}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #00f0ff, #bf00ff)',
              borderRadius: '4px',
              boxShadow: '0 0 10px #00f0ff66',
            }}
          />
        </div>
        <span style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: '14px',
          color: '#00f0ff',
          fontWeight: 'bold',
          minWidth: '40px',
          textAlign: 'right',
        }}>
          {avgProficiency}%
        </span>
      </div>

      {/* Category Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        padding: isMobile ? '8px' : '10px',
        borderRadius: '18px',
        background: 'linear-gradient(180deg, rgba(17,17,40,0.92), rgba(10,10,26,0.85))',
        border: '1px solid rgba(42,42,74,0.9)',
        boxShadow: '0 12px 26px rgba(0,0,0,0.16)',
      }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: isMobile ? '10px' : '11px',
              letterSpacing: '1px',
              padding: isMobile ? '10px 13px' : '11px 16px',
              minWidth: isMobile ? 'auto' : 88,
              background: activeCategory === cat
                ? 'linear-gradient(135deg, rgba(0,240,255,0.16), rgba(191,0,255,0.12))'
                : 'rgba(255,255,255,0.02)',
              border: activeCategory === cat
                ? '1px solid rgba(0,240,255,0.34)'
                : '1px solid rgba(42,42,74,0.8)',
              borderRadius: '999px',
              color: activeCategory === cat ? '#eafcff' : '#9aa0c4',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              textTransform: 'uppercase',
              boxShadow: activeCategory === cat
                ? '0 10px 24px rgba(0,240,255,0.14)'
                : 'none',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          variants={container}
          initial="hidden"
          animate="show"
          exit="hidden"
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: isMobile ? '10px' : '16px',
          }}
        >
          {filteredSkills.map((skill, i) => {
            const isHovered = hoveredCard === i;
            const catColor = getCategoryColor(skill.category);
            return (
              <motion.div
                key={skill.name + i}
                variants={cardVariant}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  background: '#111128',
                  border: `1px solid ${isHovered ? catColor : '#2a2a4a'}`,
                  borderRadius: isMobile ? '8px' : '10px',
                  padding: isMobile ? '10px' : '16px',
                  cursor: 'default',
                  transition: 'border-color 0.3s, transform 0.3s, box-shadow 0.3s',
                  transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: isHovered ? `0 8px 24px ${catColor}22` : 'none',
                }}
              >
                {/* Icon */}
                <div style={{
                  width: isMobile ? '32px' : '40px',
                  height: isMobile ? '32px' : '40px',
                  borderRadius: '8px',
                  background: `${catColor}15`,
                  border: `1px solid ${catColor}44`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: isMobile ? '8px' : '12px',
                  fontSize: isMobile ? '12px' : '16px',
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: 'bold',
                  color: catColor,
                }}>
                  {skill.icon || skill.name.charAt(0).toUpperCase()}
                </div>

                {/* Name */}
                <div style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: isMobile ? '14px' : '16px',
                  fontWeight: 600,
                  marginBottom: '4px',
                  color: '#e0e0ff',
                }}>
                  {skill.name}
                </div>

                {/* Category Badge - hide on mobile to save space */}
                {!isMobile && (
                <div style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '10px',
                  color: catColor,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}>
                  {skill.category}
                </div>
                )}

                {/* Progress Bar */}
                <div style={{
                  height: '6px',
                  background: '#0a0a1a',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  marginBottom: '6px',
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.proficiency || 0}%` }}
                    transition={{ duration: 0.8, delay: i * 0.05, ease: 'easeOut' }}
                    style={{
                      height: '100%',
                      background: `linear-gradient(90deg, #00f0ff, ${catColor})`,
                      borderRadius: '3px',
                      boxShadow: `0 0 6px ${catColor}66`,
                    }}
                  />
                </div>

                {/* Percentage */}
                <div style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: '13px',
                  color: catColor,
                  fontWeight: 'bold',
                  textAlign: 'right',
                }}>
                  {skill.proficiency || 0}%
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {filteredSkills.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#8888aa',
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '14px',
        }}>
          No skills found in this category.
        </div>
      )}
    </div>
  );
}
