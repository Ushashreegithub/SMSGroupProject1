import React from 'react';
import { 
  LayoutDashboard, 
  UploadCloud, 
  History, 
  BarChart3, 
  ShieldCheck,
  Cpu
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onSelectView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload Planning', icon: UploadCloud },
    { id: 'history', label: 'Version History', icon: History },
    { id: 'benchmarks', label: 'Benchmarks', icon: BarChart3 },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-badge">SMS</div>
        <div className="brand-text">
          <h1>Capacity Planning</h1>
          <span>SMS GROUP ENTERPRISE</span>
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

      <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          <ShieldCheck size={16} color="var(--accent-emerald)" />
          <span>Django REST API Connected</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
          <Cpu size={16} color="var(--accent-cyan)" />
          <span>Next.js App Router v14+</span>
        </div>
      </div>
    </aside>
  );
};
