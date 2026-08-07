'use client';

import React, { useState } from 'react';
import {
  Plus,
  FolderKanban,
  Calendar,
  User,
  Clock,
  Flag,
  CircleCheck,
  X,
  Save,
  FileText,
  Hash,
} from 'lucide-react';

interface Project {
  id: string;
  projectName: string;
  projectNumber: string;
  description: string;
  startDate: string;
  endDate: string;
  projectManager: string;
  task: string;
  location: string;

  // New fields for Khordha / Mancheswar
  smi: string;
  labourSupply: string;
  jobContractor: string;

  plannedHours: number;
  priority: string;
  status: string;
}

interface ProjectPlanningViewProps {
  onProjectCreated?: (project: Project) => void;
}

export const ProjectPlanningView: React.FC<ProjectPlanningViewProps> = ({
  onProjectCreated,
}) => {
  const [showForm, setShowForm] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);

  const [formData, setFormData] = useState({
    projectName: '',
    projectNumber: '',
    description: '',
    startDate: '',
    endDate: '',
    projectManager: '',
    task: '',
    location: '',

    // New fields
    smi: '',
    labourSupply: '',
    jobContractor: '',

    plannedHours: '',
    priority: 'Medium',
    status: 'Planned',
  });

  const [saveMessage, setSaveMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,

      // If task is changed to something other than Welding/Assembly,
      // clear location and the three additional fields.
      ...(name === 'task' &&
      !['Welding', 'Assembly'].includes(value)
        ? {
            location: '',
            smi: '',
            labourSupply: '',
            jobContractor: '',
          }
        : {}),

      // If location is changed to K+M,
      // clear the three additional fields.
      ...(name === 'location' && value === 'K+M'
        ? {
            smi: '',
            labourSupply: '',
            jobContractor: '',
          }
        : {}),
    }));
  };

  const resetForm = () => {
    setFormData({
      projectName: '',
      projectNumber: '',
      description: '',
      startDate: '',
      endDate: '',
      projectManager: '',
      task: '',
      location: '',
      smi: '',
      labourSupply: '',
      jobContractor: '',
      plannedHours: '',
      priority: 'Medium',
      status: 'Planned',
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
    setSaveMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic required-field validation
    if (
      !formData.projectName ||
      !formData.projectNumber ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.projectManager ||
      !formData.task ||
      !formData.plannedHours
    ) {
      setSaveMessage('Please fill all required fields.');
      return;
    }

    // Location is required only for Welding and Assembly
    if (
      ['Welding', 'Assembly'].includes(formData.task) &&
      !formData.location
    ) {
      setSaveMessage('Please select a location for the selected task.');
      return;
    }

    // Validate dates
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setSaveMessage('End Date cannot be earlier than Start Date.');
      return;
    }

    const newProject: Project = {
      id: `project_${Date.now()}`,

      projectName: formData.projectName,
      projectNumber: formData.projectNumber,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      projectManager: formData.projectManager,
      task: formData.task,
      location: formData.location,

      // New fields
      smi: formData.smi,
      labourSupply: formData.labourSupply,
      jobContractor: formData.jobContractor,

      plannedHours: Number(formData.plannedHours),
      priority: formData.priority,
      status: formData.status,
    };

    const updatedProjects = [...projects, newProject];

    setProjects(updatedProjects);

    // Save to localStorage
    localStorage.setItem(
      'sms_project_planning',
      JSON.stringify(updatedProjects)
    );

    if (onProjectCreated) {
      onProjectCreated(newProject);
    }

    setSaveMessage('Project created successfully.');

    resetForm();

    setTimeout(() => {
      setSaveMessage('');
      setShowForm(false);
    }, 1200);
  };

  const showLocation =
    formData.task === 'Welding' || formData.task === 'Assembly';

  const showWorkDetails =
    showLocation &&
    (formData.location === 'Khordha' ||
      formData.location === 'Mancheswar');

  return (
    <div
      style={{
        padding: '1.5rem',
        minHeight: 'calc(100vh - 80px)',
      }}
    >
      {/* PAGE HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
            }}
          >
            <FolderKanban
              size={24}
              color="var(--accent-cyan)"
            />

            <h2
              style={{
                margin: 0,
                color: '#ffffff',
                fontSize: '1.35rem',
                fontWeight: 800,
              }}
            >
              Project Planning
            </h2>
          </div>

          <p
            style={{
              marginTop: '0.4rem',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
            }}
          >
            Create and manage projects for capacity planning.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background:
              'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
            color: '#ffffff',
            border: 'none',
            padding: '0.65rem 1.1rem',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '0 0 15px rgba(0, 210, 255, 0.25)',
          }}
        >
          <Plus size={18} />
          Add Project
        </button>
      </div>

      {/* PROJECT FORM */}
      {showForm && (
        <div
          className="glass-panel"
          style={{
            padding: '1.5rem',
            marginBottom: '1.5rem',
            border: '1px solid rgba(0, 210, 255, 0.25)',
          }}
        >
          {/* FORM HEADER */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.25rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid var(--border-color)',
            }}
          >
            <div>
              <h3
                style={{
                  margin: 0,
                  color: '#ffffff',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                }}
              >
                Create New Project
              </h3>

              <p
                style={{
                  marginTop: '0.3rem',
                  color: 'var(--text-muted)',
                  fontSize: '0.75rem',
                }}
              >
                Enter the project information below.
              </p>
            </div>

            <button
              onClick={handleCancel}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-muted)',
                borderRadius: '7px',
                padding: '0.4rem',
                cursor: 'pointer',
              }}
              title="Close"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* ROW 1 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1rem',
              }}
            >
              {/* PROJECT NAME */}
              <div>
                <label className="project-form-label">
                  <FolderKanban size={14} />
                  Project Name *
                </label>

                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  placeholder="Enter project name"
                  className="project-form-input"
                />
              </div>

              {/* PROJECT NUMBER */}
              <div>
                <label className="project-form-label">
                  <Hash size={14} />
                  Project ID / Project Number *
                </label>

                <input
                  type="text"
                  name="projectNumber"
                  value={formData.projectNumber}
                  onChange={handleChange}
                  placeholder="e.g. PRJ-2026-001"
                  className="project-form-input"
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div style={{ marginBottom: '1rem' }}>
              <label className="project-form-label">
                <FileText size={14} />
                Project Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter project description"
                rows={4}
                className="project-form-input"
                style={{
                  resize: 'vertical',
                  minHeight: '90px',
                }}
              />
            </div>

            {/* ROW 2 - DATES */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1rem',
              }}
            >
              {/* START DATE */}
              <div>
                <label className="project-form-label">
                  <Calendar size={14} />
                  Start Date *
                </label>

                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="project-form-input"
                />
              </div>

              {/* END DATE */}
              <div>
                <label className="project-form-label">
                  <Calendar size={14} />
                  End Date *
                </label>

                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="project-form-input"
                />
              </div>
            </div>

            {/* ROW 3 - MANAGER + TASK */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1rem',
              }}
            >
              {/* PROJECT MANAGER */}
              <div>
                <label className="project-form-label">
                  <User size={14} />
                  Project Manager *
                </label>

                <input
                  type="text"
                  name="projectManager"
                  value={formData.projectManager}
                  onChange={handleChange}
                  placeholder="Enter project manager name"
                  className="project-form-input"
                />
              </div>

              {/* TASK */}
              <div>
                <label className="project-form-label">
                  <FolderKanban size={14} />
                  Task *
                </label>

                <select
                  name="task"
                  value={formData.task}
                  onChange={handleChange}
                  className="project-form-input"
                >
                  <option value="">Select task</option>
                  <option value="Welding">Welding</option>
                  <option value="Assembly">Assembly</option>
                  <option value="Machining">Machining</option>
                  <option value="Plating">Plating</option>
                  <option value="RR">RR</option>
                  <option value="Service Machining">
                    Service Machining
                  </option>
                </select>
              </div>
            </div>

            {/* LOCATION */}
            {showLocation && (
              <div
                style={{
                  marginBottom: '1rem',
                  padding: '0.85rem',
                  background: 'rgba(0, 210, 255, 0.04)',
                  border: '1px solid rgba(0, 210, 255, 0.15)',
                  borderRadius: '8px',
                }}
              >
                <label className="project-form-label">
                  <FolderKanban size={14} />
                  {formData.task} Location *
                </label>

                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="project-form-input"
                >
                  <option value="">Select location</option>
                  <option value="Khordha">Khordha</option>
                  <option value="Mancheswar">Mancheswar</option>
                  <option value="K+M">K+M</option>
                </select>
              </div>
            )}

            {/* WORK DETAILS
                ONLY FOR KHORDHA OR MANCHESWAR
                AND NOT FOR K+M
            */}
            {showWorkDetails && (
              <div
                style={{
                  marginBottom: '1rem',
                  padding: '1rem',
                  background: 'rgba(0, 210, 255, 0.03)',
                  border: '1px solid rgba(0, 210, 255, 0.15)',
                  borderRadius: '8px',
                }}
              >
                <div
                  style={{
                    marginBottom: '0.9rem',
                  }}
                >
                  <h4
                    style={{
                      margin: 0,
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                    }}
                  >
                    {formData.task} - {formData.location} Details
                  </h4>

                  <p
                    style={{
                      margin: '0.3rem 0 0',
                      color: 'var(--text-dim)',
                      fontSize: '0.7rem',
                    }}
                  >
                    These fields are optional.
                  </p>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '1rem',
                  }}
                >
                  {/* SMI */}
                  <div>
                    <label className="project-form-label">
                      SMI
                    </label>

                    <input
                      type="text"
                      name="smi"
                      value={formData.smi}
                      onChange={handleChange}
                      placeholder="Enter SMI"
                      className="project-form-input"
                    />
                  </div>

                  {/* LABOUR SUPPLY */}
                  <div>
                    <label className="project-form-label">
                      Labour Supply
                    </label>

                    <input
                      type="text"
                      name="labourSupply"
                      value={formData.labourSupply}
                      onChange={handleChange}
                      placeholder="Enter Labour Supply"
                      className="project-form-input"
                    />
                  </div>

                  {/* JOB CONTRACTOR */}
                  <div>
                    <label className="project-form-label">
                      Job Contractor
                    </label>

                    <input
                      type="text"
                      name="jobContractor"
                      value={formData.jobContractor}
                      onChange={handleChange}
                      placeholder="Enter Job Contractor"
                      className="project-form-input"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ROW 4 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              {/* PLANNED HOURS */}
              <div>
                <label className="project-form-label">
                  <Clock size={14} />
                  Planned Hours *
                </label>

                <input
                  type="number"
                  name="plannedHours"
                  value={formData.plannedHours}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  placeholder="e.g. 5000"
                  className="project-form-input"
                />
              </div>

              {/* PRIORITY */}
              <div>
                <label className="project-form-label">
                  <Flag size={14} />
                  Priority
                </label>

                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="project-form-input"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              {/* STATUS */}
              <div>
                <label className="project-form-label">
                  <CircleCheck size={14} />
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="project-form-input"
                >
                  <option value="Planned">Planned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* MESSAGE */}
            {saveMessage && (
              <div
                style={{
                  marginBottom: '1rem',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '7px',
                  background: saveMessage.includes('successfully')
                    ? 'rgba(16, 185, 129, 0.1)'
                    : 'rgba(239, 68, 68, 0.1)',
                  border: saveMessage.includes('successfully')
                    ? '1px solid rgba(16, 185, 129, 0.25)'
                    : '1px solid rgba(239, 68, 68, 0.25)',
                  color: saveMessage.includes('successfully')
                    ? 'var(--accent-emerald)'
                    : '#f87171',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
              >
                {saveMessage}
              </div>
            )}

            {/* BUTTONS */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.75rem',
              }}
            >
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-muted)',
                  padding: '0.55rem 1rem',
                  borderRadius: '7px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                <X size={16} />
                Cancel
              </button>

              <button
                type="submit"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background:
                    'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
                  border: 'none',
                  color: '#ffffff',
                  padding: '0.55rem 1rem',
                  borderRadius: '7px',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                <Save size={16} />
                Create Project
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EMPTY STATE */}
      {!showForm && projects.length === 0 && (
        <div
          className="glass-panel"
          style={{
            padding: '3rem',
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <FolderKanban
            size={45}
            color="var(--accent-cyan)"
            style={{ marginBottom: '1rem' }}
          />

          <h3
            style={{
              color: '#ffffff',
              marginBottom: '0.5rem',
            }}
          >
            No Projects Created
          </h3>

          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
            }}
          >
            Click <strong>Add Project</strong> to create your first project.
          </p>

          <button
            onClick={() => setShowForm(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background:
                'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
              border: 'none',
              color: '#ffffff',
              padding: '0.6rem 1rem',
              borderRadius: '7px',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            <Plus size={17} />
            Add Project
          </button>
        </div>
      )}

      {/* PROJECT TABLE */}
      {projects.length > 0 && (
        <div
          className="glass-panel"
          style={{
            padding: '1.25rem',
            border: '1px solid rgba(255,255,255,0.08)',
            overflowX: 'auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <div>
              <h3
                style={{
                  color: '#ffffff',
                  margin: 0,
                  fontSize: '1rem',
                }}
              >
                Projects
              </h3>

              <span
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.7rem',
                }}
              >
                {projects.length} project
                {projects.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.8rem',
            }}
          >
            <thead>
              <tr
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  color: 'var(--text-muted)',
                }}
              >
                <th style={tableHeaderStyle}>Project</th>
                <th style={tableHeaderStyle}>Project ID</th>
                <th style={tableHeaderStyle}>Manager</th>
                <th style={tableHeaderStyle}>Task</th>
                <th style={tableHeaderStyle}>Location</th>
                <th style={tableHeaderStyle}>SMI</th>
                <th style={tableHeaderStyle}>Labour Supply</th>
                <th style={tableHeaderStyle}>Job Contractor</th>
                <th style={tableHeaderStyle}>Dates</th>
                <th style={tableHeaderStyle}>Hours</th>
                <th style={tableHeaderStyle}>Priority</th>
                <th style={tableHeaderStyle}>Status</th>
              </tr>
            </thead>

            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  style={{
                    borderBottom:
                      '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  {/* PROJECT */}
                  <td style={tableCellStyle}>
                    <strong style={{ color: '#ffffff' }}>
                      {project.projectName}
                    </strong>

                    {project.description && (
                      <div
                        style={{
                          color: 'var(--text-dim)',
                          fontSize: '0.68rem',
                          marginTop: '0.2rem',
                          maxWidth: '250px',
                        }}
                      >
                        {project.description}
                      </div>
                    )}
                  </td>

                  {/* PROJECT ID */}
                  <td style={tableCellStyle}>
                    {project.projectNumber}
                  </td>

                  {/* MANAGER */}
                  <td style={tableCellStyle}>
                    {project.projectManager}
                  </td>

                  {/* TASK */}
                  <td style={tableCellStyle}>
                    {project.task}
                  </td>

                  {/* LOCATION */}
                  <td style={tableCellStyle}>
                    {project.location || '—'}
                  </td>

                  {/* SMI */}
                  <td style={tableCellStyle}>
                    {project.smi || '—'}
                  </td>

                  {/* LABOUR SUPPLY */}
                  <td style={tableCellStyle}>
                    {project.labourSupply || '—'}
                  </td>

                  {/* JOB CONTRACTOR */}
                  <td style={tableCellStyle}>
                    {project.jobContractor || '—'}
                  </td>

                  {/* DATES */}
                  <td style={tableCellStyle}>
                    {project.startDate}
                    <br />
                    <span style={{ color: 'var(--text-dim)' }}>
                      → {project.endDate}
                    </span>
                  </td>

                  {/* HOURS */}
                  <td
                    style={{
                      ...tableCellStyle,
                      color: 'var(--accent-cyan)',
                      fontWeight: 700,
                    }}
                  >
                    {project.plannedHours.toLocaleString()}
                  </td>

                  {/* PRIORITY */}
                  <td style={tableCellStyle}>
                    <span
                      style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '5px',
                        background:
                          'rgba(0,210,255,0.08)',
                        color: 'var(--accent-cyan)',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                      }}
                    >
                      {project.priority}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td style={tableCellStyle}>
                    {project.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* STYLES */}
      <style jsx>{`
        .project-form-label {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          color: var(--text-muted);
          font-size: 0.75rem;
          font-weight: 700;
          margin-bottom: 0.4rem;
        }

        .project-form-input {
          width: 100%;
          box-sizing: border-box;
          background: rgba(10, 14, 23, 0.8);
          border: 1px solid rgba(0, 210, 255, 0.2);
          border-radius: 7px;
          padding: 0.65rem 0.75rem;
          color: #ffffff;
          font-size: 0.8rem;
          outline: none;
        }

        .project-form-input:focus {
          border-color: var(--accent-cyan);
          box-shadow: 0 0 10px rgba(0, 210, 255, 0.1);
        }

        .project-form-input::placeholder {
          color: var(--text-dim);
        }

        select.project-form-input option {
          background: #0f172a;
          color: #ffffff;
        }

        @media (max-width: 900px) {
          form > div {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 600px) {
          .project-form-input {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

const tableHeaderStyle: React.CSSProperties = {
  padding: '0.75rem',
  textAlign: 'left',
  fontWeight: 700,
  whiteSpace: 'nowrap',
};

const tableCellStyle: React.CSSProperties = {
  padding: '0.75rem',
  color: 'var(--text-main)',
  verticalAlign: 'top',
};