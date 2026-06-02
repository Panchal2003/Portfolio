import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import API from '../api/index';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const inputStyle = (focused) => ({
  width: '100%',
  padding: '10px 14px',
  background: '#0a0a1a',
  border: `1px solid ${focused ? '#00f0ff' : '#2a2a4a'}`,
  borderRadius: '6px',
  color: '#e0e0ff',
  fontFamily: "'Rajdhani', sans-serif",
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.3s, box-shadow 0.3s',
  boxShadow: focused ? '0 0 12px #00f0ff22' : 'none',
  boxSizing: 'border-box',
});

export default function ContactApp({ profile = {} }) {
  const { email, phone, socialLinks = {} } = profile;

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [focusedField, setFocusedField] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState(null);

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      alert('Please fill in all required fields (Name, Email, Message).');
      return;
    }
    try {
      await API.post('/contacts', form);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      alert('Failed to send message. Please try again.');
      console.error(error);
    }
  };

  const contactCards = [
    {
      icon: <FaEnvelope />,
      label: 'EMAIL',
      value: email || 'N/A',
      href: email ? `mailto:${email}` : null,
      color: '#00f0ff',
    },
    {
      icon: <FaPhone />,
      label: 'PHONE',
      value: phone || 'N/A',
      href: phone ? `tel:${phone}` : null,
      color: '#bf00ff',
    },
    {
      icon: <FaMapMarkerAlt />,
      label: 'LOCATION',
      value: profile.location || 'India',
      href: null,
      color: '#ff0080',
    },
  ];

  const socialButtons = [
    { key: 'github', icon: <FaGithub />, url: socialLinks.github, color: '#bf00ff' },
    { key: 'linkedin', icon: <FaLinkedin />, url: socialLinks.linkedin, color: '#00f0ff' },
  ].filter(s => s.url);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      style={{
        padding: '24px',
        fontFamily: "'Rajdhani', sans-serif",
        color: '#e0e0ff',
        minHeight: '100%',
      }}
    >
      {/* Header */}
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
        {'>'} SYSTEM://COMMUNICATIONS
      </motion.div>

      {/* Success Toast */}
      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#00ff8820',
            border: '1px solid #00ff8844',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '13px',
            color: '#00ff88',
          }}
        >
          <FaCheckCircle /> Message sent successfully! Transmission complete.
        </motion.div>
      )}

      {/* Main Layout */}
      <div style={{
        display: 'flex',
        gap: '24px',
        flexWrap: 'wrap',
      }}>
        {/* Left Side - Contact Form */}
        <motion.div variants={item} style={{
          flex: '1 1 340px',
          minWidth: '280px',
        }}>
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '11px',
                color: '#8888aa',
                letterSpacing: '1px',
                marginBottom: '6px',
                textTransform: 'uppercase',
              }}>
                NAME *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={handleChange('name')}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your name"
                style={inputStyle(focusedField === 'name')}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '11px',
                color: '#8888aa',
                letterSpacing: '1px',
                marginBottom: '6px',
                textTransform: 'uppercase',
              }}>
                EMAIL *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your email"
                style={inputStyle(focusedField === 'email')}
              />
            </div>

            {/* Subject */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '11px',
                color: '#8888aa',
                letterSpacing: '1px',
                marginBottom: '6px',
                textTransform: 'uppercase',
              }}>
                SUBJECT
              </label>
              <input
                type="text"
                value={form.subject}
                onChange={handleChange('subject')}
                onFocus={() => setFocusedField('subject')}
                onBlur={() => setFocusedField(null)}
                placeholder="Subject line"
                style={inputStyle(focusedField === 'subject')}
              />
            </div>

            {/* Message */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '11px',
                color: '#8888aa',
                letterSpacing: '1px',
                marginBottom: '6px',
                textTransform: 'uppercase',
              }}>
                MESSAGE *
              </label>
              <textarea
                value={form.message}
                onChange={handleChange('message')}
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField(null)}
                placeholder="Type your message..."
                rows={5}
                style={{
                  ...inputStyle(focusedField === 'message'),
                  resize: 'vertical',
                  minHeight: '100px',
                }}
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02, boxShadow: '0 0 24px #00f0ff44' }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #00f0ff, #bf00ff)',
                border: 'none',
                borderRadius: '8px',
                color: '#0a0a1a',
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '13px',
                fontWeight: 'bold',
                letterSpacing: '2px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'box-shadow 0.3s',
              }}
            >
              <FaPaperPlane /> TRANSMIT MESSAGE
            </motion.button>
          </form>
        </motion.div>

        {/* Right Side - Contact Info */}
        <motion.div variants={item} style={{
          flex: '1 1 260px',
          minWidth: '240px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}>
          {/* Contact Info Cards */}
          {contactCards.map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ boxShadow: `0 4px 16px ${card.color}22` }}
              style={{
                background: '#111128',
                border: '1px solid #2a2a4a',
                borderRadius: '10px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                transition: 'box-shadow 0.3s',
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: `${card.color}15`,
                border: `1px solid ${card.color}33`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: card.color,
                fontSize: '16px',
                flexShrink: 0,
              }}>
                {card.icon}
              </div>
              <div>
                <div style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '10px',
                  color: '#8888aa',
                  letterSpacing: '1px',
                  marginBottom: '2px',
                }}>
                  {card.label}
                </div>
                {card.href ? (
                  <a href={card.href} style={{
                    color: '#e0e0ff',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: 600,
                    transition: 'color 0.3s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = card.color}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#e0e0ff'}
                  >
                    {card.value}
                  </a>
                ) : (
                  <span style={{
                    color: '#e0e0ff',
                    fontSize: '14px',
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: 600,
                  }}>
                    {card.value}
                  </span>
                )}
              </div>
            </motion.div>
          ))}

          {/* Social Links */}
          {socialButtons.length > 0 && (
            <div style={{
              background: '#111128',
              border: '1px solid #2a2a4a',
              borderRadius: '10px',
              padding: '16px',
            }}>
              <div style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '10px',
                color: '#8888aa',
                letterSpacing: '1px',
                marginBottom: '12px',
              }}>
                SOCIAL_LINKS
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {socialButtons.map((social) => (
                  <motion.a
                    key={social.key}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, boxShadow: `0 0 20px ${social.color}66` }}
                    onMouseEnter={() => setHoveredSocial(social.key)}
                    onMouseLeave={() => setHoveredSocial(null)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '44px',
                      height: '44px',
                      borderRadius: '8px',
                      background: '#0a0a1a',
                      border: `1px solid ${hoveredSocial === social.key ? social.color : '#2a2a4a'}`,
                      color: hoveredSocial === social.key ? social.color : '#e0e0ff',
                      fontSize: '20px',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      transition: 'border-color 0.3s, color 0.3s',
                    }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
