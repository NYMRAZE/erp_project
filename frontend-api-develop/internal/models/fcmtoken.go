package models

import (
	cm "gitlab.****************.vn/micro_erp/frontend-api/internal/common"
)

type FcmToken struct {
	cm.BaseModel

	tableName struct{} `sql:"alias:fcmt"`
	UserId    int
	Token     string
}
