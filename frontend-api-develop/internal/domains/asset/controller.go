package asset

import (
	"math"
	"net/http"
	"time"

	valid "github.com/asaskevich/govalidator"
	"github.com/go-pg/pg/v9"
	"github.com/labstack/echo/v4"
	cf "gitlab.****************.vn/micro_erp/frontend-api/configs"
	cm "gitlab.****************.vn/micro_erp/frontend-api/internal/common"
	rp "gitlab.****************.vn/micro_erp/frontend-api/internal/interfaces/repository"
	param "gitlab.****************.vn/micro_erp/frontend-api/internal/interfaces/requestparams"
	m "gitlab.****************.vn/micro_erp/frontend-api/internal/models"
	afb "gitlab.****************.vn/micro_erp/frontend-api/internal/platform/appfirebase"
)

type Controller struct {
	cm.BaseController
	afb.FirebaseCloudMessage

	assetRepository  rp.AssetRepository
	UserRepo         rp.UserRepository
	BranchRepo       rp.BranchRepository
	NotificationRepo rp.NotificationRepository
	FcmTokenRepo     rp.FcmTokenRepository
}

func NewAssetController(logger echo.Logger, assetRepository rp.AssetRepository, userRepo rp.UserRepository,
	branchRepo rp.BranchRepository, notificationRepo rp.NotificationRepository, fcmTokenRepo rp.FcmTokenRepository) (ctr *Controller) {
	ctr = &Controller{cm.BaseController{}, afb.FirebaseCloudMessage{}, assetRepository,
		userRepo, branchRepo, notificationRepo, fcmTokenRepo}
	ctr.Init(logger)
	return
}

func (ctr *Controller) GetAssetList(c echo.Context) error {
	getAssetListParams := new(param.GetAssetListParams)

	if err := c.Bind(getAssetListParams); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid Params",
			Data:    err,
		})
	}

	_, err := valid.ValidateStruct(getAssetListParams)
	if err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid field value",
		})
	}

	userProfile := c.Get("user_profile").(m.User)
	assetRecords, totalRow, err := ctr.assetRepository.SelectAssetList(
		userProfile.OrganizationID,
		getAssetListParams,
	)

	if err != nil && err.Error() != pg.ErrNoRows.Error() {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
			Data:    err,
		})
	}

	var assetList []map[string]interface{}
	var dateStartedUse string
	var depreciationEndDate string
	var depreciationRates float64 = 0
	var licenseEndDate string

	for _, record := range assetRecords {
		if (record.DateStartedUse.Format(cf.FormatDateDisplay) == "0001/01/01"){
			dateStartedUse = ""
			depreciationEndDate = ""
		} else {
			dateStartedUse = record.DateStartedUse.Format(cf.FormatDateDisplay)
			depreciationEndDate = record.DateStartedUse.AddDate(0, record.DepreciationPeriod * 12, 0).Format(cf.FormatDateDisplay)
			usedMonths := monthsCountSince(record.DateStartedUse)
			depreciationRates = 100 * float64(usedMonths) / float64(record.DepreciationPeriod * 12)
		}

		if (record.LicenseEndDate.Format(cf.FormatDateDisplay) == "0001/01/01") {
			licenseEndDate = ""
		} else {
			licenseEndDate = record.LicenseEndDate.Format(cf.FormatDateDisplay)
		}

		res := map[string]interface{}{
			"asset_id":              record.ID,
			"asset_name":            record.AssetName,
			"asset_code":            record.AssetCode,
			"asset_type":            record.AssetCode,
			"branch_id":             record.BranchID,
			"user_id":               record.UserID,
			"status":                record.Status,
			"description":           record.Description,
			"date_started_use":      dateStartedUse,
			"license_end_date":      licenseEndDate,
			"date_of_purchase":      record.DateOfPurchase.Format(cf.FormatDateDisplay),
			"purchase_price":        record.PurchasePrice,
			"managed_by":            record.ManagedBy,
			"depreciation_period":   record.DepreciationPeriod,
			"depreciation_end_date": depreciationEndDate,
			"depreciation_rates":    toFixed(depreciationRates, 2),
		}
		assetList = append(assetList, res)
	}

	pagination := map[string]interface{}{
		"current_page": getAssetListParams.CurrentPage,
		"total_row":    totalRow,
		"row_per_page": getAssetListParams.RowPerPage,
	}

	userRecords, err := ctr.UserRepo.GetAllUserNameByOrgID(userProfile.OrganizationID)
	if err != nil && err.Error() != pg.ErrNoRows.Error() {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	users := make(map[int]string)
	if len(userRecords) > 0 {
		for _, user := range userRecords {
			users[user.UserID] = user.FullName
		}
	}

	branches, err := ctr.BranchRepo.SelectBranches(userProfile.OrganizationID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	branchList := make(map[int]string)
	for _, record := range branches {
		branchList[record.Id] = record.Name
	}

	responseData := map[string]interface{}{
		"pagination": pagination,
		"asset_list": assetList,
		"users":      users,
		"branches":   branchList,
		"asset_status": cf.AssetStatus,
		"asset_request_status": cf.RequestAssetStatus,
	}

	return c.JSON(http.StatusOK, cf.JsonResponse{
		Status:  cf.SuccessResponseCode,
		Message: "Get asset list successfully.",
		Data:    responseData,
	})
}

func (ctr *Controller) CreateAssetType(c echo.Context) error {
	createAssetTypeParams := new(param.CreateAssetTypeParams)

	if err := c.Bind(createAssetTypeParams); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid Params",
			Data:    err,
		})
	}

	_, err := valid.ValidateStruct(createAssetTypeParams)
	if err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid field value",
		})
	}

	userProfile := c.Get("user_profile").(m.User)
	err = ctr.assetRepository.InsertAssetType(
		userProfile.OrganizationID,
		createAssetTypeParams,
	)

	if err != nil && err.Error() != pg.ErrNoRows.Error() {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
			Data:    err,
		})
	}

	return c.JSON(http.StatusOK, cf.JsonResponse{
		Status:  cf.SuccessResponseCode,
		Message: "Create asset type successfully.",
	})
}

