package notification

import (
	valid "github.com/asaskevich/govalidator"
	"github.com/labstack/echo/v4"
	cf "gitlab.****************.vn/micro_erp/frontend-api/configs"
	cm "gitlab.****************.vn/micro_erp/frontend-api/internal/common"
	rp "gitlab.****************.vn/micro_erp/frontend-api/internal/interfaces/repository"
	param "gitlab.****************.vn/micro_erp/frontend-api/internal/interfaces/requestparams"
	m "gitlab.****************.vn/micro_erp/frontend-api/internal/models"
	gc "gitlab.****************.vn/micro_erp/frontend-api/internal/platform/cloud"
	"gitlab.****************.vn/micro_erp/frontend-api/internal/platform/utils/calendar"
	"net/http"
	"time"
)

type Controller struct {
	cm.BaseController

	NotificationRepo rp.NotificationRepository
	Cloud            gc.StorageUtility
}

func NewNotificationController(logger echo.Logger, notificationRepo rp.NotificationRepository, cloud gc.StorageUtility) (ctr *Controller) {
	ctr = &Controller{cm.BaseController{}, notificationRepo, cloud}
	ctr.Init(logger)
	return
}

func (ctr *Controller) EditNotificationStatusRead(c echo.Context) error {
	params := new(param.UpdateNotificationStatusReadParam)
	if err := c.Bind(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid Params",
		})
	}

	if _, err := valid.ValidateStruct(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid field value",
		})
	}

	userProfile := c.Get("user_profile").(m.User)
	if params.Receiver != userProfile.UserProfile.UserID {
		return c.JSON(http.StatusMethodNotAllowed, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "You not have permission to edit notification status",
		})
	}

	if err := ctr.NotificationRepo.UpdateNotificationStatusRead(userProfile.OrganizationID, params.Receiver); err != nil {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	return c.JSON(http.StatusOK, cf.JsonResponse{
		Status:  cf.SuccessResponseCode,
		Message: "Edit notification status to read successful",
	})
}

func (ctr *Controller) EditNotificationStatus(c echo.Context) error {
	params := new(param.UpdateNotificationStatusParam)
	if err := c.Bind(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid Params",
		})
	}

	if _, err := valid.ValidateStruct(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid field value",
		})
	}

	userProfile := c.Get("user_profile").(m.User)
	if params.Receiver != userProfile.UserProfile.UserID {
		return c.JSON(http.StatusMethodNotAllowed, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "You not have permission to edit notification status",
		})
	}

	count, err := ctr.NotificationRepo.CheckNotificationExist(params.Id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	if count == 0 {
		return c.JSON(http.StatusNotFound, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Notification does not exist",
		})
	}

	err = ctr.NotificationRepo.UpdateNotificationStatus(params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	return c.JSON(http.StatusOK, cf.JsonResponse{
		Status:  cf.SuccessResponseCode,
		Message: "Edit notification status successful",
	})
}

func (ctr *Controller) GetNotifications(c echo.Context) error {
	params := new(param.GetNotificationsParam)
	if err := c.Bind(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid Params",
		})
	}

	if _, err := valid.ValidateStruct(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid field value",
		})
	}

	userProfile := c.Get("user_profile").(m.User)
	if params.Receiver != userProfile.UserProfile.UserID {
		return c.JSON(http.StatusMethodNotAllowed, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "You not have permission to get notifications",
		})
	}

	if params.RowPerPage == 0 {
		params.CurrentPage = 1
		params.RowPerPage = 8
	}

	records, totalRow, err := ctr.NotificationRepo.SelectNotifications(userProfile.OrganizationID, params)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	pagination := map[string]interface{}{
		"current_page": params.CurrentPage,
		"total_row":    totalRow,
		"row_per_page": params.RowPerPage,
	}

	var notifications []map[string]interface{}
	var days []time.Time
	location, _ := time.LoadLocation("Asia/Ho_Chi_Minh")
	for _, record := range records {
		days = append(days, record.CreatedAt)
		data := map[string]interface{}{
			"id":           record.Id,
			"sender":       record.Sender,
			"content":      record.Content,
			"status":       record.Status,
			"redirect_url": record.RedirectUrl,
			"created_at":   record.CreatedAt.In(location).Format(cf.FormatDateNoSec),
		}

		var base64Img []byte
		if record.AvatarSender != "" {
			base64Img, err = ctr.Cloud.GetFileByFileName(record.AvatarSender, cf.AvatarFolderGCS)
			if err != nil {
				ctr.Logger.Error(err)
			}
		}
		data["avatar_sender"] = base64Img

		notifications = append(notifications, data)
	}

	var smallestDay time.Time
	if len(days) > 0 {
		smallestDay = days[0]
		for i := 1; i < len(days); i++ {
			if days[i].Sub(smallestDay) < 0 {
				smallestDay = days[i]
			}
		}
	}

	dataResponse := map[string]interface{}{
		"pagination":              pagination,
		"notification_status_map": cf.NotificationStatusMap,
		"notifications":           notifications,
		"smallest_day":            smallestDay.Format(cf.FormatDate),
	}

	return c.JSON(http.StatusOK, cf.JsonResponse{
		Status:  cf.SuccessResponseCode,
		Message: "Get notifications successful",
		Data:    dataResponse,
	})
}

func (ctr *Controller) GetTotalNotificationsUnread(c echo.Context) error {
	params := new(param.GetTotalNotificationsUnreadParam)
	if err := c.Bind(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid Params",
		})
	}

	if _, err := valid.ValidateStruct(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid field value",
		})
	}

	clientTime := calendar.ParseTime(cf.FormatDate, params.ClientTime)
	location, _ := time.LoadLocation("Asia/Ho_Chi_Minh")
	serverTime := calendar.ParseTime(cf.FormatDate, time.Now().In(location).Format(cf.FormatDate))
	duration, _ := time.ParseDuration("0h0m3s")
	if serverTime.Sub(clientTime) > duration || serverTime.Sub(clientTime) < -duration {
		return c.JSON(http.StatusUnprocessableEntity, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Server could not precess the request",
		})
	}

	userProfile := c.Get("user_profile").(m.User)
	count, err := ctr.NotificationRepo.CountNotificationsUnRead(userProfile.OrganizationID, userProfile.UserProfile.UserID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	return c.JSON(http.StatusOK, cf.JsonResponse{
		Status:  cf.SuccessResponseCode,
		Message: "Get total notifications unread successful",
		Data:    count,
	})
}

func (ctr *Controller) RemoveNotification(c echo.Context) error {
	params := new(param.RemoveNotificationParam)
	if err := c.Bind(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid Params",
		})
	}

	if _, err := valid.ValidateStruct(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid field value",
		})
	}

	count, err := ctr.NotificationRepo.CheckNotificationExist(params.Id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	if count == 0 {
		return c.JSON(http.StatusNotFound, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Notification does not exist",
		})
	}

	userProfile := c.Get("user_profile").(m.User)
	if params.Receiver != userProfile.UserProfile.UserID {
		return c.JSON(http.StatusMethodNotAllowed, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "You not have permission to remove notification",
		})
	}

	if err := ctr.NotificationRepo.DeleteNotification(params.Id); err != nil {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	return c.JSON(http.StatusOK, cf.JsonResponse{
		Status:  cf.SuccessResponseCode,
		Message: "Remove notification successful",
	})
}
