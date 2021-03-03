package models

import (
	cm "gitlab.****************.vn/micro_erp/frontend-api/internal/common"
	"time"
)

type Recruitment struct {
	cm.BaseModel

	OrganizationId int
	JobName        string
	Description    string
	StartDate      time.Time
	ExpiryDate     time.Time
	BranchIds      []int `pg:",array"`
	Assignees      []int `pg:",array"`
}
