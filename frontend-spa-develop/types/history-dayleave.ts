export interface SearchParams {
  id: number;
  user_id: number;
  user_name: string;
  datetime_leave_from: string;
  datetime_leave_to: string;
  subtract_day_off_type_id: number;
  current_page: number;
  date_of_week: string[];
}

export interface LeaveHistory {
  leave_dates: string[];
  leave_request_type_id: number;
  subtract_day_off_type_id: number;
}

export interface UserLeave {
  first_name          : string;
  last_name           : string;
  avatar              : string;
  leave_request_list  : LeaveRequest;
}

export interface LeaveRequest {
  leave_request_type_id      : number;
  subtract_day_off_type_id  : number;
  date_time_leave_from      : string;
  date_time_leave_to        : string;
}

export interface Pagination {
  current_page: number;
  total_row:    number;
  row_per_page: number;
}
