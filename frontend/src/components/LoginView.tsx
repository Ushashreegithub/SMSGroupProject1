import React, { useState } from 'react';
import { SmsGroupLogo } from './SmsGroupLogo';
import { AuthUser, loginUser } from '../lib/api';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState<string>('admin');
  const [password, setPassword] = useState<string>('smsgroup2026');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await loginUser(username, password);
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Dynamic Background Ambient Light Orbs */}
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />

      <div className="login-card">
        {/* Header Branding */}
        <div className="login-header">
          <div className="login-brand-badge">
            <span className="badge-dot" />
            <span>ENTERPRISE PLANT PORTAL</span>
          </div>

          <div className="logo-wrapper">
            <SmsGroupLogo height={44} textColor="#ffffff" />
          </div>

          <h1 className="login-title">Capacity Planning System</h1>
          <p className="login-subtitle">
            Secure authentication for plant managers & production planners
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error-banner">
              <AlertCircle size={18} className="error-icon" />
              <span>{error}</span>
            </div>
          )}

          {/* Username Field */}
          <div className="form-group">
            <label htmlFor="username">Username / Corporate Email</label>
            <div className="input-icon-wrapper">
              <User size={18} className="input-icon" />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin or planner@sms-group.com"
                required
                disabled={loading}
                className="login-input"
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <div className="label-row">
              <label htmlFor="password">Security Password</label>
            </div>
            <div className="input-icon-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter company password"
                required
                disabled={loading}
                className="login-input"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Preset Credentials Hint Box */}
          <div className="credentials-hint">
            <KeyRound size={15} color="var(--accent-cyan)" />
            <div>
              <strong>Internal Credentials:</strong>
              <span> Username: <code>admin</code> | Password: <code>smsgroup2026</code></span>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-sm" />
                <span>Authenticating User...</span>
              </>
            ) : (
              <>
                <span>Sign In to System</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer Security Badges */}
        <div className="login-footer">
          <div className="security-tag">
            <ShieldCheck size={16} color="var(--accent-emerald)" />
            <span>Authorized Enterprise Access • SMS Group v2.4</span>
          </div>
        </div>
      </div>
    </div>
  );
};
