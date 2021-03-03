import { DisplayLanguage, LanguageProfileInterface } from '~/types/language';

// common const
const UrlSuffix = '.erp.**************.vn';
const LanguageList : DisplayLanguage[] = [
  {
    id          : 1,
    code        : 'en',
    name        : 'English',
    class_flag  : 'flag-us'
  },
  {
    id          : 2,
    code        : 'ja',
    name        : '日本語',
    class_flag  : 'flag-ja'
  },
  {
    id          : 3,
    code        : 'vi',
    name        : 'Tiếng Việt',
    class_flag  : 'flag-vi'
  }
];

const JpLanguageProfiles: LanguageProfileInterface[] = [
  { id: 1, name: 'JLPT-N1' },
  { id: 2, name: 'JLPT-N2' },
  { id: 3, name: 'JLPT-N3' },
  { id: 4, name: 'JLPT-N4' },
  { id: 5, name: 'JLPT-N5' }
];

export {
  UrlSuffix,
  LanguageList,
  JpLanguageProfiles
};

// pagination
const RowPerStatisticPage = 7;

export {
  RowPerStatisticPage
};

export function getOrganizationInUrl(): string {
  let urlString = window.location.hostname;
  urlString = urlString.replace('https://', '')
    .replace('http://', '')
    .replace('www.', '');
  return urlString.substring(0, urlString.lastIndexOf(UrlSuffix));
}

// notification status
const NotificationStatusUnread = 1;
const NotificationStatusRead   = 2;
const NotificationStatusSeen   = 3;

const ORGANIZATIONEMAILSETTING = 1;
const BRANCHSETTING = 2;
const JOBTITLESETTING = 3;
const TECHNOLOGYSETTING = 4;
const OVERTIMESETTING = 5;
const FINISHSETTING = 6;

export {
  NotificationStatusUnread,
  NotificationStatusRead,
  NotificationStatusSeen,
  ORGANIZATIONEMAILSETTING,
  BRANCHSETTING,
  JOBTITLESETTING,
  TECHNOLOGYSETTING,
  OVERTIMESETTING,
  FINISHSETTING
};

const RECRUITMENT = 0;
const SURVEY = 1;
const REQUEST = 2;
const TODOLIST = 3;

export {
  RECRUITMENT,
  SURVEY,
  REQUEST,
  TODOLIST
};

const MODULES_CONST = {
  'HRM': 1,
  'EVALUATION': 2,
  'WORKFLOW': 3,
  'RECRUITMENT': 4,
  'REQUEST': 5
};

const MODULES_NAME_CONST = {
  1: 'Module HRM',
  2: 'Module Evaluation',
  3: 'Module Workflow',
  4: 'Module Recruitment',
  5: 'Module Request'
};

const FUNCTIONS_NAME_CONST = {
  1: 'Bonus leave history',
  2: 'Create leave request',
  3: 'Edit account',
  4: 'Manage member leave',
  5: 'Day off information',
  6: 'Manage leave request',
  7: 'Manage request',
  8: 'Profile list',
  9: 'Manage timekeeping',
  10: 'User timekeeping',
  11: 'Edit profile',
  12: 'Leave for someone',
  13: 'View profile',
  14: 'Create evaluation user',
  15: 'Evaluation list',
  16: 'Edit evaluation user',
  17: 'View evaluation user',
  18: 'Board',
  19: 'Create project',
  20: 'Project board',
  21: 'Project list',
  22: 'Project Participate',
  23: 'Edit project',
  24: 'View project',
  25: 'Create recruitment',
  26: 'Manage CV',
  27: 'Manage recruitment',
  28: 'Edit recruitment',
  29: 'View recruitment',
  30: 'Create overtime',
  31: 'Manage overtime',
  32: 'View overtime request'
};

const FUNCTIONS_CONST = {
  // HRM
  HRM_BONUS_LEAVE_HISTORY: 1,
  HRM_CREATE_LEAVE_REQUEST: 2,
  HRM_EDIT_ACCOUNT: 3,
  HRM_HISTORY_USER_LEAVE: 4,
  HRM_MANAGE_DAY_LEAVE: 5,
  HRM_MANAGE_LEAVE_REQUEST: 6,
  HRM_MANAGE_REQUEST: 7,
  HRM_PROFILE_LIST: 8,
  HRM_TIMEKEEPING_LIST: 9,
  HRM_USER_TIMEKEEPING: 10,
  HRM_EDIT_PROFILE_ID: 11,
  HRM_LEAVE_FOR_SOMEONE_ID: 12,
  HRM_VIEW_PROFILE_ID: 13,
  // EVALUATION
  EVALUATION_CREATE_EVAL_USER: 14,
  EVALUATION_EVALUATION_LIST: 15,
  EVALUATION_EDIT_EVAL_USER_ID: 16,
  EVALUATION_VIEW_EVAL_USER_ID: 17,
  // WORKFLOW
  WORKFLOW_BOARD: 18,
  WORKFLOW_CREATE_PROJECT: 19,
  WORKFLOW_PROJECT_BOARD: 20,
  WORKFLOW_PROJECT_LIST: 21,
  WORKFLOW_PROJECT_PARTICIPATE: 22,
  WORKFLOW_EDIT_PROJECT_ID: 23,
  WORKFLOW_VIEW_PROJECT_ID: 24,
  // RECRUITMENT
  RECRUITMENT_CREATE_RECRUITMENT: 25,
  RECRUITMENT_MANAGE_CV: 26,
  RECRUITMENT_MANAGE_RECRUITMENT: 27,
  RECRUITMENT_EDIT_RECRUITMENT_ID: 28,
  RECRUITMENT_VIEW_RECRUITMENT_ID: 29,
  // REQUEST
  REQUEST_CREATE_OVERTIME: 30,
  REQUEST_MANAGE_OVERTIME: 31,
  REQUEST_VIEW_OVERTIME_REQUEST_ID: 32
};

const PERMISSION_STATUS = {
  1: true,
  2: false
};

export {
  MODULES_CONST,
  MODULES_NAME_CONST,
  FUNCTIONS_NAME_CONST,
  FUNCTIONS_CONST,
  PERMISSION_STATUS
};
