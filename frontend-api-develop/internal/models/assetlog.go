package models

import (
	cm "gitlab.****************.vn/micro_erp/frontend-api/internal/common"
	"time"
)

type AssetLog struct {
	cm.BaseModel
	tableName            struct{} `sql:"alias:asset_logs"`
	AssetId              int
	UserId               int
	StartDayUsing        time.Time
	EndDayUsing          time.Time
}
