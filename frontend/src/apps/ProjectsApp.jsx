import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub, FaStar, FaArrowLeft } from 'react-icons/fa';

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

function ProjectCard({ project, onSelect, isMobile }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariant}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        background: '#111128',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        perspective: '1000px',
        transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transition: 'transform 0.1s ease-out, box-shadow 0.3s',
        boxShadow: isHovered ? '0 12px 32px #00f0ff22' : '0 4px 12px #00000044',
        border: '1px solid #2a2a4a',
        position: 'relative',
      }}
      onClick={() => onSelect(project)}
    >
      {/* Gradient Top Border */}
      <div style={{
        height: '3px',
        background: 'linear-gradient(90deg, #00f0ff, #bf00ff)',
      }} />

      {/* Featured Badge */}
      {project.featured && (
        <div style={{
          position: 'absolute',
          top: '14px',
          right: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: '#1a1a3e',
          border: '1px solid #ffaa00',
          borderRadius: '12px',
          padding: '3px 8px',
          fontSize: '10px',
          fontFamily: "'Share Tech Mono', monospace",
          color: '#ffaa00',
          textShadow: '0 0 8px #ffaa0066',
          zIndex: 2,
        }}>
          <FaStar style={{ fontSize: '9px' }} /> FEATURED
        </div>
      )}

      <div style={{ padding: isMobile ? '14px' : '20px' }}>
        {/* Title */}
        <h3 style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: isMobile ? '14px' : '16px',
          fontWeight: 'bold',
          color: '#e0e0ff',
          margin: '0 0 8px 0',
          paddingRight: project.featured ? '90px' : '0',
        }}>
          {project.title}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: isMobile ? '12px' : '13px',
          color: '#8888aa',
          lineHeight: '1.5',
          margin: '0 0 12px 0',
          display: '-webkit-box',
          WebkitLineClamp: isMobile ? 2 : 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          fontFamily: "'Rajdhani', sans-serif",
        }}>
          {project.description}
        </p>

        {/* Tech Stack - stacked on mobile */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: isMobile ? '4px' : '6px',
          marginBottom: isMobile ? '10px' : '16px',
        }}>
          {(project.techStack || []).slice(0, isMobile ? 4 : 5).map((tech, i) => (
            <span key={i} style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: isMobile ? '9px' : '10px',
              color: '#00f0ff',
              border: '1px solid #00f0ff44',
              borderRadius: '12px',
              padding: '2px 8px',
              letterSpacing: '0.5px',
            }}>
              {tech}
            </span>
          ))}
          {(project.techStack || []).length > (isMobile ? 4 : 5) && (
            <span style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '9px',
              color: '#8888aa',
              padding: '2px 4px',
            }}>
              +{project.techStack.length - (isMobile ? 4 : 5)}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '8px',
        }}>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #00f0ff22, #bf00ff22)',
                border: '1px solid #00f0ff44',
                color: '#00f0ff',
                fontSize: '11px',
                fontFamily: "'Share Tech Mono', monospace",
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'box-shadow 0.3s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 12px #00f0ff44'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
            >
              <FaExternalLinkAlt style={{ fontSize: '10px' }} /> View Live
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                background: '#1a1a3e',
                border: '1px solid #2a2a4a',
                color: '#e0e0ff',
                fontSize: '11px',
                fontFamily: "'Share Tech Mono', monospace",
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'box-shadow 0.3s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 12px #bf00ff44'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
            >
              <FaGithub style={{ fontSize: '12px' }} /> GitHub
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ProjectDetail({ project, onBack, isMobile }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      style={{ padding: isMobile ? '2px' : '4px' }}
    >
      {/* Back Button */}
      <button
        onClick={onBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: '1px solid #2a2a4a',
          borderRadius: '6px',
          color: '#00f0ff',
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: isMobile ? '10px' : '12px',
          padding: isMobile ? '6px 10px' : '8px 14px',
          cursor: 'pointer',
          marginBottom: isMobile ? '12px' : '20px',
          transition: 'border-color 0.3s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#00f0ff'}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#2a2a4a'}
      >
        <FaArrowLeft /> {isMobile ? 'BACK' : 'BACK TO PROJECTS'}
      </button>

      {/* Gradient Top Border */}
      <div style={{
        height: '3px',
        background: 'linear-gradient(90deg, #00f0ff, #bf00ff, #ff0080)',
        borderRadius: '3px 3px 0 0',
      }} />

      <div style={{
        background: '#111128',
        border: '1px solid #2a2a4a',
        borderTop: 'none',
        borderRadius: '0 0 12px 12px',
        padding: isMobile ? '16px' : '24px',
      }}>
        {/* Featured Badge */}
        {project.featured && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#1a1a3e',
            border: '1px solid #ffaa00',
            borderRadius: '12px',
            padding: '4px 10px',
            fontSize: '11px',
            fontFamily: "'Share Tech Mono', monospace",
            color: '#ffaa00',
            textShadow: '0 0 8px #ffaa0066',
            marginBottom: '12px',
          }}>
            <FaStar style={{ fontSize: '10px' }} /> FEATURED PROJECT
          </div>
        )}

        {/* Title */}
        <h2 style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: isMobile ? '18px' : '24px',
          fontWeight: 'bold',
          color: '#00f0ff',
          textShadow: '0 0 16px #00f0ff44',
          margin: '0 0 12px 0',
        }}>
          {project.title}
        </h2>

        {/* Full Description */}
        <div style={{
          background: '#0a0a1a',
          border: '1px solid #2a2a4a',
          borderRadius: '8px',
          padding: isMobile ? '12px' : '16px',
          marginBottom: isMobile ? '14px' : '20px',
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: isMobile ? '13px' : '14px',
          lineHeight: '1.7',
          color: '#e0e0ff',
        }}>
          {project.description}
        </div>

        {/* Full Tech Stack - stacked on mobile */}
        <div style={{ marginBottom: isMobile ? '14px' : '20px' }}>
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '11px',
            color: '#8888aa',
            letterSpacing: '1px',
            marginBottom: '8px',
          }}>
            TECH_STACK:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? '6px' : '8px' }}>
            {(project.techStack || []).map((tech, i) => (
              <span key={i} style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: isMobile ? '10px' : '12px',
                color: '#00f0ff',
                border: '1px solid #00f0ff44',
                background: '#00f0ff0a',
                borderRadius: '14px',
                padding: isMobile ? '3px 8px' : '4px 12px',
                letterSpacing: '0.5px',
              }}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: isMobile ? '8px' : '12px', flexWrap: 'wrap' }}>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: isMobile ? '8px 14px' : '10px 20px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #00f0ff, #bf00ff)',
                color: '#0a0a1a',
                fontSize: isMobile ? '11px' : '13px',
                fontFamily: "'Share Tech Mono', monospace",
                fontWeight: 'bold',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'box-shadow 0.3s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 20px #00f0ff66'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
            >
              <FaExternalLinkAlt /> VIEW LIVE
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: isMobile ? '8px 14px' : '10px 20px',
                borderRadius: '8px',
                background: '#1a1a3e',
                border: '1px solid #2a2a4a',
                color: '#e0e0ff',
                fontSize: isMobile ? '11px' : '13px',
                fontFamily: "'Share Tech Mono', monospace",
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'box-shadow 0.3s, border-color 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 16px #bf00ff44';
                e.currentTarget.style.borderColor = '#bf00ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#2a2a4a';
              }}
            >
              <FaGithub /> VIEW SOURCE
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsApp({ projects = [] }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const sortedProjects = [...projects].sort((a, b) => (a.order || 0) - (b.order || 0));
  const isMobile = window.innerWidth <= 480;

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
        {'>'} SYSTEM://PROJECT_EXPLORER
      </div>

      <AnimatePresence mode="wait">
        {selectedProject ? (
          <ProjectDetail
            key="detail"
            project={selectedProject}
            onBack={() => setSelectedProject(null)}
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
            {sortedProjects.map((project) => (
              <ProjectCard
                key={project._id || project.title}
                project={project}
                onSelect={setSelectedProject}
                isMobile={isMobile}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {projects.length === 0 && !selectedProject && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#8888aa',
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '14px',
        }}>
          No projects found in directory.
        </div>
      )}
    </div>
  );
}
