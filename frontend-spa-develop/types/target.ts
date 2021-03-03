export interface Common {
  value           : string;
  numeric         : number | null;
  actual_eval     : number | null;
  completion_rate : number | null;
  points          : number | null;
  weight          : number | null;
}

export interface Individual {
  weight           : number | null;
  item             : string | null;
  goal             : number | null;
  actual_eval      : number | null;
  completion_rate  : number | null;
  points           : number | null;
  placeholder      : string | null;
}

export interface Project {
  id              : number | null;
  action          : string | null;
  self_assessment : number | null;
  superior_eval   : number | null;
  points          : number | null;
  weight          : number | null;
}

export interface Challenge {
  name            : string;
  actions         : string;
  self_assessment : number | null;
  superior_eval   : number | null;
  points          : number | null;
  weight          : number | null;
}

export interface Comment {
  self_cmt      : string;
  superior_cmt  : string;
}

export interface Result {
  total_actual_eval : number;
  completion_rate   : number;
  points            : number;
  weight            : number;
  rank              : number;
}

export interface TargetContent {
  common      : Common;
  individuals : Individual[];
  projects    : Project[];
  challenges  : Challenge[];
  comment     : Comment;
  result      : Result;
}

export interface Target {
  id: number;
  content: TargetContent;
  quarter: number;
  year: number;
  status: number;
  user_id: number;
}
