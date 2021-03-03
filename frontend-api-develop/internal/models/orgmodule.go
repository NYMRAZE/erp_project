package models

import cm "gitlab.****************.vn/micro_erp/frontend-api/internal/common"

type OrganizationModule struct {
	cm.BaseModel

	TableName      struct{} `sql:"alias:orgm"`
	OrganizationId int
	ModuleId       int
}
