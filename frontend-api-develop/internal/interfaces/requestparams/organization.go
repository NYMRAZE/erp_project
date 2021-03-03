package requestparams

// CheckOrganizationParams struct for receive param from frontend
type CheckOrganizationParams struct {
	OrganizationTag  string `json:"organization_tag" form:"organization_tag" validate:"required,alphanum"`
	OrganizationName string `json:"organization_name" form:"organization_name" validate:"required"`
}

// BaseRegisterParams struct for receive param from frontend
type BaseRegisterParams struct {
	Email     string `json:"email" form:"email" validate:"required,email"`
	Code      string `json:"code" form:"code" validate:"required"`
	FirstName string `json:"first_name" form:"first_name" validate:"required"`
	LastName  string `json:"last_name" form:"last_name" validate:"required"`
	Password  string `json:"password" form:"password" validate:"required"`
	GoogleID  string `json:"google_id"`
}

// RegisterOrganizationParams struct for receive param from frontend
type RegisterOrganizationParams struct {
	BaseRegisterParams

	OrganizationTag  string `json:"organization_tag" form:"organization_tag" validate:"required,alphanum"`
	OrganizationName string `json:"organization_name" form:"organization_name" validate:"required"`
}

// RegisterInviteLinkParams struct for receive param from frontend
type RegisterInviteLinkParams struct {
	BaseRegisterParams

	RequestID int `json:"request_id" form:"requestID" validate:"required,numberic"`
}

type EmailForOrganizationParams struct {
	Email     string `json:"email" valid:"required"`
	Password  string `json:"password" valid:"required"`
	EmailTest string `json:"email_test" valid:"required"`
}

type EditExpirationResetDayOffParam struct {
	Expiration int `json:"expiration" valid:"required"`
}
