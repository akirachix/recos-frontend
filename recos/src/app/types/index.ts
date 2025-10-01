
export interface Job {
  job_id: number;
  company: number;
  company_name: string;
  company_id: number;
  job_title: string;
  job_description: string;
  generated_job_summary: string | null;
  state: string;
  posted_at: string;
  expired_at: string;
  created_at: string;
  applicants?: number;
  ai_shortlisted?: number;
  status?: string;
}
export interface Candidate {
  candidate_id: number;
  job: number;
  job_title: string;
  company_name: string;
  odoo_candidate_id: number;
  name: string;
  email: string;
  phone: string;
  generated_skill_summary: string | null;
  state: string;
  partner_id: number;
  date_open: string | null;
  date_last_stage_update: string | null;
  created_at: string;
  updated_at: string;
}
export interface Interview {
  candidate_id: number;
  candidate_name: string;
  scheduled_at: string;
  status: string;
  is_upcoming: boolean;
  created_at: string;
}
export interface DashboardMetrics {
  totalCandidates: number;
  openPositions: number;
  avgHiringCycle: number;
  completedInterviews: number;
}
export interface PositionSummary {
  name: string;
  value: number;
}
export interface CandidateSummary {
  total: number;
  reviewed: number;
  pending: number;
}
export interface InterviewItem {
  id: number;
  position: string;
  candidate: string;
  time: string;
  date: string;
}
export interface Company {
  company_id: number;
  company_name: string;
}