package models

import cm "gitlab.****************.vn/micro_erp/frontend-api/internal/common"

type UserPermission struct {
	cm.BaseModel

	TableName      struct{} `sql:"alias:up"`
	OrganizationId int
	UserID		   int
	FunctionID     int
	Status         int
}
