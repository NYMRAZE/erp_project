package models

import (
	"time"

	cm "gitlab.****************.vn/micro_erp/frontend-api/internal/common"
)

// UserTimekeeping : struct for db table user_timekeepings
type UserTimekeeping struct {
	cm.BaseModel

	tableName      struct{} `sql:"alias:utk"`
	UserID         int
	OrganizationID int
	CheckInTime    time.Time
	CheckOutTime   time.Time
}
