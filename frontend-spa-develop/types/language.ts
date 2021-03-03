export interface DisplayLanguage {
  id:         number;
  code:       string;
  name:       string;
  class_flag: string;
}

export interface LanguageSettingParams {
  user_id:     number;
  language_id: number;
}

export interface LanguageProfileInterface {
  id: number;
  name: string;
}
