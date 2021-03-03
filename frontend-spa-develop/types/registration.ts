export interface RegistrationSubmit {
  email   : string;
  status  : string;
  message : string;
}

export interface OrganizationSubmit {
  name                : string;
  tag                 : string;
  registration_code   : string;
  status              : string;
}

export interface OrganizationRegister {
  organization_name  : string;
  organization_tag   : string;
  request_id         : number;
  email              : string;
  code               : string;
  first_name         : string;
  last_name          : string;
  password           : string;
}

export interface UserRequest {
  email           : string;
  organizationID  : number;
  message         : string;
}
