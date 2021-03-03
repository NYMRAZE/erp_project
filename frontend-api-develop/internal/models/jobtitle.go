package models

import cm "gitlab.****************.vn/micro_erp/frontend-api/internal/common"

type JobTitle struct {
	cm.BaseModel

	tableName      struct{}
	Name           string
	OrganizationId int
	Priority       int
}
