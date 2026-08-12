export interface DepartmentData {
  capacityHours?: number[];
  loadHours?: number[];
  ordersCount?: number[];
  groupCompany?: number[];
  contractMfg?: number[];
  laborSupply?: number[];
  millingLoad?: number[];
  latheLoad?: number[];
  refurbLoad?: number[];
  platingLoad?: number[];
  serviceLoad?: number[];
  loi?: number[];
  smi?: number[];
  serviceBasic?: number[];
}

export interface PlanningVersion {
  id: number;
  version_id: string;
  month_name: string;
  horizon: string;
  upload_date: string;
  uploaded_by: string;
  status: string;
  file_name: string;
  file_size: string;
  processing_time_ms: number;
  months: string[];
  departments: Record<string, DepartmentData>;
  chart_urls?: Record<string, string>;
  validation_warnings: string[];
}

export interface BenchmarkItem {
  id: number;
  department: string;
  name: string;
  target_utilization: number;
  max_threshold: number;
  historical_baseline: number;
  description: string;
}

export interface AuthUser {
  username: string;
  name?: string;
  email: string;
  role: 'administrator' | 'user';
  is_superuser: boolean;
  is_staff: boolean;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: AuthUser;
}

export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  return 'http://127.0.0.1:8000/api/v1';
}

export function getChartUrl(url: string | undefined): string {
  if (!url) return '';

  if (url.startsWith('http://localhost:8000')) {
    return url.replace('http://localhost:8000', '');
  }

  return url;
}

export async function fetchPlanningVersions(): Promise<PlanningVersion[]> {
  try {
    const apiBase = getApiBaseUrl();
    const res = await fetch(`${apiBase}/versions/`);
    if (!res.ok) throw new Error('Failed to fetch planning versions');
    return await res.json();
  } catch (error) {
    console.warn('API connection offline, using fallback state:', error);
    return [];
  }
}

export async function fetchLatestPlanningVersion(): Promise<PlanningVersion | null> {
  try {
    const apiBase = getApiBaseUrl();
    const res = await fetch(`${apiBase}/versions/latest/`);
    if (!res.ok) throw new Error('Failed to fetch latest version');
    return await res.json();
  } catch (error) {
    console.warn('API connection offline, using fallback state:', error);
    return null;
  }
}

export async function fetchBenchmarks(): Promise<BenchmarkItem[]> {
  try {
    const apiBase = getApiBaseUrl();
    const res = await fetch(`${apiBase}/benchmarks/`);
    if (!res.ok) throw new Error('Failed to fetch benchmarks');
    return await res.json();
  } catch (error) {
    console.warn('API connection offline, using fallback state:', error);
    return [];
  }
}

export async function uploadPlanningSpreadsheet(file: File): Promise<PlanningVersion> {
  const formData = new FormData();
  formData.append('file', file);

  const apiBase = getApiBaseUrl();
  const res = await fetch(`${apiBase}/versions/upload_planning/`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Spreadsheet upload failed');
  }

  return await res.json();
}

export async function loginUser(
  username: string,
  password: string,
  loginType: 'administrator' | 'user'
): Promise<AuthResponse> {
  const apiBase = getApiBaseUrl();

  const res = await fetch(`${apiBase}/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username.trim(),
      password,
      role: loginType,
      login_type: loginType,
    }),
  });

  let data: any;

  try {
    data = await res.json();
  } catch {
    throw new Error(
      'Backend returned an invalid response. Please make sure Django is running.'
    );
  }

  if (!res.ok) {
    throw new Error(data.error || 'Invalid username or password');
  }

  if (!data.access || !data.refresh || !data.user) {
    throw new Error('Invalid login response from backend');
  }

  const backendUser = data.user;

  const role: 'administrator' | 'user' =
    backendUser.role ||
    (backendUser.is_superuser ? 'administrator' : 'user');

  return {
    user: {
      username: backendUser.username,
      name: backendUser.name || backendUser.username,
      email: backendUser.email || '',
      role,
      is_superuser: Boolean(backendUser.is_superuser),
      is_staff: Boolean(backendUser.is_staff),
    },
    access: data.access,
    refresh: data.refresh,
  };
}


export interface CalculatedTaskItem {
  id: string;
  name: string;
  category: string;
  monthly_hours: number;
  daily_hours: number;
  days_in_month: number;
  share_pct: number;
}

export interface MonthlyCalculation {
  month: string;
  month_num: number;
  days_in_month: number;
  monthly_available_hours: number;
  daily_available_hours: number;
  tasks: CalculatedTaskItem[];
}

export interface ManualCalculationResponse {
  status: string;
  inputs: {
    annual_hours: number;
    year: number;
    is_leap_year: boolean;
    total_days_in_year: number;
    daily_available_hours: number;
    total_tasks_count: number;
  };
  monthly_calculations: MonthlyCalculation[];
}

export async function calculateManualPlanning(
  annualHours: number, 
  year: number = 2026, 
  tasks: Array<{ id: string; name: string; category?: string; hours: number }>
): Promise<ManualCalculationResponse | null> {
  try {
    const apiBase = getApiBaseUrl();
    const res = await fetch(`${apiBase}/versions/calculate_manual_planning/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ annual_hours: annualHours, year, tasks })
    });
    if (!res.ok) throw new Error('Failed to compute manual planning calculations');
    return await res.json();
  } catch (err) {
    console.warn('API error computing manual planning, fallback to local math:', err);
    return null;
  }
}

