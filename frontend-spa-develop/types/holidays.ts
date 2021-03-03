export interface Pagination {
  current_page : number;
  total_row    : number;
  row_per_page : number;
}

export interface Holiday {
  id              : number;
  holiday_date    : string;
  description     : string;
  organization_id : number;
}
