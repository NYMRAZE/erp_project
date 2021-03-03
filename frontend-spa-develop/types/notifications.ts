export interface AppNotification {
  id   : number;
  sender : number;
  content: string;
  status: number;
  redirect_url: string;
}

export interface Pagination {
  current_page: number;
  total_row: number;
  row_per_page: number;
}
