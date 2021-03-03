package repository

import (
	"github.com/go-pg/pg/v9"
	param "gitlab.****************.vn/micro_erp/frontend-api/internal/interfaces/requestparams"
	m "gitlab.****************.vn/micro_erp/frontend-api/internal/models"
)

// OrgRepository interface
type OrgRepository interface {
	FindOrganizationByTag(tag string) (m.Organization, error)
	GetOrganizationByID(id int) (m.Organization, error)
	SaveOrganization(userRepo UserRepository, regCodeRepo RegCodeRepository, registerOrganizationParams *param.RegisterOrganizationParams) (m.Organization, string, error)
	SaveInviteRegister(userRepo UserRepository, regCodeRepo RegCodeRepository, requestRepo RegistRequestRepository, registerInviteLinkParams *param.RegisterInviteLinkParams) (m.RegistrationRequest, error)
	InsertOrganizationWithTx(tx *pg.Tx, organizationName string, organizationTag string) (m.Organization, error)
	UpdateEmailForOrganization(organizationId int, emailForOrganizationParams *param.EmailForOrganizationParams, settingStep int) error
	SelectEmailAndPassword(Id int) (m.Organization, error)
	UpdateSettingStepWithTx(tx *pg.Tx, Id int, step int) error
	UpdateExpirationResetDayOff(id int, expiration int) error
}
