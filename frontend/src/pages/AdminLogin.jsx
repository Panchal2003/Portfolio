import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api/index';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
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
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: var(--bg);
          position: relative;
          z-index: 1;
        }
        .login-card {
          background: rgba(17, 17, 40, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 3rem;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 0 30px rgba(0, 240, 255, 0.08), 0 20px 60px rgba(0, 0, 0, 0.4);
        }
        .login-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.5rem;
          color: var(--primary);
          text-align: center;
          margin-bottom: 0.5rem;
          text-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
        }
        .login-subtitle {
          text-align: center;
          color: var(--text-dim);
          margin-bottom: 2rem;
          font-size: 0.95rem;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }
        .login-input {
          width: 100%;
          padding: 0.9rem 1.2rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          color: var(--text);
          font-family: 'Rajdhani', sans-serif;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s ease;
        }
        .login-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 10px rgba(0, 240, 255, 0.15);
        }
        .login-input::placeholder {
          color: var(--text-dim);
        }
        .login-btn {
          font-family: 'Orbitron', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          padding: 1rem;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: var(--bg);
          border: none;
          border-radius: 10px;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 2px;
          transition: all 0.3s ease;
          margin-top: 0.5rem;
        }
        .login-btn:hover {
          box-shadow: 0 0 20px rgba(0, 240, 255, 0.4);
          transform: translateY(-2px);
        }
        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .login-back {
          text-align: center;
          margin-top: 1.5rem;
        }
        .login-back a {
          color: var(--text-dim);
          font-size: 0.9rem;
          transition: color 0.3s ease;
        }
        .login-back a:hover {
          color: var(--primary);
        }
      `}</style>
      <div className="login-page">
        <div className="login-card">
          <h1 className="login-title">ADMIN_ACCESS</h1>
          <p className="login-subtitle">Enter credentials to continue</p>
          <form className="login-form" onSubmit={handleSubmit}>
            <input
              className="login-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="login-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? 'Authenticating...' : 'Login'}
            </button>
          </form>
          <div className="login-back">
            <a href="/">← Back to Portfolio</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
