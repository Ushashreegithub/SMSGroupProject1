import React, { useState } from 'react';
import { SmsGroupLogo } from './SmsGroupLogo';
import { AuthUser, loginUser } from '../lib/api';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  KeyRound
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (
    user: AuthUser,
    access: string,
    refresh: string
  ) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('smsgroup2026');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const data = await loginUser(username, password);

      onLoginSuccess(
        data.user,
        data.access,
        data.refresh
      );
    } catch (err: any) {
      setError(
        err.message || 'Authentication failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />

      <div className="login-card">
        <div className="login-header">
          <div className="login-brand-badge">
            <span className="badge-dot" />
            <span>ENTERPRISE PLANT PORTAL</span>
          </div>

          <div className="logo-wrapper">
            <SmsGroupLogo height={44} textColor="#ffffff" />
          </div>

          <h1 className="login-title">
            Capacity Planning System
          </h1>

          <p className="login-subtitle">
            Secure authentication for plant managers & production planners
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error-banner">
              <AlertCircle size={18} className="error-icon" />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label>Username / Corporate Email</label>

            <div className="input-icon-wrapper">
              <User size={18} className="input-icon" />

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="login-input"
                placeholder="admin"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>

            <div className="input-icon-wrapper">
              <Lock size={18} className="input-icon" />

              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                disabled={loading}
              />

              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="credentials-hint">
            <KeyRound size={15} />

            <div>
              <strong>Internal Credentials:</strong>

              <span>
                Username: <code>admin</code> | Password:
                <code> smsgroup2026</code>
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="login-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-sm" />
                Authenticating...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <div className="security-tag">
            <ShieldCheck size={16} />
            <span>SMS Group Enterprise</span>
          </div>
        </div>
      </div>
    </div>
  );
};