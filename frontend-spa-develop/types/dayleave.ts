export interface LeaveInfo {
  day_bonus              : number;
  holidays               : string[];
  day_remaining          : number;
  day_used               : number;
  leave_bonus_types      : Map<string, string> | null;
  leave_request_types    : Map<string, string> | null;
  day_remaining_previous : number;
  user_info              : UserInfo;
}

export interface DayLeaveRequest {
  user_id                  : number;
  leave_request_type_id    : number | null;
  date_from                : Date | null;
  date_to                  : Date | null;
  from_timeh_leave         : number | null;
  from_timem_leave         : string | null;
  to_timeh_leave           : number | null;
  to_timem_leave           : string | null;
  datetime_leave_from      : string;
  datetime_leave_to        : string;
  email_title              : string;
  email_content            : string;
  reason                   : string | undefined;
  isShow                   : boolean;
  subtract_day_off_type_id : number;
  extra_time               : number | null;
}

export interface LeaveBonus {
  user_id            ?: number;
  leave_bonus_type_id : number | null;
  hour                : number;
  reason              : string;
  year_belong         : number;
  isShow             ?: boolean;
}

export interface LeaveRequestParams {
  user_name             : string;
  leave_request_type_id : number;
  branch                : number;
  datetime_leave_from   : string;
  datetime_leave_to     : string;
  current_page          : number;
}

export interface AllUserName {
  user_name             : string;
  branch                : number;
  current_page          : number;
}

export interface OtherType {
  type                  : string;
  value                 : number;
}

export interface LeaveBonusesResponse {
  id               : number;
  user_id          : number;
  full_name        : string;
  created_by       : string;
  reason           : string;
  year             : number;
  hour             : number;
  leave_bonus_type : string;
  created_at       : string;
}

export interface LeaveBonusParam {
  full_name           : string;
  leave_bonus_type_id : number;
  year                : number;
  current_page        : number;
  row_per_page        : number;
  is_deleted          : boolean;
}

export interface UserInfo {
  email        : string;
  phone_number : string;
  full_name    : string;
  avatar       : string | null;
}
