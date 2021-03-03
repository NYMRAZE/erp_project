export interface EvaluationListSubmit {
  user_ids     : number[];
  name         : string;
  quarter      : number;
  year         : number;
  branch       : number;
  rank         : number;
  status       : number;
  current_page : number;
  project_id   : number;
}

export interface Pagination {
  current_page: number;
  total_row:    number;
  row_per_page: number;
}

export interface EvaluationTable {
  id              : number;
  name            : string;
  updated_by_name : string;
  quarter         : string;
  year            : string;
  branch          : number;
  status          : number;
  last_updated    : number;
  updated_by      : number;
  avatar          : string;
}

export interface ExportEvaluationExcel {
  buf: any;
  file_name: string;
}
