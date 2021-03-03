package repository

import (
	param "gitlab.****************.vn/micro_erp/frontend-api/internal/interfaces/requestparams"
	m "gitlab.****************.vn/micro_erp/frontend-api/internal/models"
)

type AssetRepository interface {
	SelectAssetList(organizationID int, params *param.GetAssetListParams) ([]param.AssetListRecord, int, error)
	InsertAssetType(organizationID int, params *param.CreateAssetTypeParams) error
	SelectAssetLog(organizationID int, params *param.GetAssetLogParams) ([]param.AssetLogRecord, int, error)
	InsertAssetRequest(
		organizationID int,
		params *param.CreateRequestAssetParams,
		notificationRepo NotificationRepository,
		userRepo UserRepository,
		uniqueUsersID []int) (string, string, error)
	CreateAsset(organizationID int, params *param.CreateAssetParams) (m.Asset, error)
}
