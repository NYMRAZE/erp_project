export interface UserAndPermissions {
  id        : number;
  email     : string;
  roldID    : number;
  avatar    : string;
  firstName : string;
  lastName  : string;
}

export interface FunctionPermission {
  function_id : number;
  status      : number;
}

export interface Pagination {
  current_page: number;
  total_row: number;
  row_per_page: number;
}
