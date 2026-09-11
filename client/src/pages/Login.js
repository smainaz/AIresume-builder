import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../App';
import { roleForEmail } from '../utils/admin';

const GOOGLE_ENABLED = Boolean(process.env.REACT_APP_GOOGLE_CLIENT_ID);

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      login({ email, name: user.name, role: roleForEmail(email) });
      navigate('/builder');
    } else {
      setError('Invalid email or password');
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const { email: googleEmail, name, picture } = decoded;

      // Register the Google account locally if it hasn't signed in before,
      // matching the app's existing localStorage-based user store.
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      let existing = users.find(u => u.email === googleEmail);
      if (!existing) {
        existing = { email: googleEmail, name, provider: 'google', role: roleForEmail(googleEmail) };
        users.push(existing);
        localStorage.setItem('users', JSON.stringify(users));
      }

      login({ email: googleEmail, name, picture, provider: 'google', role: roleForEmail(googleEmail) });
      navigate('/builder');
    } catch (err) {
      setError('Could not sign in with Google. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <h2>Log In</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Log In</button>
        {error && <div className="auth-error">{error}</div>}
      </form>

      {GOOGLE_ENABLED && (
        <div className="auth-divider-section">
          <div className="auth-divider"><span>or</span></div>
          <div className="google-login-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google sign-in failed. Please try again.')}
              text="signin_with"
              width="100%"
            />
          </div>
        </div>
      )}

      <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
    </div>
  );
}

export default Login;
