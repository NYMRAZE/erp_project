package models

import (
	cm "gitlab.****************.vn/micro_erp/frontend-api/internal/common"
)

type CvComment struct {
	cm.BaseModel

	CvId      int
	CreatedBy int
	Comment   string
}
