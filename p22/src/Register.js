import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    dob: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToUpdates, setAgreeToUpdates] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.username.trim()) newErrors.username = 'Username is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Email is invalid';

    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 8) newErrors.password = 'Minimum 8 characters';

    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (!form.gender) newErrors.gender = 'Gender is required';

    if (!form.dob) {
      newErrors.dob = 'Date of birth is required';
    } else {
      const today = new Date();
      const dobDate = new Date(form.dob);
      const minDate = new Date(today.getFullYear() - 14, today.getMonth(), today.getDate());
      if (dobDate > minDate) {
        newErrors.dob = 'You must be at least 14 years old';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/api/auth/register', {
        username: form.username,
        email: form.email,
        password: form.password,
        gender: form.gender,
        dob: form.dob,
        agreeToUpdates
      });

      // After successful registration response:
      const token = res.data.token;
      const userId = res.data.userId;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', userId);
      navigate('/goal'); // or wherever you take the user next

    } catch (err) {
      console.error('Signup error:', err);
      const errorMessage = err.response?.data?.error || 'Something went wrong';
      setErrors({ server: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <div className="logo"></div>
          <h2>Create Your Account</h2>
          <p>Join our community today</p>
        </div>

        {errors.server && (
          <div className="error-message">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-3H9V5h2v7z" fill="currentColor" />
            </svg>
            <span>{errors.server}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="signup-form">
          <div className={`form-group ${errors.email ? 'error' : ''}`}>
            <label htmlFor="email">Email Address*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className={`form-group ${errors.username ? 'error' : ''}`}>
            <label htmlFor="username">Username*</label>
            <input
              type="text"
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="username"
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>

          <div className={`form-group ${errors.password ? 'error' : ''}`}>
            <label htmlFor="password">Password*</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimum 8 characters"
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(prev => !prev)}
              title={showPassword ? "Hide password" : "Show password"}
            >
              👁
            </span>
            {errors.password ? (
              <span className="error-message">{errors.password}</span>
            ) : (
              <span className="password-hint">Minimum 8 characters</span>
            )}
          </div>

          <div className={`form-group ${errors.confirmPassword ? 'error' : ''}`}>
            <label htmlFor="confirmPassword">Confirm Password*</label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
            />
            <span
              className="toggle-password"
              onClick={() => setShowConfirmPassword(prev => !prev)}
              title={showConfirmPassword ? "Hide password" : "Show password"}
            >
              👁
            </span>
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          <div className="form-row">
            <div className={`form-group ${errors.gender ? 'error' : ''}`}>
              <label htmlFor="gender">Gender*</label>
              <select
                id="gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <span className="error-message">{errors.gender}</span>}
            </div>

            <div className={`form-group ${errors.dob ? 'error' : ''}`}>
              <label htmlFor="dob">Date of Birth*</label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={form.dob}
                onChange={handleChange}
              />
              {errors.dob && <span className="error-message">{errors.dob}</span>}
            </div>
          </div>

          <div className="form-checkbox">
            <input
              type="checkbox"
              id="agreeToUpdates"
              checked={agreeToUpdates}
              onChange={(e) => setAgreeToUpdates(e.target.checked)}
            />
            <label htmlFor="agreeToUpdates">I agree to receive updates and newsletters</label>
          </div>

          <button
            type="submit"
            className="signup-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="login-link">
          Already have an account? <a href="/login">Log in</a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
