package models

import (
	cm "gitlab.****************.vn/micro_erp/frontend-api/internal/common"
)

// UserRankLog : struct for db table user_rank_logs
type UserRankLog struct {
	cm.BaseModel

	UserID int
	Rank   int
}
