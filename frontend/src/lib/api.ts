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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function fetchPlanningVersions(): Promise<PlanningVersion[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/versions/`);
    if (!res.ok) throw new Error('Failed to fetch planning versions');
    return await res.json();
  } catch (error) {
    console.warn('API connection offline, using fallback state:', error);
    return [];
  }
}

export async function fetchLatestPlanningVersion(): Promise<PlanningVersion | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/versions/latest/`);
    if (!res.ok) throw new Error('Failed to fetch latest version');
    return await res.json();
  } catch (error) {
    console.warn('API connection offline, using fallback state:', error);
    return null;
  }
}

export async function fetchBenchmarks(): Promise<BenchmarkItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/benchmarks/`);
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

  const res = await fetch(`${API_BASE_URL}/versions/upload_planning/`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Spreadsheet upload failed');
  }

  return await res.json();
}
