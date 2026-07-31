import React from 'react';
import { PlanningVersion } from '../lib/api';
import { History, FileText, CheckCircle, Clock } from 'lucide-react';

interface HistoryViewProps {
  versions: PlanningVersion[];
  onSelectVersion: (version: PlanningVersion) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ versions, onSelectVersion }) => {
  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <History color="var(--accent-cyan)" size={24} />
            Permanent Planning Version History
          </h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Stored in Django DB (SQLite/PostgreSQL) with full multi-department historical metrics.
          </p>
        </div>

        <div style={{ background: 'rgba(0, 210, 255, 0.1)', color: 'var(--accent-cyan)', padding: '0.4rem 0.85rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid rgba(0, 210, 255, 0.3)' }}>
          {versions.length} Version(s) Stored
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {versions.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No historical versions retrieved.
          </div>
        ) : (
          versions.map((ver) => (
            <div
              key={ver.version_id}
              onClick={() => onSelectVersion(ver)}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'rgba(0, 210, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText color="var(--accent-cyan)" size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>
                    {ver.version_id} — {ver.month_name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'flex', gap: '1rem' }}>
                    <span>Uploaded by: {ver.uploaded_by}</span>
                    <span>•</span>
                    <span>File: {ver.file_name} ({ver.file_size})</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-emerald)', fontSize: '0.8rem', fontWeight: 600 }}>
                    <CheckCircle size={14} />
                    <span>{ver.status}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={12} />
                    <span>{ver.processing_time_ms} ms validation</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
