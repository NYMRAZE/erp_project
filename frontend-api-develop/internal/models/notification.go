package models

import (
	cm "gitlab.****************.vn/micro_erp/frontend-api/internal/common"
	"time"
)

type Notification struct {
	cm.BaseModel

	tableName      struct{} `sql:"alias:ntf"`
	OrganizationId int
	Sender         int
	Receiver       int
	Content        string
	DatetimeSeen   time.Time
	RedirectUrl    string
	Status         int
}
