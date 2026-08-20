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
  FileBarChart2,
  FolderKanban,
  Eye
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
  const isAdmin = Boolean(currentUser?.role === 'administrator' || currentUser?.is_superuser || currentUser?.is_staff);

  const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, adminOnly: false },
    { id: 'upload', label: 'Upload Planning', icon: UploadCloud, adminOnly: true },
    { id: 'capacity-planning', label: 'Capacity Planning', icon: Calculator, adminOnly: true },
    { id: 'project-planning', label: 'Project Planning', icon: FolderKanban, adminOnly: true },
    { id: 'summary', label: 'Summary', icon: FileBarChart2, adminOnly: false },
    { id: 'history', label: 'Version History', icon: History, adminOnly: false },
    { id: 'benchmarks', label: 'Benchmarks', icon: BarChart3, adminOnly: false },
  ];

  const menuItems = allMenuItems.filter(item => !item.adminOnly || isAdmin);

  const getInitials = (name?: string) => {
    if (!name) return 'US';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <aside className="sidebar">
      <div className="brand" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.6rem' }}>
        <SmsGroupLogo height={30} textColor="#ffffff" />
        <div className="brand-text">
          <h1 style={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 600, letterSpacing: '0.05em', marginTop: '0.2rem' }}>
            Capacity Planning
          </h1>
          <span style={{ fontSize: '0.65rem', color: isAdmin ? '#38bdf8' : '#34d399', fontWeight: 700 }}>
            {isAdmin ? 'ENTERPRISE PLANT (ADMIN)' : 'VIEW ONLY PORTAL'}
          </span>
        </div>
      </div>

      <div className="nav-menu">
        <div style={{ fontSize: '0.7rem', color: '#94a3b8', letterSpacing: '0.1em', paddingLeft: '0.75rem', marginBottom: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>CORE OPERATIONS</span>
          {!isAdmin && (
            <span style={{ fontSize: '0.65rem', color: 'var(--accent-amber)', background: 'rgba(255,171,0,0.15)', padding: '2px 6px', borderRadius: '4px' }}>
              VIEW ONLY
            </span>
          )}
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
            <div className="avatar-circle" style={{ background: isAdmin ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'linear-gradient(135deg, #475569, #334155)' }}>
              {getInitials(currentUser.name || currentUser.username)}
            </div>
            <div className="user-info">
              <span className="user-name">{currentUser.name || currentUser.username}</span>
              <span className="user-role" style={{ color: isAdmin ? '#38bdf8' : '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                {!isAdmin && <Eye size={12} />}
                {isAdmin ? 'Administrator' : 'User (View Only)'}
              </span>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.25rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.75rem', color: '#94a3b8' }}>
            <ShieldCheck size={15} color={isAdmin ? '#38bdf8' : '#34d399'} />
            <span>{isAdmin ? 'Admin Auth Granted' : 'Read-Only Permission'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.75rem', color: '#94a3b8' }}>
            <Cpu size={15} color="#38bdf8" />
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