func (ctr *Controller) GetAssetLog(c echo.Context) error {
	getAssetLogParams := new(param.GetAssetLogParams)

	if err := c.Bind(getAssetLogParams); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid Params",
			Data:    err,
		})
	}

	_, err := valid.ValidateStruct(getAssetLogParams)
	if err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid field value",
		})
	}

	userProfile := c.Get("user_profile").(m.User)

	assetLogRecords, totalRow, err := ctr.assetRepository.SelectAssetLog(userProfile.OrganizationID, getAssetLogParams)

	if err != nil && err.Error() != pg.ErrNoRows.Error() {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
			Data:    err,
		})
	}

	pagination := map[string]interface{}{
		"current_page": getAssetLogParams.CurrentPage,
		"total_row":    totalRow,
		"row_per_page": getAssetLogParams.RowPerPage,
	}

	responseData := map[string]interface{}{
		"pagination":      pagination,
		"asset_histories": assetLogRecords,
	}

	return c.JSON(http.StatusOK, cf.JsonResponse{
		Status:  cf.SuccessResponseCode,
		Message: "Get asset history successfully.",
		Data:    responseData,
	})
}

func (ctr *Controller) CreateAsset(c echo.Context) error {
	createAssetParams := new(param.CreateAssetParams)

	if err := c.Bind(createAssetParams); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid Params",
			Data:    err,
		})
	}

	userProfile := c.Get("user_profile").(m.User)

	_, err := valid.ValidateStruct(createAssetParams)
	if err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid field value",
		})
	}

	asset, err := ctr.assetRepository.CreateAsset(userProfile.OrganizationID, createAssetParams)

	if err != nil && err.Error() != pg.ErrNoRows.Error() {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
			Data:    err,
		})
	}

	return c.JSON(http.StatusOK, cf.JsonResponse{
		Status:  cf.SuccessResponseCode,
		Message: "Create asset successfully.",
		Data:    asset,
	})
}

func (ctr *Controller) CreateRequestAsset(c echo.Context) error {
	createRequestAssetParams := new(param.CreateRequestAssetParams)

	if err := c.Bind(createRequestAssetParams); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid Params",
			Data:    err,
		})
	}

	_, err := valid.ValidateStruct(createRequestAssetParams)
	if err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid field value",
		})
	}

	userProfile := c.Get("user_profile").(m.User)
	usersIdGm, err := ctr.UserRepo.SelectIdsOfGM(userProfile.OrganizationID)

	if err != nil && err.Error() != pg.ErrNoRows.Error() {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System error",
		})
	}

	if createRequestAssetParams.UserID != userProfile.UserProfile.UserID {
		return c.JSON(http.StatusMethodNotAllowed, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "You not have permission to create asset request",
		})
	}

	_, _, err = ctr.assetRepository.InsertAssetRequest(
		userProfile.OrganizationID,
		createRequestAssetParams,
		ctr.NotificationRepo,
		ctr.UserRepo,
		usersIdGm)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System error",
		})
	}
	_, err = ctr.FcmTokenRepo.SelectMultiFcmTokens(usersIdGm, createRequestAssetParams.UserID)

	if err != nil && err.Error() != pg.ErrNoRows.Error() {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System error",
		})
	}

	// body = userProfile.UserProfile.FirstName + " " + userProfile.UserProfile.LastName + " " + body
	// if len(registrationTokens) > 0 {
	// 	for _, token := range registrationTokens {
	// 		if token != "" {
	// 			fmt.Println("token fcm:   ", token)
	// 			err := ctr.SendMessageToSpecificUser(token, "Micro Erp New Notification", body, link)
	// 			if err != nil && err.Error() == "http error status: 400; reason: request contains an invalid argument; "+
	// 				"code: invalid-argument; details: The registration token is not a valid FCM registration token" {
	// 				_ = ctr.FcmTokenRepo.DeleteFcmToken(token)
	// 			}
	// 		}
	// 	}
	// }

	return c.JSON(http.StatusOK, cf.JsonResponse{
		Status:  cf.SuccessResponseCode,
		Message: "Create request asset successfully.",
	})
}

func monthsCountSince(createdAtTime time.Time) int {
	now := time.Now()
	months := 0
	month := createdAtTime.Month()
	for createdAtTime.Before(now) {
		createdAtTime = createdAtTime.Add(time.Hour * 24)
		nextMonth := createdAtTime.Month()
		if nextMonth != month {
			months++
		}
		month = nextMonth
	}

	return months
}

func round(num float64) int {
    return int(num + math.Copysign(0.5, num))
}

func toFixed(num float64, precision int) float64 {
    output := math.Pow(10, float64(precision))
    return float64(round(num * output)) / output
}
