export interface OvertimeRequest {
  id           : number | null;
  users_id     : number[];
  project_id   : number | null;
  status       : number | null;
  branch       : number | null;
  overtime_type: number;
  date_from    : string;
  date_to      : string;
  current_page : number;
  row_per_page : number;
}

export interface Pagination {
  current_page : number;
  total_row    : number;
  row_per_page : number;
}

export interface CreateOvertimeParams {
  user_id                 : number;
  project_id              : number;
  status                  : number;
  datetime_overtime_from  : string;
  datetime_overtime_to    : string;
  email_title             : string;
  email_content           : string;
  send_to                 : string[];
  send_cc                 : string[];
  reason                  : string;
  overtime_type           : number;
  isShow                  : boolean;
  users_id_notification   : number[];
  work_at_noon            : number;
}

export interface OvertimeWeight {
  normal_day_weight : number;
  weekend_weight    : number;
  holiday_weight    : number;
}
