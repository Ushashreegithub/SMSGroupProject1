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
  Sliders,
  PlusCircle,
  TrendingUp,
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
    // In-Progress Adjustment & Buffer inputs (Only in Edit mode)
    adjustmentMonthIndex: '',
    actualUtilizedHours: '',
    bufferMonthIndex: '',
    bufferHours: '',
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
        adjustmentMonthIndex: taskObj.adjustment_month_index || taskObj.adjustmentMonthIndex || '',
        actualUtilizedHours: taskObj.actual_utilized_hours !== undefined && taskObj.actual_utilized_hours !== null ? taskObj.actual_utilized_hours : '',
        bufferMonthIndex: taskObj.buffer_month_index || taskObj.bufferMonthIndex || '',
        bufferHours: taskObj.buffer_hours || taskObj.bufferHours || '',
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

    const adjMonth = formData.adjustmentMonthIndex ? Number(formData.adjustmentMonthIndex) : null;
    const actualHours = formData.actualUtilizedHours !== '' && formData.actualUtilizedHours !== null ? Number(formData.actualUtilizedHours) : null;
    const bufMonth = formData.bufferMonthIndex ? Number(formData.bufferMonthIndex) : null;
    const bufHours = formData.bufferHours ? Number(formData.bufferHours) : 0;

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
          adjustmentMonthIndex: adjMonth,
          adjustment_month_index: adjMonth,
          actualUtilizedHours: actualHours,
          actual_utilized_hours: actualHours,
          bufferMonthIndex: bufMonth,
          buffer_month_index: bufMonth,
          bufferHours: bufHours,
          buffer_hours: bufHours,
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
    setSaveMsg('Project updated with adjustment & buffer calculations!');
    onProjectUpdated();

    setTimeout(() => {
      setSaveMsg('');
      onClose();
    }, 800);
  };

  // Preview local monthly calculation with Adjustment & Buffer
  const getPreviewMonths = () => {
    const baseHours = Number(formData.plannedHours) || 0;
    const duration = Number(formData.durationMonths) || 3;
    if (baseHours <= 0 || duration <= 0) return [];

    const startDt = formData.startDate ? new Date(formData.startDate) : new Date(2026, 7, 1);

    // 1. Baseline
    let m1Base = Math.round(baseHours * 0.15 * 100) / 100;
    let remBaseTotal = baseHours - m1Base;
    let remCount = duration - 1;
    let baseRemaining = remCount > 0 ? Math.round((remBaseTotal / remCount) * 100) / 100 : 0;

    let monthlyHours: number[] = [m1Base];
    for (let i = 1; i < duration; i++) {
      if (i === duration - 1) {
        let sumSoFar = monthlyHours.reduce((a, b) => a + b, 0);
        monthlyHours.push(Math.round((baseHours - sumSoFar) * 100) / 100);
      } else {
        monthlyHours.push(baseRemaining);
      }
    }

    // 2. Adjustment
    const adjIdx = formData.adjustmentMonthIndex ? Number(formData.adjustmentMonthIndex) - 1 : -1;
    const actualH = formData.actualUtilizedHours !== '' && formData.actualUtilizedHours !== null ? Number(formData.actualUtilizedHours) : null;
    let isAdjustedArr = new Array(duration).fill(false);

    if (adjIdx >= 0 && adjIdx < duration && actualH !== null) {
      isAdjustedArr[adjIdx] = true;
      const plannedVal = monthlyHours[adjIdx];
      const diff = plannedVal - actualH;
      monthlyHours[adjIdx] = actualH;

      const subCount = duration - (adjIdx + 1);
      if (subCount > 0) {
        const addPerMonth = Math.round((diff / subCount) * 100) / 100;
        let accDiff = 0;
        for (let k = adjIdx + 1; k < duration; k++) {
          if (k === duration - 1) {
            monthlyHours[k] = Math.round((monthlyHours[k] + (diff - accDiff)) * 100) / 100;
          } else {
            monthlyHours[k] = Math.round((monthlyHours[k] + addPerMonth) * 100) / 100;
            accDiff += addPerMonth;
          }
        }
      }
    }

    // 3. Buffer
    const bufIdx = formData.bufferMonthIndex ? Number(formData.bufferMonthIndex) - 1 : -1;
    const bufH = formData.bufferHours ? Number(formData.bufferHours) : 0;
    let isBufferArr = new Array(duration).fill(false);

    if (bufIdx >= 0 && bufIdx < duration && bufH > 0) {
      isBufferArr[bufIdx] = true;
      monthlyHours[bufIdx] = Math.round((monthlyHours[bufIdx] + bufH) * 100) / 100;
    }

    const totalEffHours = monthlyHours.reduce((a, b) => a + b, 0);

    // Build month items
    return monthlyHours.map((h, i) => {
      const d = new Date(startDt.getFullYear(), startDt.getMonth() + i, 1);
      const label = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const pct = totalEffHours > 0 ? Math.round((h / totalEffHours) * 1000) / 10 : 0;

      return {
        month: label,
        hours: h,
        pct: pct,
        index: i + 1,
        isAdjusted: isAdjustedArr[i],
        isBuffer: isBufferArr[i],
      };
    });
  };

  const previewMonths = getPreviewMonths();

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 11, 20, 0.85)',
        backdropFilter: 'blur(10px)',
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
          maxWidth: '920px',
          maxHeight: '92vh',
          overflowY: 'auto',
          background: 'linear-gradient(145deg, rgba(13, 25, 48, 0.96) 0%, rgba(10, 16, 30, 0.98) 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(0, 210, 255, 0.35)',
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
              Manipulate project hours, task parameters, and introduce in-progress <strong>Adjustments</strong> & <strong>Buffers</strong>.
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

          {/* IN-PROGRESS ADJUSTMENTS & BUFFERS (EXCLUSIVELY INSIDE EDIT MODAL) */}
          <div
            style={{
              padding: '1.25rem',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(0, 210, 255, 0.08) 100%)',
              borderRadius: '12px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <Sliders size={18} color="var(--accent-emerald)" />
              <h4 style={{ margin: 0, color: '#ffffff', fontSize: '0.95rem', fontWeight: 800 }}>
                In-Progress Capacity Adjustments & Buffers
              </h4>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', padding: '0.15rem 0.5rem', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '12px', fontWeight: 700 }}>
                Edit Progress Feature
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              
              {/* 1. ADJUSTMENT INPUT BOX */}
              <div
                style={{
                  padding: '1rem',
                  background: 'rgba(10, 16, 30, 0.7)',
                  borderRadius: '8px',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f59e0b', fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                  <TrendingUp size={16} /> 1. Capacity Utilization Adjustment
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      Adjustment After Month
                    </label>
                    <select
                      name="adjustmentMonthIndex"
                      value={formData.adjustmentMonthIndex}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.7rem',
                        background: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        borderRadius: '6px',
                        color: '#fff',
                        fontSize: '0.82rem',
                      }}
                    >
                      <option value="">No Adjustment</option>
                      {Array.from({ length: Number(formData.durationMonths) || 3 }).map((_, idx) => (
                        <option key={idx + 1} value={idx + 1}>
                          Month {idx + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      Actual Utilized Hours in Month {formData.adjustmentMonthIndex || 1}
                    </label>
                    <input
                      type="number"
                      name="actualUtilizedHours"
                      placeholder="e.g. 500 (planned was 750)"
                      value={formData.actualUtilizedHours}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.7rem',
                        background: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        borderRadius: '6px',
                        color: '#f59e0b',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* 2. BUFFER INPUT BOX */}
              <div
                style={{
                  padding: '1rem',
                  background: 'rgba(10, 16, 30, 0.7)',
                  borderRadius: '8px',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a855f7', fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                  <PlusCircle size={16} /> 2. Introduced Buffer Hours
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      Buffer Introduced In Month
                    </label>
                    <select
                      name="bufferMonthIndex"
                      value={formData.bufferMonthIndex}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.7rem',
                        background: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                        borderRadius: '6px',
                        color: '#fff',
                        fontSize: '0.82rem',
                      }}
                    >
                      <option value="">No Buffer</option>
                      {Array.from({ length: Number(formData.durationMonths) || 3 }).map((_, idx) => (
                        <option key={idx + 1} value={idx + 1}>
                          Month {idx + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      Extra Buffer Capacity (Hours)
                    </label>
                    <input
                      type="number"
                      name="bufferHours"
                      placeholder="e.g. 500 extra hours"
                      value={formData.bufferHours}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.7rem',
                        background: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                        borderRadius: '6px',
                        color: '#a855f7',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                      }}
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* DYNAMIC MONTHLY BREAKDOWN PREVIEW */}
          {previewMonths.length > 0 && (
            <div
              style={{
                background: 'rgba(10, 16, 30, 0.75)',
                borderRadius: '10px',
                padding: '1rem',
                border: '1px solid rgba(0, 210, 255, 0.25)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                  Calculated Monthly Breakdown Preview ({formData.task} Logic Engine)
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Total Capacity: <strong style={{ color: '#fff' }}>{previewMonths.reduce((a, b) => a + b.hours, 0).toLocaleString()} hrs</strong>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${previewMonths.length}, 1fr)`, gap: '0.6rem' }}>
                {previewMonths.map((m) => (
                  <div
                    key={m.index}
                    style={{
                      padding: '0.6rem',
                      background: m.isAdjusted
                        ? 'rgba(245, 158, 11, 0.15)'
                        : m.isBuffer
                        ? 'rgba(168, 85, 247, 0.15)'
                        : m.index === 1
                        ? 'rgba(0, 210, 255, 0.12)'
                        : 'rgba(255, 255, 255, 0.03)',
                      border: m.isAdjusted
                        ? '1px solid #f59e0b'
                        : m.isBuffer
                        ? '1px solid #a855f7'
                        : m.index === 1
                        ? '1px solid var(--accent-cyan)'
                        : '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '6px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Month {m.index}: {m.month}
                    </div>

                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: m.isAdjusted ? '#f59e0b' : m.isBuffer ? '#a855f7' : m.index === 1 ? 'var(--accent-cyan)' : '#fff', marginTop: '0.15rem' }}>
                      {m.hours.toLocaleString()} hrs
                    </div>

                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: m.isAdjusted ? '#f59e0b' : m.isBuffer ? '#a855f7' : m.index === 1 ? '#00d2ff' : '#10b981' }}>
                      {m.isAdjusted ? '(Adjusted)' : m.isBuffer ? '(Buffer Added)' : m.index === 1 ? '(15% Ramp-up)' : '(Equal Split)'}
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
