import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Load remembered login details on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    const savedCheckbox = localStorage.getItem('rememberMe') === 'true';

    if (savedCheckbox && savedEmail) {
      setFormData({
        email: savedEmail,
        password: savedPassword || ''
      });
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate email and password
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }
      if (formData.password.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }

      // Send login request to the backend
      const res = await axios.post('http://localhost:8000/api/auth/login', formData);

      // Validate response
      if (!res.data.token || !res.data.userId) {
        throw new Error('Invalid login response. Please try again.');
      }

      // Store token and userId in localStorage
      localStorage.setItem('authToken', res.data.token);
      localStorage.setItem('userId', res.data.userId);

      // Redirect to the home page
      navigate('/Loginhome');
    } catch (err) {
      console.error('Login failed:', err.response || err);
      setError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/api/auth/google'; // // Redirect to Google login
  };

  return (
    <div className="body2 bg-[url('/your-pattern.svg')] bg-cover bg-no-repeat">
      <div className="login-container bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-8">
        <div className="login-card">
          <div className="login-header">
            <div className="logo">{/* Your logo SVG */}</div>
            <h2>Welcome Back</h2>
            <p>Please enter your credentials to login</p>
          </div>

          {error && (
            <div className="error-message">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-3H9V5h2v7z" fill="currentColor"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                autoComplete="username"
              />
              <small>We'll never share your email</small>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                  minLength="8"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  👁
                </button>
              </div>
            </div>

            <div className="form-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember">Remember me</label>
              </div>
              
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  <span>Logging in...</span>
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="social-login">
            <div className="social-buttons">
              <a
                href="http://localhost:8000/api/auth/google"
                className="social-button google-button"
                onClick={handleGoogleLogin}
              >
                <svg xmlns="http://www.w3.org/2000/svg"  width="20" height="20" fill="currentColor" viewBox="0 0 24 24 ">
                  <path d="M21.35 11.1H12v2.9h5.35c-.25 1.4-1.05 2.6-2.2 3.35v2.8h3.55c2.1-1.95 3.3-4.85 3.3-8.05 0-.65-.05-1.25-.15-1.85z" fill="#4285F4"/>
                  <path d="M12 22c2.7 0 4.95-.9 6.6-2.45l-3.55-2.8c-.95.65-2.2 1.05-3.05 1.05-2.35 0-4.35-1.6-5.05-3.75H3.3v2.85C5 19.95 8.25 22 12 22z" fill="#34A853"/>
                  <path d="M6.95 13.05A5.98 5.98 0 016.6 12c0-.35.05-.7.15-1.05V8.1H3.3A9.93 9.93 0 003 12c0 1.55.35 3.05.95 4.35l2.9-2.3z" fill="#FBBC05"/>
                  <path d="M12 6.1c1.45 0 2.75.5 3.8 1.5l2.8-2.8C16.95 2.95 14.7 2 12 2 8.25 2 5 4.05 3.3 7.15l2.9 2.8C7.65 7.7 9.65 6.1 12 6.1z" fill="#EA4335"/>
                </svg>
              </a>

              
            </div>
          </div>

          <div className="signup-link">
            Don't have an account? <a href="/Register">Sign up</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;