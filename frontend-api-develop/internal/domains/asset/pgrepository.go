package asset

import (
	"strconv"

	"github.com/go-pg/pg/v9"
	"github.com/labstack/echo/v4"
	cf "gitlab.****************.vn/micro_erp/frontend-api/configs"
	cm "gitlab.****************.vn/micro_erp/frontend-api/internal/common"
	rp "gitlab.****************.vn/micro_erp/frontend-api/internal/interfaces/repository"
	param "gitlab.****************.vn/micro_erp/frontend-api/internal/interfaces/requestparams"
	m "gitlab.****************.vn/micro_erp/frontend-api/internal/models"
	"gitlab.****************.vn/micro_erp/frontend-api/internal/platform/utils/calendar"
)

type PgAssetRepository struct {
	cm.AppRepository
}

func NewPgAssetRepository(logger echo.Logger) (repo *PgAssetRepository) {
	repo = &PgAssetRepository{}
	repo.Init(logger)
	return
}

func (repo *PgAssetRepository) SelectAssetList(organizationId int, getAssetListParams *param.GetAssetListParams) ([]param.AssetListRecord, int, error) {
	var records []param.AssetListRecord
	q := repo.DB.Model(&m.Asset{})

	q.Column("asset.id", "asset.asset_name", "asset.asset_code", "asset.branch_id", "asset.user_id", "asset.status",
	"asset.description", "asset.date_started_use", "asset.license_end_date",
	"asset.purchase_price", "asset.managed_by", "asset.date_of_purchase", "asset.depreciation_period").
	ColumnExpr("ast.name as asset_type").
	Join("JOIN asset_types as ast on asset.asset_type_id = ast.id").
	Join("FULL OUTER JOIN user_profiles as up on up.user_id = asset.user_id").
	Where("asset.organization_id = ?", organizationId)

	if getAssetListParams.AssetName != "" {
		q.Where("LOWER(asset.asset_name) LIKE LOWER(?)", "%"+getAssetListParams.AssetName+"%")
	}

	if getAssetListParams.AssetCode != "" {
		q.Where("LOWER(asset.asset_code) LIKE LOWER(?)", "%"+getAssetListParams.AssetCode+"%")
	}

	if getAssetListParams.BranchID != 0 {
		q.Where("asset.branch_id = ?", getAssetListParams.BranchID)
	}

	if getAssetListParams.UserName != "" {
		userName := "%" + getAssetListParams.UserName + "%"
		q.Where("vietnamese_unaccent(LOWER(up.first_name)) || ' ' || vietnamese_unaccent(LOWER(up.last_name)) "+
			"LIKE vietnamese_unaccent(LOWER(?0))",
			userName)
	}

	if getAssetListParams.Status != 0 {
		q.Where("asset.status = ?", getAssetListParams.Status)
	}

	q.Offset((getAssetListParams.CurrentPage - 1) * getAssetListParams.RowPerPage).
		Order("asset.created_at DESC").
		Limit(getAssetListParams.RowPerPage)

	totalRow, err := q.SelectAndCount(&records)

	if err != nil {
		repo.Logger.Errorf("%+v", err)
	}

	return records, totalRow, err
}

func (repo *PgAssetRepository) InsertAssetType(
	organizationId int,
	params *param.CreateAssetTypeParams,
) error {
	assetType := m.AssetType{
		Name:           params.Name,
		OrganizationID: organizationId,
	}

	err := repo.DB.Insert(&assetType)
	if err != nil {
		repo.Logger.Error(err)
	}

	return err
}

