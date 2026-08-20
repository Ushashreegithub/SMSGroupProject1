'use client';

import React from 'react';

export interface MonthStep {
  label: string;
  dateStr: string;
}

interface TaskScheduleSliderProps {
  taskTitle: string;
  taskColor: string;
  projectMonthSteps: MonthStep[];
  startIdx: number;
  endIdx: number;
  durationMonths: number;
  onChange: (newStartIdx: number, newEndIdx: number) => void;
}

export const TaskScheduleSlider: React.FC<TaskScheduleSliderProps> = ({
  taskTitle,
  taskColor,
  projectMonthSteps,
  startIdx,
  endIdx,
  durationMonths,
  onChange,
}) => {
  const maxIdx = Math.max(0, projectMonthSteps.length - 1);
  const safeStartIdx = Math.max(0, Math.min(startIdx, maxIdx));
  const safeEndIdx = Math.max(safeStartIdx, Math.min(endIdx, maxIdx));

  const startPercent = maxIdx > 0 ? (safeStartIdx / maxIdx) * 100 : 0;
  const endPercent = maxIdx > 0 ? (safeEndIdx / maxIdx) * 100 : 100;
  const highlightWidth = Math.max(0, endPercent - startPercent);

  const startLabel = projectMonthSteps[safeStartIdx]?.label || 'Start';
  const endLabel = projectMonthSteps[safeEndIdx]?.label || 'End';

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    let newStart = Math.min(val, maxIdx);
    let newEnd = safeEndIdx;
    if (newStart > newEnd) {
      newEnd = newStart;
    }
    onChange(newStart, newEnd);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    let newEnd = Math.max(0, Math.min(val, maxIdx));
    let newStart = safeStartIdx;
    if (newEnd < newStart) {
      newStart = newEnd;
    }
    onChange(newStart, newEnd);
  };

  return (
    <div
      style={{
        background: '#ffffff',
        padding: '1rem 1.25rem',
        borderRadius: '12px',
        border: '1px solid #cbd5e1',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Header Info Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: taskColor,
              boxShadow: `0 0 8px ${taskColor}`,
            }}
          />
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: taskColor }}>
            {taskTitle}: Schedule Range Controller
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.75rem',
            fontWeight: 800,
            color: '#059669',
            background: '#f0fdf4',
            padding: '0.25rem 0.75rem',
            borderRadius: '16px',
            border: '1px solid #bbf7d0',
          }}
        >
          <span>Kickoff: <strong style={{ color: '#0f172a' }}>{startLabel}</strong></span>
          <span style={{ color: '#94a3b8' }}>➔</span>
          <span>Completion: <strong style={{ color: '#0f172a' }}>{endLabel}</strong></span>
          <span
            style={{
              marginLeft: '0.25rem',
              paddingLeft: '0.4rem',
              borderLeft: '1px solid #bbf7d0',
              color: '#059669',
            }}
          >
            ({durationMonths} {durationMonths === 1 ? 'Month' : 'Months'})
          </span>
        </div>
      </div>

      {/* Dual Pointer Slider Component */}
      <div style={{ position: 'relative', width: '100%', padding: '0.25rem 0' }}>
        <div className="dual-range-container">
          {/* Background Track */}
          <div className="dual-range-track-bg" />

          {/* Active Highlight Track */}
          <div
            className="dual-range-highlight"
            style={{
              left: `${startPercent}%`,
              width: `${highlightWidth}%`,
              backgroundColor: taskColor,
              boxShadow: `0 0 10px ${taskColor}88`,
            }}
          />

          {/* Start Pointer Input */}
          <input
            type="range"
            min={0}
            max={maxIdx}
            value={safeStartIdx}
            onChange={handleStartChange}
            className="dual-range-input"
            style={{
              zIndex: safeStartIdx === maxIdx ? 5 : 3,
            }}
            title={`Start Month: ${startLabel}`}
          />

          {/* End Pointer Input */}
          <input
            type="range"
            min={0}
            max={maxIdx}
            value={safeEndIdx}
            onChange={handleEndChange}
            className="dual-range-input"
            style={{
              zIndex: safeEndIdx === safeStartIdx ? 4 : 4,
            }}
            title={`End Month: ${endLabel}`}
          />
        </div>

        {/* Timeline Month Ticks Below Slider */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.25rem',
            overflowX: 'auto',
            paddingTop: '0.4rem',
            paddingBottom: '0.2rem',
            width: '100%',
          }}
        >
          {projectMonthSteps.map((step, sIdx) => {
            const isStart = sIdx === safeStartIdx;
            const isEnd = sIdx === safeEndIdx;
            const inRange = sIdx >= safeStartIdx && sIdx <= safeEndIdx;

            return (
              <button
                key={`step_${step.dateStr}_${sIdx}`}
                type="button"
                onClick={() => {
                  if (sIdx < safeStartIdx) {
                    onChange(sIdx, safeEndIdx);
                  } else if (sIdx > safeEndIdx) {
                    onChange(safeStartIdx, sIdx);
                  } else {
                    const distToStart = Math.abs(sIdx - safeStartIdx);
                    const distToEnd = Math.abs(sIdx - safeEndIdx);
                    if (distToStart <= distToEnd) {
                      onChange(sIdx, safeEndIdx);
                    } else {
                      onChange(safeStartIdx, sIdx);
                    }
                  }
                }}
                style={{
                  flex: 1,
                  minWidth: '42px',
                  padding: '0.25rem 0.35rem',
                  borderRadius: '6px',
                  fontSize: '0.65rem',
                  fontWeight: isStart || isEnd ? 800 : inRange ? 700 : 500,
                  background: isStart || isEnd
                    ? taskColor
                    : inRange
                    ? '#e0f2fe'
                    : '#f8fafc',
                  border: isStart || isEnd
                    ? `1px solid ${taskColor}`
                    : inRange
                    ? '1px solid #7dd3fc'
                    : '1px solid #cbd5e1',
                  color: isStart || isEnd ? '#ffffff' : inRange ? '#0284c7' : '#475569',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  textAlign: 'center',
                  transition: 'all 0.15s ease',
                  boxShadow: isStart || isEnd ? `0 2px 8px ${taskColor}66` : 'none',
                }}
                title={`Click to set range point (${step.label})`}
              >
                {step.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TaskScheduleSlider;
