import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('demo@investiq.com');
  const [password, setPassword] = useState('password123');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'demo@investiq.com' && password === 'password123') {
      navigate('/analyze');
    } else {
      alert('Invalid credentials. For this demo, please use demo@investiq.com / password123');
    }
  };

  const handleSocialClick = (provider: string) => {
    alert(`${provider} authentication is not implemented in this demo.`);
  };

  return (
    <div className="auth-page">
      <div className="card">
        <div className="card-top">
          <Link to="/" className="logo"><span className="logo-mark">IQ</span>InvestIQ</Link>
          <button 
            type="button" 
            className="signup-link" 
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>

        <h1 className="title">{isLogin ? 'Log in' : 'Create an account'}</h1>

        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <button type="submit" className="btn btn-primary">
            {isLogin ? 'Continue' : 'Sign up'}
          </button>
        </form>

        <div className="divider">or</div>

        <div className="social-list">
          <button type="button" className="btn btn-social" onClick={() => handleSocialClick('Google')}>
            <span className="icon">
              <svg viewBox="0 0 18 18" width="18" height="18"><path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z"/><path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.94v2.33A9 9 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.94A9 9 0 0 0 0 9c0 1.45.35 2.83.94 4.03l3.01-2.33z"/><path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .94 4.97l3.01 2.33C4.66 5.17 6.65 3.58 9 3.58z"/></svg>
            </span>
            Continue with Google
          </button>
          <button type="button" className="btn btn-social" onClick={() => handleSocialClick('Microsoft')}>
            <span className="icon">
              <svg viewBox="0 0 18 18" width="16" height="16"><rect x="0" y="0" width="8" height="8" fill="#F25022"/><rect x="10" y="0" width="8" height="8" fill="#7FBA00"/><rect x="0" y="10" width="8" height="8" fill="#00A4EF"/><rect x="10" y="10" width="8" height="8" fill="#FFB900"/></svg>
            </span>
            Continue with Microsoft
          </button>
          <button type="button" className="btn btn-social" onClick={() => handleSocialClick('Apple')}>
            <span className="icon">
              <svg viewBox="0 0 384 512" width="15" height="15"><path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
            </span>
            Continue with Apple
          </button>
        </div>

        <p className="foot-note">By continuing, you agree to InvestIQ's <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.</p>
      </div>
    </div>
  );
}
