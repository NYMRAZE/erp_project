package models

import (
	cm "gitlab.****************.vn/micro_erp/frontend-api/internal/common"
)

type Cv struct {
	cm.BaseModel

	RecruitmentId int
	MediaId       int
	FileName      string
	Status        int
}
