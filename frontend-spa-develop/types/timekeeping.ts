export interface TimekeepingListSubmit {
  user_id      : number | null;
  branch       : number;
  from_date    : string | null;
  to_date      : string | null;
  current_page : number;
}

export interface Pagination {
  current_page: number;
  total_row   : number;
  row_per_page: number;
}

export interface TimekeepingsTable {
  id        : number;
  name      : string;
  email     : string;
  branch    : number;
  check_in  : Date;
  check_out : Date;
}
