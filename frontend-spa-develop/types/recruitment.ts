export interface RecruitmentParams {
  id            ?: number;
  job_name      ?: string | null;
  description   ?: string | null;
  start_date    : string | null;
  expiry_date   : string | null;
  branch_ids    : number[];
  assignees     : number[];
}

export interface RecruitmentSearchParams {
  job_name    : string;
  start_date  : string;
  expiry_date : string;
  branch_id   : number;
  current_page  ?: number;
  row_per_page  ?: number;
}
export interface CreateCvParam {
  recruitment_id  ?: number;
  cv_fields: CV[];
  assignees: number[];
}
export interface CV {
  id        ?: number;
  media_id  ?: number | null;
  file_name : string | null;
  content   : string;
  status    ?: number;
  comment   ?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CVComments {
  id         : number;
  comment    : string;
  created_by : number;
  created_at : string;
  updated_at : string;
  isEdit    ?: boolean;
}

export interface Pagination {
  current_page : number;
  total_row : number;
  row_per_page : number;
}

export interface CVStatistic {
  cv_status: number;
  amount: number;
}
