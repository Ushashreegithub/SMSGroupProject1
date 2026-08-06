import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Layers, 
  Save, 
  CheckCircle, 
  Plus, 
  Trash2, 
  Sliders, 
  Calculator,
  Calendar,
  Sparkles,
  ArrowRight,
  PieChart
} from 'lucide-react';
import { 
  calculateManualPlanning, 
  fetchManualConfig, 
  saveManualConfig, 
  ManualCalculationResponse 
} from '../lib/api';

export interface DepartmentTaskInput {
  id: string;
  name: string;
  category: string;
  hours: number;
}

export const INITIAL_TASKS: DepartmentTaskInput[] = [
  { id: 'welding', name: 'Welding', category: 'Heavy Fabrication', hours: 25000 },
  { id: 'machining', name: 'Machining', category: 'Precision Turning & Milling', hours: 32000 },
  { id: 'assembly', name: 'Assembly', category: 'Plant Equipment Assembly', hours: 22000 },
  { id: 'rr', name: 'Roll Repair (R&R)', category: 'Refurbishment & Reconditioning', hours: 18000 },
  { id: 'plating', name: 'Plating', category: 'Surface Treatment & Chrome', hours: 15000 },
];

export interface ManualInputPanelProps {
  onInputsChange?: (annualHours: number, tasks: DepartmentTaskInput[]) => void;
}

