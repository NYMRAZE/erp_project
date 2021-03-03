export interface LeaveRequestItem {
  datetime_leave_from   : string;
  datetime_leave_to     : string | null;
  email                 : string;
  avatar                : string;
  full_name             : string;
  email_content         : string;
  leave_request_type_id : number;
  reason                : string;
  user_id               : number;
  id                    : number;
  isShow                : boolean;
}

export interface Pagination {
  current_page: number;
  total_row   : number;
  row_per_page: number;
}
