export interface Project {
  project_id    : number;
  name          : string | null;
  description   : string | null;
  targets       : TargetProject[] | [];
  managed_by    : number | null;
}

export interface TargetProject {
  year         : number | null;
  quarter      : number | null;
  content      : string | null;
  isShow      ?: boolean;
  isEnableEdit?: boolean;
}

export interface EditTargetProject {
  index   : number | null;
  year    : number | null;
  quarter : number | null;
  content : string | null;
}

export interface PaginationTargetProject {
  current_page  : number;
  total_rows    : number;
  per_page      : number;
  limit_page    : number;
}

export interface ProjectTable {
  project_id           : number;
  project_name         : string;
  managed_by           : number;
  project_description  ?: string;
  project_targets      ?: TargetProject[] | [];
  created_at           ?: string;
  updated_at           ?: number;
  joined_at            ?: string;
}

export interface ProjectSubmit {
  keyword      : string;
  current_page : number;
  row_per_page : number | null;
}

export interface Pagination {
  current_page: number;
  total_row:    number;
  row_per_page:  number;
}

export interface CreateProjectSubmit {
  project_name        : string;
  managed_by          : number | null;
  project_description : string;
}

export interface UserProject {
  id         ?: number;
  user_id    : number;
  project_id ?: number;
  date_joined?: string;
}

export interface UserBranch {
  user_id : number;
  branch  : number;
}
