package models

import cm "gitlab.****************.vn/micro_erp/frontend-api/internal/common"

type KanbanList struct {
	cm.BaseModel

	tableName       struct{} `sql:"alias:kl"`
	Name            string
	KanbanBoardId   int
	PositionInBoard int
}
