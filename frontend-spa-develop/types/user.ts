export interface LoginForm {
  organization_id   : number;
  email             : string;
  password          : string;
  organization_name : string;
}

export interface ForgotPasswordParam {
  organization_id   : number;
  email             : string;
}

export interface ResetPasswordParams {
  user_id             : number;
  email               : string;
  organization_id     : number;
  reset_password_code : string;
  password            : string;
}

export interface ResetPasswordResponse {
  organization_id   : number;
  organization_name : string;
  organization_tag  : string;
  user_id           : number;
}

export interface ChangePasswordParams {
  current_password    : string;
  new_password        : string;
  repeat_new_password : string;
}

export interface ChangeEmailParams {
  user_id             : number;
  email               : string;
  organization_id     : number;
  change_email_code   : string;
}
