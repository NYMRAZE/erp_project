package models

import cm "gitlab.****************.vn/micro_erp/frontend-api/internal/common"

type KanbanBoard struct {
	cm.BaseModel

	tableName struct{} `sql:"alias:kb"`
	Name      string
	ProjectId int
}