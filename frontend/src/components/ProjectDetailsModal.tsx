'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Wrench,
  Calendar,
  Clock,
  User,
  Hash,
  Scale,
  Building,
  MapPin,
  Tag,
  CheckCircle,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { updateBackendProject } from '../lib/api';

interface ProjectDetailsModalProps {
  project: any | null;
  isOpen: boolean;
  onClose: () => void;
  onProjectUpdated: () => void;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  project,
  isOpen,
  onClose,
  onProjectUpdated,
}) => {
  const [formData, setFormData] = useState<any>({
    projectName: '',
    projectNumber: '',
    equipmentName: '',
    equipmentWeight: '',
    description: '',
    startDate: '',
    endDate: '',
    projectManager: '',
    task: 'Welding',
    location: '',
    smi: '',
    labourSupply: '',
    jobContractor: '',
    plannedHours: 5000,
    durationMonths: 3,
    priority: 'Medium',
    status: 'Planned',
  });

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMsg, setSaveMsg] = useState<string>('');

  useEffect(() => {
    if (project) {
      const taskObj = (project.tasks && project.tasks[0]) || {};
      setFormData({
        id: project.id,
        projectName: project.project_name || project.projectName || '',
        projectNumber: project.project_number || project.projectNumber || '',
        equipmentName: project.equipment_name || project.equipmentName || '',
        equipmentWeight: project.equipment_weight || project.equipmentWeight || '',
        description: project.description || '',
        startDate: project.zero_date || project.startDate || '',
        endDate: project.cdd || project.endDate || '',
        projectManager: project.project_manager || project.projectManager || '',
        task: taskObj.task_name || project.task || 'Welding',
        location: taskObj.location || project.location || '',
        smi: taskObj.smi || project.smi || '',
        labourSupply: taskObj.labour_supply || project.labourSupply || project.labour_supply || '',
        jobContractor: taskObj.job_contractor || project.jobContractor || project.job_contractor || '',
        plannedHours: taskObj.allocated_hours || project.total_planned_hours || project.plannedHours || 5000,
        durationMonths: taskObj.duration_months || 3,
        priority: project.priority || 'Medium',
        status: project.status || 'Planned',
      });
      setSaveMsg('');
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updatedPayload = {
      projectName: formData.projectName,
      project_name: formData.projectName,
      projectNumber: formData.projectNumber,
      project_number: formData.projectNumber,
      equipmentName: formData.equipmentName,
      equipment_name: formData.equipmentName,
      equipmentWeight: formData.equipmentWeight,
      equipment_weight: formData.equipmentWeight,
      description: formData.description,
      startDate: formData.startDate,
      zero_date: formData.startDate,
      endDate: formData.endDate,
      cdd: formData.endDate,
      projectManager: formData.projectManager,
      project_manager: formData.projectManager,
      plannedHours: Number(formData.plannedHours),
      total_planned_hours: Number(formData.plannedHours),
      priority: formData.priority,
      status: formData.status,
      tasks: [
        {
          task_name: formData.task,
          task_code: String(formData.task).toLowerCase().replace(/\s+/g, '_'),
          allocated_hours: Number(formData.plannedHours),
          duration_months: Number(formData.durationMonths),
          start_date: formData.startDate,
          location: formData.location,
          smi: formData.smi,
          labour_supply: formData.labourSupply,
          job_contractor: formData.jobContractor,
        },
      ],
    };

    // 1. Update backend DB if project.id exists
    if (project.id) {
      await updateBackendProject(project.id, updatedPayload);
    }

    // 2. Update localStorage projects list
    try {
      const savedLocal = localStorage.getItem('sms_project_planning');
      if (savedLocal) {
        const parsed = JSON.parse(savedLocal);
        const updatedList = parsed.map((p: any) => {
          if (
            (project.id && p.id === project.id) ||
            p.projectNumber === formData.projectNumber ||
            p.project_number === formData.projectNumber
          ) {
            return {
              ...p,
              ...updatedPayload,
              id: p.id || project.id,
              plannedHours: Number(formData.plannedHours),
              task: formData.task,
              location: formData.location,
              smi: formData.smi,
              labourSupply: formData.labourSupply,
              jobContractor: formData.jobContractor,
            };
          }
          return p;
        });
        localStorage.setItem('sms_project_planning', JSON.stringify(updatedList));
      }
    } catch (err) {
      console.warn('LocalStorage save warning:', err);
    }

    setIsSaving(false);
    setSaveMsg('Project updated successfully!');
    onProjectUpdated();

    setTimeout(() => {
      setSaveMsg('');
      onClose();
    }, 800);
  };

  // Preview local monthly calculation
  const getPreviewMonths = () => {
    const hours = Number(formData.plannedHours) || 0;
    const duration = Number(formData.durationMonths) || 3;
    if (hours <= 0 || duration <= 0) return [];

    const startDt = formData.startDate ? new Date(formData.startDate) : new Date(2026, 7, 1);
    const result: any[] = [];

    if (duration === 1) {
      result.push({
        month: startDt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        hours: hours,
        pct: 100,
        index: 1,
      });
      return result;
    }

    const m1Hours = Math.round(hours * 0.15 * 100) / 100;
    const remainingHours = hours - m1Hours;
    const remainingMonthsCount = duration - 1;
    const baseRemaining = Math.round((remainingHours / remainingMonthsCount) * 100) / 100;
    let accumulated = m1Hours;

    for (let i = 0; i < duration; i++) {
      const d = new Date(startDt.getFullYear(), startDt.getMonth() + i, 1);
      const label = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (i === 0) {
        result.push({ month: label, hours: m1Hours, pct: 15.0, index: 1 });
      } else {
        let mH = baseRemaining;
        if (i === duration - 1) {
          mH = Math.round((hours - accumulated) * 100) / 100;
        }
        accumulated += mH;
        const pct = Math.round((mH / hours) * 1000) / 10;
        result.push({ month: label, hours: mH, pct, index: i + 1 });
      }
    }
    return result;
  };

  const previewMonths = getPreviewMonths();

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 11, 20, 0.82)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '900px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'linear-gradient(145deg, rgba(13, 25, 48, 0.95) 0%, rgba(10, 16, 30, 0.98) 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(0, 210, 255, 0.3)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 210, 255, 0.15)',
          padding: '1.75rem',
        }}
      >
        {/* MODAL HEADER */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '1.25rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span
                style={{
                  padding: '0.25rem 0.6rem',
                  background: 'rgba(0, 210, 255, 0.15)',
                  color: 'var(--accent-cyan)',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  fontFamily: 'monospace',
                }}
              >
                {formData.projectNumber}
              </span>
              <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.25rem', fontWeight: 800 }}>
                View & Edit Project Details
              </h3>
            </div>
            <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              Manipulate project hours, task parameters, SMI, contractors, and review live monthly breakdown.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '0.5rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* ROW 1: Project Name & Number */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Project Name *
              </label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  background: 'rgba(10, 16, 30, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Project ID / Number *
              </label>
              <input
                type="text"
                name="projectNumber"
                value={formData.projectNumber}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  background: 'rgba(10, 16, 30, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                }}
              />
            </div>
          </div>

          {/* ROW 2: Equipment Name & Weight */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Equipment Name
              </label>
              <input
                type="text"
                name="equipmentName"
                value={formData.equipmentName}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  background: 'rgba(10, 16, 30, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.88rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Equipment Weight (kg)
              </label>
              <input
                type="text"
                name="equipmentWeight"
                value={formData.equipmentWeight}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  background: 'rgba(10, 16, 30, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.88rem',
                }}
              />
            </div>
          </div>

          {/* ROW 3: Dates & Manager */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Zero Date (Start Date) *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  background: 'rgba(10, 16, 30, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.85rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                CDD (End Date) *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  background: 'rgba(10, 16, 30, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.85rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Project Manager *
              </label>
              <input
                type="text"
                name="projectManager"
                value={formData.projectManager}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  background: 'rgba(10, 16, 30, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.88rem',
                }}
              />
            </div>
          </div>

          {/* ROW 4: Task Parameters & Hours */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Task Name *
              </label>
              <select
                name="task"
                value={formData.task}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  background: 'rgba(10, 16, 30, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.85rem',
                }}
              >
                <option value="Welding">Welding</option>
                <option value="Machining">Machining</option>
                <option value="Assembly">Assembly</option>
                <option value="Roll Repair">Roll Repair (R&R)</option>
                <option value="Plating">Plating</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Planned Hours *
              </label>
              <input
                type="number"
                name="plannedHours"
                value={formData.plannedHours}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  background: 'rgba(10, 16, 30, 0.8)',
                  border: '1px solid rgba(0, 210, 255, 0.3)',
                  borderRadius: '8px',
                  color: 'var(--accent-cyan)',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Task Duration (Months)
              </label>
              <input
                type="number"
                name="durationMonths"
                min={1}
                max={12}
                value={formData.durationMonths}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  background: 'rgba(10, 16, 30, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.88rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Location
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  background: 'rgba(10, 16, 30, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.85rem',
                }}
              >
                <option value="">Select Location</option>
                <option value="Khordha">Khordha</option>
                <option value="Mancheswar">Mancheswar</option>
                <option value="K+M">K+M (Both)</option>
              </select>
            </div>
          </div>

          {/* ROW 5: SMI, Labour, Contractor */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                SMI
              </label>
              <input
                type="text"
                name="smi"
                value={formData.smi}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  background: 'rgba(10, 16, 30, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.85rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Labour Supply
              </label>
              <input
                type="text"
                name="labourSupply"
                value={formData.labourSupply}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  background: 'rgba(10, 16, 30, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.85rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Job Contractor
              </label>
              <input
                type="text"
                name="jobContractor"
                value={formData.jobContractor}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  background: 'rgba(10, 16, 30, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.85rem',
                }}
              />
            </div>
          </div>

          {/* DYNAMIC MONTHLY BREAKDOWN PREVIEW */}
          {previewMonths.length > 0 && (
            <div
              style={{
                background: 'rgba(10, 16, 30, 0.7)',
                borderRadius: '10px',
                padding: '1rem',
                border: '1px solid rgba(0, 210, 255, 0.2)',
              }}
            >
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: '0.6rem' }}>
                Calculated Monthly Breakdown Preview ({formData.task} 15% Ramp-up Rule)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${previewMonths.length}, 1fr)`, gap: '0.6rem' }}>
                {previewMonths.map((m) => (
                  <div
                    key={m.index}
                    style={{
                      padding: '0.6rem',
                      background: m.index === 1 ? 'rgba(0, 210, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: m.index === 1 ? '1px solid var(--accent-cyan)' : '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '6px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Month {m.index}: {m.month}
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: m.index === 1 ? 'var(--accent-cyan)' : '#fff', marginTop: '0.15rem' }}>
                      {m.hours.toLocaleString()} hrs
                    </div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: m.index === 1 ? '#00d2ff' : '#10b981' }}>
                      {m.pct}% {m.index === 1 ? '(15% Ramp-up)' : '(Equal Split)'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SAVE MESSAGE */}
          {saveMsg && (
            <div style={{ padding: '0.6rem 0.8rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', color: '#10b981', fontSize: '0.82rem', fontWeight: 700 }}>
              {saveMsg}
            </div>
          )}

          {/* ACTIONS */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', paddingTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.65rem 1.2rem',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              style={{
                padding: '0.65rem 1.4rem',
                background: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#050b14',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Save size={16} /> {isSaving ? 'Saving Edits...' : 'Save & Recalculate Project'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
