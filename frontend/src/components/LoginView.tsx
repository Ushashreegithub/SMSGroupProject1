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
  UserRound,
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (
    user: AuthUser,
    access: string,
    refresh: string
  ) => void;
}

type LoginRole = 'administrator' | 'user';

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
}) => {
  const [loginRole, setLoginRole] =
    useState<LoginRole>('administrator');

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [showPassword, setShowPassword] =
    useState<boolean>(false);

  const [loading, setLoading] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string | null>(null);

  const handleRoleChange = (role: LoginRole) => {
    setLoginRole(role);
    setError(null);
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const data = await loginUser(
        username,
        password,
        loginRole
      );

      onLoginSuccess(
        data.user,
        data.access,
        data.refresh
      );
    } catch (err: any) {
      setError(
        err.message ||
          'Authentication failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* =====================================================
          LOGIN PAGE STYLES
          Everything is contained inside LoginView.tsx
          ===================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .login-container {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;

          position: relative;
          overflow: hidden;

          padding: 30px 20px;

          background:
            radial-gradient(
              circle at 10% 20%,
              rgba(95, 45, 130, 0.18),
              transparent 35%
            ),
            radial-gradient(
              circle at 90% 80%,
              rgba(0, 180, 255, 0.12),
              transparent 35%
            ),
            #080f20;
        }

        /* Ambient background lights */

        .bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }

        .orb-1 {
          width: 250px;
          height: 250px;
          top: -100px;
          left: -100px;
          background: rgba(170, 40, 120, 0.16);
        }

        .orb-2 {
          width: 280px;
          height: 280px;
          right: -120px;
          bottom: -120px;
          background: rgba(0, 180, 255, 0.12);
        }

        /* Main card */

        .login-card {
          position: relative;
          z-index: 2;

          width: 100%;
          max-width: 575px;

          padding: 46px 50px 34px;

          border-radius: 18px;

          background:
            linear-gradient(
              145deg,
              rgba(17, 27, 49, 0.98),
              rgba(10, 19, 36, 0.98)
            );

          border: 1px solid rgba(150, 170, 200, 0.18);

          box-shadow:
            0 25px 70px rgba(0, 0, 0, 0.45),
            inset 0 1px 0 rgba(255, 255, 255, 0.03);

          overflow: hidden;
        }

        /* Top gradient line */

        .login-card::before {
          content: '';
          position: absolute;

          top: 0;
          left: 0;
          right: 0;

          height: 4px;

          background: linear-gradient(
            90deg,
            #ff294f,
            #8741a8,
            #00cfff
          );
        }

        /* Header */

        .login-header {
          text-align: center;
          margin-bottom: 28px;
        }

        .login-brand-badge {
          display: inline-flex;
          align-items: center;
          gap: 9px;

          padding: 8px 16px;

          border-radius: 22px;

          border: 1px solid rgba(0, 205, 255, 0.35);

          background: rgba(0, 140, 190, 0.08);

          color: #00d5ff;

          font-size: 12px;
          font-weight: 700;

          letter-spacing: 0.6px;
        }

        .badge-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #00d9ff;

          box-shadow:
            0 0 10px rgba(0, 217, 255, 0.8);
        }

        .logo-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;

          margin-top: 28px;
          margin-bottom: 22px;
        }

        .login-title {
          margin: 0;

          color: #ffffff;

          font-size: 28px;
          font-weight: 750;

          letter-spacing: -0.5px;
        }

        .login-subtitle {
          margin: 10px 0 0;

          color: #8fa5c0;

          font-size: 15px;

          line-height: 1.5;
        }

        /* Form */

        .login-form {
          width: 100%;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;

          margin-bottom: 9px;

          color: #9db1c9;

          font-size: 14px;
          font-weight: 650;
        }

        /* =====================================================
           ROLE SELECTOR
           ===================================================== */

        .role-selector-wrapper {
          display: flex;

          width: 100%;

          padding: 3px;

          margin-bottom: 28px;

          border-radius: 28px;

          background: rgba(4, 12, 26, 0.9);

          border: 1px solid rgba(0, 190, 255, 0.22);
        }

        .role-option {
          flex: 1;

          height: 44px;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 8px;

          border: none;
          border-radius: 23px;

          background: transparent;

          color: #7389a4;

          font-size: 12px;
          font-weight: 750;

          letter-spacing: 0.5px;

          cursor: pointer;

          transition:
            background 0.2s ease,
            color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .role-option:hover {
          color: #ffffff;

          background: rgba(
            0,
            150,
            220,
            0.08
          );
        }

        .role-option.active {
          color: #ffffff;

          background: linear-gradient(
            135deg,
            #0878d1,
            #075ba2
          );

          box-shadow:
            0 5px 18px rgba(
              0,
              115,
              210,
              0.32
            );
        }

        .role-option:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        /* Inputs */

        .input-icon-wrapper {
          position: relative;

          width: 100%;
        }

        .input-icon {
          position: absolute;

          left: 17px;
          top: 50%;

          transform: translateY(-50%);

          color: #687e9a;

          pointer-events: none;

          z-index: 2;
        }

        .login-input {
          width: 100%;

          height: 56px;

          padding: 0 48px;

          border-radius: 11px;

          border: 1px solid rgba(
            135,
            155,
            180,
            0.22
          );

          outline: none;

          background: rgba(
            4,
            12,
            26,
            0.78
          );

          color: #ffffff;

          font-size: 15px;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .login-input::placeholder {
          color: #566b85;
        }

        .login-input:focus {
          border-color: rgba(
            0,
            193,
            255,
            0.65
          );

          background: rgba(
            6,
            17,
            34,
            0.95
          );

          box-shadow:
            0 0 0 3px rgba(
              0,
              180,
              255,
              0.08
            );
        }

        .login-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Password button */

        .toggle-password-btn {
          position: absolute;

          right: 10px;
          top: 50%;

          transform: translateY(-50%);

          width: 34px;
          height: 34px;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 0;

          border: none;

          background: transparent;

          color: #6f849d;

          cursor: pointer;

          border-radius: 7px;
        }

        .toggle-password-btn:hover {
          color: #00caff;

          background: rgba(
            0,
            180,
            255,
            0.08
          );
        }

        .toggle-password-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Error */

        .login-error-banner {
          display: flex;

          align-items: center;

          gap: 9px;

          padding: 11px 13px;

          margin-bottom: 18px;

          border-radius: 9px;

          border: 1px solid rgba(
            255,
            75,
            95,
            0.3
          );

          background: rgba(
            255,
            55,
            75,
            0.08
          );

          color: #ff8f9d;

          font-size: 13px;
        }

        .error-icon {
          flex-shrink: 0;
        }

        /* Submit button */

        .login-submit-btn {
          width: 100%;

          height: 58px;

          margin-top: 5px;

          display: flex;

          align-items: center;
          justify-content: center;

          gap: 11px;

          border: none;

          border-radius: 10px;

          background: linear-gradient(
            135deg,
            #096fc4,
            #075ca5
          );

          color: #ffffff;

          font-size: 16px;
          font-weight: 700;

          cursor: pointer;

          box-shadow:
            0 10px 25px rgba(
              0,
              100,
              190,
              0.22
            );

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            opacity 0.2s ease;
        }

        .login-submit-btn:hover {
          transform: translateY(-1px);

          box-shadow:
            0 13px 30px rgba(
              0,
              120,
              220,
              0.32
            );
        }

        .login-submit-btn:active {
          transform: translateY(0);
        }

        .login-submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
        }

        /* Spinner */

        .spinner-sm {
          width: 17px;
          height: 17px;

          border-radius: 50%;

          border: 2px solid rgba(
            255,
            255,
            255,
            0.3
          );

          border-top-color: #ffffff;

          animation: login-spin 0.7s linear infinite;
        }

        @keyframes login-spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Footer */

        .login-footer {
          margin-top: 32px;

          padding-top: 20px;

          border-top: 1px solid rgba(
            150,
            170,
            200,
            0.12
          );
        }

        .security-tag {
          display: flex;

          align-items: center;
          justify-content: center;

          gap: 9px;

          color: #687f9c;

          font-size: 13px;
        }

        .security-tag svg {
          color: #687f9c;
        }

        /* Responsive */

        @media (max-width: 600px) {

          .login-container {
            padding: 20px 12px;
          }

          .login-card {
            padding: 36px 24px 28px;
          }

          .login-title {
            font-size: 24px;
          }

          .login-subtitle {
            font-size: 13px;
          }

          .role-option {
            font-size: 11px;
          }

        }

      `}</style>

      {/* =====================================================
          LOGIN UI
          ===================================================== */}

      <div className="login-container">

        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-2" />

        <div className="login-card">

          {/* Header */}

          <div className="login-header">

            <div className="login-brand-badge">

              <span className="badge-dot" />

              <span>
                ENTERPRISE PLANT PORTAL
              </span>

            </div>

            <div className="logo-wrapper">

              <SmsGroupLogo
                height={44}
                textColor="#ffffff"
              />

            </div>

            <h1 className="login-title">
              Capacity Planning System
            </h1>

            <p className="login-subtitle">
              Secure authentication for plant managers
              &amp; production planners
            </p>

          </div>

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="login-form"
          >

            {/* Error */}

            {error && (
              <div className="login-error-banner">

                <AlertCircle
                  size={18}
                  className="error-icon"
                />

                <span>{error}</span>

              </div>
            )}

            {/* =================================================
                ROLE SELECTION
                ================================================= */}

            <div className="role-selector-wrapper">

              {/* Administrator */}

              <button
                type="button"
                className={`role-option ${
                  loginRole === 'administrator'
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  handleRoleChange('administrator')
                }
                disabled={loading}
                aria-pressed={
                  loginRole === 'administrator'
                }
              >

                <ShieldCheck size={17} />

                <span>
                  ADMINISTRATOR
                </span>

              </button>

              {/* User */}

              <button
                type="button"
                className={`role-option ${
                  loginRole === 'user'
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  handleRoleChange('user')
                }
                disabled={loading}
                aria-pressed={
                  loginRole === 'user'
                }
              >

                <UserRound size={17} />

                <span>
                  USER
                </span>

              </button>

            </div>

            {/* =================================================
                USERNAME
                ================================================= */}

            <div className="form-group">

              <label htmlFor="username">
                Username / Corporate Email
              </label>

              <div className="input-icon-wrapper">

                <User
                  size={18}
                  className="input-icon"
                />

                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  className="login-input"
                  placeholder={
                    loginRole === 'administrator'
                      ? 'Administrator username'
                      : 'User username'
                  }
                  disabled={loading}
                  autoComplete="username"
                  required
                />

              </div>

            </div>

            {/* =================================================
                PASSWORD
                ================================================= */}

            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="input-icon-wrapper">

                <Lock
                  size={18}
                  className="input-icon"
                />

                <input
                  id="password"
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="login-input"
                  placeholder="Enter your password"
                  disabled={loading}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  disabled={loading}
                  tabIndex={-1}
                  title={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >

                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}

                </button>

              </div>

            </div>

            {/* =================================================
                SUBMIT
                ================================================= */}

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="spinner-sm" />

                  <span>
                    Authenticating...
                  </span>
                </>
              ) : (
                <>
                  <span>
                    Sign In as{' '}
                    {loginRole === 'administrator'
                      ? 'Administrator'
                      : 'User'}
                  </span>

                  <ArrowRight size={18} />
                </>
              )}

            </button>

          </form>

          {/* Footer */}

          <div className="login-footer">

            <div className="security-tag">

              <ShieldCheck size={16} />

              <span>
                SMS Group Enterprise
              </span>

            </div>

          </div>

        </div>

      </div>
    </>
  );
};