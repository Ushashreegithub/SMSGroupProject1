import React from 'react';
import { SmsGroupLogo } from './SmsGroupLogo';
import { AuthUser } from '../lib/api';
import { 
  LayoutDashboard, 
  UploadCloud, 
  Calculator,
  History, 
  BarChart3, 
  ShieldCheck,
  Cpu,
  LogOut,
  UserCheck
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onSelectView,
  currentUser,
  onLogout 
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload Planning', icon: UploadCloud },
    { id: 'capacity-planning', label: 'Capacity Planning', icon: Calculator },

    { id: 'history', label: 'Version History', icon: History },
    { id: 'benchmarks', label: 'Benchmarks', icon: BarChart3 },
  ];

  const getInitials = (name?: string) => {
    if (!name) return 'JS';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <aside className="sidebar">
      <div className="brand" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.6rem' }}>
        <SmsGroupLogo height={28} textColor="#ffffff" />
        <div className="brand-text">
          <h1 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', marginTop: '0.2rem' }}>
            Capacity Planning
          </h1>
          <span style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)' }}>ENTERPRISE PLANT</span>
        </div>
      </div>

      <div className="nav-menu">
        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '0.1em', paddingLeft: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>
          CORE OPERATIONS
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              className={`nav-link ${isActive ? 'active' : ''}`}
              onClick={() => onSelectView(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* User Profile Card & System Status */}
      <div className="sidebar-footer">
        {currentUser && (
          <div className="user-profile-badge">
            <div className="avatar-circle">
              {getInitials(currentUser.name)}
            </div>
            <div className="user-info">
              <span className="user-name">{currentUser.name}</span>
              <span className="user-role">{currentUser.role}</span>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.25rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            <ShieldCheck size={15} color="var(--accent-emerald)" />
            <span>Enterprise API Sync</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            <Cpu size={15} color="var(--accent-cyan)" />
            <span>Capacity Engine v2.4</span>
          </div>
        </div>

        {onLogout && (
          <button className="logout-button" onClick={onLogout} title="Sign out of system">
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        )}
      </div>
    </aside>
  );
};

