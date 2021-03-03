package repository

import (
	param "gitlab.****************.vn/micro_erp/frontend-api/internal/interfaces/requestparams"
	// m "gitlab.****************.vn/micro_erp/frontend-api/internal/models"
)

type AdminRepository interface {
	InsertOrgModule(organizationId int, moudleId int) error
	SelectFunctionsOrg(organizationId int) ([]param.FunctionRecord, error)
	InsertUserPermission(organizationId int, userID int, functionId int, status int) error
}