export async function fetchManualConfig(): Promise<{ year: number; tasks: any[] } | null> {
  try {
    const apiBase = getApiBaseUrl();
    const res = await fetch(`${apiBase}/versions/get_manual_config/`);
    if (!res.ok) throw new Error('Failed to fetch manual config');
    return await res.json();
  } catch (err) {
    console.warn('API error fetching manual config:', err);
    return null;
  }
}

export async function saveManualConfig(year: number, tasks: any[]): Promise<boolean> {
  try {
    const apiBase = getApiBaseUrl();
    const res = await fetch(`${apiBase}/versions/save_manual_config/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ year, tasks })
    });
    return res.ok;
  } catch (err) {
    console.warn('API error saving manual config:', err);
    return false;
  }
}

export interface ProjectTaskMonthlyDistribution {
  id?: number;
  month_index: number;
  month_label: string;
  date?: string;
  hours: number;
  percentage: number;
}

export interface ProjectTask {
  id?: number;
  task_name: string;
  task_code: string;
  allocated_hours: number;
  duration_months: number;
  start_date?: string;
  location?: string;
  smi?: string;
  labour_supply?: string;
  job_contractor?: string;
  monthly_distributions?: ProjectTaskMonthlyDistribution[];
}

export interface BackendProject {
  id?: number;
  customer_name?: string;
  wbs_no?: string;
  project_code?: string;
  location?: string;
  project_name: string;
  project_number: string;
  equipment_name?: string;
  equipment_weight?: string;
  description?: string;
  zero_date?: string;
  cdd?: string;
  project_manager?: string;
  total_planned_hours: number;
  priority: string;
  status: string;
  tasks?: ProjectTask[];
  created_at?: string;
  updated_at?: string;
}

export interface WeldingPreviewResponse {
  status: string;
  task_name: string;
  allocated_hours: number;
  duration_months: number;
  start_date: string;
  rule_applied: string;
  monthly_breakdown: ProjectTaskMonthlyDistribution[];
}

export async function fetchBackendProjects(): Promise<BackendProject[]> {
  try {
    const apiBase = getApiBaseUrl();
    const res = await fetch(`${apiBase}/projects/`);
    if (!res.ok) throw new Error('Failed to fetch backend projects');
    return await res.json();
  } catch (err) {
    console.warn('API error fetching backend projects:', err);
    return [];
  }
}

export async function previewWeldingCalculation(
  allocatedHours: number,
  durationMonths: number,
  startDate: string = "2026-08-01"
): Promise<WeldingPreviewResponse | null> {
  try {
    const apiBase = getApiBaseUrl();
    const res = await fetch(`${apiBase}/projects/preview_welding_calculation/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        allocated_hours: allocatedHours,
        duration_months: durationMonths,
        start_date: startDate
      })
    });
    if (!res.ok) throw new Error('Failed previewing welding calculation');
    return await res.json();
  } catch (err) {
    console.warn('API error previewing welding calculation:', err);
    return null;
  }
}

export async function updateBackendProject(id: number | string, data: any): Promise<BackendProject | null> {

  try {
    const apiBase = getApiBaseUrl();
    const res = await fetch(`${apiBase}/projects/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed updating backend project');
    return await res.json();
  } catch (err) {
    console.warn('API error updating project:', err);
    return null;
  }
}


