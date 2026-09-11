import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../App';

const GOOGLE_ENABLED = Boolean(process.env.REACT_APP_GOOGLE_CLIENT_ID);

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
      setError('Email already registered');
      return;
    }
    users.push({ email, password });
    localStorage.setItem('users', JSON.stringify(users));
    login({ email });
    navigate('/builder');
  };

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const { email: googleEmail, name, picture } = decoded;

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (!users.find(u => u.email === googleEmail)) {
        users.push({ email: googleEmail, name, provider: 'google' });
        localStorage.setItem('users', JSON.stringify(users));
      }

      login({ email: googleEmail, name, picture, provider: 'google' });
      navigate('/builder');
    } catch (err) {
      setError('Could not sign up with Google. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Sign Up</button>
        {error && <div className="auth-error">{error}</div>}
      </form>

      {GOOGLE_ENABLED && (
        <div className="auth-divider-section">
          <div className="auth-divider"><span>or</span></div>
          <div className="google-login-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google sign-up failed. Please try again.')}
              text="signup_with"
              width="100%"
            />
          </div>
        </div>
      )}

      <p>Already have an account? <Link to="/login">Log In</Link></p>
    </div>
  );
}

export default Signup;
