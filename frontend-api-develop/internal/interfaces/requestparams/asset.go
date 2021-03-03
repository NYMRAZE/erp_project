package requestparams

import "time"

// GetAssetListParams struct for receive param from frontend
type GetAssetListParams struct {
	AssetName   string `json:"asset_name"`
	AssetCode   string `json:"asset_code"`
	BranchID    int    `json:"branch_id"`
	UserName    string `json:"user_name"`
	Status      int    `json:"status"`
	CurrentPage int    `json:"current_page"`
	RowPerPage  int    `json:"row_per_page"`
}

// AssetListRecord struct for receive param from frontend
type AssetListRecord struct {
	ID                  int       `json:"id"`
	AssetName           string    `json:"asset_name"`
	AssetCode           string    `json:"asset_code"`
	AssetType           string    `json:"asset_type"`
	BranchID            int       `json:"branch_id"`
	UserID              int       `json:"user_id"`
	Status              int       `json:"status"`
	Description         string    `json:"description"`
	DateStartedUse      time.Time `json:"date_started_use"`
	LicenseEndDate      time.Time `json:"license_end_date"`
	DateOfPurchase      time.Time `json:"date_of_purchase"`
	PurchasePrice       int       `json:"purchase_price"`
	ManagedBy           int       `json:"managed_by"`
	DepreciationPeriod  int       `json:"depreciation_period"`
}

// CreateAssetTypeParams struct for receive param from frontend
type CreateAssetTypeParams struct {
	Name string `json:"name" valid:"required"`
}

// GetAssetLogParams struct for receive param from frontend
type GetAssetLogParams struct {
	AssetName   string `json:"asset_name"`
	AssetCode   string `json:"asset_code"`
	BranchID    int    `json:"branch_id"`
	UserName    string `json:"user_name"`
	Status      int    `json:"status"`
	CurrentPage int    `json:"current_page"`
	RowPerPage  int    `json:"row_per_page"`
}

// AssetLogRecord struct for receive param from frontend
type AssetLogRecord struct {
	AssetId       int       `json:"asset_id"`
	AssetName     string    `json:"asset_name"`
	AssetCode     string    `json:"asset_code"`
	BranchID      int       `json:"branch_id"`
	UserID        int       `json:"user_id"`
	FirstName     string    `json:"first_name"`
	LastName      string    `json:"last_name"`
	Status        int       `json:"status"`
	StartDayUsing time.Time `json:"start_day_using"`
	EndDayUsing   time.Time `json:"end_day_using"`
}

// CreateRequestAccessParams struct for receive param from frontend
type CreateRequestAssetParams struct {
	AssetId int `json:"asset_id"`
	UserID  int `json:"user_id"`
}

type CreateAssetParams struct {
	AssetTypeId         int    `json:"asset_type_id" valid:"required"`
	UserId              int    `json:"user_id"`
	BrandId             int    `json:"branch_id" valid:"required"`
	AssetCode           string `json:"asset_code" valid:"required"`
	AssetName           string `json:"asset_name" valid:"required"`
	ManageBy            int    `json:"manage_by" valid:"required"`
	Status              int    `json:"status" valid:"required"`
	Description         string `json:"description"`
	PurchasePrice       int    `json:"purchase_price"`
	DepreciationPeriod  int    `json:"depreciation_period"`
	DateOfPurchase      string `json:"date_of_purchase"`
	LicenseEndDate      string `json:"license_end_date"`
	DateStartedUse      string `json:"date_started_use"`
}
