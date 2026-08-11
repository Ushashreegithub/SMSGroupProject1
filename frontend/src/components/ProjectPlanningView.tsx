'use client';

import React, { useState, useEffect } from 'react';
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
  Wrench,
  Scale,
  Edit,
  MapPin,
  Tag,
  Trash2,
} from 'lucide-react';
import { ProjectDetailsModal } from './ProjectDetailsModal';

interface Project {
  id: string;
  projectName: string;
  projectNumber: string;
  equipmentName: string;
  equipmentWeight: string;
  description: string;
  startDate: string;
  endDate: string;
  projectManager: string;
  task: string;
  location: string;

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

interface TaskItem {
  id: string;
  task_name: string;
  allocated_hours: number | string;
  duration_months: number | string;
  location: string;
  smi: string;
  labour_supply: string;
  job_contractor: string;
}

const STANDARD_TASKS = [
  'Welding',
  'Machining',
  'Assembly',
  'Plating',
  'RR',
];

/*
 * ============================================================
 * LOCATION CONFIGURATION
 * ============================================================
 *
 * Welding currently supports all three locations.
 *
 * All other tasks currently support only Khordha.
 *
 * If later you want to add more locations for another task,
 * simply update this object.
 *
 * Example:
 *
 * Machining: ['Khordha', 'Mancheswar']
 *
 * or:
 *
 * Plating: ['Khordha', 'Mancheswar', 'K+M']
 *
 * ============================================================
 */

const TASK_LOCATIONS: Record<string, string[]> = {
  Welding: ['Khordha', 'Mancheswar', 'K+M'],

  Machining: ['Khordha'],

  Assembly: ['Khordha'],

  Plating: ['Khordha'],

  RR: ['Khordha'],
};

/*
 * Returns the available locations for a task.
 *
 * If a new task is added later and no location configuration
 * is provided, Khordha will be used as the default.
 */
const getLocationsForTask = (taskName: string): string[] => {
  return TASK_LOCATIONS[taskName] || ['Khordha'];
};

/*
 * Returns the default location for a task.
 *
 * Currently:
 * Welding -> Khordha
 * Everything else -> Khordha
 */
const getDefaultLocationForTask = (taskName: string): string => {
  const locations = getLocationsForTask(taskName);

  return locations.includes('Khordha')
    ? 'Khordha'
    : locations[0] || 'Khordha';
};

const createDefaultTask = (
  taskName: string = 'Welding'
): TaskItem => ({
  id: `task_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 7)}`,

  task_name: taskName,

  allocated_hours: 3000,

  duration_months: 3,

  location: getDefaultLocationForTask(taskName),

  smi: '',

  labour_supply: '',

  job_contractor: '',
});

export const ProjectPlanningView: React.FC<
  ProjectPlanningViewProps
> = ({ onProjectCreated }) => {
  const [showForm, setShowForm] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);

  const [selectedProject, setSelectedProject] =
    useState<any | null>(null);

  const [isModalOpen, setIsModalOpen] =
    useState<boolean>(false);

  /*
   * ============================================================
   * LOAD PROJECTS
   * ============================================================
   */