func (repo *PgAssetRepository) SelectAssetLog(OrgID int, getAssetLogParams *param.GetAssetLogParams) ([]param.AssetLogRecord, int, error) {
	var records []param.AssetLogRecord
	q := repo.DB.Model(&m.AssetLog{})

	q.Column("asset_logs.asset_id", "asset_logs.user_id", "asset_logs.start_day_using", "asset_logs.end_day_using", "assets.asset_name", "assets.asset_code", "assets.status", "assets.branch_id", "up.first_name", "up.last_name").
		Join("JOIN user_profiles AS up on up.user_id = asset_logs.user_id").
		Join("JOIN assets on assets.id = asset_logs.asset_id").
		Where("asset_logs.organization_id = ?", OrgID)

	if getAssetLogParams.AssetName != "" {
		q.Where("LOWER(assets.asset_name) LIKE LOWER(?)", "%"+getAssetLogParams.AssetName+"%")
	}

	if getAssetLogParams.AssetCode != "" {
		q.Where("LOWER(assets.asset_code) LIKE LOWER(?)", "%"+getAssetLogParams.AssetCode+"%")
	}

	if getAssetLogParams.BranchID != 0 {
		q.Where("assets.branch_id = ?", getAssetLogParams.BranchID)
	}

	if getAssetLogParams.UserName != "" {
		userName := "%" + getAssetLogParams.UserName + "%"
		q.Where("vietnamese_unaccent(LOWER(up.first_name)) || ' ' || vietnamese_unaccent(LOWER(up.last_name)) "+
			"LIKE vietnamese_unaccent(LOWER(?0))",
			userName)
	}

	if getAssetLogParams.Status != 0 {
		q.Where("assets.status = ?", getAssetLogParams.Status)
	}

	q.Offset((getAssetLogParams.CurrentPage - 1) * getAssetLogParams.RowPerPage).
		Order("asset_logs.created_at DESC").
		Limit(getAssetLogParams.RowPerPage)

	totalRow, err := q.SelectAndCount(&records)

	return records, totalRow, err
}

func (repo *PgAssetRepository) InsertAssetRequest(
	organizationId int,
	createRequestAssetParams *param.CreateRequestAssetParams,
	notificationRepo rp.NotificationRepository,
	userRepo rp.UserRepository,
	uniqueUsersID []int,
) (string, string, error) {
	var body string
	var link string
	err := repo.DB.RunInTransaction(func(tx *pg.Tx) error {
		var transErr error
		userAssetRequest := m.UserAssetRequest{
			OrganizationID: organizationId,
			CreatedBy:      createRequestAssetParams.UserID,
			AssetID:        createRequestAssetParams.AssetId,
			Status:         3,
		}

		transErr = tx.Insert(&userAssetRequest)
		if transErr != nil {
			return transErr
		}

		notificationParams := new(param.InsertNotificationParam)
		notificationParams.Content = "has just created a asset request"
		notificationParams.RedirectUrl = "/request/manage-request-asset?id=" + strconv.Itoa(userAssetRequest.ID)

		for _, userID := range uniqueUsersID {
			if userID == createRequestAssetParams.UserID {
				continue
			}
			notificationParams.Receiver = userID
			transErr = notificationRepo.InsertNotificationWithTx(tx, organizationId, createRequestAssetParams.UserID, notificationParams)
			if transErr != nil {
				return transErr
			}
		}

		body = notificationParams.Content
		link = notificationParams.RedirectUrl

		return transErr
	})

	return body, link, err
}

func (repo *PgAssetRepository) CreateAsset(orgID int, createAssetParams *param.CreateAssetParams) (m.Asset, error) {
	asset := m.Asset{
		OrganizationId: orgID,
		UserId: createAssetParams.UserId,
		AssetTypeId: createAssetParams.AssetTypeId,
		BranchId: createAssetParams.BrandId,
		ManagedBy: createAssetParams.ManageBy,
		AssetName: createAssetParams.AssetName,
		AssetCode: createAssetParams.AssetCode,
		Description: createAssetParams.Description,
		Status: createAssetParams.Status,
		PurchasePrice: createAssetParams.PurchasePrice,
		DepreciationPeriod: createAssetParams.DepreciationPeriod,
		DateOfPurchase: calendar.ParseTime(cf.FormatDateDatabase, createAssetParams.DateOfPurchase),
		LicenseEndDate: calendar.ParseTime(cf.FormatDateDatabase, createAssetParams.LicenseEndDate),
		DateStartedUse: calendar.ParseTime(cf.FormatDateDatabase, createAssetParams.DateStartedUse),
	}

	err := repo.DB.Insert(&asset)

	if err != nil {
		repo.Logger.Error(err)
	}
	return asset, err
}
