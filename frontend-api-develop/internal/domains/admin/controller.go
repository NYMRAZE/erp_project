package admin

import (
	"net/http"

	valid "github.com/asaskevich/govalidator"
	"github.com/go-pg/pg/v9"
	"github.com/labstack/echo/v4"
	cf "gitlab.****************.vn/micro_erp/frontend-api/configs"
	cm "gitlab.****************.vn/micro_erp/frontend-api/internal/common"
	rp "gitlab.****************.vn/micro_erp/frontend-api/internal/interfaces/repository"
	param "gitlab.****************.vn/micro_erp/frontend-api/internal/interfaces/requestparams"
)

type Controller struct {
	cm.BaseController

	adminRepository    rp.AdminRepository
	UserRepo           rp.UserRepository
	UserPermissionRepo rp.UserPermissionRepository
}

func NewAdminController(logger echo.Logger, adminRepository rp.AdminRepository, userRepo rp.UserRepository,
	userPermissionRepo rp.UserPermissionRepository) (ctr *Controller) {
	ctr = &Controller{cm.BaseController{}, adminRepository, userRepo, userPermissionRepo}
	ctr.Init(logger)
	return
}

func (ctr *Controller) SettingOrgModule(c echo.Context) error {
	dataInitOrg := new(param.DataInitOrg)

	if err := c.Bind(dataInitOrg); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid Params",
			Data:    err,
		})
	}

	_, err := valid.ValidateStruct(dataInitOrg)
	if err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid field value",
		})
	}

	for _, moduleId := range dataInitOrg.ModuleIds {
		err = ctr.adminRepository.InsertOrgModule(
			dataInitOrg.OrganizationId,
			moduleId,
		)
	}

	return c.JSON(http.StatusOK, cf.JsonResponse{
		Status:  cf.SuccessResponseCode,
		Message: "Init data organization module successfully.",
	})
}

func (ctr *Controller) SettingOrgFunctions(c echo.Context) error {
	settingOrgFunctionsParam := new(param.SettingOrgFunctionsParam)

	if err := c.Bind(settingOrgFunctionsParam); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid Params",
			Data:    err,
		})
	}

	_, err := valid.ValidateStruct(settingOrgFunctionsParam)
	if err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid field value",
		})
	}
	userProfileListParams := new(param.UserProfileListParams)

	userProfileList, _, err := ctr.UserRepo.GetUserProfileList(settingOrgFunctionsParam.OrganizationId, userProfileListParams)

	if err != nil && err.Error() != pg.ErrNoRows.Error() {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System error",
		})
	}

	functionsOrg, err := ctr.adminRepository.SelectFunctionsOrg(
		settingOrgFunctionsParam.OrganizationId,
	)

	if err != nil && err.Error() != pg.ErrNoRows.Error() {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System error",
		})
	}

	if userProfileList != nil && functionsOrg != nil {
		for _, user := range userProfileList {
			var status = 2
			for _, function := range functionsOrg {
				if user.RoleID == cf.GeneralManagerRoleID {
					status = 1
				}
				err = ctr.adminRepository.InsertUserPermission(
					settingOrgFunctionsParam.OrganizationId,
					user.UserProfile.UserID,
					function.Id,
					status,
				)
			}
		}
	}
	if err != nil {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	return c.JSON(http.StatusOK, cf.JsonResponse{
		Status:  cf.SuccessResponseCode,
		Message: "Setting organization functions successfully.",
	})
}