  const loadProjects = () => {
    try {
      const saved = localStorage.getItem(
        'sms_project_planning'
      );

      if (saved) {
        setProjects(JSON.parse(saved));
      }
    } catch (e) {
      console.error(
        'Failed to load saved projects',
        e
      );
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  /*
   * ============================================================
   * TASK STATE
   * ============================================================
   */

  const [formTasks, setFormTasks] = useState<TaskItem[]>([
    createDefaultTask('Welding'),
  ]);

  /*
   * ADD NEW TASK
   */

  const addFormTask = () => {
    if (formTasks.length >= 5) return;

    const existingNames = formTasks.map(
      (t) => t.task_name
    );

    const nextName =
      STANDARD_TASKS.find(
        (name) => !existingNames.includes(name)
      ) || 'Machining';

    setFormTasks((prev) => [
      ...prev,
      createDefaultTask(nextName),
    ]);
  };

  /*
   * REMOVE TASK
   */

  const removeFormTask = (index: number) => {
    if (formTasks.length <= 1) return;

    setFormTasks((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  /*
   * ============================================================
   * TASK FIELD CHANGE
   * ============================================================
   *
   * Important location logic:
   *
   * When Task Type changes:
   *
   * Welding
   *   -> Khordha / Mancheswar / K+M
   *
   * Other tasks
   *   -> Khordha only
   *
   * If changing from Welding to another task,
   * location automatically becomes Khordha.
   */

  const handleTaskFieldChange = (
    index: number,
    field: string,
    value: any
  ) => {
    setFormTasks((prev) => {
      const copy = [...prev];

      /*
       * TASK TYPE CHANGED
       */

      if (field === 'task_name') {
        const newTaskName = value;

        const availableLocations =
          getLocationsForTask(newTaskName);

        /*
         * Always use Khordha when available.
         *
         * This means:
         *
         * Welding -> Khordha
         * Machining -> Khordha
         * Assembly -> Khordha
         * Plating -> Khordha
         * RR -> Khordha
         */

        const defaultLocation =
          getDefaultLocationForTask(newTaskName);

        copy[index] = {
          ...copy[index],

          task_name: newTaskName,

          /*
           * If current location is not allowed for the
           * newly selected task, reset to Khordha.
           */
          location: availableLocations.includes(
            copy[index].location
          )
            ? copy[index].location
            : defaultLocation,
        };

        return copy;
      }

      /*
       * NORMAL FIELD CHANGE
       */

      copy[index] = {
        ...copy[index],
        [field]: value,
      };

      return copy;
    });
  };

  /*
   * ============================================================
   * PROJECT FORM DATA
   * ============================================================
   */

  const [formData, setFormData] = useState({
    customerName: '',
    wbsNo: '',
    projectCode: '',
    location: '',
    projectName: '',
    projectNumber: '',
    equipmentName: '',
    equipmentWeight: '',
    description: '',
    startDate: '',
    endDate: '',
    projectManager: '',
    priority: 'Medium',
    status: 'Planned',
  });

  const [saveMessage, setSaveMessage] =
    useState('');

  /*
   * ============================================================
   * FORM CHANGE
   * ============================================================
   */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
   * ============================================================
   * RESET FORM
   * ============================================================
   */

  const resetForm = () => {
    setFormTasks([
      createDefaultTask('Welding'),
    ]);

    setFormData({
      customerName: '',
      wbsNo: '',
      projectCode: '',
      location: '',
      projectName: '',
      projectNumber: '',
      equipmentName: '',
      equipmentWeight: '',
      description: '',
      startDate: '',
      endDate: '',
      projectManager: '',
      priority: 'Medium',
      status: 'Planned',
    });
  };

  /*
   * ============================================================
   * CANCEL
   * ============================================================
   */

  const handleCancel = () => {
    setShowForm(false);

    resetForm();

    setSaveMessage('');
  };

  /*
   * ============================================================
   * SUBMIT PROJECT
   * ============================================================
   */

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const cName =
      formData.customerName ||
      formData.projectName;

    const wbs =
      formData.wbsNo ||
      formData.projectNumber;

    const pCode =
      formData.projectCode ||
      wbs;

    /*
     * REQUIRED FIELD VALIDATION
     */

    if (
      !cName ||
      !wbs ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.projectManager ||
      formTasks.length === 0
    ) {
      setSaveMessage(
        'Please fill all required project fields and add at least one task.'
      );

      return;
    }

    /*
     * DATE VALIDATION
     */

    if (
      new Date(formData.endDate) <
      new Date(formData.startDate)
    ) {
      setSaveMessage(
        'CDD cannot be earlier than Zero Date.'
      );

      return;
    }

    /*
     * TOTAL PLANNED HOURS
     */

    const totalPlannedHours =
      formTasks.reduce(
        (sum, task) =>
          sum +
          (Number(
            task.allocated_hours
          ) || 0),
        0
      );

    const primaryTask =
      formTasks[0] || {};

    /*
     * CREATE PROJECT
     */

    const newProject: any = {
      id: `project_${Date.now()}`,

      customerName: cName,

      customer_name: cName,

      wbsNo: wbs,

      wbs_no: wbs,

      projectCode: pCode,

      project_code: pCode,

      location:
        formData.location ||
        primaryTask.location ||
        '',

      projectName: cName,

      project_name: cName,

      projectNumber: wbs,

      project_number: wbs,

      equipmentName:
        formData.equipmentName,

      equipmentWeight:
        formData.equipmentWeight,

      description:
        formData.description,

      startDate:
        formData.startDate,

      endDate:
        formData.endDate,

      projectManager:
        formData.projectManager,

      task:
        primaryTask.task_name ||
        'Welding',

      plannedHours:
        totalPlannedHours,

      total_planned_hours:
        totalPlannedHours,

      priority:
        formData.priority,

      status:
        formData.status,

      /*
       * TASK DATA
       */

      tasks: formTasks.map(
        (task) => ({
          task_name:
            task.task_name,

          task_code:
            String(task.task_name)
              .toLowerCase()
              .replace(/\s+/g, '_'),

          allocated_hours:
            Number(
              task.allocated_hours
            ) || 0,

          duration_months:
            Number(
              task.duration_months
            ) || 3,

          start_date:
            formData.startDate,

          location:
            task.location ||
            getDefaultLocationForTask(
              task.task_name
            ),

          smi:
            task.smi || '',

          labour_supply:
            task.labour_supply || '',

          job_contractor:
            task.job_contractor || '',
        })
      ),
    };

    /*
     * UPDATE LOCAL PROJECT LIST
     */

    const updatedProjects = [
      ...projects,
      newProject,
    ];

    setProjects(updatedProjects);

    /*
     * SAVE LOCAL STORAGE
     */

    localStorage.setItem(
      'sms_project_planning',
      JSON.stringify(
        updatedProjects
      )
    );

    /*
     * DJANGO API SYNC
     */

    try {
      fetch('/api/v1/projects/', {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',
        },

        body: JSON.stringify(
          newProject
        ),
      }).catch((e) =>
        console.warn(
          'Django API sync note:',
          e
        )
      );
    } catch (err) {
      console.warn(
        'API sync warning:',
        err
      );
    }

    /*
     * CALLBACK
     */

    if (onProjectCreated) {
      onProjectCreated(
        newProject
      );
    }

    /*
     * SUCCESS MESSAGE
     */

    setSaveMessage(
      'Project created & synchronized with Backend calculation engine successfully.'
    );

    resetForm();

    setTimeout(() => {
      setSaveMessage('');

      setShowForm(false);
    }, 1200);
  };

  return (
    <div
      style={{
        padding: '1.5rem',
        minHeight:
          'calc(100vh - 80px)',
      }}
    >
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div
        style={{
          display: 'flex',
          justifyContent:
            'space-between',
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
            Create and manage projects
            for capacity planning.
          </p>
        </div>

        <button
          onClick={() =>
            setShowForm(true)
          }
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background:
              'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
            color: '#ffffff',
            border: 'none',
            padding:
              '0.65rem 1.1rem',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow:
              '0 0 15px rgba(0, 210, 255, 0.25)',
          }}
        >
          <Plus size={18} />

          Add Project
        </button>
      </div>

      {/* =====================================================
          PROJECT FORM
      ====================================================== */}

      {showForm && (
        <div
          className="glass-panel"
          style={{
            padding: '1.5rem',
            marginBottom: '1.5rem',
            border:
              '1px solid rgba(0, 210, 255, 0.25)',
          }}
        >
          {/* FORM HEADER */}

          <div
            style={{
              display: 'flex',
              justifyContent:
                'space-between',
              alignItems: 'center',
              marginBottom: '1.25rem',
              paddingBottom: '1rem',
              borderBottom:
                '1px solid var(--border-color)',
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
                Enter the project
                information below.
              </p>
            </div>

            <button
              type="button"
              onClick={
                handleCancel
              }
              style={{
                background:
                  'rgba(255,255,255,0.05)',
                border:
                  '1px solid var(--border-color)',
                color:
                  'var(--text-muted)',
                borderRadius: '7px',
                padding: '0.4rem',
                cursor: 'pointer',
              }}
              title="Close"
            >
              <X size={18} />
            </button>
          </div>

          <form
            onSubmit={
              handleSubmit
            }
          >
            {/* =================================================
                ROW 1 - CUSTOMER NAME & LOCATION
            ================================================== */}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '1fr 1fr',
                gap: '1rem',
                marginBottom: '1rem',
              }}
            >
              {/* CUSTOMER NAME */}

              <div>
                <label className="project-form-label">
                  <User size={14} />

                  Customer Name *
                </label>

                <input
                  type="text"
                  name="customerName"
                  value={
                    formData.customerName
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="e.g. JSW Steels Ltd"
                  className="project-form-input"
                />
              </div>

              {/* PROJECT LOCATION */}

              <div>
                <label className="project-form-label">
                  <MapPin size={14} />

                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={
                    formData.location
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="e.g. Khordha, Odisha"
                  className="project-form-input"
                />
              </div>
            </div>

            {/* =================================================
                WBS & PROJECT CODE
            ================================================== */}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '1fr 1fr',
                gap: '1rem',
                marginBottom: '1rem',
              }}
            >
              {/* WBS */}

              <div>
                <label className="project-form-label">
                  <Hash size={14} />

                  WBS No. *
                </label>

                <input
                  type="text"
                  name="wbsNo"
                  value={
                    formData.wbsNo
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="e.g. WBS-2026-001"
                  className="project-form-input"
                />
              </div>

              {/* PROJECT CODE */}

              <div>
                <label className="project-form-label">
                  <Tag size={14} />

                  Project Code
                </label>

                <input
                  type="text"
                  name="projectCode"
                  value={
                    formData.projectCode
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="e.g. PRJ-2026-001"
                  className="project-form-input"
                />
              </div>
            </div>

            {/* =================================================
                EQUIPMENT
            ================================================== */}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '1fr 1fr',
                gap: '1rem',
                marginBottom: '1rem',
              }}
            >
              {/* EQUIPMENT NAME */}

              <div>
                <label className="project-form-label">
                  <Wrench size={14} />

                  Equipment Name
                </label>

                <input
                  type="text"
                  name="equipmentName"
                  value={
                    formData.equipmentName
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter equipment name"
                  className="project-form-input"
                />
              </div>

              {/* EQUIPMENT WEIGHT */}

              <div>
                <label className="project-form-label">
                  <Scale size={14} />

                  Equipment Weight
                  (in kg)
                </label>

                <input
                  type="number"
                  name="equipmentWeight"
                  value={
                    formData.equipmentWeight
                  }
                  onChange={
                    handleChange
                  }
                  min="0"
                  step="any"
                  placeholder="e.g. 15000"
                  className="project-form-input"
                />
              </div>
            </div>

            {/* =================================================
                DESCRIPTION
            ================================================== */}

            <div
              style={{
                marginBottom: '1rem',
              }}
            >
              <label className="project-form-label">
                <FileText size={14} />

                Project Description
              </label>

              <textarea
                name="description"
                value={
                  formData.description
                }
                onChange={
                  handleChange
                }
                placeholder="Enter project description"
                rows={4}
                className="project-form-input"
                style={{
                  resize: 'vertical',
                  minHeight: '90px',
                }}
              />
            </div>

            {/* =================================================
                DATES
            ================================================== */}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '1fr 1fr',
                gap: '1rem',
                marginBottom: '1rem',
              }}
            >
              {/* ZERO DATE */}

              <div>
                <label className="project-form-label">
                  <Calendar size={14} />

                  Zero Date *
                </label>

                <input
                  type="date"
                  name="startDate"
                  value={
                    formData.startDate
                  }
                  onChange={
                    handleChange
                  }
                  className="project-form-input"
                />
              </div>

              {/* CDD */}

              <div>
                <label className="project-form-label">
                  <Calendar size={14} />

                  CDD *
                </label>

                <input
                  type="date"
                  name="endDate"
                  value={
                    formData.endDate
                  }
                  onChange={
                    handleChange
                  }
                  className="project-form-input"
                />
              </div>
            </div>

            {/* =================================================
                PROJECT MANAGER
            ================================================== */}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '1fr 1fr',
                gap: '1rem',
                marginBottom: '1rem',
              }}
            >
              <div>
                <label className="project-form-label">
                  <User size={14} />

                  Project Manager *
                </label>

                <input
                  type="text"
                  name="projectManager"
                  value={
                    formData.projectManager
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter project manager name"
                  className="project-form-input"
                />
              </div>
            </div>

            {/* =================================================
                MULTI TASK BUILDER
            ================================================== */}

            <div
              style={{
                marginBottom: '1.5rem',
                padding: '1.25rem',
                background:
                  'rgba(0, 210, 255, 0.03)',
                border:
                  '1px solid rgba(0, 210, 255, 0.2)',
                borderRadius: '12px',
              }}
            >
              {/* TASK HEADER */}

              <div
                style={{
                  display: 'flex',
                  justifyContent:
                    'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  paddingBottom:
                    '0.75rem',
                  borderBottom:
                    '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div>
                  <h4
                    style={{
                      margin: 0,
                      color: '#ffffff',
                      fontSize:
                        '0.95rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems:
                        'center',
                      gap: '0.5rem',
                    }}
                  >
                    <FolderKanban
                      size={16}
                      color="var(--accent-cyan)"
                    />

                    Project Tasks (
                    {formTasks.length} / 5
                    Max)
                  </h4>

                  <p
                    style={{
                      margin:
                        '0.2rem 0 0',
                      color:
                        'var(--text-muted)',
                      fontSize:
                        '0.75rem',
                    }}
                  >
                    Add up to 5 tasks per
                    project from standard
                    categories: Welding,
                    Machining, Assembly,
                    Plating, RR.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    addFormTask
                  }
                  disabled={
                    formTasks.length >=
                    5
                  }
                  style={{
                    display:
                      'inline-flex',
                    alignItems:
                      'center',
                    gap: '0.4rem',
                    padding:
                      '0.45rem 0.85rem',
                    background:
                      formTasks.length >=
                      5
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(0,210,255,0.15)',
                    border:
                      '1px solid rgba(0,210,255,0.3)',
                    borderRadius: '7px',
                    color:
                      formTasks.length >=
                      5
                        ? 'var(--text-dim)'
                        : 'var(--accent-cyan)',
                    fontWeight: 700,
                    fontSize:
                      '0.78rem',
                    cursor:
                      formTasks.length >=
                      5
                        ? 'not-allowed'
                        : 'pointer',
                  }}
                >
                  <Plus size={15} />

                  Add Task (
                  {5 -
                    formTasks.length}{' '}
                  left)
                </button>
              </div>

              {/* =================================================
                  TASK LIST
              ================================================== */}

              <div
                style={{
                  display: 'flex',
                  flexDirection:
                    'column',
                  gap: '1rem',
                }}
              >
                {formTasks.map(
                  (
                    tItem,
                    tIdx
                  ) => {
                    /*
                     * Get location options for
                     * current task.
                     */

                    const locationOptions =
                      getLocationsForTask(
                        tItem.task_name
                      );

                    return (
                      <div
                        key={
                          tItem.id ||
                          tIdx
                        }
                        style={{
                          background:
                            'rgba(10, 16, 30, 0.7)',
                          border:
                            '1px solid rgba(255,255,255,0.1)',
                          borderRadius:
                            '10px',
                          padding:
                            '1rem',
                        }}
                      >
                        {/* TASK TITLE */}

                        <div
                          style={{
                            display:
                              'flex',
                            justifyContent:
                              'space-between',
                            alignItems:
                              'center',
                            marginBottom:
                              '0.75rem',
                          }}
                        >
                          <span
                            style={{
                              fontSize:
                                '0.78rem',
                              fontWeight:
                                800,
                              color:
                                'var(--accent-cyan)',
                            }}
                          >
                            Task #
                            {tIdx +
                              1}
                            :{' '}
                            {tItem.task_name ||
                              'Task'}
                          </span>

                          {formTasks.length >
                            1 && (
                            <button
                              type="button"
                              onClick={() =>
                                removeFormTask(
                                  tIdx
                                )
                              }
                              style={{
                                background:
                                  'rgba(239,68,68,0.12)',
                                border:
                                  '1px solid rgba(239,68,68,0.3)',
                                borderRadius:
                                  '6px',
                                color:
                                  '#f87171',
                                padding:
                                  '0.3rem 0.6rem',
                                cursor:
                                  'pointer',
                                fontSize:
                                  '0.72rem',
                                fontWeight:
                                  700,
                                display:
                                  'flex',
                                alignItems:
                                  'center',
                                gap:
                                  '0.3rem',
                              }}
                            >
                              <Trash2
                                size={
                                  13
                                }
                              />

                              Remove
                            </button>
                          )}
                        </div>

                        {/* =================================================
                            TASK TYPE / HOURS / DURATION / LOCATION
                        ================================================== */}

                        <div
                          style={{
                            display:
                              'grid',
                            gridTemplateColumns:
                              '1.5fr 1fr 1fr 1.2fr',
                            gap:
                              '0.75rem',
                            marginBottom:
                              '0.75rem',
                          }}
                        >
                          {/* TASK TYPE */}

                          <div>
                            <label className="project-form-label">
                              Task Type *
                            </label>

                            <select
                              value={
                                tItem.task_name
                              }
                              onChange={(
                                e
                              ) =>
                                handleTaskFieldChange(
                                  tIdx,
                                  'task_name',
                                  e.target
                                    .value
                                )
                              }
                              className="project-form-input"
                            >
                              <option value="Welding">
                                Welding
                              </option>

                              <option value="Machining">
                                Machining
                              </option>

                              <option value="Assembly">
                                Assembly
                              </option>

                              <option value="Plating">
                                Plating
                              </option>

                              <option value="RR">
                                RR
                              </option>
                            </select>
                          </div>

                          {/* ALLOCATED HOURS */}

                          <div>
                            <label className="project-form-label">
                              Allocated
                              Hours *
                            </label>

                            <input
                              type="number"
                              value={
                                tItem.allocated_hours
                              }
                              onChange={(
                                e
                              ) =>
                                handleTaskFieldChange(
                                  tIdx,
                                  'allocated_hours',
                                  e.target
                                    .value
                                )
                              }
                              min="1"
                              placeholder="e.g. 3000"
                              className="project-form-input"
                            />
                          </div>

                          {/* DURATION */}

                          <div>
                            <label className="project-form-label">
                              Duration
                              (Months) *
                            </label>

                            <input
                              type="number"
                              value={
                                tItem.duration_months
                              }
                              onChange={(
                                e
                              ) =>
                                handleTaskFieldChange(
                                  tIdx,
                                  'duration_months',
                                  e.target
                                    .value
                                )
                              }
                              min="1"
                              max="24"
                              placeholder="e.g. 3"
                              className="project-form-input"
                            />
                          </div>

                          {/* =================================================
                              LOCATION
                          ================================================== */}

                          <div>
                            <label className="project-form-label">
                              <MapPin
                                size={
                                  14
                                }
                              />

                              Location
                            </label>

                            <select
                              value={
                                tItem.location
                              }
                              onChange={(
                                e
                              ) =>
                                handleTaskFieldChange(
                                  tIdx,
                                  'location',
                                  e.target
                                    .value
                                )
                              }
                              className="project-form-input"
                            >
                              {locationOptions.map(
                                (
                                  location
                                ) => (
                                  <option
                                    key={
                                      location
                                    }
                                    value={
                                      location
                                    }
                                  >
                                    {
                                      location
                                    }
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                        </div>

                        {/* =================================================
                            OPTIONAL DETAILS
                        ================================================== */}

                        <div
                          style={{
                            display:
                              'grid',
                            gridTemplateColumns:
                              '1fr 1fr 1fr',
                            gap:
                              '0.75rem',
                          }}
                        >
                          {/* SMI */}

                          <div>
                            <label
                              className="project-form-label"
                              style={{
                                fontSize:
                                  '0.7rem',
                              }}
                            >
                              SMI
                              (Optional)
                            </label>

                            <input
                              type="text"
                              value={
                                tItem.smi
                              }
                              onChange={(
                                e
                              ) =>
                                handleTaskFieldChange(
                                  tIdx,
                                  'smi',
                                  e.target
                                    .value
                                )
                              }
                              placeholder="e.g. Internal"
                              className="project-form-input"
                            />
                          </div>

                          {/* LABOUR SUPPLY */}

                          <div>
                            <label
                              className="project-form-label"
                              style={{
                                fontSize:
                                  '0.7rem',
                              }}
                            >
                              Labour
                              Supply
                              (Optional)
                            </label>

                            <input
                              type="text"
                              value={
                                tItem.labour_supply
                              }
                              onChange={(
                                e
                              ) =>
                                handleTaskFieldChange(
                                  tIdx,
                                  'labour_supply',
                                  e.target
                                    .value
                                )
                              }
                              placeholder="e.g. Vendor A"
                              className="project-form-input"
                            />
                          </div>

                          {/* JOB CONTRACTOR */}

                          <div>
                            <label
                              className="project-form-label"
                              style={{
                                fontSize:
                                  '0.7rem',
                              }}
                            >
                              Job
                              Contractor
                              (Optional)
                            </label>

                            <input
                              type="text"
                              value={
                                tItem.job_contractor
                              }
                              onChange={(
                                e
                              ) =>
                                handleTaskFieldChange(
                                  tIdx,
                                  'job_contractor',
                                  e.target
                                    .value
                                )
                              }
                              placeholder="e.g. SMS Subcontractor"
                              className="project-form-input"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* =================================================
                TOTAL HOURS / PRIORITY / STATUS
            ================================================== */}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '1fr 1fr 1fr',
                gap: '1rem',
                marginBottom:
                  '1.25rem',
              }}
            >
              {/* TOTAL HOURS */}

              <div>
                <label className="project-form-label">
                  <Clock size={14} />

                  Total Project
                  Planned Hours
                </label>

                <div
                  style={{
                    padding:
                      '0.65rem 0.75rem',
                    background:
                      'rgba(0,210,255,0.08)',
                    border:
                      '1px solid rgba(0,210,255,0.25)',
                    borderRadius:
                      '7px',
                    color:
                      'var(--accent-cyan)',
                    fontWeight: 800,
                    fontSize:
                      '0.9rem',
                  }}
                >
                  {formTasks
                    .reduce(
                      (
                        sum,
                        task
                      ) =>
                        sum +
                        (Number(
                          task.allocated_hours
                        ) ||
                          0),
                      0
                    )
                    .toLocaleString()}{' '}
                  hrs
                </div>
              </div>

              {/* PRIORITY */}

              <div>
                <label className="project-form-label">
                  <Flag size={14} />

                  Priority
                </label>

                <select
                  name="priority"
                  value={
                    formData.priority
                  }
                  onChange={
                    handleChange
                  }
                  className="project-form-input"
                >
                  <option value="Low">
                    Low
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="High">
                    High
                  </option>

                  <option value="Critical">
                    Critical
                  </option>
                </select>
              </div>

              {/* STATUS */}

              <div>
                <label className="project-form-label">
                  <CircleCheck
                    size={14}
                  />

                  Status
                </label>

                <select
                  name="status"
                  value={
                    formData.status
                  }
                  onChange={
                    handleChange
                  }
                  className="project-form-input"
                >
                  <option value="Planned">
                    Planned
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="On Hold">
                    On Hold
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>
                </select>
              </div>
            </div>

            {/* =================================================
                MESSAGE
            ================================================== */}

            {saveMessage && (
              <div
                style={{
                  marginBottom:
                    '1rem',
                  padding:
                    '0.7rem 0.9rem',
                  borderRadius:
                    '7px',

                  background:
                    saveMessage.includes(
                      'successfully'
                    )
                      ? 'rgba(16,185,129,0.1)'
                      : 'rgba(239,68,68,0.1)',

                  border:
                    saveMessage.includes(
                      'successfully'
                    )
                      ? '1px solid rgba(16,185,129,0.25)'
                      : '1px solid rgba(239,68,68,0.25)',

                  color:
                    saveMessage.includes(
                      'successfully'
                    )
                      ? 'var(--accent-emerald)'
                      : '#f87171',

                  fontSize:
                    '0.8rem',

                  fontWeight: 600,
                }}
              >
                {saveMessage}
              </div>
            )}

            {/* =================================================
                FORM BUTTONS
            ================================================== */}

            <div
              style={{
                display: 'flex',
                justifyContent:
                  'flex-end',
                gap: '0.75rem',
              }}
            >
              {/* CANCEL */}

              <button
                type="button"
                onClick={
                  handleCancel
                }
                style={{
                  display:
                    'flex',
                  alignItems:
                    'center',
                  gap: '0.4rem',
                  background:
                    'rgba(255,255,255,0.05)',
                  border:
                    '1px solid var(--border-color)',
                  color:
                    'var(--text-muted)',
                  padding:
                    '0.55rem 1rem',
                  borderRadius:
                    '7px',
                  cursor:
                    'pointer',
                  fontWeight: 600,
                }}
              >
                <X size={16} />

                Cancel
              </button>

              {/* CREATE */}

              <button
                type="submit"
                style={{
                  display:
                    'flex',
                  alignItems:
                    'center',
                  gap: '0.4rem',
                  background:
                    'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
                  border: 'none',
                  color: '#ffffff',
                  padding:
                    '0.55rem 1rem',
                  borderRadius:
                    '7px',
                  cursor:
                    'pointer',
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

      {/* =====================================================
          EMPTY STATE
      ====================================================== */}

      {!showForm &&
        projects.length === 0 && (
          <div
            className="glass-panel"
            style={{
              padding: '3rem',
              textAlign:
                'center',
              border:
                '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <FolderKanban
              size={45}
              color="var(--accent-cyan)"
              style={{
                marginBottom:
                  '1rem',
              }}
            />

            <h3
              style={{
                color:
                  '#ffffff',
                marginBottom:
                  '0.5rem',
              }}
            >
              No Projects Created
            </h3>

            <p
              style={{
                color:
                  'var(--text-muted)',
                fontSize:
                  '0.85rem',
                marginBottom:
                  '1.25rem',
              }}
            >
              Click{' '}
              <strong>
                Add Project
              </strong>{' '}
              to create your
              first project.
            </p>

            <button
              onClick={() =>
                setShowForm(
                  true
                )
              }
              style={{
                display:
                  'inline-flex',
                alignItems:
                  'center',
                gap: '0.4rem',
                background:
                  'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
                border: 'none',
                color:
                  '#ffffff',
                padding:
                  '0.6rem 1rem',
                borderRadius:
                  '7px',
                cursor:
                  'pointer',
                fontWeight: 700,
              }}
            >
              <Plus size={17} />

              Add Project
            </button>
          </div>
        )}

      {/* =====================================================
          PROJECT TABLE
      ====================================================== */}

      {projects.length > 0 && (
        <div
          className="glass-panel"
          style={{
            padding: '1.25rem',
            border:
              '1px solid rgba(255,255,255,0.08)',
            overflowX:
              'auto',
          }}
        >
          <div
            style={{
              display:
                'flex',
              justifyContent:
                'space-between',
              alignItems:
                'center',
              marginBottom:
                '1rem',
            }}
          >
            <div>
              <h3
                style={{
                  color:
                    '#ffffff',
                  margin: 0,
                  fontSize:
                    '1rem',
                }}
              >
                Projects
              </h3>

              <span
                style={{
                  color:
                    'var(--text-muted)',
                  fontSize:
                    '0.7rem',
                }}
              >
                {projects.length}{' '}
                project
                {projects.length !==
                1
                  ? 's'
                  : ''}
              </span>
            </div>
          </div>

          <table
            style={{
              width:
                '100%',
              borderCollapse:
                'collapse',
              fontSize:
                '0.8rem',
            }}
          >
            <thead>
              <tr
                style={{
                  background:
                    'rgba(255,255,255,0.04)',
                  color:
                    'var(--text-muted)',
                }}
              >
                <th
                  style={
                    tableHeaderStyle
                  }
                >
                  Customer Name
                </th>

                <th
                  style={
                    tableHeaderStyle
                  }
                >
                  WBS No.
                </th>

                <th
                  style={
                    tableHeaderStyle
                  }
                >
                  Project Code
                </th>

                <th
                  style={
                    tableHeaderStyle
                  }
                >
                  Equipment
                </th>

                <th
                  style={
                    tableHeaderStyle
                  }
                >
                  Weight (kg)
                </th>

                <th
                  style={
                    tableHeaderStyle
                  }
                >
                  Manager
                </th>

                <th
                  style={
                    tableHeaderStyle
                  }
                >
                  Task
                </th>

                <th
                  style={
                    tableHeaderStyle
                  }
                >
                  Location
                </th>

                <th
                  style={
                    tableHeaderStyle
                  }
                >
                  SMI
                </th>

                <th
                  style={
                    tableHeaderStyle
                  }
                >
                  Labour Supply
                </th>

                <th
                  style={
                    tableHeaderStyle
                  }
                >
                  Job Contractor
                </th>

                <th
                  style={
                    tableHeaderStyle
                  }
                >
                  Zero Date / CDD
                </th>

                <th
                  style={
                    tableHeaderStyle
                  }
                >
                  Hours
                </th>

                <th
                  style={
                    tableHeaderStyle
                  }
                >
                  Priority
                </th>

                <th
                  style={
                    tableHeaderStyle
                  }
                >
                  Status
                </th>

                <th
                  style={
                    tableHeaderStyle
                  }
                >
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {projects.map(
                (
                  project: any
                ) => {
                  const cName =
                    project.customer_name ||
                    project.customerName ||
                    project.project_name ||
                    project.projectName ||
                    '—';

                  const wbs =
                    project.wbs_no ||
                    project.wbsNo ||
                    project.project_number ||
                    project.projectNumber ||
                    '—';

                  const pCode =
                    project.project_code ||
                    project.projectCode ||
                    '—';

                  return (
                    <tr
                      key={
                        project.id
                      }
                      style={{
                        borderBottom:
                          '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      {/* CUSTOMER */}

                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        <strong
                          style={{
                            color:
                              '#ffffff',
                          }}
                        >
                          {cName}
                        </strong>

                        {project.description && (
                          <div
                            style={{
                              color:
                                'var(--text-dim)',
                              fontSize:
                                '0.68rem',
                              marginTop:
                                '0.2rem',
                              maxWidth:
                                '250px',
                            }}
                          >
                            {
                              project.description
                            }
                          </div>
                        )}
                      </td>

                      {/* WBS */}

                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        <span
                          style={{
                            color:
                              'var(--accent-cyan)',
                            fontWeight:
                              700,
                          }}
                        >
                          {wbs}
                        </span>
                      </td>

                      {/* PROJECT CODE */}

                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        {pCode}
                      </td>

                      {/* EQUIPMENT */}

                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        {project.equipmentName ||
                          '—'}
                      </td>

                      {/* WEIGHT */}

                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        {project.equipmentWeight
                          ? `${Number(
                              project.equipmentWeight
                            ).toLocaleString()} kg`
                          : '—'}
                      </td>

                      {/* MANAGER */}

                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        {project.projectManager ||
                          '—'}
                      </td>

                      {/* TASK */}

                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        {project.task ||
                          '—'}
                      </td>

                      {/* LOCATION */}

                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        {project.location ||
                          '—'}
                      </td>

                      {/* SMI */}

                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        {project.smi ||
                          '—'}
                      </td>

                      {/* LABOUR SUPPLY */}

                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        {project.labourSupply ||
                          '—'}
                      </td>

                      {/* JOB CONTRACTOR */}

                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        {project.jobContractor ||
                          '—'}
                      </td>

                      {/* DATES */}

                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        <div>
                          <span
                            style={{
                              color:
                                'var(--text-dim)',
                              fontSize:
                                '0.7rem',
                            }}
                          >
                            Zero:{' '}
                          </span>

                          {project.startDate ||
                            '—'}
                        </div>

                        <div>
                          <span
                            style={{
                              color:
                                'var(--text-dim)',
                              fontSize:
                                '0.7rem',
                            }}
                          >
                            CDD:{' '}
                          </span>

                          {project.endDate ||
                            '—'}
                        </div>
                      </td>

                      {/* HOURS */}

                      <td
                        style={{
                          ...tableCellStyle,
                          color:
                            'var(--accent-cyan)',
                          fontWeight:
                            700,
                        }}
                      >
                        {Number(
                          project.plannedHours ||
                            0
                        ).toLocaleString()}
                      </td>

                      {/* PRIORITY */}

                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        <span
                          style={{
                            padding:
                              '0.25rem 0.5rem',
                            borderRadius:
                              '5px',
                            background:
                              'rgba(0,210,255,0.08)',
                            color:
                              'var(--accent-cyan)',
                            fontWeight:
                              700,
                            fontSize:
                              '0.7rem',
                          }}
                        >
                          {project.priority ||
                            '—'}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        {project.status ||
                          '—'}
                      </td>

                      {/* ACTION */}

                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        <button
                          onClick={() => {
                            setSelectedProject(
                              project
                            );

                            setIsModalOpen(
                              true
                            );
                          }}
                          style={{
                            display:
                              'inline-flex',
                            alignItems:
                              'center',
                            gap:
                              '0.3rem',
                            padding:
                              '0.35rem 0.65rem',
                            background:
                              'rgba(0,210,255,0.12)',
                            border:
                              '1px solid rgba(0,210,255,0.3)',
                            borderRadius:
                              '6px',
                            color:
                              'var(--accent-cyan)',
                            fontWeight:
                              700,
                            fontSize:
                              '0.72rem',
                            cursor:
                              'pointer',
                            whiteSpace:
                              'nowrap',
                          }}
                        >
                          <Edit
                            size={
                              13
                            }
                          />

                          View / Edit
                        </button>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* =====================================================
          PROJECT DETAILS / EDIT MODAL
      ====================================================== */}

      <ProjectDetailsModal
        project={
          selectedProject
        }
        isOpen={
          isModalOpen
        }
        onClose={() =>
          setIsModalOpen(
            false
          )
        }
        onProjectUpdated={
          loadProjects
        }
      />
    </div>
  );
};

/* ============================================================
   TABLE STYLES
============================================================ */

const tableHeaderStyle: React.CSSProperties =
  {
    padding: '0.75rem',
    textAlign: 'left',
    fontWeight: 700,
    whiteSpace: 'nowrap',
  };

const tableCellStyle: React.CSSProperties =
  {
    padding: '0.75rem',
    color: 'var(--text-main)',
    verticalAlign: 'top',
  };