import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import API from '../api/index';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      toast.success('Login successful!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(0,240,255,0.3), 0 0 40px rgba(0,240,255,0.1); }
          50% { box-shadow: 0 0 40px rgba(0,240,255,0.5), 0 0 80px rgba(0,240,255,0.2); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes scan-line {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: var(--bg);
          position: relative;
          z-index: 1;
          overflow: hidden;
        }
        .login-bg-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(0,240,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,240,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }
        .login-bg-gradient {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse at 20% 30%, rgba(0,240,255,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(191,0,255,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(255,0,128,0.05) 0%, transparent 60%);
          pointer-events: none;
        }
        .login-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .login-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(0,240,255,0.6);
          border-radius: 50%;
          animation: float 6s infinite ease-in-out;
        }
        .login-card {
          background: rgba(17, 17, 40, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(0,240,255,0.2);
          border-radius: 24px;
          padding: 3rem;
          width: 100%;
          max-width: 440px;
          box-shadow: 
            0 0 30px rgba(0, 240, 255, 0.1),
            0 20px 60px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255,255,255,0.05);
          position: relative;
          z-index: 2;
        }
        .login-card::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(135deg, rgba(0,240,255,0.3), rgba(191,0,255,0.3), rgba(255,0,128,0.3));
          border-radius: 26px;
          z-index: -1;
          opacity: 0.5;
          animation: gradient-shift 4s ease infinite;
          background-size: 200% 200%;
        }
        .login-scan-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(0,240,255,0.4), transparent);
          animation: scan-line 3s linear infinite;
          pointer-events: none;
        }
        .login-logo {
          text-align: center;
          margin-bottom: 2rem;
        }
        .login-logo-icon {
          font-size: 3.5rem;
          margin-bottom: 0.5rem;
          animation: pulse-glow 2s infinite;
          display: inline-block;
        }
        .login-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.8rem;
          font-weight: 800;
          background: linear-gradient(135deg, #00f0ff 0%, #bf00ff 50%, #ff0080 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-align: center;
          margin-bottom: 0.3rem;
          letter-spacing: 2px;
        }
        .login-subtitle {
          text-align: center;
          color: #8888aa;
          margin-bottom: 2rem;
          font-size: 0.9rem;
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 1px;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }
        .input-group {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.1rem;
          opacity: 0.5;
          transition: opacity 0.3s;
        }
        .login-input {
          width: 100%;
          padding: 0.9rem 1.2rem 0.9rem 2.8rem;
          background: rgba(8, 8, 24, 0.8);
          border: 1px solid rgba(42, 42, 74, 0.6);
          border-radius: 12px;
          color: #e0e0ff;
          font-family: 'Rajdhani', sans-serif;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s ease;
        }
        .login-input:focus {
          border-color: rgba(0,240,255,0.5);
          box-shadow: 0 0 15px rgba(0,240,255,0.15), inset 0 0 4px rgba(0,240,255,0.05);
        }
        .login-input:focus + .input-icon,
        .login-input:focus ~ .input-icon {
          opacity: 1;
        }
        .login-input::placeholder {
          color: #666688;
        }
        .password-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #666688;
          cursor: pointer;
          font-size: 1.1rem;
          padding: 4px;
          transition: color 0.3s;
        }
        .password-toggle:hover {
          color: #00f0ff;
        }
        .login-btn {
          font-family: 'Orbitron', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          padding: 1rem;
          background: linear-gradient(135deg, #00f0ff 0%, #bf00ff 100%);
          color: #0a0a1a;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 2px;
          transition: all 0.3s ease;
          margin-top: 0.5rem;
          position: relative;
          overflow: hidden;
        }
        .login-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }
        .login-btn:hover::before {
          left: 100%;
        }
        .login-btn:hover {
          box-shadow: 0 0 30px rgba(0,240,255,0.4), 0 0 60px rgba(191,0,255,0.2);
          transform: translateY(-2px);
        }
        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .login-btn:disabled:hover::before {
          left: -100%;
        }
        .login-back {
          text-align: center;
          margin-top: 1.5rem;
        }
        .login-back a {
          color: #666688;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.3s ease;
          font-family: 'Share Tech Mono', monospace;
        }
        .login-back a:hover {
          color: #00f0ff;
          text-shadow: 0 0 10px rgba(0,240,255,0.3);
        }
        .login-footer {
          text-align: center;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(42,42,74,0.3);
        }
        .login-footer-text {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: #444;
          letter-spacing: 1px;
        }
      `}</style>
      <div className="login-page">
        <div className="login-bg-grid" />
        <div className="login-bg-gradient" />
        <div className="login-particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="login-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${4 + Math.random() * 4}s`,
                opacity: 0.3 + Math.random() * 0.4,
              }}
            />
          ))}
        </div>
        <div className="login-scan-line" />
        
        <motion.div
          className="login-card"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="login-logo">
            <div className="login-logo-icon">🔐</div>
            <h1 className="login-title">ADMIN ACCESS</h1>
            <p className="login-subtitle">Secure authentication required</p>
          </div>
          
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                className="login-input"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <span className="input-icon">📧</span>
            </div>
            
            <div className="input-group">
              <input
                className="login-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <span className="input-icon">🔑</span>
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            
            <motion.button
              className="login-btn"
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    ⏳
                  </motion.span>
                  Authenticating...
                </span>
              ) : (
                'Login to Dashboard'
              )}
            </motion.button>
          </form>
          
          <div className="login-back">
            <a href="/">← Back to Portfolio</a>
          </div>
          
          <div className="login-footer">
            <div className="login-footer-text">SACHIN_OS v2.0 // SECURE ACCESS</div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminLogin;
