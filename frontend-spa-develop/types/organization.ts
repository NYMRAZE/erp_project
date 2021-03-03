export interface Organization {
  id    : number;
  tag   : string;
  name  : string;
}

export interface OrganizationSetting {
  email: string;
  password: string;
  expiration_reset_day_off: number;
}
