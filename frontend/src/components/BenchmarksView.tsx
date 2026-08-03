import React from 'react';
import { BenchmarkItem } from '../lib/api';
import { BarChart3, Target, ShieldAlert } from 'lucide-react';

interface BenchmarksViewProps {
  benchmarks: BenchmarkItem[];
}

export const BenchmarksView: React.FC<BenchmarksViewProps> = ({ benchmarks }) => {
  const defaultBenchmarks: BenchmarkItem[] = benchmarks.length > 0 ? benchmarks : [
    { id: 1, department: 'production', name: 'Overall Production Plant', target_utilization: 88.0, max_threshold: 95.0, historical_baseline: 82.0, description: 'Plant-wide target capacity baseline.' },
    { id: 2, department: 'welding', name: 'Heavy Welding Division', target_utilization: 85.0, max_threshold: 92.0, historical_baseline: 79.0, description: 'Heavy welding shop capacity threshold.' },
    { id: 3, department: 'machining', name: 'Precision Machining Workshop', target_utilization: 90.0, max_threshold: 98.0, historical_baseline: 85.5, description: 'CNC milling & lathe precision capacity.' },
    { id: 4, department: 'rr', name: 'Roll Repair & Refurbishment', target_utilization: 82.0, max_threshold: 90.0, historical_baseline: 77.0, description: 'Roll shop refurb contract load target.' },
    { id: 5, department: 'plating', name: 'Surface Plating Unit', target_utilization: 80.0, max_threshold: 88.0, historical_baseline: 75.0, description: 'Chemical & electroplating throughput target.' }
  ];

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <BarChart3 color="var(--accent-cyan)" size={24} />
        Department Capacity Benchmarks & Targets
      </h3>
      <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Configured target thresholds stored in Central Database and synced across planning validation pipelines.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {defaultBenchmarks.map((item) => (
          <div 
            key={item.id} 
            style={{ 
              background: 'rgba(255, 255, 255, 0.03)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '10px', 
              padding: '1.5rem' 
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>{item.name}</h4>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                  {item.department}
                </span>
              </div>
              <Target size={20} color="var(--accent-blue)" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  <span>Target Utilization</span>
                  <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>{item.target_utilization}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${item.target_utilization}%` }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  <span>Max Risk Threshold</span>
                  <span style={{ color: 'var(--accent-amber)', fontWeight: 700 }}>{item.max_threshold}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${item.max_threshold}%`,
                      background: 'linear-gradient(90deg, var(--accent-amber), var(--accent-rose))'
                    }} 
                  />
                </div>
              </div>
            </div>

            <div style={{ paddingTop: '0.85rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              <span>Historical Baseline: <strong style={{ color: 'var(--text-muted)' }}>{item.historical_baseline}%</strong></span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <ShieldAlert size={12} color="var(--accent-cyan)" />
                Active Rule
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
