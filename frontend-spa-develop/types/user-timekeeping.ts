export interface Timekeeping {
  time_server    : string;
  check_in_time  : string;
  check_out_time : string;
}

export interface TimekeepingItem {
  check_in_time  : string;
  check_out_time : string;
}

export interface SeachTimekeepingUserSubmit {
  date_from     : string;
  date_to       : string;
  current_page  : number;
}

export interface Pagination {
  current_page: number;
  total_row:    number;
  row_per_page: number;
}

export interface TimekeepingListSubmit {
  user_name    : string;
  branch_id    : number;
  date_from    : string | null;
  date_to      : string | null;
  current_page : number;
}

export interface TimekeepingsTable {
  user_name      : string;
  branch    : number;
  check_in  : Date;
  check_out : Date;
}
