export interface UserRankLog {
  created_at: string;
  rank      : number;
}

export interface NumberPeopleBranch {
  branch: number;
  amount: number;
}

export interface NumberPeopleProject {
  project_name: string;
  amount      : number;
}

export interface NumberPeopleJobTitle {
  job_title: string;
  amount   : number;
}

export interface NumberPeopleJapaneseLevel {
  certificate: string;
  amount     : number;
}

export interface NumberPeopleInterestTechnology {
  technology: string;
  amount    : number;
}

export interface EvaluationRank {
  datetime: string[];
  datasets: Dataset[];
}

interface Dataset {
  rank: string;
  data: number[];
}

export interface EvaluationRankDatasets {
  label          : string;
  backgroundColor: string;
  data           : object[];
}

export interface StatisticPagination {
  current_page : number;
  row_per_page : number;
  total_row    : number;
}

export interface TechnologyStatistic {
  technology     : string;
  current_page   : number;
  row_per_page   : number;
}

export interface TechnologyStatisticDetail {
  user_id            : number;
  full_name          : string;
  job_title          : string;
  branch             : string;
  birthday           : string;
  company_joined_date: string;
}

export interface JobTitleStatistic {
  job_title      : string;
  current_page   : number;
  row_per_page   : number;
}

export interface JobTitleStatisticDetail {
  user_id            : number;
  full_name          : string;
  branch             : string;
  birthday           : string;
  company_joined_date: string;
}

export interface BranchStatistic {
  branch         : string;
  current_page   : number;
  row_per_page   : number;
}

export interface BranchStatisticDetail {
  user_id            : number;
  full_name          : string;
  job_title          : string;
  birthday           : string;
  company_joined_date: string;
}

export interface JpLevelStatistic {
  certificate    : string;
  current_page   : number;
  row_per_page   : number;
}

export interface JpLevelStatisticDetail {
  user_id            : number;
  full_name          : string;
  job_title          : string;
  birthday           : string;
  company_joined_date: string;
}

export interface CommentStatisticParams {
  quarter            : number;
  year               : number;
  last_quarter       : number;
  last_year          : number;
}

export interface CommentStatisticDetail {
  user_id: number;
  full_name: string;
  rank: string;
  score: number;
  comment: string;
  last_rank: string;
  last_score: number;
  last_comment: string;
  isShow: boolean;
  avatar: string;
}
