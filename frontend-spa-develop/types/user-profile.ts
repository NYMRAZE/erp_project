export interface ProfileListSubmit {
  name         : string;
  email        : string;
  phone        : string;
  rank         : string | '';
  branch       : string | '';
  date_from    : string;
  date_to      : string;
  current_page : number;
}

export interface ProfileListPagination {
  current_page: number;
  total_row:    number;
  row_perpage:  number;
}

export interface ProfileDetailSubmit {
  request_id      : number;
  status_request  : number;
}

export interface ProfileListTable {
  id                  : number;
  first_name          : string;
  last_name           : string;
  email               : string;
  branch              : string;
  role                : string;
  company_joined_date : string;
  avatar              : string | null;
}

export interface ProfileListSearchParams {
  name         : string;
  email        : string;
  date_from    : Date | null;
  date_to      : Date | null;
  rank         : number | 0;
  branch       : number | 0;
  current_page : number;
}

export interface UserProfile {
  user_id                 : number;
  avatar                  : string;
  first_name              : string;
  last_name               : string;
  email                   : string;
  phone_number            : string;
  birthday                : string | null;
  role_id                 : number;
  role_name               : string;
  job_title               : number;
  job_title_name          : string;
  rank                    : number;
  rank_name               : string;
  company_joined_date     : string | null;
  employee_id             : string;
  skill                   : Skill[] | [];
  language                : Language[] | [];
  education               : Education[] | [];
  certificate             : Certificate[] | [];
  award                   : Award[] | [];
  experience              : Experience[] | [];
  interest_technology     : InterestTechnology[] | [];
  introduce               : string;
  branch                  : number;
  branch_name             : string;
  flag_edit_avatar        : boolean;
  flag_edit_basic_profile : boolean;
  flag_edit_skill         : boolean;
  flag_edit_language      : boolean;
  flag_edit_education     : boolean;
  flag_edit_certificate   : boolean;
  flag_edit_award         : boolean;
  flag_edit_experience    : boolean;
  flag_edit_introduce     : boolean;
  flag_edit_interest_technology : boolean;
}

export interface FormEditBasicInfo {
  avatar                : string;
  flag_edit_avatar      : boolean;
  first_name            : string;
  last_name             : string;
  email                 : string;
  phone_number          : string;
  birthday              : string | null;
  role_id               : number;
  job_title             : number;
  rank                  : number;
  company_joined_date   : string | null;
  branch                : number;
  employee_id           : string;
}

export interface Skill {
  title : string;
  level : number | null;
  years_of_experience: number | null;
}

export interface Language {
  language_id : number | null;
  level_id : number | null;
  certificate : string;
}

export interface Education {
  title : string;
  university : string;
  achievement : string;
  start_date : string | null;
  end_date : string | null;
}

export interface Certificate {
  title       : string;
  description : string;
}

export interface Award {
  title       : string;
  description : string;
}

export interface Experience {
  company  : string;
  projects : Project[];
}

export interface Project {
  start_date : string;
  end_date   : string;
  project    : string;
  position   : string;
  technology : string;
}

export interface InterestTechnology {
  id: number | null;
  technology_name: string;
}

export interface RankListItem {
  id: number;
  name: string;
}

export interface BranchListItem {
  id: number;
  name: string;
}

export interface JobTitleListItem {
  id: number;
  name: string;
}

export interface LanguageListItem {
  id: number;
  name: string;
}

export interface LevelLanguageListItem {
  id: number;
  name: string;
}

export interface TechnologyListItem {
  id: number;
  name: string;
}

export interface UserTechnology {
  user_id: number;
  technology_id: number | null;
}

export interface RemoveTechnologyParams {
  user_id: number;
  id: number | null;
}