export const ManualInputPanel: React.FC<ManualInputPanelProps> = ({ onInputsChange }) => {
  const initialTotalTaskHours = INITIAL_TASKS.reduce((sum, t) => sum + t.hours, 0);
  const [annualHours, setAnnualHours] = useState<number>(initialTotalTaskHours);
  const [year, setYear] = useState<number>(2026);
  const [tasks, setTasks] = useState<DepartmentTaskInput[]>(INITIAL_TASKS);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [calculationResult, setCalculationResult] = useState<ManualCalculationResponse | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // 1. Initial Load: Load saved inputs from localStorage & Database API
  useEffect(() => {
    let isMounted = true;
    
    // Check localStorage first for instant rendering
    const localSaved = localStorage.getItem('sms_capacity_planning_config');
    if (localSaved) {
      try {
        const parsed = JSON.parse(localSaved);
        if (parsed.tasks && parsed.tasks.length > 0) {
          setTasks(parsed.tasks);
          const total = parsed.tasks.reduce((sum: number, t: any) => sum + (Number(t.hours) || 0), 0);
          setAnnualHours(total);
        }
        if (parsed.year) setYear(parsed.year);
      } catch (e) {
        console.warn('Error reading local storage capacity config:', e);
      }
    }

    // Fetch latest configuration from Django Database
    async function loadDbConfig() {
      const dbConfig = await fetchManualConfig();
      if (isMounted && dbConfig && dbConfig.tasks && dbConfig.tasks.length > 0) {
        setTasks(dbConfig.tasks);
        setYear(dbConfig.year || 2026);
        const total = dbConfig.tasks.reduce((sum: number, t: any) => sum + (Number(t.hours) || 0), 0);
        setAnnualHours(total);
      }
    }

    loadDbConfig();
    return () => { isMounted = false; };
  }, []);

  // Helper to persist to both localStorage and database API
  const persistConfig = (updatedYear: number, updatedTasks: DepartmentTaskInput[]) => {
    localStorage.setItem('sms_capacity_planning_config', JSON.stringify({
      year: updatedYear,
      tasks: updatedTasks
    }));
    saveManualConfig(updatedYear, updatedTasks);
  };

  // Sync annualHours whenever task inputs change
  useEffect(() => {
    const totalTaskHours = tasks.reduce((sum, t) => sum + (Number(t.hours) || 0), 0);
    if (totalTaskHours !== annualHours) {
      setAnnualHours(totalTaskHours);
    }
  }, [tasks]);

  // Trigger backend calculation when inputs change
  useEffect(() => {
    let isMounted = true;
    async function runCalc() {
      setIsCalculating(true);
      try {
        const totalTaskHours = tasks.reduce((sum, t) => sum + (Number(t.hours) || 0), 0);
        const effectiveAnnualHours = tasks.length > 0 && totalTaskHours > 0 ? totalTaskHours : annualHours;
        
        const res = await calculateManualPlanning(effectiveAnnualHours, year, tasks);
        if (isMounted) {
          if (res) {
            setCalculationResult(res);
          } else {
            // Local fallback logic
            const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
            const totalDaysInYear = isLeap ? 366 : 365;
            const dailyAvailableHours = effectiveAnnualHours / totalDaysInYear;
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const daysPerMonth = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            const monthlyCalculations = monthNames.map((mName, idx) => {
              const dInMonth = daysPerMonth[idx];
              let monthlyAvl = 0;

              const taskBreakdown = tasks.map(t => {
                const taskHoursInput = Number(t.hours) || 0;
                const taskDailyHours = taskHoursInput / totalDaysInYear;
                const taskMonthlyHours = taskDailyHours * dInMonth;
                monthlyAvl += taskMonthlyHours;

                const ratio = totalTaskHours > 0 ? (taskHoursInput / totalTaskHours) : (1 / (tasks.length || 1));
                return {
                  id: t.id,
                  name: t.name,
                  category: t.category,
                  monthly_hours: Math.round(taskMonthlyHours * 100) / 100,
                  daily_hours: Math.round(taskDailyHours * 100) / 100,
                  days_in_month: dInMonth,
                  share_pct: Math.round(ratio * 10000) / 100
                };
              });

              return {
                month: `${mName} ${year}`,
                month_num: idx + 1,
                days_in_month: dInMonth,
                monthly_available_hours: Math.round(monthlyAvl * 100) / 100,
                daily_available_hours: Math.round(dailyAvailableHours * 10000) / 10000,
                tasks: taskBreakdown
              };
            });

            setCalculationResult({
              status: 'local_fallback',
              inputs: {
                annual_hours: effectiveAnnualHours,
                year: year,
                is_leap_year: isLeap,
                total_days_in_year: totalDaysInYear,
                daily_available_hours: Math.round(dailyAvailableHours * 10000) / 10000,
                total_tasks_count: tasks.length
              },
              monthly_calculations: monthlyCalculations
            });
          }
        }
      } catch (err) {
        console.warn('Manual calculation error:', err);
      } finally {
        if (isMounted) setIsCalculating(false);
      }
    }

    runCalc();
    return () => { isMounted = false; };
  }, [annualHours, year, tasks]);

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
    persistConfig(newYear, tasks);
    if (onInputsChange) onInputsChange(annualHours, tasks);
  };

  const handleTaskHoursChange = (id: string, val: number) => {
    const updated = tasks.map(t => t.id === id ? { ...t, hours: Math.max(0, val) } : t);
    const newTotal = updated.reduce((sum, t) => sum + (Number(t.hours) || 0), 0);
    setTasks(updated);
    setAnnualHours(newTotal);
    persistConfig(year, updated);
    if (onInputsChange) onInputsChange(newTotal, updated);
  };

  const handleTaskNameChange = (id: string, newName: string) => {
    const updated = tasks.map(t => t.id === id ? { ...t, name: newName } : t);
    setTasks(updated);
    persistConfig(year, updated);
    if (onInputsChange) onInputsChange(annualHours, updated);
  };

  const handleAddTask = () => {
    const newId = `task_${Date.now()}`;
    const newTask: DepartmentTaskInput = {
      id: newId,
      name: `Custom Task ${tasks.length + 1}`,
      category: 'Specialized Process',
      hours: 5000
    };
    const updated = [...tasks, newTask];
    const newTotal = updated.reduce((sum, t) => sum + (Number(t.hours) || 0), 0);
    setTasks(updated);
    setAnnualHours(newTotal);
    persistConfig(year, updated);
    if (onInputsChange) onInputsChange(newTotal, updated);
  };

  const handleRemoveTask = (id: string) => {
    if (tasks.length <= 1) return;
    const updated = tasks.filter(t => t.id !== id);
    const newTotal = updated.reduce((sum, t) => sum + (Number(t.hours) || 0), 0);
    setTasks(updated);
    setAnnualHours(newTotal);
    persistConfig(year, updated);
    if (onInputsChange) onInputsChange(newTotal, updated);
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    await saveManualConfig(year, tasks);
    localStorage.setItem('sms_capacity_planning_config', JSON.stringify({ year, tasks }));
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const totalAllocatedTaskHours = tasks.reduce((sum, task) => sum + (Number(task.hours) || 0), 0);
  const inputsSummary = calculationResult?.inputs;
  const dailyAvailableHours = inputsSummary?.daily_available_hours ?? (annualHours / 365);
  const daysInYear = inputsSummary?.total_days_in_year ?? 365;

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid rgba(0, 210, 255, 0.25)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Sliders size={22} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
              Manual Data Input & Planning Calculations
            </h3>
            <span style={{ 
              background: 'rgba(0, 210, 255, 0.15)', 
              color: 'var(--accent-cyan)', 
              border: '1px solid rgba(0, 210, 255, 0.3)',
              fontSize: '0.7rem', 
              fontWeight: 700, 
              padding: '0.2rem 0.6rem', 
              borderRadius: '12px' 
            }}>
              SMS Group Requirements
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            Calculates 1-day available capacity (Annual / Days in Year) & splits monthly hours by task (Days in Month × Daily Task Hours).
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={handleSave}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: saveStatus === 'saved' ? 'var(--accent-emerald)' : 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
              color: '#ffffff',
              border: 'none',
              padding: '0.5rem 1.1rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 0 15px rgba(0, 210, 255, 0.3)'
            }}
          >
            {saveStatus === 'saved' ? <CheckCircle size={16} /> : <Save size={16} />}
            {saveStatus === 'saved' ? 'Saved to Database!' : saveStatus === 'saving' ? 'Saving...' : 'Save Manual Inputs'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        
        {/* Component 1: Annual Hours Summary (Derived from 5 Tasks) */}
        <div className="glass-panel" style={{ padding: '1.25rem', background: 'rgba(10, 16, 30, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.4rem', background: 'rgba(0, 210, 255, 0.1)', borderRadius: '8px' }}>
                <Clock size={20} color="var(--accent-cyan)" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>1. Annual Hours Output</h4>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Total Plant Capacity (Sum of Tasks)</span>
              </div>
            </div>

            {/* Read-Only Calculated Annual Hours Display */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                TOTAL AVAILABLE ANNUAL HOURS (HRS / YEAR)
              </label>
              <div style={{
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(0, 210, 255, 0.35)',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 0 15px rgba(0, 210, 255, 0.1)'
              }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                  {annualHours.toLocaleString()}
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  HRS / YEAR
                </span>
              </div>
              <span style={{ fontSize: '0.675rem', color: 'var(--text-dim)', marginTop: '0.35rem', display: 'block' }}>
                Automatically calculated as the sum of the 5 task inputs below
              </span>
            </div>

            {/* Planning Year Selection */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                TARGET PLANNING YEAR
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[2026, 2027, 2028].map(y => (
                  <button
                    key={y}
                    onClick={() => handleYearChange(y)}
                    style={{
                      flex: 1,
                      background: year === y ? 'rgba(0, 210, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      border: `1px solid ${year === y ? 'var(--accent-cyan)' : 'var(--border-color)'}`,
                      color: year === y ? 'var(--accent-cyan)' : 'var(--text-muted)',
                      padding: '0.4rem 0.25rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {y} {(y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? '(366d)' : '(365d)'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Daily Capacity Formula Card */}
          <div style={{ background: 'rgba(0, 210, 255, 0.06)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(0, 210, 255, 0.2)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              CALCULATED 1-DAY AVAILABLE CAPACITY
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
              {dailyAvailableHours.toFixed(2)} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>hrs / day</span>
            </div>
            <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
              Formula: {annualHours.toLocaleString()} annual hrs ÷ {daysInYear} days ({year})
            </div>
          </div>
        </div>

        {/* Component 2: Tasks Breakdown Component (5 Core SMS Group Tasks) */}
        <div className="glass-panel" style={{ padding: '1.25rem', background: 'rgba(10, 16, 30, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ padding: '0.4rem', background: 'rgba(58, 123, 213, 0.15)', borderRadius: '8px' }}>
                <Layers size={20} color="var(--accent-blue)" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                  2. Tasks Input Component (5 Standard SMS Group Tasks)
                </h4>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                  Target Annual Workload Hours for Welding, Machining, Assembly, Roll Repair & Plating
                </span>
              </div>
            </div>
          </div>

          {/* Task Inputs List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '280px', overflowY: 'auto', paddingRight: '0.25rem' }}>
            {tasks.map((task, index) => {
              const taskSharePct = annualHours > 0 ? ((task.hours / annualHours) * 100).toFixed(1) : '0';
              const taskDailyHours = (dailyAvailableHours * (task.hours / (totalAllocatedTaskHours || 1))).toFixed(1);

              return (
                <div 
                  key={task.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.5fr 1fr 130px',
                    alignItems: 'center',
                    gap: '0.75rem',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* Task Name & Category */}
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff' }}>
                      {task.name}
                    </div>
                    <span style={{ fontSize: '0.675rem', color: 'var(--text-dim)', display: 'block' }}>
                      Task #{index + 1} — {task.category}
                    </span>
                  </div>

                  {/* Share indicator badge */}
                  <div style={{ textAlign: 'right', paddingRight: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      {taskSharePct}% Share
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', display: 'block' }}>
                      ~{taskDailyHours} hrs/day
                    </span>
                  </div>

                  {/* Numeric Input for Target Task Hours */}
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="number"
                      value={task.hours}
                      onChange={(e) => handleTaskHoursChange(task.id, Number(e.target.value))}
                      step={500}
                      min={0}
                      title="Target Annual Task Workload Hours"
                      style={{
                        width: '100%',
                        background: 'rgba(10, 14, 23, 0.8)',
                        border: '1px solid rgba(0, 210, 255, 0.25)',
                        borderRadius: '6px',
                        padding: '0.4rem 2.2rem 0.4rem 0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: 'var(--accent-cyan)',
                        textAlign: 'right',
                        outline: 'none'
                      }}
                    />
                    <span style={{ position: 'absolute', right: '0.4rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-dim)' }}>
                      HRS
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Summary of Task Allocation */}
          <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
              Total Target Task Workload:
            </span>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
              {totalAllocatedTaskHours.toLocaleString()} hrs
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic 12-Month Calculated Workload Matrix */}
      {calculationResult && (
        <div style={{ background: 'rgba(10, 16, 30, 0.7)', borderRadius: '10px', padding: '1.25rem', border: '1px solid rgba(0, 210, 255, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Calculator size={20} color="var(--accent-emerald)" />
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                3. Calculated Monthly Task Hours Breakdown ({year})
              </h4>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ background: 'rgba(0, 210, 255, 0.08)', padding: '0.35rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(0, 210, 255, 0.2)', color: 'var(--accent-cyan)' }}>
                <strong>Task-Based Formula:</strong> Task Daily Hours (Annual Task Hrs ÷ {daysInYear}d) × Days in Month
              </span>
              {isCalculating && <span className="spinner-sm" />}
            </div>
          </div>

          {/* Calculations Matrix Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 0.85rem', fontWeight: 700, verticalAlign: 'bottom' }}>
                    MONTH
                  </th>
                  <th style={{ padding: '0.75rem 0.85rem', fontWeight: 700, textAlign: 'center', verticalAlign: 'bottom' }}>
                    DAYS
                  </th>
                  <th style={{ padding: '0.75rem 0.85rem', fontWeight: 700, textAlign: 'right', verticalAlign: 'bottom' }}>
                    <div>MONTHLY AVL (HRS)</div>
                    <div style={{ fontSize: '0.675rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                      Plant: {dailyAvailableHours.toFixed(2)} hrs/day
                    </div>
                  </th>
                  {tasks.map(t => {
                    const taskHoursInput = Number(t.hours) || 0;
                    const taskDailyHours = (taskHoursInput / daysInYear).toFixed(2);
                    return (
                      <th key={t.id} style={{ padding: '0.75rem 0.85rem', fontWeight: 700, textAlign: 'right', color: 'var(--accent-cyan)', verticalAlign: 'bottom' }}>
                        <div>{t.name.toUpperCase()} (HRS)</div>
                        <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)', fontWeight: 600, marginTop: '0.15rem' }}>
                          1-Day: {taskDailyHours} hrs/day
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {calculationResult.monthly_calculations.map((m, idx) => (
                  <tr 
                    key={m.month} 
                    style={{ 
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      background: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)'
                    }}
                  >
                    <td style={{ padding: '0.6rem 0.85rem', fontWeight: 700, color: '#ffffff' }}>
                      {m.month}
                    </td>
                    <td style={{ padding: '0.6rem 0.85rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      {m.days_in_month}d
                    </td>
                    <td style={{ padding: '0.6rem 0.85rem', textAlign: 'right', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                      {m.monthly_available_hours.toLocaleString()} hrs
                    </td>
                    {m.tasks.map(tCalc => (
                      <td key={tCalc.id} style={{ padding: '0.6rem 0.85rem', textAlign: 'right', fontWeight: 600, color: 'var(--text-main)' }}>
                        {tCalc.monthly_hours.toLocaleString()} hrs
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: 'rgba(0, 210, 255, 0.08)', borderTop: '2px solid var(--accent-cyan)', fontWeight: 800 }}>
                  <td style={{ padding: '0.75rem 0.85rem', color: '#ffffff' }}>TOTAL ANNUAL</td>
                  <td style={{ padding: '0.75rem 0.85rem', textAlign: 'center', color: 'var(--accent-cyan)' }}>
                    {daysInYear}d
                  </td>
                  <td style={{ padding: '0.75rem 0.85rem', textAlign: 'right', color: 'var(--accent-emerald)', fontSize: '0.9rem' }}>
                    {annualHours.toLocaleString()} hrs
                  </td>
                  {tasks.map(t => {
                    const taskAnnualTotal = calculationResult.monthly_calculations.reduce((sum, m) => {
                      const found = m.tasks.find(x => x.id === t.id);
                      return sum + (found?.monthly_hours || 0);
                    }, 0);
                    return (
                      <td key={t.id} style={{ padding: '0.75rem 0.85rem', textAlign: 'right', color: 'var(--accent-cyan)' }}>
                        {Math.round(taskAnnualTotal).toLocaleString()} hrs
                      </td>
                    );
                  })}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
