export interface Task {
  id                     ?: number;
  project_id             ?: number;
  kanban_task_id         ?: number;
  title                  ?: string | null;
  due_date               ?: string | null;
  description            ?: string;
  assignees              ?: number[];
  created_by             ?: string;
  updated_by             ?: string;
  avatar                 ?: string;
  status                 ?: number | boolean;
  checklists             ?: Checklist[];
  new_kanban_list_id     ?: number;
  kanban_list_id         ?: number;
  kanban_board_id        ?: number;
  sort_position_list     ?: SortPositionInListParam[];
  sort_new_position_list ?: SortPositionInListParam[];
}

export interface SortPositionInListParam {
  id : number;
  position_in_list: number;
}

export interface SortPositionInBoardParam {
  id : number;
  position_in_board: number;
}

export interface Pagination {
  current_page: number;
  total_row   : number;
  row_per_page: number;
}

export interface ColumnBoard {
  kanban_list_id   ?: number;
  kanban_list_name : string;
  kanban_tasks: Task[];
}

export interface KanbanBoard{
  id   : number;
  name : string;
}

export interface Checklist {
  name          : string;
  status        : boolean;
  isEnableEdit ?: boolean;
}
