export interface TableManageRequest {
  id                : number;
  email             : string;
  type              : number;
  type_name         : string;
  status            : number;
  status_name       : string;
  message           : string;
  allow_resend      : boolean;
}

export interface ManageRequestSubmit {
  email           : string;
  type            : number | '';
  status          : number | '';
  date_from       : Date | null;
  date_to         : Date | null;
  current_page    : number;
}

export interface Pagination {
  current_page: number;
  total_row:    number;
  row_perpage:  number;
}

export interface UpdateRequestStatusSubmit {
  request_id      : number;
  status_request  : number;
}
export interface ManageRequest {
  id                : number;
  email             : string;
  type_request      : number;
  name_type_request : string;
  message           : string;
  time_request      : string;
  status            : number;
  name_status       : string;
  total_row         : number;
}

export interface XLSXInviteEmail {
  Email: string;
}
